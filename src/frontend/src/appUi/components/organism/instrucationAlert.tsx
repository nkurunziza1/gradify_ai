import React from "react";
import { IconWrapper } from "../atoms/icon";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { AlertCircle } from "lucide-react";

export const InstructionAlert: React.FC = () => (
    <Alert className="mb-6">
      <IconWrapper icon={AlertCircle} className="h-4 w-4" />
      <AlertDescription>
        Please enter your registration number to view your examination results
      </AlertDescription>
    </Alert>
  );