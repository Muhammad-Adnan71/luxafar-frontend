import SelectInput from "@template-components/select";
import { cn } from "lib/utils";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

function FormSelect({
  options,
  name,
  placeHolder,
  classNames,
}: {
  classNames?: string;
  placeHolder?: string;
  name: string;
  options: { label: string; value: string }[];
}) {
  const {
    control,
    register,
    formState: { errors, touchedFields },
  } = useFormContext();
  return (
    <div className="relative">
      <Controller
        control={control}
        {...register(name)}
        render={({ field: { onChange, onBlur, value } }) => {
          return (
            <SelectInput
              name={name}
              placeHolder={placeHolder}
              onChange={(value: any) => onChange(value)}
              classes={cn([
                "py-[15px] px-8 mb-5 max-sm:mb-4 max-sm:py-[18px] max-sm:text-center placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90 " +
                  classNames,
              ])}
              value={value}
              items={options}
            />
          );
        }}
      />

      {errors[name] && (
        <span className="text-red-500 text-xs pt-1 block text-[#ff3b3b] absolute -bottom-[17px]">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
}

export default FormSelect;
