/* eslint-disable @next/next/no-img-element */
"use client";
import ImageWithLoader from "@template-components/ImageWithLoader";
import Breadcrumbs from "@template-components/breadcrumbs";
import Container from "components/template/container";
import { cn } from "lib/utils";

import React, { useEffect, useState } from "react";

const BlogBanner = ({
  breadcrumbs,
  image,
  classes,
  mobileImage,
  altText,
}: {
  mobileImage: any;
  altText: string;
  breadcrumbs: { name?: string; url: string }[];
  image: any;
  classes?: string;
}) => {
  let isMobile;
  if (typeof window !== "undefined") {
    isMobile = window && window.screen.width < 640;
  }

  return (
    <>
      <Container classes="max-md:hidden">
        <Breadcrumbs breadcrumbs={breadcrumbs} classes="mb-10" />
      </Container>
      <div
        className={cn([
          "h-[calc(100vh_-_158px)] sm:relative sm:overflow-hidden max-md:w-[80%] max-md:mx-auto",
          ,
          classes,
        ])}
      >
        <div className="w-full h-full">
          <ImageWithLoader
            alt={altText ? altText : ""}
            loaderClasses={" glass-banner-effect"}
            classes="w-full h-full object-cover  "
            url={isMobile ? (mobileImage ? mobileImage : image) : image}
          />
        </div>
      </div>
    </>
  );
};

export default BlogBanner;
