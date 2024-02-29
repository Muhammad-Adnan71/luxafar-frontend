import Image from "next/image";
import React from "react";
import Subheading from "@template-components/sub-heading";

export default function ThingsDescriptionCard({
  descriptionList,
  classes,
  image,
  title,
}: {
  classes?: string;
  descriptionList: any;
  image: any;
  title: string;
}) {
  return (
    <div className="flex gap-10 max-md:gap-y-5 w-full max-xl:flex-col max-xl:justify-center max-xl:items-center max-xl:text-center">
      <div className={`w-[35%] max-xl:w-full`}>
        <div className="rounded-full w-[180px] h-[180px] max-sm:w-[150px] max-sm:h-[150px] max-xl:m-auto bg-quaternary-color flex items-center justify-center  overflow-hidden">
          <img
            loading="lazy"
            src={image}
            alt={title ? title + "" + "Luxafar Destination Features" : ""}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className={`w-[65%] max-lg:w-[85%] max-md:w-[95%]`}>
        <Subheading classes={"max-xl:text-[25px] max-sm:text-[20px]"}>
          <strong className="text-secondary-color !font-heading font-[500] ">
            {title}
          </strong>
        </Subheading>
        {/* <ul className="text-white max-sm:w-4/5 max-sm:mx-auto">
          {descriptionList.map((li: any, index: number) => (
            <li
              key={index}
              className="pb-3 leading-[1.4] text-[18px] last:border-none opacity-70 max-xl:text-[16px] max-xl:border- max-md:text-[12px] max-xl:w-fit max-xl:m-auto max-xl:border-b max-xl:border-[rgba(166,151,105,1)] max-xl:mb-5 max-md:mb-2 max-xl:pb-1 xl:before:content-['\2022'] xl:before:text-secondary-color xl:before:text-[25px] xl:before:font-bold xl:before:inline-block xl:before:w-[1em] xl:before:ml-[-1em]"
            >
              {li}
            </li>
          ))}
        </ul> */}
        <div
          className="text-white relative featuresBullet max-sm:w-4/5 max-sm:mx-auto"
          dangerouslySetInnerHTML={{ __html: descriptionList ?? "" }}
        ></div>
      </div>
    </div>
  );
}
