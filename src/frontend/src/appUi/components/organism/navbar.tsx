import React from "react";
import { Sun, Moon } from "lucide-react";

import { Logo } from "../molecules/logo";
import { YearSelector } from "../molecules/yearSelector";
import { LoginButton } from "./loginButton";
import { useAuth } from "../../../context/authContexts";

interface NavbarProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedYear,
  setSelectedYear,
}) => {
  const { isAuthenticated } = useAuth();

  const formatCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Determine if it's day or night based on current hour
  const getTimeIcon = () => {
    const currentHour = new Date().getHours();
    const isDaytime = currentHour >= 6 && currentHour < 18; // 6 AM to 6 PM

    if (isDaytime) {
      return <Sun size={18} className="text-amber-500 mr-2" />;
    } else {
      return <Moon size={18} className="text-indigo-400 mr-2" />;
    }
  };

  return (
    <header className="bg-gray-150 border-b border-b-secondary shadow-none">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Logo />
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center text-gray-700 italic font-sm">
              {getTimeIcon()}
              {formatCurrentDate()}
            </div>
          ) : (
            <YearSelector
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          )}
          <LoginButton />
        </div>
      </div>
    </header>
  );
};
