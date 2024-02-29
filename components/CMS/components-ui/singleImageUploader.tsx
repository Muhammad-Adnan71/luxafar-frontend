import React, { useEffect, useState } from "react";
import { Label } from "./shadcn/ui/label";
import Image from "next/image";
import upload from "@public/template/upload-image.png";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { cn } from "lib/utils";

function SingleImageUploader({
  name,
  classes,
}: {
  name: string;
  classes?: string;
}) {
  const {
    control,
    register,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useFormContext();

  const [image, setImage] = useState({ desktopMediaUrl: undefined });
  const watch = useWatch();

  useEffect(() => {
    if (getValues(name) === undefined) {
      setImage({ desktopMediaUrl: undefined });
    }
  }, [watch]);
  useEffect(() => {
    if (typeof getValues(name)?.desktopMediaUrl === "string") {
      setImage(getValues(name));
    }
  }, []);

  return (
    <Label className={cn("flex flex-1", classes)}>
      <label
        className="w-full  gap-2 px-2 flex-1 border border-green-600  bg-cms-fourth-color border-cms-tertiary-color dark:border-gray-900 dark:bg-gray-700  rounded-md cursor-pointer flex justify-center items-center"
        htmlFor={name}
      >
        {image.desktopMediaUrl ? (
          <img
            src={
              typeof image.desktopMediaUrl === "string"
                ? image.desktopMediaUrl
                : URL.createObjectURL(image.desktopMediaUrl as File)
            }
            className=" w-full h-full object-contain"
            alt="slides"
          />
        ) : (
          <>
            <Image
              src={upload}
              alt="Upload symbol"
              className="max-w-[20px] invert "
            />
            <p>Upload Image</p>
          </>
        )}
        <Controller
          control={control}
          {...register(name)}
          render={({ field: { onChange, onBlur, value } }) => {
            return (
              <input
                multiple={false}
                disabled={isSubmitting}
                type="file"
                className="hidden"
                id={name}
                onChange={(e: any) => {
                  const fileInput = e.target;

                  if (!fileInput.files) {
                    console.warn("no file was chosen");
                    return;
                  }

                  if (!fileInput.files || fileInput.files.length === 0) {
                    console.warn("files list is empty");
                    return;
                  }
                  setValue(name, { desktopMediaUrl: fileInput.files[0] });
                  setImage({ desktopMediaUrl: fileInput.files[0] });
                }}
              />
            );
          }}
        />
      </label>
    </Label>
  );
}

export default SingleImageUploader;
