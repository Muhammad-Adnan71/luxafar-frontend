/* eslint-disable @next/next/no-img-element */
import MainHeading from "@template-components/heading";
import MainHeadingContent from "@template-components/mainHeadingContent";
import Paragraph from "@template-components/paragraph";
import { removeParaTagsFromString, truncateText } from "lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
function UpcomingToursSlider({
  slides,
  title,
  description,
}: {
  slides: any[];
  title: string;
  description: string;
}) {
  const splideRef = useRef() as any;
  useEffect(() => {
    splideRef?.current?.splide?.on("click", (e: any) => {
      const currentIndex = splideRef?.current?.splide.index;
      if (e.index < currentIndex) {
        splideRef.current.go("-1");
      } else {
        splideRef.current.go("+1");
      }
    });
  });

  return (
    <div className="flex md:w-4/5 md:mx-auto justify-between max-md:flex-col items-start gap-12 py-16 max-md:pt-0">
      <div className="w-[30%] max-md:w-[90%] max-md:mx-auto max-md:flex items-center max-md:justify-between">
        <MainHeading isHeadingH1={true} data-scroll data-scroll-speed="1.5">
          <MainHeadingContent
            content={title}
            strongClasses="mt-2 inline-block "
          />
        </MainHeading>
        <Paragraph
          classes="my-5 max-md:hidden"
          htmlText={description}
        ></Paragraph>

        <div className="flex">
          <button
            onClick={() => splideRef.current.go("-1")}
            className={`relative flex justify-center items-center border-[1px] border-secondary-color rounded-full  mr-3 max-sm:mr-2 cursor-pointer w-10 h-10 max-sm:w-9 max-sm:h-9 `}
          >
            <ChevronLeftIcon
              className={` absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary-color font-[20px] w-[18px]  h-[18px]`}
            />
          </button>
          <button
            onClick={() => splideRef.current.go("+1")}
            className={`relative flex justify-center items-center border-[1px] border-secondary-color rounded-full  mr-3 max-sm:mr-2 cursor-pointer w-10 h-10 max-sm:w-9 max-sm:h-9 `}
          >
            <ChevronRightIcon
              className={` absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary-color font-[20px] w-[18px]  h-[18px]`}
            />
          </button>
        </div>
      </div>
      <div className="w-[70%] max-md:w-full">
        <Splide
          ref={splideRef}
          options={{
            rewind: true,
            gap: "1rem",
            updateOnMove: true,
            type: "loop",
            perPage: 3,
            perMove: 1,
            focus: "center",
            pagination: false,
            arrows: false,
            breakpoints: {
              1150: {
                perPage: 1.5,
                gap: "10px",
              },
            },
          }}
          aria-label="My Favorite Images"
          className="[&_#splide01-track]:pt-[50px] [&_.is-active]:bg-quaternary-color [&_.is-active_h3]:visible [&_.is-active_.description]:visible  [&_.is-active]:-top-[2rem] [&>.swiper-wrapper]:pt-12"
        >
          {slides?.map((item, index: number) => (
            <SplideSlide key={index} className="relative  p-2 rounded-[5px] ">
              <div>
                <img
                  src={item?.bannerImageMedia?.desktopMediaUrl as string}
                  alt={"Holiday Type Highlight " + (index + 1)}
                  className={`w-full h-full rounded-[5px] ${
                    item?.bannerImageMedia?.mobileMediaUrl && "max-md:hidden"
                  } min-h-[280px] object-cover relative top-[-20px] `}
                />
                {item?.bannerImageMedia?.mobileMediaUrl && (
                  <img
                    src={item.bannerImageMedia.mobileMediaUrl as string}
                    alt=""
                    className="w-full h-full rounded-sm md:hidden min-h-[280px] object-cover relative top-[-20px]"
                  />
                )}
                <div className="px-2 max-md:mt-1">
                  <h3
                    className={`font-heading text-[18px] leading-[1.2] font-[600] text-secondary-color  mb-2 line-clamp-2 invisible  `}
                  >
                    {truncateText(item.title, 20)}
                  </h3>
                  <Paragraph
                    classes={`${"line-clamp-3 !text-[13px] mb-4 max-sm:mb-0 invisible description"}  `}
                    htmlText={truncateText(
                      removeParaTagsFromString(item.description),
                      50
                    )}
                  ></Paragraph>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </div>
  );
}

export default UpcomingToursSlider;
