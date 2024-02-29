import React, { useEffect, useRef, useState } from "react";
import upload from "@public/template/upload-image.png";
import Image from "next/image";
import { Label } from "./shadcn/ui/label";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import ErrorText from "./form/errorText";
import { undefined } from "zod";

function VideoUploader({ name = "" }: { name?: string }) {
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
  const [videos, setVideos] = useState<any>({
    desktopMediaUrl: undefined,
    mobileMediaUrl: undefined,
  });
  const [isVideoPlay, setIsVideoPlay] = useState(false);
  const watch = useWatch();

  useEffect(() => {
    setVideos(getValues(name));
    if (getValues(name) === undefined) {
      setVideos({ desktopMediaUrl: undefined, mobileMediaUrl: undefined });
      setTabActive("desktopMediaUrl");
    } else {
      setVideos(getValues(name));
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
          {isVideoPlay && (
            <label
              htmlFor={name + tabActive}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 block bg-primary-color px-5 py-2 cursor-pointer rounded-md text-[14px]"
            >
              Upload Video
            </label>
          )}
          <Label className=" flex flex-1 relative overflow-hidden group  ">
            <label
              className="w-full  gap-2 flex-1 overflow-hidden border-[1px] border-cms-tertiary-color     cursor-pointer flex justify-center items-center"
              htmlFor={name + tabActive}
            >
              {videos?.[tabActive] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <>
                  {typeof videos?.[tabActive] === "object" ? (
                    <video
                      preload="none"
                      id="videoLoad"
                      controls
                      onPlaying={() => setIsVideoPlay((cur) => !cur)}
                    >
                      <source
                        src={URL.createObjectURL(videos?.[tabActive] as File)}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <video
                      preload="none"
                      id="videoLoad"
                      controls
                      onPlaying={() => setIsVideoPlay((cur) => !cur)}
                    >
                      <source src={videos?.[tabActive]} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </>
              ) : (
                <>
                  <Image
                    src={upload}
                    alt="Upload Symbol"
                    className="max-w-[30px] invert "
                  />
                  <p>Upload Video</p>
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

                      const videos = getValues(name);
                      setValue(name, {
                        ...videos,
                        [tabActive]: fileInput.files[0] as any,
                      });
                      setVideos((prev: any) => ({
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

export default VideoUploader;
