/* eslint-disable @next/next/no-img-element */
"use client";
import Paragraph from "@template-components/paragraph";
import SliderButtons from "@template-components/sliderButtons";
import { HighlightsResponse } from "lib/types";
import React, { useRef, useState } from "react";
import { SwiperSlide, Swiper } from "swiper/react";

const HolidaySlider = ({ slides }: { slides: HighlightsResponse[] }) => {
  const swiperRefBlog = useRef() as any;
  const [slideIndex, setSlideIndex] = useState(0);
  const [lastSlide, setLastSlide] = useState<boolean>(false);
  const handleSlideChange = (params: any) => {
    setSlideIndex(params.activeIndex);
    if (swiperRefBlog?.current?.swiper?.isEnd) {
      setLastSlide(true);
    } else {
      setLastSlide(false);
    }
  };
  return (
    <div className="relative">
      <Swiper
        onSlideChange={handleSlideChange}
        slidesPerView={1}
        ref={swiperRefBlog}
      >
        {slides?.map((item, index: number) => (
          <SwiperSlide
            key={index}
            className="relative after:w-full after:h-full after:absolute after:top-0 after:left-0 after:bg-[#000] after:bg-opacity-10 "
          >
            <img
              src={item?.media?.desktopMediaUrl as string}
              alt={"Holiday Type Highlight " + (index + 1)}
              className={`w-full h-full ${
                item?.media?.mobileMediaUrl && "max-md:hidden"
              } max-sm:min-h-[370px] object-cover`}
            />
            {item?.media?.mobileMediaUrl && (
              <img
                src={item.media.mobileMediaUrl as string}
                alt=""
                className="w-full h-full md:hidden max-sm:min-h-[370px] object-cover"
              />
            )}
            <Paragraph
              classes="absolute max-sm:mx-auto left-8 bottom-10 w-[40%] max-sm:leading-[1.2] max-md:w-full max-md:left-0 max-md:px-5 z-[9] m-0 "
              htmlText={item.description}
            ></Paragraph>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="z-10 mt-8">
        <SliderButtons
          sliderLength={slides.length}
          classes="flex justify-end"
          lastSlide={lastSlide}
          slideIndex={slideIndex}
          swiperRef={swiperRefBlog}
        />
      </div>
    </div>
  );
};

export default HolidaySlider;
