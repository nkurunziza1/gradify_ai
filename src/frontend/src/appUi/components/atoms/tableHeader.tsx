import React from "react";
import { TableHead, TableHeader as ShadcnTableHeader, TableRow } from "../../../components/ui/table";

interface TableHeaderProps {
  headers: string[];
}

export const TableHeader = ({ headers }: TableHeaderProps) => {
  return (
    <ShadcnTableHeader>
      <TableRow>
        {headers.map((header, index) => (
          <TableHead key={index} className="text-left">{header}</TableHead>
        ))}
      </TableRow>
    </ShadcnTableHeader>
  );
};