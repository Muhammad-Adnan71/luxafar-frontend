/* eslint-disable @next/next/no-img-element */
import ImageWithLoader from "@template-components/ImageWithLoader";
import CustomLink from "@template-components/link";
import Paragraph from "@template-components/paragraph";
import Subheading from "@template-components/sub-heading";
import { cn, removeParaTagsFromString, truncateText } from "lib/utils";
import React, { useState } from "react";

function BlogCard({
  image,
  title,
  description,
  buttonURL,
  buttonText,
  altText,
  titleClasses,
}: {
  image?: any;
  title?: string;
  description?: string;
  buttonText: string;
  buttonURL: string;
  altText?: string;
  titleClasses?: string;
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="h-[286px] mb-10">
        <ImageWithLoader
          alt={title ? title + " " + "Luxafar Blog Card Image" : ""}
          loading="lazy"
          classes="w-full h-full object-cover"
          url={image as string}
        />
      </div>
      <div className="h-full  flex flex-col justify-between flex-1">
        <div className="h-full flex flex-col justify-between ">
          <Subheading
            classes={cn([
              "font-[700] text-[28px] max-xl:text-[24px] max-lg:text-[23px] max-sm:text-[22px] leading-[1.2]",
              titleClasses,
            ])}
          >
            {truncateText(title as string)}
          </Subheading>
          <Paragraph
            classes="opacity-1 line-clamp-4 overflow-y-hidden line-clamp-4 max-sm:text-[14px]"
            htmlText={truncateText(
              removeParaTagsFromString(description as string),
              300
            )}
          ></Paragraph>
        </div>
        <CustomLink
          text={buttonText}
          redirect={buttonURL}
          classes="w-fit max-sm:mt-5"
        />
      </div>
    </div>
  );
}

export default BlogCard;
