/* eslint-disable @next/next/no-img-element */
"use client";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";
import React, { useRef, useState } from "react";
import Paragraph from "./paragraph";
import { Swiper, SwiperSlide } from "swiper/react";
import SliderButtons from "./sliderButtons";
import { removeParaTagsFromString, truncateText } from "lib/utils";

const Highlights = ({ highlightsData }: { highlightsData?: any[] }) => {
  const swiperRef = useRef() as any;
  const [slideIndex, setSlideIndex] = useState(0);
  const [lastSlide, setLastSlide] = useState<boolean>(false);

  const handleSlideChange = (params: any) => {
    setSlideIndex(params.activeIndex);
    if (swiperRef?.current?.swiper?.isEnd) {
      setLastSlide(true);
    } else {
      setLastSlide(false);
    }
  };
  if (!highlightsData?.length) {
    return;
  }
  return (
    <>
      <div className="mb-10">
        <SectionTitleHeader
          mainHeadingClasses="text-secondary-color font-[700]"
          title="Highlights"
        />
      </div>
      <div className="mb-10 max-sm:mb-2">
        <Swiper
          onSlideChange={handleSlideChange}
          slidesPerView={1}
          ref={swiperRef}
        >
          {highlightsData?.map((data: any, index: number) => {
            return (
              <SwiperSlide key={index} className="max-md:pb-20 max-sm:pb-16 ">
                <div className="relative z-10">
                  {/* <Image
                    src={data.image}
                    className="w-full h-[55vh] max-sm:h-[40vh] object-cover"
                    alt={"tour highlights"}
                  /> */}
                  <img
                    src={data?.media?.desktopMediaUrl as string}
                    alt={"tour highlights " + (index + 1)}
                    className={`w-full h-[65vh] ${
                      data?.media?.mobileMediaUrl && "max-md:hidden"
                    }  max-sm:h-[40vh] object-cover`}
                  />
                  {data?.media?.mobileMediaUrl && (
                    <img
                      src={data.media.mobileMediaUrl as string}
                      alt="tour highlights"
                      className="w-full h-[65vh] max-sm:h-[40vh] object-cover md:hidden"
                    />
                  )}
                  <div
                    data-scroll
                    data-scroll-speed="-1"
                    data-scroll-direction="vertical"
                    className="w-1/2 max-md:w-4/5 bg-quaternary-color absolute px-14 py-6 left-0 bottom-12 max-lg:px-8 max-lg:py-4 max-md:p-4 max-sm:py-3 max-lg:left-1/2 max-lg:-bottom-1/4 max-lg:-translate-x-1/2 max-lg:-translate-y-1/2 max-sm:-translate-y-[10%]  z-20"
                  >
                    <Paragraph
                      classes="mb-0 sm:line-clamp-3 max-sm:line-clamp-[6] xl:text-[15px] font-[400] max-md:text-[11px] "
                      htmlText={truncateText(
                        removeParaTagsFromString(data?.description as string),
                        280
                      )}
                    >
                      {/* {data.description} */}
                    </Paragraph>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      {/* <div className="mb-10">
        <div className="flex gap-x-3 justify-end max-md:justify-center">
          <div
            onClick={() => {
              swiperRef?.current?.swiper?.slidePrev();
            }}
            className={`flex justify-center items-center border-[1px] border-secondary-color rounded-full p-3 cursor-pointer w-10 h-10 ${
              slideIndex === 0 && "!border-[#757575]"
            } `}
          >
            <ChevronDownIcon
              className={`text-secondary-color font-[20px] w-5  h-4 rotate-90  ${
                slideIndex === 0 && "!text-[#757575]"
              }`}
            />
          </div>
          <div
            onClick={() => {
              swiperRef?.current?.swiper?.slideNext();
            }}
            className={`flex justify-center items-center border-[1px] border-secondary-color rounded-full p-3 cursor-pointer w-10 h-10  ${
              lastSlide && "!border-[#757575]"
            } `}
          >
            <ChevronDownIcon
              className={` text-secondary-color font-[20px] w-5  h-4 rotate-[270deg] ${
                lastSlide && "!text-[#757575]"
              } `}
            />
          </div>
        </div>
      </div> */}
      <SliderButtons
        sliderLength={highlightsData?.length}
        classes="mb-10 flex justify-end max-sm:justify-center"
        lastSlide={lastSlide}
        slideIndex={slideIndex}
        swiperRef={swiperRef}
      />
      <div className=" "></div>
    </>
  );
};

export default Highlights;
