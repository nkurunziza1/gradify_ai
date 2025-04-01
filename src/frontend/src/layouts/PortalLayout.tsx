import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { MainTemplate } from "../appUi/components/templates/home";
import { ContentTemplate } from "../appUi/components/templates/content";
import { Navbar } from "../appUi/components/organism/navbar";
import { AdminSidebar } from "../appUi/components/organism/adminSidebar";

const PortalLayout: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>("2024");

  return (
    <MainTemplate>
      <Navbar selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      <ContentTemplate sidebar={<AdminSidebar />} content={<Outlet />} />
    </MainTemplate>
  );
};

export default PortalLayout;
