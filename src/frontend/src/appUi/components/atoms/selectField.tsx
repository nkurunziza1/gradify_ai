import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import { Control } from "react-hook-form";
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../../../components/ui/form";

interface SelectFieldProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  control: Control<any>;
  placeholder?: string;
}

export const SelectField = ({
  name,
  label,
  options,
  control,
  placeholder,
}: SelectFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder || `Select ${label}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
