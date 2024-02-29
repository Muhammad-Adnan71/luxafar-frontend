import React from "react";
import { cn } from "lib/utils";

function Gallery({ images, classes }: { classes?: string; images?: any }) {
  return (
    <div
      className={cn([
        "grid  grid-rows-[400px,300px,300px] max-md:grid-rows-[400px,300px,300px,300px] max-sm:grid-rows-[180px_150px_155px_180px]  gap-3 overflow-hidden",
        ,
        classes,
      ])}
    >
      <div className="grid grid-cols-2 gap-3 max-md:hidden">
        <div className="overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={images?.[0]?.media?.desktopMediaUrl as string}
            alt="Luxafar Gallary Image 1"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 overflow-hidden">
          <div>
            <img
              className="w-full h-full object-cover"
              src={images?.[1]?.media?.desktopMediaUrl as string}
              alt="Luxafar Gallary Image 2"
            />
          </div>
          <div className="grid grid-rows-[repeat(2,minmax(0px,_200px))] gap-3 overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={images?.[2]?.media?.desktopMediaUrl as string}
              alt="Luxafar Gallary Image 3"
            />
            <img
              className="w-full h-full object-cover"
              src={images?.[3]?.media?.desktopMediaUrl as string}
              alt="Luxafar Gallary Image 4"
            />
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <img
          className="w-full h-full object-cover"
          src={images?.[0]?.media?.desktopMediaUrl as string}
          alt="Luxafar Gallary Image 1"
        />
      </div>
      <div>
        <img
          className="w-full h-full object-cover"
          src={images?.[4]?.media?.desktopMediaUrl as string}
          alt="Luxafar Gallary Image 5"
        />
      </div>
      <div className="grid grid-cols-3 max-md:grid-cols-2 gap-3">
        <img
          className="w-full h-full object-cover"
          src={images?.[5]?.media?.desktopMediaUrl as string}
          alt="Luxafar Gallary Image 6"
        />
        <img
          className="w-full h-full object-cover"
          src={images?.[6]?.media?.desktopMediaUrl as string}
          alt="Luxafar Gallary Image 7"
        />
        <img
          className="w-full h-full object-cover max-md:hidden"
          src={images?.[7]?.media?.desktopMediaUrl as string}
          alt="Luxafar Gallary Image 8"
        />
      </div>
      <div className="md:hidden">
        <img
          className="w-full h-full object-cover"
          src={images?.[7]?.media?.desktopMediaUrl as string}
          alt="Luxafar Gallary Image 8"
        />
      </div>
    </div>
  );
}

export default Gallery;
