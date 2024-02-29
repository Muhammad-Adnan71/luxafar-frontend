import React from "react";
import MainHeading from "./heading";
import Paragraph from "./paragraph";
import Button from "./button";
import { cn } from "lib/utils";

export default function ThingsSection({
  description,
  buttonText,
  buttonURL,
  classes,
  image,
  title,
  imgRight,
  headingClasses,
  altText,
}: {
  altText?: string;
  classes?: string;
  description?: string;
  image: any;
  title: string;
  buttonText?: string;
  buttonURL?: string;
  imgRight?: boolean;
  headingClasses?: string;
}) {
  return (
    <div
      className={cn([
        `flex  w-full gap-10 max-md:gap-y-6 items-center lg:justify-between max-lg:flex-col `,
        classes,
      ])}
    >
      <div
        className={`w-[58%] max-lg:w-full ${
          imgRight ? "lg:order-2" : "order-1"
        }`}
      >
        {/* {image?.desktopMediaUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            // loading="lazy"
            src={image?.desktopMediaUrl}
            alt="mansion"
            className="w-full h-full"
          />
        )} */}

        <picture>
          <source
            className="w-full h-full object-cover"
            srcSet={image?.mobileMediaUrl}
            media="(max-width:640px)"
          />
          <source
            className={"w-full  h-full object-cover"}
            srcSet={image?.desktopMediaUrl}
            media="(min-width:641px)"
          />
          <img
            src={image}
            alt={
              altText
                ? altText
                : title
                ? title + " " + "Luxafar Holiday Type"
                : ""
            }
            className="w-full h-full object-cover"
          />
        </picture>
      </div>
      <div
        className={cn([
          `txtPadding w-[38%] max-lg:w-full ${
            imgRight ? "lg:order-1" : "order-2"
          }`,
        ])}
      >
        <MainHeading
          classes={cn([
            "!text-[60px] pb-6 max-xl:!text-[50px] max-lg:!text-[40px] max-sm:!text-[34px]",
            headingClasses,
          ])}
        >
          <span
            data-scroll
            data-scroll-speed="-.3"
            data-scroll-direction="horizontal"
            className="inline-block"
          >
            <strong className="text-secondary-color font-[600] !font-heading">
              {title}
            </strong>
          </span>
        </MainHeading>
        <Paragraph
          classes="pb-6 max-md:pb-0 max-sm:my-0 max-sm:mb-5 max-sm:text-[12px]"
          htmlText={description}
        ></Paragraph>
        {buttonText && <Button text={buttonText} redirect={buttonURL}></Button>}
      </div>
    </div>
  );
}
