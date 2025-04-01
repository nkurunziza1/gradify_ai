import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

interface ImportedDataInfo {
  type: "students" | "schools";
  year: string;
  level: string;
  count: number;
  data: any[];
}

interface ImportedDataCardsProps {
  importedData: ImportedDataInfo[];
  onCardClick: (data: any[], type: "students" | "schools") => void;
}

export const ImportedDataCards = ({
  importedData,
  onCardClick,
}: ImportedDataCardsProps) => {
  if (importedData.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {importedData.map((item, index) => (
          <Card
            key={`${item.type}-${item.year}-${item.level}-${index}`}
            className="cursor-pointer bg-yellow-500/10  hover:bg-gray-50 transition-colors"
            onClick={() => onCardClick(item.data, item.type)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {item.type === "students" ? "Students" : "Schools"}: {item.year}{" "}
                {item.level}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                {item.count} {item.type === "students" ? "Students" : "Schools"}
              </p>
              <Button
                variant="link"
                className="p-0 h-auto mt-2 text-blue-600"
                onClick={(e: any) => {
                  e.stopPropagation();
                  onCardClick(item.data, item.type);
                }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
