import {
  Search,
  User,
  School,
  FileText,
  Filter,
  AlertCircle,
} from "lucide-react";
import React from "react";

import { IconWrapper } from "../atoms/icon";
import { Texts } from "../atoms/text";

export const Logo: React.FC = () => (
  <div className="flex items-center space-x-2">
    <img width={40} height={40} src="/images/logo.png" alt="" />
    <Texts variant="title">Exam Results</Texts>
  </div>
);
