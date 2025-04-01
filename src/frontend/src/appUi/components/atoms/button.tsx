import React from "react";
import { Button as ShadcnButton } from "../../../components/ui/button";
import { ReactNode } from "react";
import Loading from "./loading";

interface CustomButtonProps {
  children: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: string;
  className?: string;
  onClick?: () => any;
}

export const Button: React.FC<CustomButtonProps> = ({
  children,
  isLoading = false,
  disabled = false,
  onClick,
  ...props
}) => {
  return (
    <ShadcnButton onClick={onClick} disabled={isLoading || disabled} {...props}>
      {isLoading ? <Loading /> : children}
    </ShadcnButton>
  );
};
