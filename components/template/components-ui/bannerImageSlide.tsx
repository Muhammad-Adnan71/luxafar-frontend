/* eslint-disable @next/next/no-img-element */
import React from "react";

function BannerImageSlide({
  isLoading,
  desktopImage,
  mobileImage,
  setImageLoading,
  imageAlt,
}: {
  isLoading: boolean;
  imageAlt?: string;
  desktopImage: any;
  mobileImage: any;
  setImageLoading?: Function;
}) {
  const doesImageExist = (url: any) =>
    new Promise((resolve) => {
      const img = new Image();

      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  return (
    <>
      <picture>
        <source
          className="w-full"
          srcSet={mobileImage}
          media="(max-width:640px)"
          // onLoad={async () => {
          //   const response = await doesImageExist(mobileImage);
          //   setImageLoading && setImageLoading(false);
          // }}
        />
        <source
          className={
            !isLoading
              ? "w-full sm:hidden grayscale animate-[0.8s_filterEffect_1.4s_ease-in-out_forwards] "
              : "w-full sm:hidden grayscale "
          }
          srcSet={desktopImage}
          media="(min-width:641px)"
          onLoad={async () => {
            const response = await doesImageExist(desktopImage);
            setImageLoading && setImageLoading(false);
          }}
        />
        <img
          src={mobileImage}
          alt={imageAlt ? imageAlt : ""}
          className="w-full"
        />
      </picture>
    </>
  );
}

export default BannerImageSlide;
