"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "components/CMS/components-ui/shadcn/ui/select";
import React from "react";

function SearchSelectInput({
  placeHolder,
  label,
  items,
  isBorderBold,
  onChange,
  value,
}: {
  value?: string;
  onChange?: Function;
  label?: string;
  placeHolder?: string;
  isBorderBold?: boolean;
  items?: { value: string; label: string }[];
}) {
  return (
    <Select
      value={value}
      onValueChange={(value) => onChange && onChange(value)}
    >
      <SelectGroup className="w-full max-lg:text-sm">
        {label && (
          <SelectLabel className="lg:text-center text-white font-body mb-3 font-normal px-0 opacity-80">
            {label}
          </SelectLabel>
        )}
        <SelectTrigger
          className={`[&>span]:text-[12px] border-secondary-color bg-transparent rounded-sm text-[rgba(255,255,255,0.4)] capitalize ${
            isBorderBold
              ? "focus:outline-none max-sm:rounded-md border max-sm:py-5 max-sm:bg-primary-color pl-8 justify-start border-[#6F6A5A] focus:shadow-none "
              : "justify-center max-sm:py-6"
          }`}
        >
          <SelectValue placeholder={placeHolder} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {items?.map((item, index) => (
            <SelectItem value={item.value} key={index}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectGroup>
    </Select>
  );
}

export default SearchSelectInput;
