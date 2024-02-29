/* eslint-disable @next/next/no-img-element */
"use client";
import React, {
  ReactNode,
  MouseEventHandler,
  useState,
  useEffect,
} from "react";
import Button from "./button";
import Main from "../container";
import MainHeading from "./heading";
import Paragraph from "./paragraph";
import Breadcrumbs from "./breadcrumbs";
import SectionHeading from "./sectionHeading";
import Container from "../container";
import ImageWithLoader from "./ImageWithLoader";

function InnerPageBanner({
  image,
  mainHeading,
  description,
  buttonText,
  buttonLink,
  detailPage,
  breadcrumbs,
  altText,
  onButtonClick,
}: {
  image: any;
  altText?: string;
  mainHeading: string | ReactNode;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  detailPage?: boolean;
  breadcrumbs?: any;
  onButtonClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  const breadcrumbsDefault = [
    { name: "home", url: "" },
    { name: mainHeading as string, url: "" },
  ];

  return (
    <div className=" relative" id="innerPageBanner">
      <div className="relative max-2xl:h-[calc(100vh_-_232px)] 2xl:h-[calc(100vh_-_271px)]  after:w-full after:h-full after:bg-[#000] after:absolute after:top-0 after:left-0 after:opacity-[.65] max-md:hidden">
        <div className="w-full h-full">
          <ImageWithLoader
            alt={
              altText
                ? altText
                : mainHeading
                ? mainHeading + " " + "Destination Banner Image"
                : ""
            }
            loaderClasses={" glass-banner-effect"}
            loading="eager"
            classes="object-cover w-full h-full"
            url={image as string}
          />
        </div>
        <Container classes="absolute top-[30px] left-[50%] translate-x-[-50%] z-20">
          <Breadcrumbs
            breadcrumbs={breadcrumbs?.length ? breadcrumbs : breadcrumbsDefault}
            classes="mb-10"
          />
        </Container>
        <Container classes="absolute  top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  z-10">
          <div>
            <SectionHeading classes={"font-[700]"}>
              {mainHeading}
            </SectionHeading>
            {description && (
              <Paragraph
                htmlText={description}
                classes="max-w-[600px] max-xl:max-w-[70%] opacity-100 mb-10 mt-6"
              ></Paragraph>
            )}
            {buttonText && (
              <Button
                text={buttonText}
                redirect={buttonLink}
                onClick={onButtonClick}
                classes={`${detailPage && "hidden"} px-10 `}
              />
            )}
          </div>
        </Container>
      </div>
      <div className={` max-md:mb-14 md:hidden  `}>
        <Main>
          <div
            className={`relative ${
              description ? "h-[45vh]" : "h-[50vh]"
            } after:w-full after:z-[-1] after:h-full after:bg-[#000] after:absolute after:top-0 after:left-0 after:opacity-[.65]`}
          >
            <div className="w-full h-full">
              {/* {imageLoading ? (
                <>
                  <div className="w-full !bg-quaternary-color h-full glass-banner-effect">
                    <span></span>
                    <span></span>
                  </div>
                </>
              ) : (
                ""
              )}
              <img
                loading="eager"
                src={image}
                alt="banner"
                className={`${
                  imageLoading ? "invisible" : ""
                } relative z-[-1] object-cover w-full h-full`}
                onLoad={async () => {
                  const response = await doesImageExist(image);
                  setImageLoading(false);
                }}
              /> */}
              <ImageWithLoader
                loading="eager"
                classes="relative z-[-1] object-cover w-full h-full"
                url={image as string}
              />
            </div>
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-0">
              <MainHeading classes={"font-[600] max-[380px]:text-[29px]"}>
                {mainHeading}
              </MainHeading>
            </div>
          </div>
          <div
            className={`${detailPage && "max-md:mx-auto max-md:text-center"}`}
          >
            {description && (
              <Paragraph
                htmlText={description}
                classes={`opacity-100 mb-10 max-sm:mb-5 ${
                  !buttonText && "max-sm:mb-0"
                } mt-6 !text-[13px]`}
              ></Paragraph>
            )}
            {buttonText && (
              <Button
                redirect={buttonLink}
                text={buttonText}
                classes={`px-10 px-5 max-md:hidden  ${
                  detailPage && "max-sm:mt-8 sm:hidden max-sm:mb-0"
                }`}
              />
            )}
          </div>
        </Main>
      </div>
    </div>
  );
}

export default InnerPageBanner;
