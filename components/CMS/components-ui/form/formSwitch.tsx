import React from "react";
import FormLabel from "./formLabel";
import { Switch } from "../shadcn/ui/switch";
import { useFormContext } from "react-hook-form";
import ErrorText from "./errorText";

function FormSwitch({ label, name }: { label?: string; name: string }) {
  const {
    register,
    formState: { errors, touchedFields, isSubmitting },
  } = useFormContext();
  return (
    <div className="flex gap-3 items-center">
      <FormLabel>{label}</FormLabel>
      <Switch {...register(name)} disabled={isSubmitting} />
      {errors[name] && <ErrorText message={errors[name]?.message} />}
    </div>
  );
}

export default FormSwitch;
