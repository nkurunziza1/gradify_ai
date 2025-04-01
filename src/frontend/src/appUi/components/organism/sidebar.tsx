import React from "react";
import { SearchInput } from "../molecules/searchInput";
import { LevelButton } from "../molecules/levelButton";
import { Texts } from "../atoms/text";
import { EducationLevel } from "./topNavbarTabs";

interface SidebarProps {
  sidebarSearch: string;
  setSidebarSearch: (search: string) => void;
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
}

export interface LevelOption {
  id: string;
  name: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarSearch,
  setSidebarSearch,
  selectedLevel,
  setSelectedLevel,
}) => {
  const educationLevels: LevelOption[] = [
    { id: "Primary", name: "Primary Level" },
    { id: "O'Level", name: "O'Level" },
  ];

  const filteredLevels = educationLevels.filter((level) =>
    level.name.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  return (
    <aside className="w-64 mt-4 rounded-xl bg-white p-4 ring-1 ring-secondary">
      <div className="mb-6">
        <SearchInput
          placeholder="Search levels..."
          value={sidebarSearch}
          onChange={setSidebarSearch}
        />
      </div>

      <div className="mt-6">
        <Texts variant="label" className="mb-2 block">
          Choose Your Level
        </Texts>
        <div className="space-y-1">
          {filteredLevels.map((level) => (
            <LevelButton
              key={level.id}
              level={level}
              selectedLevel={selectedLevel}
              onClick={setSelectedLevel}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};
