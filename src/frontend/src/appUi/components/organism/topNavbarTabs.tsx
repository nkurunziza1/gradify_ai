import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import React from "react";
import { ACADEMIC_COLORS } from "./resultList";

export type EducationLevel = "P-Level" | "O-Level";

interface TopNavTabsProps {
  selectedLevel: EducationLevel;
  setSelectedLevel: (level: EducationLevel) => void;
}

const TopNavTabs: React.FC<{
  selectedLevel: EducationLevel;
  setSelectedLevel: (level: EducationLevel) => void;
}> = ({ selectedLevel, setSelectedLevel }) => (
  <div className={`border-b ${ACADEMIC_COLORS.border} mb-4`}>
    <div className="flex">
      <button
        onClick={() => setSelectedLevel("P-Level")}
        className={`
          flex-1 py-2 px-4 
          font-serif 
          ${
            selectedLevel === "P-Level"
              ? `${ACADEMIC_COLORS.accent.primary} text-white`
              : `${ACADEMIC_COLORS.text.secondary} bg-transparent`
          }
          transition duration-300
        `}
      >
        Primary Level
      </button>
      <button
        onClick={() => setSelectedLevel("O-Level")}
        className={`
          flex-1 py-2 px-4 
          font-serif 
          ${
            selectedLevel === "O-Level"
              ? `${ACADEMIC_COLORS.accent.primary} text-white`
              : `${ACADEMIC_COLORS.text.secondary} bg-transparent`
          }
          transition duration-300
        `}
      >
        O'Level
      </button>
    </div>
  </div>
);
export default TopNavTabs;
