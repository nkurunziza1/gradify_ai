import React from "react";

interface MainTemplateProps {
  children: React.ReactNode;
}

export const MainTemplate: React.FC<MainTemplateProps> = ({ children }) => (
  <div className="flex flex-col min-h-screen  items-center justify-center">
    <div className="container mx-auto max-w-6xl px-4">{children}</div>
  </div>
);
