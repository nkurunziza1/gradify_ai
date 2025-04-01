import React from "react";
import TopNavTabs from "../organism/topNavbarTabs";

interface ContentTemplateProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

export const ContentTemplate: React.FC<ContentTemplateProps> = ({
  sidebar,
  content,
}) => (
  <div className="flex flex-1 container mx-auto">
    {sidebar}
    <main className="flex-1 ml-4 rounded-xl mt-4 ring-1 ring-secondary p-4">{content}</main>
  </div>
);
 