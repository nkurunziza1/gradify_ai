import { Play, Database } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../atoms/button";
import { SelectField } from "../atoms/selectField";
import { Form } from "../../../components/ui/form";
import React from "react";
import { ImportDialog } from "../molecules/importDialog";
import { ExportButton } from "../molecules/exportButton";
import Loading from "../atoms/loading";

interface DistributionToolbarProps {
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
}

const formSchema = z.object({
  year: z.string().min(4, "Year is required"),
  level: z.string().min(1, "Level is required"),
});

type FormValues = z.infer<typeof formSchema>;

export const DistributionToolbar = ({
  onDistribute,
  onSave,
  onImport,
  onUseTestData,
  isDistributing,
  isSaving,
  distributedStudents,
  importedStudentsCount = 0,
  importedSchoolsCount = 0,
}: DistributionToolbarProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: new Date().getFullYear().toString(),
      level: "O-Level",
    },
  });

  const yearOptions = [
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ];

  const levelOptions = [
    { value: "P-Level", label: "Primary" },
    { value: "O-Level", label: "Secondary" },
  ];

  const handleDistribute = () => {
    const { year, level } = form.getValues();
    onDistribute(year, level);
  };

  const handleSave = () => {
    const { year, level } = form.getValues();
    onSave(year, level);
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <Form {...form}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <SelectField
            name="year"
            label="Academic Year"
            options={yearOptions}
            control={form.control}
          />
          <SelectField
            name="level"
            label="Education Level"
            options={levelOptions}
            control={form.control}
          />
          <div className="flex flex-col justify-end">
            <div className="text-sm text-gray-500 mb-2">
              {importedStudentsCount > 0 && (
                <span className="mr-3 px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {importedStudentsCount} Students
                </span>
              )}
              {importedSchoolsCount > 0 && (
                <span className="px-3 py-2 bg-green-100 text-green-800 rounded-full text-xs">
                  {importedSchoolsCount} Schools
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="border-primary border w-full my-1"></div>
        <div className="flex flex-wrap gap-2">
          <ImportDialog
            onImport={(data, year, level) =>
              onImport(data, year, level, "students")
            }
            title="Import Students"
            description="Upload an Excel file containing student information"
          />

          <ImportDialog
            onImport={(data, year, level) =>
              onImport(data, year, level, "schools")
            }
            title="Import Schools"
            description="Upload an Excel file containing school information"
          />

          <Button onClick={onUseTestData} className="gap-2 text-black bg-red-200/25">
            <Database size={16} />
            Get Data Automatically
          </Button>
          <div className="border-primary border w-full"></div>
          <Button
            onClick={handleDistribute}
            disabled={
              isDistributing ||
              (importedStudentsCount === 0 && importedSchoolsCount === 0)
            }
            className="gap-2 text-black"
          >
            {isDistributing ? (
              <div className="mt-4">
                <Loading />
              </div>
            ) : (
              <Play className="text-green-500 font-bold" size={16} />
            )}
            Distribute Students
          </Button>

          <Button
            variant="outline"
            onClick={handleSave}
            disabled={isSaving || distributedStudents.length === 0}
            className="gap-2 bg-black text-white"
          >
            {isSaving ? "save..." : "Save Distribution"}
          </Button>

          <ExportButton
            data={distributedStudents}
            filename="student-distribution"
          />
        </div>
      </Form>
    </div>
  );
};
