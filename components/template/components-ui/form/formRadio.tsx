import React, { useEffect, useState } from "react";
import { Label } from "components/CMS/components-ui/shadcn/ui/label";
import { useFormContext, useWatch } from "react-hook-form";
import ErrorText from "components/CMS/components-ui/form/errorText";
import {
  RadioGroup,
  RadioGroupItem,
} from "components/CMS/components-ui/shadcn/ui/radio-group";

function FormRadio({
  options,
  name,
  defaultValue,
  classes,
}: {
  classes?: string;
  defaultValue?: string;
  name: string;
  options?: { label: string; value: string }[];
}) {
  const [emptySelectedValue, setEmptySelectedValue] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const {
    register,
    getValues,
    setValue,
    formState: { errors, touchedFields, isSubmitSuccessful },
  } = useFormContext();
  const watch = useWatch();

  useEffect(() => {
    if (isMounted) setEmptySelectedValue("");
  }, [isSubmitSuccessful]);

  useEffect(() => {
    setEmptySelectedValue(getValues(name));
  }, [watch]);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <div className="relative ">
      <RadioGroup
        onValueChange={(e: any) => {
          setValue(name, e);
          setEmptySelectedValue(e);
        }}
        defaultValue={getValues(name)}
        className={`flex gap-x-[20px] max-lg:gap-x-[40px] flex-start flex-wrap mt-5 mb-5  ${
          options && options[0]?.label.length > 20 ? "flex-col" : ""
        } ${classes}`}
        value={emptySelectedValue}
      >
        {options?.map((option, index) => (
          <React.Fragment key={index}>
            <div
              className={` w-[20%]  max-xl:w-[30%] max-lg:w-[40%]  flex items-center gap-[15px]  ${
                options && options[0]?.label.length > 20
                  ? "w-full max-xl:w-full max-lg:w-full"
                  : " "
              }`}
            >
              <RadioGroupItem
                value={option.value}
                id={`r${option.value}`}
                className="border-secondary-color w-[20px] h-[20px] border-[2px]"
              />
              <Label
                id={`r${option.value}`}
                htmlFor={`r${option.value}`}
                className="text-[11px] opacity-70 font-body"
              >
                {option.label}
              </Label>
            </div>
          </React.Fragment>
        ))}
      </RadioGroup>
      {errors[name] && <ErrorText message={errors[name]?.message} />}
    </div>
  );
}

export default FormRadio;
