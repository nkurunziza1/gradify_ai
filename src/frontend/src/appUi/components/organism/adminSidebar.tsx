import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { SearchInput } from "../molecules/searchInput";
import { Texts } from "../atoms/text";
import { Search, Users, ListChecks, ShieldCheck } from "lucide-react";

interface AdminLink {
  id: string;
  name: string;
  path: string;
  icon: React.ReactNode;
}

export const AdminSidebar: React.FC = () => {
  const [sidebarSearch, setSidebarSearch] = useState<string>("");

  const adminLinks: AdminLink[] = [
    {
      id: "locate",
      name: "Locate Students",
      path: "/portal/locate",
      icon: <Search size={18} className="text-green-500" />,
    },
    {
      id: "distributed",
      name: "Distributed Students List",
      path: "/portal/distributed",
      icon: <ListChecks size={18} className="text-green-500" />,
    },
  ];

  const filteredLinks = adminLinks.filter((link) =>
    link.name.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  return (
    <aside className="w-64 mt-4 rounded-xl bg-white p-4 ring-1 ring-secondary h-full">
      <div className="mb-6">
        <SearchInput
          placeholder="Search options..."
          value={sidebarSearch}
          onChange={setSidebarSearch}
        />
      </div>

      <div className="mt-6">
        <div className="flex items-center mb-2">
          <ShieldCheck size={18} className="mr-2 text-gray-700" />
          <Texts variant="label">Admin Options</Texts>
        </div>
        <div className="flex flex-col space-y-1">
          {filteredLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-black"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="mr-2">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
          {/* This empty div ensures the sidebar maintains height */}
          <div className="flex-grow min-h-64"></div>
        </div>
      </div>
    </aside>
  );
};
