import React from "react";
import { SearchInput } from "../molecules/searchInput";

interface SearchBarProps {
    registrationNumber: string;
    setRegistrationNumber: (regNum: string) => void;
    handleSearch: () => void;
  }

 export  const SearchBar: React.FC<SearchBarProps> = ({ registrationNumber, setRegistrationNumber, handleSearch }) => (
    <div className="mb-6  p-3 rounded-md ">
      <SearchInput 
        placeholder="REG10000" 
        value={registrationNumber} 
        onChange={setRegistrationNumber}
        onSearch={handleSearch}
      />
    </div>
  );