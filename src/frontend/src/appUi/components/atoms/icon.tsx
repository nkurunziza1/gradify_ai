import React from "react";

interface IconWrapperProps {
  icon: React.ElementType;
  size?: number;
  className?: string;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({
  icon: Icon,
  size = 4,
  className = "",
}) => {
  return <Icon className={`h-${size} w-${size} ${className}`} />;
};
