import React from "react";
import { Button } from "./shadcn/ui/button";
import { Loader, PlusIcon, Save } from "lucide-react";
import { useFormContext } from "react-hook-form";

function SaveButton({
  isEdit,
  label,
  isLoading,
}: {
  label?: string;
  isEdit?: boolean;
  isLoading?: boolean;
}) {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <div className="flex justify-end mt-5 mb-2">
      <Button
        disabled={isSubmitting}
        className=" py-5  flex items-center justify-center gap-1 px-10 disabled:bg-opacity-90 disabled:cursor-default"
        type="submit"
      >
        {!isSubmitting && (
          <>
            {isEdit ? (
              <Save size={16} />
            ) : (
              <PlusIcon className="w-4 h-4" aria-hidden="true" />
            )}
          </>
        )}

        <span className="relative">
          {isSubmitting && (
            <Loader className="h-5 w-5 absolute -left-[30px] -top-[0px]  animate-spin transition-all text-[#fff]" />
          )}
          <span className="capitalize">{isEdit ? "Save Changes" : label}</span>
        </span>
      </Button>
    </div>
  );
}

export default SaveButton;
