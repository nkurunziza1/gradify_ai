import React, { useState, useEffect } from "react";
import axios from "axios";
import { Distribution, StudentLevel } from "../../../../backend/types";
import { Button } from "../../components/ui/button";
import { FileDown } from "lucide-react";
import { ExportButton } from "../../appUi/components/molecules/exportButton";
import { StudentDistributionTable } from "../../appUi/components/molecules/studentDistributionTable";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";

const LocateStudents = () => {
  const currentYear = new Date().getFullYear().toString() as any;

  const defaultLevel = StudentLevel.SECONDARY;

  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [filteredDistributions, setFilteredDistributions] = useState<
    Distribution[]
  >([]);

  const [years, setYears] = useState<string[]>(() =>
    Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())
  );

  const [schools, setSchools] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedYear, setSelectedYear] = useState<string>(currentYear);
  const [selectedLevel, setSelectedLevel] = useState<string>(defaultLevel);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [schoolSearchInput, setSchoolSearchInput] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistributionData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${
            (import.meta as any).env.VITE_CANISTER_ORIGIN
          }/distribution/${selectedYear}/${selectedLevel}`
        );

        if (response.data.success) {
          setDistributions(response.data.data.distributions);
          setFilteredDistributions(response.data.data.distributions);
          setLastUpdated(response.data.data.lastUpdated);
        } else {
          setError(
            `No distributions found for ${selectedYear}, ${selectedLevel}`
          );
        }
      } catch (error) {
        console.error("Error fetching distribution data:", error);
        setError(
          `Failed to load distribution for ${selectedYear}, ${selectedLevel}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDistributionData();
  }, [selectedYear, selectedLevel]);

  useEffect(() => {
    if (distributions.length > 0) {
      const uniqueSchools = Array.from(
        new Set(distributions.map((dist) => dist.assignedSchool))
      )
        .filter(Boolean)
        .sort();

      setSchools(uniqueSchools);
    } else {
      setSchools([]);
    }
  }, [distributions]);

  useEffect(() => {
    if (distributions.length > 0) {
      let filtered = [...distributions];

      if (selectedSchool) {
        filtered = filtered.filter(
          (dist) => dist.assignedSchool === selectedSchool
        );
      } else if (schoolSearchInput) {
        filtered = filtered.filter((dist) =>
          dist.assignedSchool
            ?.toLowerCase()
            .includes(schoolSearchInput.toLowerCase())
        );
      }

      setFilteredDistributions(filtered);
    } else {
      setFilteredDistributions([]);
    }
  }, [distributions, selectedSchool, schoolSearchInput]);

  const studentsForTable = filteredDistributions.map((dist) => ({
    id: dist.id,
    name: dist.name,
    registrationNumber: dist.registrationNumber,
    level: dist.level,
    assignedSchool: dist.assignedSchool,
    allocatedCombinations: dist.allocatedCombinations || [],
    explanation: dist.explanation,
    totalMarks: dist.totalMarks,
    createdAt: dist.createdAt,
  }));

  const dataForExport = filteredDistributions.map((student) => ({
    Name: student.name,
    "Registration Number": student.registrationNumber,
    "Total Marks": student.totalMarks,
    "Assigned School": student.assignedSchool,
    "Allocated Combinations": student.allocatedCombinations || "",
    Explanation: student.explanation || "",
  }));

  const handleSchoolChange = (value: string | null) => {
    setSelectedSchool(value === "all-schools" ? null : value);
    setSchoolSearchInput("");
  };

  const handleSchoolSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchoolSearchInput(e.target.value);
    setSelectedSchool(null);
  };

  const downloadAsCSV = () => {
    if (filteredDistributions.length === 0) return;

    const headers = [
      "Name",
      "Registration Number",
      "Total Marks",
      "Assigned School",
      "Allocated Combinations",
      "Explanation",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredDistributions.map((student) =>
        [
          `"${student.name}"`,
          student.registrationNumber,
          student.totalMarks,
          `"${student.assignedSchool}"`,
          `"${student.allocatedCombinations || ""}"`,
          `"${student.explanation?.replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);

    const filenameSchool = selectedSchool
      ? `-${selectedSchool.replace(/\s+/g, "-")}`
      : schoolSearchInput
      ? `-school-filter`
      : "";

    link.setAttribute(
      "download",
      `distributions-${selectedYear}-${selectedLevel}${filenameSchool}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get export filename
  const getExportFilename = () => {
    const baseFilename = `distributions-${selectedYear}-${selectedLevel}`;
    if (selectedSchool) {
      return `${baseFilename}-${selectedSchool.replace(/\s+/g, "-")}`;
    } else if (schoolSearchInput) {
      return `${baseFilename}-school-filter`;
    }
    return baseFilename;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card className="p-0">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl md:text-2xl">
          Student Distribution Results
        </CardTitle>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <Select
                value={selectedYear}
                onValueChange={(value) => {
                  setSelectedYear(value);
                  setSelectedSchool(null);
                  setSchoolSearchInput("");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={selectedLevel}
                onValueChange={(value) => {
                  setSelectedLevel(value);
                  setSelectedSchool(null);
                  setSchoolSearchInput("");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(StudentLevel).map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={selectedSchool || "all-schools"}
                onValueChange={handleSchoolChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by School" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-schools">All Schools</SelectItem>
                  {schools.map((school) => (
                    <SelectItem key={school} value={school}>
                      {school}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Input
                placeholder="Search schools..."
                value={schoolSearchInput}
                onChange={handleSchoolSearchChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
            {lastUpdated && (
              <div className="text-sm rounded-full px-4 bg-green-100 text-black order-2 sm:order-1">
                Last updated: {formatDate(lastUpdated)}
              </div>
            )}

            <div className="flex justify-center gap-2 order-1 sm:order-2">
              <Button
                onClick={downloadAsCSV}
                disabled={filteredDistributions.length === 0}
                className="gap-2 bg-black"
              >
                <FileDown className="h-4 w-4" />
                <span className="hidden sm:inline">CSV</span>
              </Button>

              <ExportButton
                data={dataForExport}
                filename={getExportFilename()}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading distributions...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="w-full">
            <div className="mb-2 text-sm text-gray-500">
              {filteredDistributions.length} students found
              {selectedSchool ? ` in ${selectedSchool}` : ""}
              {schoolSearchInput ? ` matching "${schoolSearchInput}"` : ""}
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-full inline-block align-middle px-4 sm:px-0">
                <StudentDistributionTable students={studentsForTable} />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocateStudents;
