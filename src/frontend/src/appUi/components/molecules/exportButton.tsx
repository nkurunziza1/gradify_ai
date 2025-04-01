import React from "react";
import { Play, Database, Download } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../atoms/button";
import { SelectField } from "../atoms/selectField";
import { Form } from "../../../components/ui/form";
import { ImportDialog } from "../molecules/importDialog";
import * as XLSX from "xlsx";

// Export Button Component
interface ExportButtonProps {
  data: any[];
  filename?: string;
}

export const ExportButton = ({
  data,
  filename = "distributed-students",
}: ExportButtonProps) => {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={!data || data.length === 0}
      className="gap-2 bg-green-100 text-green-800"
    >
      <Download size={16} className="" />
      Export Excel
    </Button>
  );
};
