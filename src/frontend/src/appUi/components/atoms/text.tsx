import React from "react";

interface TextProps {
  children: React.ReactNode;
  variant?: "default" | "title" | "subtitle" | "label";
  className?: string;
}

export const Texts: React.FC<TextProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const variants = {
    default: "text-base",
    title: "font-bold text-xl",
    subtitle: "text-sm text-gray-500",
    label: "font-medium text-sm text-gray-500",
  };

  return (
    <span className={`${variants[variant]} ${className}`}>{children}</span>
  );
};
