import { cn } from "lib/utils";
import React from "react";

import { useFormContext } from "react-hook-form";

function TextArea({
  classes,
  name,
  rows,
  placeholder,
}: {
  classes?: string;
  name: string;
  rows?: number;
  placeholder?: string;
}) {
  const {
    register,
    formState: { errors, touchedFields },
  } = useFormContext();
  return (
    <div className="relative">
      <textarea
        rows={rows}
        placeholder={placeholder}
        className={cn([
          "bg-primary-color  resize-none text-xs text-[#949393] block w-full border-[#6F6A5A] border rounded-md py-3 px-8  focus:outline-none focus:shadow-none placeholder:text-[#949393] ",
          classes,
        ])}
        {...register(name)}
      ></textarea>
      {errors[name] && (
        <span className="text-red-500 text-xs pt-1 block text-[#ff3b3b] absolute -bottom-[17px]">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
}

export default TextArea;
