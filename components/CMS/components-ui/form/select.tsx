import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/CMS/components-ui/shadcn/ui/select";
import { cn } from "lib/utils";
function CustomSelect({
  options,
  placeholder,
  name,
  onChange,

  classes,
  value,
  defaultValue,
  disabled,
}: {
  disabled?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: Function;
  onBlur?: Function;
  classes?: string;
  placeholder?: string;
  name: string;
  options: { label: string; value: string }[];
}) {
  return (
    <Select
      disabled={disabled}
      defaultValue={defaultValue}
      name={name}
      onValueChange={(e) => onChange && onChange(e)}
      value={value}
    >
      <SelectTrigger className={cn("text-[#ccc] capitalize py-5", classes)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[200px] overflow-y-scroll">
        {options.map((option) => (
          <SelectItem value={option.value} key={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default CustomSelect;
