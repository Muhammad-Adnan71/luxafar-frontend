import { cn } from "lib/utils";
import React from "react";
import { useFormContext } from "react-hook-form";

type inputType = {
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  value?: string;
  type?: string;
  classes?: string;
  defaultValue?: string;
  isInnerPage?: boolean;
  name: string;
  isFormInput?: boolean;
  onFocus?: React.FocusEventHandler<HTMLInputElement> | undefined;
};

function Input({
  isInnerPage,
  placeholder,
  onChange,
  value,
  type,
  classes,
  defaultValue = "",
  name,
  isFormInput = true,
  onFocus,
}: inputType) {
  const {
    register,
    formState: { errors, touchedFields },
  } = useFormContext();
  return (
    <>
      {isFormInput && (
        <div className="relative">
          <input
            type={type ?? "text"}
            className={cn([
              `bg-primary-color text-xs text-[#949393] block w-full border-[#6F6A5A] border rounded-md py-3 px-8  focus:outline-none focus:shadow-none placeholder:text-[#949393] 
              
              ${
                isInnerPage
                  ? "rounded-none max-sm:rounded-md placeholder:text-[rgba(255,255,255,0.4)]"
                  : "rounded-md placeholder:text-[#949393]"
              }
              `,
              classes,
            ])}
            onFocus={onFocus}
            defaultValue={defaultValue}
            placeholder={placeholder}
            value={value}
            {...register(name)}
          />
          {errors[name] && (
            <span className="text-red-500 text-xs pt-1 block text-[#ff3b3b] absolute -bottom-[17px]">
              {errors[name]?.message as string}
            </span>
          )}
        </div>
      )}
      {!isFormInput && (
        <input
          className={cn([
            "bg-primary-color text-xs text-[#949393] block w-full border-[#6F6A5A] border rounded-md py-3 px-8  focus:outline-none focus:shadow-none placeholder:text-[#949393] ",
            classes,
          ])}
          onFocus={onFocus}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
        />
      )}
    </>
  );
}

export default Input;
