import React, { useEffect, useState } from "react";
import upload from "@public/template/upload-image.png";
import Image from "next/image";
import { Label } from "./shadcn/ui/label";
import { Input } from "./shadcn/ui/input";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import ErrorText from "./form/errorText";
import { undefined } from "zod";

function ImageUploader({ name = "" }: { name?: string }) {
  const devices = [
    {
      name: "desktopMediaUrl",
      label: "desktop",
    },
    {
      label: "mobile",
      name: "mobileMediaUrl",
    },
  ];

  const {
    control,
    register,
    setValue,
    getValues,
    formState: { errors, touchedFields },
  } = useFormContext();

  const [tabActive, setTabActive] = useState<string>(devices[0]?.name);
  const [images, setImages] = useState<any>({
    desktopMediaUrl: undefined,
    mobileMediaUrl: undefined,
  });
  const watch = useWatch();

  useEffect(() => {
    setImages(getValues(name));
    if (getValues(name) === undefined) {
      setImages({ desktopMediaUrl: undefined, mobileMediaUrl: undefined });
      setTabActive("desktopMediaUrl");
    } else {
      setImages(getValues(name));
    }
  }, [watch]);

  return (
    <div className="flex flex-col gap-3  ">
      <ul className="flex gap-1 m-0">
        {devices.map((screen: any, index: number) => (
          <li
            key={index}
            className={`capitalize cursor-pointer text-white  bg-cms-fourth-color p-2 text-xs  ${
              tabActive === screen.name
                ? " bg-tertiary-color dark:bg-gray-600"
                : "dark:bg-gray-900 bg-cms-fourth-color"
            } `}
            onClick={() => setTabActive(screen.name)}
          >
            {screen.label}
          </li>
        ))}
      </ul>
      <div className="dark:bg-gray-700 bg-cms-tertiary-color rounded">
        <div
          className={` relative flex min-h-[400px] dark:bg-gray-700 bg-[#0b2f3a] rounded-md  ${
            tabActive === "mobileMediaUrl" && "w-[350px] h-[500px] mx-auto"
          }`}
        >
          <Label className=" flex flex-1 relative overflow-hidden group  ">
            <label
              className="w-full  gap-2 flex-1 overflow-hidden border-[1px] border-cms-tertiary-color     cursor-pointer flex justify-center items-center"
              htmlFor={name + tabActive}
            >
              {images?.[tabActive] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <>
                  {typeof images?.[tabActive] === "object" ? (
                    <img
                      loading="lazy"
                      src={URL.createObjectURL(images?.[tabActive] as File)}
                      className="object-cover"
                      alt="slides"
                    />
                  ) : (
                    <img
                      loading="lazy"
                      src={images?.[tabActive]}
                      className="object-cover"
                      alt="slides"
                    />
                  )}
                </>
              ) : (
                <>
                  <Image
                    src={upload}
                    alt="Upload Symbol"
                    className="max-w-[30px] invert "
                  />
                  <p>Upload Image</p>
                </>
              )}
            </label>
            <Controller
              control={control}
              {...register(name)}
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <input
                    multiple={false}
                    type="file"
                    className="hidden"
                    id={name + tabActive}
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

                      const images = getValues(name);
                      setValue(name, {
                        ...images,
                        [tabActive]: fileInput.files[0] as any,
                      });
                      setImages((prev: any) => ({
                        ...prev,
                        [tabActive]: fileInput.files[0],
                      }));
                      e.target.value = null;
                    }}
                  />
                );
              }}
            />
          </Label>

          {errors[name] && <ErrorText message={errors[name]?.message} />}
        </div>
      </div>
    </div>
  );
}

export default ImageUploader;
