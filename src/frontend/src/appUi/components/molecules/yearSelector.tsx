import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

interface YearSelectorProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}

export const YearSelector: React.FC<YearSelectorProps> = ({
  selectedYear,
  setSelectedYear,
}) => (
  <Select value={selectedYear} onValueChange={setSelectedYear}>
    <SelectTrigger className="w-36">
      <SelectValue placeholder="Year" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="2025">2025</SelectItem>
      <SelectItem value="2024">2024</SelectItem>
      <SelectItem value="2023">2023</SelectItem>
      <SelectItem value="2022">2022</SelectItem>
      <SelectItem value="2021">2021</SelectItem>
    </SelectContent>
  </Select>
);
