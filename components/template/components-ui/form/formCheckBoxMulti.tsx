import React from "react";
import { Label } from "components/CMS/components-ui/shadcn/ui/label";
import { useFormContext, Controller } from "react-hook-form";
import ErrorText from "components/CMS/components-ui/form/errorText";
import { Checkbox } from "components/CMS/components-ui/shadcn/ui/checkbox";

function FormCheckboxMulti({
  options,
  name,
  defaultValue,
}: {
  defaultValue?: string;
  name: string;
  options?: { label: string; value: string }[];
}) {
  const {
    register,
    getValues,
    setValue,
    control,
    formState: { errors, touchedFields, isSubmitting },
  } = useFormContext();

  const setFieldValues = (check: any, value: any) => {
    if (check) {
      if (getValues(name)) {
        setValue(name, [...getValues(name), value]);
      } else {
        setValue(name, [value]);
      }
    } else {
      let values = getValues(name)?.filter((fil: any) => fil !== value);
      setValue(name, values);
    }
  };

  return (
    <div
      className={`relative flex gap-x-[20px] max-lg:gap-x-[40px] gap-y-2 flex-start flex-wrap mt-5 mb-5  ${
        options && options[0]?.label.length > 20 ? "flex-col gap-y-2" : ""
      }`}
    >
      {options?.map((item: any, index) => (
        <div
          key={index}
          className={` w-[20%] max-xl:w-[30%] max-lg:w-[40%] flex items-center gap-[15px]  ${
            options && options[0]?.label.length > 20 ? "w-full" : ""
          }`}
        >
          <Checkbox
            className="border-secondary-color w-[20px] h-[20px] border-[2px] rounded-full"
            id={`r${item.value}`}
            onCheckedChange={(checked) => {
              setFieldValues(checked, item.value);
            }}
          />
          <Label
            htmlFor={`r${item.value}`}
            className="text-[11px] opacity-70 font-body"
          >
            {item.label}
          </Label>
        </div>
      ))}
      {errors[name] && <ErrorText message={errors[name]?.message} />}
    </div>
  );
}

export default FormCheckboxMulti;
