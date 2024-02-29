import React from "react";
import FormLabel from "./formLabel";
import CustomSelect from "./select";
import { Controller, useFormContext } from "react-hook-form";
import ErrorText from "./errorText";

function FormSelect({
  label,
  name,
  placeholder,
  options,
}: {
  type?: string;
  label?: string;
  name: string;
  placeholder: string;
  options: { label: string; value: string }[];
  onChange?: Function;
}) {
  const {
    register,
    control,
    formState: { errors, touchedFields, isSubmitting },
  } = useFormContext();
  return (
    <>
      <div className="relative mb-3 w-full">
        <FormLabel>{label}</FormLabel>
        <Controller
          control={control}
          {...register(name)}
          render={({ field: { onChange, onBlur, value } }) => {
            return (
              <CustomSelect
                disabled={isSubmitting}
                name={name}
                options={options}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
              />
            );
          }}
        />
        {errors[name] && <ErrorText message={errors[name]?.message} />}
      </div>
    </>
  );
}

export default FormSelect;
