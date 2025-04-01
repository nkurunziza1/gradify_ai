import React, { useState, useEffect } from "react";
import axios from "axios";
import TopNavTabs, {
  EducationLevel,
} from "../appUi/components/organism/topNavbarTabs";
import { ContentTemplate } from "../appUi/components/templates/content";
import { MainTemplate } from "../appUi/components/templates/home";
import { Navbar } from "../appUi/components/organism/navbar";
import { InstructionAlert } from "../appUi/components/organism/instrucationAlert";
import { SearchBar } from "../appUi/components/organism/searchBar";
import { ResultsList } from "../appUi/components/organism/resultList";
import { Sidebar } from "../appUi/components/organism/sidebar";

// Define the type for the result based on the ResultsList component
type StudentResult = {
  allocatedCombinations: string;
  assignedSchool: string;
  createdAt: string;
  explanation: string;
  id: string;
  level: string;
  name: string;
  registrationNumber: string;
  totalMarks: number;
};

const ExaminationPortal: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>("P-Level");
  const [registrationNumber, setRegistrationNumber] = useState<string>("");
  const [sidebarSearch, setSidebarSearch] = useState<string>("");
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const [results, setResults] = useState<StudentResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (): Promise<void> => {
    if (!registrationNumber) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<{
        success: boolean;
        data: StudentResult;
        message?: string;
      }>(
        `${
          (import.meta as any).env.VITE_CANISTER_ORIGIN
        }/distributions/student/${registrationNumber}`,
        {
          params: {
            year: selectedYear,
            level: selectedLevel,
          },
        }
      );

      if (response.data.success) {
        setResults(response.data.data);
        setSearchPerformed(true);
      } else {
        setError(response.data.message || "No results found");
        setResults(null);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred"
      );
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset search when year or level changes
    setResults(null);
    setSearchPerformed(false);
    setError(null);
  }, [selectedYear, selectedLevel]);

  return (
    <MainTemplate>
      <Navbar selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      <ContentTemplate
        sidebar={
          <Sidebar
            sidebarSearch={sidebarSearch}
            setSidebarSearch={setSidebarSearch}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel as any}
          />
        }
        content={
          <>
            <TopNavTabs
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
            />

            {!searchPerformed && <InstructionAlert />}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            <SearchBar
              registrationNumber={registrationNumber}
              setRegistrationNumber={setRegistrationNumber}
              handleSearch={handleSearch}
            />
            <ResultsList
              results={searchPerformed ? results : null}
              selectedYear={selectedYear}
              selectedLevel={selectedLevel}
              loading={loading}
            />
          </>
        }
      />
    </MainTemplate>
  );
};

export default ExaminationPortal;
