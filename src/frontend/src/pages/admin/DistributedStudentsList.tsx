import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { DistributionTemplate } from "../../appUi/components/templates/distributionTemplate";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type Combination = {
  combinationName: string;
  school: string;
};

export interface ImportedDataInfo {
  type: "students" | "schools";
  year: string;
  level: string;
  count: number;
  data: any[];
}

interface Student {
  id: string | number;
  name: string;
  registrationNumber: string;
  scores?: Array<{ course: string; marks: number }>;
  totalMarks: number;
  level: string;
  preference?: string[];
  selectedCombinations?: Combination[] | null;
  assignedSchool?: string;
  explanation?: string;
  allocatedCombinations: Combination[] | null;
  createdAt?: Date;
}

enum Status {
  EXCELLENT = "excellent",
  GOOD = "good",
  NORMAL = "normal",
  DAILY = "daily",
}

type School = {
  id: string;
  name: string;
  status: Status;
  level: "O-Level" | "A-Level" | "TVET" | "Primary";
  combinations?: string[];
  capacity: number;
  location?: string;
  code?: string;
  availableSlots:
    | number
    | Record<string, { totalSlots: number; remainingSlots: number }>;
  otherSchoolDetails?: any;
};

const DistributionPage: React.FC = () => {
  const [distributedStudents, setDistributedStudents] = useState<Student[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [isDistributing, setIsDistributing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [currentYear, setCurrentYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [currentLevel, setCurrentLevel] = useState<string>("O-Level");
  const [importedStudentsCount, setImportedStudentsCount] = useState<number>(0);
  const [importedSchoolsCount, setImportedSchoolsCount] = useState<number>(0);
  const [importedStudents, setImportedStudents] = useState<any[]>([]);
  const [importedSchools, setImportedSchools] = useState<any[]>([]);
  const [importedDataList, setImportedDataList] = useState<ImportedDataInfo[]>(
    []
  );
  const genAI = new GoogleGenerativeAI(
    (import.meta as any).env.VITE_OPENAI_API_KEY
  );
  const memoizedDistributions = new Map<string, any>();

  const parseStudentData = (students: any[]): Student[] => {
    return students.map((student) => {
      try {
        const parsedStudent = {
          ...student,
          scores:
            typeof student.scores === "string"
              ? JSON.parse(student.scores)
              : student.scores,
          preference:
            typeof student.preference === "string"
              ? JSON.parse(student.preference)
              : student.preference,
          selectedCombinations:
            typeof student.selectedCombinations === "string"
              ? JSON.parse(student.selectedCombinations)
              : student.selectedCombinations,
          totalMarks:
            typeof student.totalMarks === "string"
              ? parseFloat(student.totalMarks)
              : student.totalMarks,
        };
        return parsedStudent;
      } catch (error) {
        console.error(`Error parsing data for student ${student.name}:`, error);
        // Return student with empty arrays for fields that couldn't be parsed
        return {
          ...student,
          scores: [],
          preference: [],
          selectedCombinations: [],
          totalMarks:
            typeof student.totalMarks === "string"
              ? parseFloat(student.totalMarks) || 0
              : student.totalMarks || 0,
        };
      }
    });
  };

  const rankStudentPreferences = async (
    students: Student[],
    schools: School[]
  ) => {
    const prompt = `
    # Bulk Student Distribution Task
    Distribute multiple students to appropriate Rwandan schools based on the following information:
    
    ## Students Details
    ${JSON.stringify(
      students.map((student) => ({
        name: student.name,
        registrationNumber: student.registrationNumber,
        individualSubjectMarks: student.scores,
        totalMarks: student.totalMarks,
        level: student.level,
        preferredSchools: student.preference,
        preferredCombinations: student.selectedCombinations,
      })),
      null,
      2
    )}
    
    ## Task Instructions
    1. Analyze each student's academic performance.
    2. Match students to appropriate schools based on their performance.
    3. Prioritize students' preferred combinations when possible.
    4. Consider school capacity and available slots.
    5. Provide a clear, detailed explanation for each assignment decision.
    
    ## Output Format
    Return a VALID JSON array of objects, ensuring each object contains:
    - studentName
    - registration
    - totalMarks
    - allocatedSchool
    - level
    - allocatedCombinations
    - reason
    `;

    try {
      // Use Gemini Pro for text generation
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Set a very low temperature to get more consistent results
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2, // Very low temperature for consistency
          maxOutputTokens: 2000, // Increased to accommodate multiple students
        },
      });

      const response = result.response.text();
      console.log("Raw response:", response);

      // More robust JSON extraction
      const cleanResponse = response
        .replace(/```json\n?|```/g, "") // Remove code block markers
        .trim();

      // Try parsing the response with multiple strategies
      let allocations;
      try {
        // Strategy 1: Direct parsing
        allocations = JSON.parse(cleanResponse);
      } catch (parseError) {
        try {
          // Strategy 2: Extract JSON between outermost brackets
          const jsonMatch = cleanResponse.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            // Remove any trailing incomplete characters or lines
            const cleanJson = jsonMatch[0].replace(/,\s*$/, "");
            allocations = JSON.parse(cleanJson);
          } else {
            throw new Error("Cannot extract valid JSON");
          }
        } catch (secondParseError) {
          console.error("JSON Parsing Errors:", parseError, secondParseError);
          throw new Error("Failed to parse student allocations");
        }
      }

      // Validate the allocations
      if (!Array.isArray(allocations) || allocations.length === 0) {
        throw new Error("Invalid or empty allocations array");
      }

      // If fewer allocations than students, use fallback
      if (allocations.length < students.length) {
        console.warn(
          `Incomplete allocations: ${allocations.length} vs ${students.length} students`
        );
        const fallbackAllocations = students.map(
          (student, index) =>
            allocations[index] || {
              studentName: student.name,
              registration: student.registrationNumber,
              totalMarks: student.totalMarks,
              allocatedSchool: "Default School",
              level: student.level,
              allocatedCombinations: [],
              reason: "Default allocation due to incomplete AI response",
            }
        );
        return fallbackAllocations;
      }

      return allocations;
    } catch (error) {
      console.error("Error during bulk distribution:", error);

      // Fallback allocations if AI processing fails
      const fallbackAllocations = students.map((student) => ({
        studentName: student.name,
        registration: student.registrationNumber,
        totalMarks: student.totalMarks,
        allocatedSchool: "Default School",
        level: student.level,
        allocatedCombinations: [],
        reason: "Default allocation due to processing error",
      }));

      return fallbackAllocations;
    }
  };

  const processDistributions = async (year: string, level: string) => {
    if (isDistributing || students.length === 0) return;

    setIsDistributing(true);
    try {
      // Ensure students are properly parsed before filtering
      const parsedStudents = parseStudentData(students);
      const filteredStudents = parsedStudents.filter(
        (student) => student.level === level
      );

      if (filteredStudents.length === 0) {
        toast.error(`No students found for ${level} level`);
        setIsDistributing(false);
        return;
      }

      // Process all students in a single API call
      const distributed = await rankStudentPreferences(
        filteredStudents,
        schools
      );

      const updatedStudents = filteredStudents.map((student, index) => ({
        ...student,
        assignedSchool: distributed[index].allocatedSchool,
        allocatedCombinations: distributed[index].allocatedCombinations || [],
        explanation: distributed[index].reason,
      }));

      setDistributedStudents(updatedStudents);
      setCurrentYear(year);
      setCurrentLevel(level);
      toast.success("Students distributed successfully");
    } catch (error) {
      console.error("Error distributing students:", error);
      toast.error("Failed to distribute students");
    } finally {
      setIsDistributing(false);
    }
  };
  const handleDistribute = (year: string, level: string) => {
    // Prevent multiple distribution attempts
    if (isDistributing) {
      toast.error("Distribution is already in progress");
      return;
    }

    if (students.length === 0) {
      toast.error("No students available to distribute");
      return;
    }

    processDistributions(year, level);
  };

  const handleSaveDistribution = async (year: string, level: string) => {
    if (distributedStudents.length === 0) {
      toast.error("No distributed students to save");
      return;
    }

    setIsSaving(true);
    try {
      const distributionsData = {
        year,
        level,
        distributions: distributedStudents.map((student) => ({
          ...student,
          name: student.name,
          registrationNumber: student.registrationNumber,
          assignedSchool: student.assignedSchool,
          allocatedCombinations: student.allocatedCombinations,
          explanation: student.explanation,
          totalMarks: student.totalMarks,
        })),
      };

      const response = await axios.post(
        `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/distribution`,
        distributionsData
      );

      if (response.data.success) {
        toast.success("Distribution saved successfully");
      } else {
        throw new Error(response.data.message || "Failed to save distribution");
      }
    } catch (error) {
      console.error("Error saving distribution:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save distribution"
      );
    } finally {
      setIsSaving(false);
    }
  };
  const handleImport = (
    importedData: any[],
    year: string,
    level: string,
    dataType: "students" | "schools"
  ) => {
    if (!importedData || importedData.length === 0) {
      toast.error(`No ${dataType} data found in imported file`);
      return;
    }
    console.log(importedData);
    try {
      if (dataType === "students") {
        const transformedStudents = importedData.map((item, index) => {
          // Ensure marks don't exceed 100%
          const normalizedScores = item.scores
            ? item.scores.map((score: any) => ({
                ...score,
                marks: Math.min(score.marks, 100), // Cap at 100%
              }))
            : [];

          return {
            id: item.id || `S${index + 1}`,
            name: item.name || item.Name || "",
            registrationNumber:
              item.registrationNumber || item.Registration || `REG${index + 1}`,
            scores: normalizedScores,
            totalMarks: Math.min(
              Number(item["Total Marks"] || item.TotalMarks || 0),
              600
            ),
            level: item.level || level,
            preference: item.preference || [],
            selectedCombinations: item.selectedCombinations || null,
            allocatedCombinations: null,
          };
        });

        setStudents(transformedStudents);
        setImportedStudentsCount(transformedStudents.length);

        const newImportedData: ImportedDataInfo = {
          type: "students",
          year,
          level,
          count: transformedStudents.length,
          data: transformedStudents,
        };

        setImportedDataList((prev) => [...prev, newImportedData]);

        toast.success(
          `Imported ${transformedStudents.length} students for ${year} - ${level}`
        );
      } else {
        const transformedSchools = importedData.map((item, index) => {
          return {
            id: item.id || `SCH${index + 1}`,
            name: item["School Name"] || item.Name || "",
            status: item.Status || Status.NORMAL,
            level: item.Level || "O-Level",
            combinations: item.combinations || [],
            capacity: Number(item.capacity || 300),
            location: item.Location || "",
            code: item.code || `${index + 1000}`,
            availableSlots: item.availableSlots || 100,
            otherSchoolDetails: item.otherSchoolDetails || {},
          };
        });

        setSchools(transformedSchools);
        setImportedSchoolsCount(transformedSchools.length);
        const newImportedData: ImportedDataInfo = {
          type: "schools",
          year,
          level,
          count: transformedSchools.length,
          data: transformedSchools,
        };

        setImportedDataList((prev) => [...prev, newImportedData]);

        toast.success(
          `Imported ${transformedSchools.length} schools for ${year}`
        );
      }

      setCurrentYear(year);
      setCurrentLevel(level);
    } catch (error) {
      console.error(`Error processing imported ${dataType} data:`, error);
      toast.error(`Failed to process imported ${dataType} data`);
    }
  };

  const handleUseTestData = () => {
    const generateTestStudents = (count: number, level: string): Student[] => {
      return Array.from({ length: count }, (_, i) => {
        const subjects = [
          "Mathematics",
          "English",
          "Science",
          "Physics",
          "Chemistry",
          "Biology",
          "Geography",
          "History",
        ];
        const scores = subjects.slice(0, 6).map((course) => ({
          course,
          marks: Math.floor(Math.random() * 60) + 40, // 40-100 marks
        }));

        const totalMarks = scores.reduce((sum, { marks }) => sum + marks, 0);

        return {
          id: `S${i + 1}`,
          name: `Student ${i + 1}`,
          registrationNumber: `REG${10000 + i}`,
          scores,
          totalMarks,
          level,
          preference: ["School A", "School B", "School C"],
          selectedCombinations:
            level === "O-Level"
              ? [
                  { combinationName: "PCM", school: "School A" },
                  { combinationName: "PCB", school: "School B" },
                ]
              : null,
          allocatedCombinations: null,
        };
      });
    };

    const generateTestSchools = (): School[] => {
      const schoolLevels = ["Primary", "O-Level", "A-Level", "TVET"];
      const statusOptions = [
        Status.EXCELLENT,
        Status.GOOD,
        Status.NORMAL,
        Status.DAILY,
      ];
      const combinations = ["PCM", "PCB", "MCB", "MEG", "HEG", "LFK", "MPC"];

      return Array.from({ length: 10 }, (_, i) => {
        const level = schoolLevels[i % 4] as
          | "O-Level"
          | "A-Level"
          | "TVET"
          | "Primary";
        const combinationSlots = combinations.reduce((acc, combo) => {
          acc[combo] = {
            totalSlots: 50,
            remainingSlots: 50 - Math.floor(Math.random() * 20),
          };
          return acc;
        }, {} as Record<string, { totalSlots: number; remainingSlots: number }>);

        return {
          id: `SCH${i + 1}`,
          name: `School ${String.fromCharCode(65 + i)}`,
          status: statusOptions[i % 4],
          level,
          combinations: level === "A-Level" ? combinations.slice(0, 3) : [],
          capacity: 300 + i * 50,
          location: `District ${Math.floor(i / 3) + 1}`,
          code: `${1000 + i}`,
          availableSlots: level === "A-Level" ? combinationSlots : 100,
        };
      });
    };

    const primaryTestStudents = generateTestStudents(11, "P-Level");
    const oLevelTestStudents = generateTestStudents(11, "O-Level");
    const testSchools = generateTestSchools();

    const allTestStudents = [...primaryTestStudents, ...oLevelTestStudents];
    setStudents(allTestStudents);
    setSchools(testSchools);
    setImportedStudentsCount(allTestStudents.length);
    setImportedSchoolsCount(testSchools.length);

    setImportedDataList([
      {
        type: "students",
        year: currentYear,
        level: "P-Level",
        count: primaryTestStudents.length,
        data: primaryTestStudents,
      },
      {
        type: "students",
        year: currentYear,
        level: "O-Level",
        count: oLevelTestStudents.length,
        data: oLevelTestStudents,
      },
      {
        type: "schools",
        year: currentYear,
        level: "All",
        count: testSchools.length,
        data: testSchools,
      },
    ]);

    toast.success("Test data loaded successfully");
  };

  return (
    <DistributionTemplate
      title="Student Distribution"
      onDistribute={handleDistribute}
      onSave={handleSaveDistribution}
      onImport={handleImport}
      onUseTestData={handleUseTestData}
      isDistributing={isDistributing}
      isSaving={isSaving}
      distributedStudents={distributedStudents}
      importedStudentsCount={importedStudentsCount}
      importedSchoolsCount={importedSchoolsCount}
      importedData={importedDataList}
    />
  );
};

export default DistributionPage;
