import React, { useState } from "react";
import { Button } from "../atoms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Form } from "../../../components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectField } from "../atoms/selectField";
import { Upload } from "lucide-react";
import { Input } from "../../../components/ui/input";
import * as XLSX from "xlsx";

interface ImportDialogProps {
  onImport: (data: any[], year: string, level: string) => void;
  title?: string;
  description?: string;
}

const formSchema = z.object({
  year: z.string().min(4, "Year is required"),
  level: z.string().min(1, "Level is required"),
});

type FormValues = z.infer<typeof formSchema>;

export const ImportDialog = ({
  onImport,
  title = "Import Data",
  description = "Upload an Excel file containing data",
}: ImportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [fileData, setFileData] = useState<any[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        setFileData(json);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        setFileData(null);
      }
    };
    reader.readAsBinaryString(file);
  };

  const onSubmit = (values: FormValues) => {
    if (fileData && fileData.length > 0) {
      onImport(fileData, values.year, values.level);
      setOpen(false);
      form.reset();
      setFileData(null);
      setFileName(null);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="gap-2">
        <Upload className="text-green-700" size={16} />
        {title}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="space-y-2">
                <label htmlFor="file-upload" className="text-sm font-medium">
                  Upload Excel File
                </label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                />
                {fileName && (
                  <p className="text-sm text-gray-500">
                    Selected file: {fileName}
                  </p>
                )}
                {fileData && (
                  <p className="text-sm text-green-600">
                    {fileData.length} records found
                  </p>
                )}
              </div>

              <DialogFooter className="mt-4">
                <Button
                  className="bg-black hover:text-black"
                  type="submit"
                  disabled={!fileData || fileData.length === 0}
                >
                  Import
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
