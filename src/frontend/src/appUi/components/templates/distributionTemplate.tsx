import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { StudentDistributionTable } from "../molecules/studentDistributionTable";
import { DistributionToolbar } from "../organism/distributionToolbar";
import { ImportedDataCards } from "../molecules/importedData";

// Import the ImportedDataInfo type from the parent component
export interface ImportedDataInfo {
  type: "students" | "schools";
  year: string;
  level: string;
  count: number;
  data: any[];
}

interface DistributionTemplateProps {
  title: string;
  onDistribute: (year: string, level: string) => void;
  onSave: (year: string, level: string) => void;
  onImport: (
    data: any[],
    year: string,
    level: string,
    dataType: "students" | "schools"
  ) => void;
  onUseTestData: () => void;
  isDistributing: boolean;
  isSaving: boolean;
  distributedStudents: any[];
  importedStudentsCount: number;
  importedSchoolsCount: number;
  importedData: ImportedDataInfo[];
}

export const DistributionTemplate = ({
  title,
  onDistribute,
  onSave,
  onImport,
  onUseTestData,
  isDistributing,
  isSaving,
  distributedStudents,
  importedStudentsCount,
  importedSchoolsCount,
  importedData = [], // Default to empty array
}: DistributionTemplateProps) => {
  // State to track which data is currently being viewed in the modal
  const [currentViewData, setCurrentViewData] = useState<{
    data: any[];
    type: "students" | "schools";
    title?: string;
  } | null>(null);

  // State to control the modal's open/closed state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle clicking on a card to view its data in a modal
  const handleCardClick = (
    data: any[],
    type: "students" | "schools",
    title?: string
  ) => {
    setCurrentViewData({ data, type, title });
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <DistributionToolbar
            onDistribute={onDistribute}
            onSave={onSave}
            onImport={onImport}
            onUseTestData={onUseTestData}
            isDistributing={isDistributing}
            isSaving={isSaving}
            distributedStudents={distributedStudents}
            importedStudentsCount={importedStudentsCount}
            importedSchoolsCount={importedSchoolsCount}
          />

          {importedData.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Imported Data</h3>
              <ImportedDataCards
                importedData={importedData}
                onCardClick={handleCardClick}
              />
            </div>
          )}

          {/* This shows the distributed students if we have any */}
          {distributedStudents.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Distributed Students</h3>
              <StudentDistributionTable students={distributedStudents} />
            </div>
          )}

          {/* Dialog/Modal component for displaying data details */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            {currentViewData && (
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {currentViewData.title ||
                      (currentViewData.type === "students"
                        ? "Students"
                        : "Schools")}{" "}
                    Details
                  </DialogTitle>
                </DialogHeader>
                
                {/* Content for the dialog based on data type */}
                {currentViewData.type === "students" ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Registration</th>
                          <th className="text-left p-2">Level</th>
                          <th className="text-left p-2">Total Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentViewData.data.map((student, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="p-2">{student.name}</td>
                            <td className="p-2">
                              {student.registrationNumber}
                            </td>
                            <td className="p-2">{student.level}</td>
                            <td className="p-2">{student.totalMarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">School Name</th>
                          <th className="text-left p-2">Level</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Capacity</th>
                          <th className="text-left p-2">Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentViewData.data.map((school, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="p-2">{school.name}</td>
                            <td className="p-2">{school.level}</td>
                            <td className="p-2">{school.status}</td>
                            <td className="p-2">{school.capacity}</td>
                            <td className="p-2">{school.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </DialogContent>
            )}
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};