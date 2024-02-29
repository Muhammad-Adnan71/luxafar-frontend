import React from "react";
import FormLabel from "./formLabel";
import { Input } from "../shadcn/ui/input";
import { useFormContext } from "react-hook-form";
import { cn } from "lib/utils";
import ErrorText from "./errorText";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "components/CMS/components-ui/shadcn/ui/hover-card";
import { InfoIcon } from "lucide-react";

function FormInput({
  informationText,
  type = "text",
  label,
  name,
  placeholder,
  value,
  disabled = false,
  classes,
  errorMessage,
}: {
  informationText?: string;
  type?: string;
  errorMessage?: any;
  label?: string;
  name: string;
  placeholder?: string;
  value?: string;
  classes?: string;
  disabled?: boolean;
}) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();

  return (
    <div className="relative mb-3 w-full">
      <div className="flex items-center gap-[10px]">
        {label && <FormLabel>{label}</FormLabel>}
        {informationText && (
          <div className="mt-1">
            <HoverCard openDelay={300}>
              <HoverCardTrigger>
                {<InfoIcon className="w-[15px] h-[15px] text-white" />}
              </HoverCardTrigger>
              <HoverCardContent className="px-3 py-2 text-xs  w-fit !bg-cms-primary-color border-cms-fourth-color max-w-[200px] text-white font-normal dark:bg-gray-800 dark:border-gray-900">
                {informationText}
              </HoverCardContent>
            </HoverCard>
          </div>
        )}
      </div>
      {type === "textarea" ? (
        <textarea
          disabled={disabled ? disabled : isSubmitting}
          rows={5}
          className={cn([
            "py-5 placeholder:capitalize  resize-none flex w-full rounded-md border border-slate-200 border-slate-200 text-white border-cms-tertiary-color font-thin bg-cms-fourth-color px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-800 dark:bg-gray-700 dark:border-gray-900 dark:text-gray-200",
            classes,
          ])}
          placeholder={placeholder}
          value={value}
          defaultValue={value}
          {...register(name)}
        />
      ) : (
        <Input
          disabled={disabled ? disabled : isSubmitting}
          className={cn(["py-5 placeholder:capitalize ", classes])}
          type={type}
          placeholder={placeholder}
          value={value}
          {...register(name)}
        />
      )}

      {errorMessage ? (
        <ErrorText message={errorMessage} />
      ) : (
        errors[name] && <ErrorText message={errors[name]?.message} />
      )}
    </div>
  );
}

export default FormInput;
