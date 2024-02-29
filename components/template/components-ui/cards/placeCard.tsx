/* eslint-disable @next/next/no-img-element */
import ImageWithLoader from "@template-components/ImageWithLoader";
import CustomLink from "@template-components/link";
import Paragraph from "@template-components/paragraph";
import Subheading from "@template-components/sub-heading";
import { removeParaTagsFromString, truncateText } from "lib/utils";
import React, { useState } from "react";
import { useLocomotiveScroll } from "react-locomotive-scroll";

function PlaceCard({
  image,
  title,
  description,
  buttonURL,
  buttonText,
}: {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonURL: string;
}) {
  const { scroll } = useLocomotiveScroll();
  // const doesImageExist = (url: any) =>
  //   new Promise((resolve) => {
  //     const img = new Image();

  //     img.src = url;
  //     img.onload = () => resolve(true);
  //     img.onerror = () => resolve(false);
  //   });
  // const [imageLoading, setImageLoading] = useState<any>(true);

  const scrollToTop = () => {
    scroll.scrollTo(0, {
      duration: 500,
      disableLerp: true,
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="h-[286px] mb-10">
        {/* {imageLoading ? (
          <>
            <div className="w-full !bg-quaternary-color h-full glass-effect">
              <span></span>
              <span></span>
            </div>
          </>
        ) : (
          ""
        )}
        <img
          loading="lazy"
          className={`w-full h-full ${imageLoading ? "invisible" : " "}`}
          src={image}
          alt=""
          onLoad={async () => {
            const response = await doesImageExist(image);
            setImageLoading(false);
          }}
        /> */}
        <ImageWithLoader
          alt={title ? title + " " + "Luxafar Place Card Image" : ""}
          loading="lazy"
          classes="w-full h-full object-cover"
          url={image as string}
        />
      </div>
      <div className="h-full  flex flex-col justify-between flex-1">
        <div>
          <Subheading classes={"font-[700]"}>{title}</Subheading>
          <Paragraph
            classes="max-sm:mb-8 line-clamp-4"
            htmlText={truncateText(
              removeParaTagsFromString(description as string),
              300
            )}
          ></Paragraph>
        </div>
        <CustomLink
          text={buttonText}
          redirect={buttonURL}
          classes="w-fit"
          onClick={scrollToTop}
        />
      </div>
    </div>
  );
}

export default PlaceCard;
