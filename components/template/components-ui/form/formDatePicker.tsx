"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Calendar } from "components/CMS/components-ui/shadcn/ui/calender";
import { Button } from "components/CMS/components-ui/shadcn/ui/button";
import {
  useFormContext,
  Controller,
  useForm,
  FieldError,
} from "react-hook-form";
import ErrorText from "components/CMS/components-ui/form/errorText";
type DatePickerNameType = {
  name: string;
  errorMessage?: any;
};
export function DatePickerWithRange({
  className,
  name,
  placeholder,
  errorMessage,
}: any) {
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    control,
    register,

    formState: { errors, touchedFields },
  } = useFormContext();
  const form = useForm();
  React.useEffect(() => {
    form.setValue(name, {
      from: new Date(Date.now()),
      to: addDays(new Date(Date.now()), 20),
    });
  }, []);

  function isFieldErrorWithTo(obj: any): obj is { to: { message: string } } {
    return obj && obj.to && obj.to.message === "Required";
  }

  function isFieldErrorWithForm(obj: any): obj is { to: { message: string } } {
    return obj && obj.form && obj.form.message === "Required";
  }

  function isFieldErrorWithMessage(
    obj: any
  ): obj is { to: { message: string } } {
    return obj && obj.message === "Required";
  }
  if (errors && errors.travelingDate) {
    if (isFieldErrorWithMessage(errors.travelingDate)) {
      errorMessage = "Form date is Required";
    } else if (isFieldErrorWithTo(errors.travelingDate)) {
      errorMessage = "To date is Required";
    } else if (isFieldErrorWithForm(errors.travelingDate)) {
      errorMessage = "Form date is required";
    }
  } else {
    if (errors.travelingDate) errorMessage = "Dates are required";
    else errorMessage = null;
  }

  return (
    <div className={cn("grid gap-2 ", className)}>
      <Controller
        control={control}
        {...register(name)}
        render={({ field: { onChange, onBlur, value } }) => {
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    " !text-3 h-[48px] text-xs text-[rgba(148,147,147,0.8)] px-[32px] relative border rounded-md  border-[#6F6A5A] items-center justify-start max-md:justify-center text-left font-normal",
                    !value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="absolute right-8 top-1/2 max-sm:right-[0.65rem] -translate-y-1/2  text-secondary-color h-4 w-4" />
                  {value?.from ? (
                    value.to ? (
                      <>
                        {format(value.from, "LLL dd, y")} -{" "}
                        {format(value.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(value.from, "LLL dd, y")
                    )
                  ) : (
                    <span className="text-[rgba(148,147,147,0.7)] text-[0.75rem]">
                      {placeholder}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="center">
                <Calendar
                  className="bg-quaternary-color [&>aria-selected]:!bg-primary-color "
                  initialFocus
                  mode="range"
                  defaultMonth={value?.from}
                  selected={value}
                  onSelect={(date: DateRange | undefined) => {
                    onChange(
                      (date = {
                        from: date?.from,
                        to: date?.to,
                      })
                    );
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          );
        }}
      />
      {errorMessage ? (
        <ErrorText message={errorMessage} />
      ) : (
        errors[name] && <ErrorText message={errors[name]?.message} />
      )}
    </div>
  );
}
