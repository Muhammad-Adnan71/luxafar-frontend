import React from "react";
import FormLabel from "./formLabel";
import { Label } from "../shadcn/ui/label";
import { RadioGroup, RadioGroupItem } from "../shadcn/ui/radio-group";
import { useFormContext } from "react-hook-form";
import ErrorText from "./errorText";

function FormCheckbox({
  options = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ],

  label,
  name,
  defaultValue,
}: {
  defaultValue?: string;
  name: string;
  label?: string;
  options?: { label: string; value: string }[];
}) {
  const {
    register,
    getValues,
    formState: { errors, touchedFields, isSubmitting },
  } = useFormContext();
  return (
    <div className="relative mb-3 w-full ">
      {label && <FormLabel>{label}</FormLabel>}
      <RadioGroup
        {...register(name)}
        defaultValue={getValues(name)}
        disabled={isSubmitting}
        className="flex mt-2 gap-5"
      >
        <div className="flex items-center space-x-2">
          {options.map((option) => (
            <React.Fragment key={option.value}>
              <RadioGroupItem value={option.value} id="r2" />
              <Label htmlFor="r2">{option.label}</Label>
            </React.Fragment>
          ))}
        </div>
      </RadioGroup>
      {errors[name] && <ErrorText message={errors[name]?.message} />}
    </div>
  );
}

export default FormCheckbox;
