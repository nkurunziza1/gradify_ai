import { Search } from "lucide-react";
import React from "react";

import { Button } from "../../../components/ui//button";
import { Input } from "../../../components/ui/input";
import { IconWrapper } from "../atoms/icon";

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  value,
  onChange,
  onSearch = null,
}) => (
  <div className="flex w-full">
    <div className="relative flex-1">
      <IconWrapper
        icon={Search}
        className="absolute left-2 top-2.5 text-gray-500"
      />
      <Input
        placeholder={placeholder}
        className="pl-8 rounded-full"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
      />
    </div>
    {onSearch && (
      <div className="ml-2">
        <Button className="text-black" onClick={onSearch}>
          Search
        </Button>
      </div>
    )}
  </div>
);
