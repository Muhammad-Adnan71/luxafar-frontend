/* eslint-disable @next/next/no-img-element */
"use client";
import ImageWithLoader from "@template-components/ImageWithLoader";
import Breadcrumbs from "@template-components/breadcrumbs";
import Button from "@template-components/button";
import MainHeading from "@template-components/heading";
import Container from "components/template/container";
import React, { useEffect, useState } from "react";

function HolidayBanner({
  breadcrumbs,
  image,
  title,
  buttonText,
  buttonURL,
  mobileImage,
}: {
  breadcrumbs: { name: string; url: string }[];
  image: any;
  title: string;
  buttonText: string;
  buttonURL: string;
  mobileImage?: any;
}) {
  let isMobile;
  if (typeof window !== "undefined") {
    isMobile = window && window.screen.width < 640;
  }

  return (
    <div className="relative overflow-hidden h-[calc(100vh_-_157px)] max-md:h-[calc(100vh_-_320px)] after:w-full max-md:after:w-[80.1%] max-md:after:left-1/2 max-md:after:top-1/2 max-md:after:-translate-x-1/2 max-md:after:-translate-y-1/2 after:h-full after:bg-[#000] after:absolute after:top-0 after:left-0 after:opacity-[.65]">
      <Container classes="absolute top-[30px] left-[50%] translate-x-[-50%] z-20">
        <Breadcrumbs breadcrumbs={breadcrumbs} classes="mb-10 max-md:hidden" />
      </Container>
      <Container classes="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  z-20">
        <MainHeading
          isHeadingH1={true}
          classes={"mb-10 w-[120px] text-center max-md:mx-auto"}
        >
          {title}
        </MainHeading>
        <Button
          classes="max-md:mx-auto"
          text={buttonText}
          redirect={buttonURL}
        ></Button>
      </Container>

      <ImageWithLoader
        alt={title ? title + " " + "Luxafar" : ""}
        loaderClasses={" max-md:mx-auto max-md:w-4/5 glass-banner-effect"}
        loading="eager"
        classes="w-full h-full object-cover  max-md:mx-auto max-md:w-4/5 "
        url={isMobile ? (mobileImage ? mobileImage : image) : image}
      />
    </div>
  );
}

export default HolidayBanner;
