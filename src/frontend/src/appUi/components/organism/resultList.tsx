import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { EducationLevel } from "./topNavbarTabs";

import React from "react";

import { IconWrapper } from "../atoms/icon";
import { Texts } from "../atoms/text";
import { Badge } from "../../../components/ui/badge";
import { FileText, Filter, Info } from "lucide-react";
import { Button } from "../../../components/ui/button";
import Loading from "../atoms/loading";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";

export const ACADEMIC_COLORS = {
  background: "bg-[#F3F4F6]", // Soft parchment-like background
  text: {
    primary: "text-[#2C3E50]", // Deep navy for primary text
    secondary: "text-[#34495E]", // Slightly lighter navy for secondary text
    muted: "text-[#7F8C8D]", // Soft gray for less important text
  },
  border: "border-[#BDC3C7]", // Soft gray border
  accent: {
    primary: "bg-[#2980B9]", // Deep blue for primary accents
    secondary: "bg-[#3498DB]", // Lighter blue for secondary accents
  },
};

export interface ResultsListProps {
  results: {
    allocatedCombinations: string;
    assignedSchool: string;
    createdAt: string;
    explanation: string;
    id: string;
    level: string;
    name: string;
    registrationNumber: string;
    totalMarks: number;
  } | null;
  selectedYear: string;
  selectedLevel: EducationLevel;
  loading?: boolean;
}

export const ResultsList: React.FC<ResultsListProps> = ({
  results,
  selectedYear,
  selectedLevel,
  loading = false,
}) => (
  <div className={`p-4 ${ACADEMIC_COLORS.background} rounded-lg shadow-md`}>
    <div className={`border-b-2 pb-3 mb-4 ${ACADEMIC_COLORS.border}`}>
      <h2
        className={`text-2xl font-serif font-bold ${ACADEMIC_COLORS.text.primary}`}
      >
        Examination Results
      </h2>
      <p className={`text-sm ${ACADEMIC_COLORS.text.secondary} mt-1`}>
        {selectedLevel} • {selectedYear}
      </p>
    </div>

    {loading ? (
      <div className="p-8 flex justify-center">
        <Loading />
      </div>
    ) : results ? (
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3
              className={`text-xl font-serif font-semibold ${ACADEMIC_COLORS.text.primary}`}
            >
              {results.name}
            </h3>
            <div
              className={`flex items-center space-x-2 ${ACADEMIC_COLORS.text.muted} text-sm mt-1`}
            >
              <span className="flex items-center">
                <IconWrapper icon={FileText} size={4} className="mr-1" />
                {results.registrationNumber}
              </span>
              <span>•</span>
              <span>{results.level}</span>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`font-bold text-2xl ${ACADEMIC_COLORS.text.primary}`}
            >
              {results.totalMarks}
              <span
                className={`block text-sm font-normal ${ACADEMIC_COLORS.text.muted}`}
              >
                Total Marks
              </span>
            </div>
          </div>
        </div>

        <div className={`border-t-2 pt-4 mt-4 ${ACADEMIC_COLORS.border}`}>
          <div className="space-y-3">
            <div className="flex items-start">
              <IconWrapper
                icon={Info}
                size={4}
                className={`mr-3 mt-1 ${ACADEMIC_COLORS.text.secondary}`}
              />
              <div>
                <h4
                  className={`font-serif font-semibold ${ACADEMIC_COLORS.text.primary}`}
                >
                  Allocated Combination
                </h4>
                <p className={`${ACADEMIC_COLORS.text.secondary} text-sm`}>
                  {results.allocatedCombinations}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <IconWrapper
                icon={Info}
                size={4}
                className={`mr-3 mt-1 ${ACADEMIC_COLORS.text.secondary}`}
              />
              <div>
                <h4
                  className={`font-serif font-semibold ${ACADEMIC_COLORS.text.primary}`}
                >
                  Assigned School
                </h4>
                <p className={`${ACADEMIC_COLORS.text.secondary} text-sm`}>
                  {results.assignedSchool}
                </p>
              </div>
            </div>
          </div>
        </div>

        {results.explanation && (
          <div
            className={`mt-4 p-4 rounded-lg ${ACADEMIC_COLORS.background} border ${ACADEMIC_COLORS.border}`}
          >
            <h4
              className={`font-serif font-semibold mb-2 ${ACADEMIC_COLORS.text.primary}`}
            >
              Explanation
            </h4>
            <p
              className={`${ACADEMIC_COLORS.text.secondary} text-sm leading-relaxed`}
            >
              {results.explanation}
            </p>
          </div>
        )}
      </div>
    ) : (
      <div className={`text-center ${ACADEMIC_COLORS.text.muted} p-4`}>
        Your result will be displayed here
      </div>
    )}
  </div>
);
