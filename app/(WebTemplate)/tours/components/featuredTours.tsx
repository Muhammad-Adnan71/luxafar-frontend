/* eslint-disable @next/next/no-img-element */
"use client";
import NameHeading from "@template-components/nameHeading";
import Paragraph from "@template-components/paragraph";
import SliderButtons from "@template-components/sliderButtons";
import {
  removeParaTagsFromString,
  replaceSpacesWithDash,
  truncateText,
} from "lib/utils";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

export default function FeaturedTours({ slides }: { slides: any }) {
  const swiperRef = useRef() as any;
  const swiperRefMobile = useRef() as any;
  const containerRef = useRef<HTMLDivElement>(null);
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
  console.log(slides, "slides");
  return (
    <div ref={containerRef} className="mb-20 max-sm:mb-8 max-md:mb-12">
      <div className="flex justify-between items-center mb-12">
        <h3 className="font-heading text-secondary-color text-[36px] font-semibold">
          Featured:
        </h3>
        <SliderButtons
          sliderLength={5}
          classes="flex justify-start max-md:hidden"
          lastSlide={lastSlide}
          slideIndex={slideIndex}
          swiperRef={swiperRef}
        />
        <SliderButtons
          sliderLength={5}
          classes="flex justify-start md:hidden"
          lastSlide={lastSlide}
          slideIndex={slideIndex}
          swiperRef={swiperRefMobile}
        />
      </div>
      <div className="w-full max-md:hidden">
        <Swiper
          draggable
          onSlideChange={handleSlideChange}
          slidesPerView={3}
          className="featured-swiper-slider [&>.swiper-wrapper>.swiper-slide-next_.background-color]:before:absolute [&>.swiper-wrapper>.swiper-slide-next_.background-color]:before:w-[90%] [&>.swiper-wrapper>.swiper-slide-next_.background-color]:before:h-full [&>.swiper-wrapper>.swiper-slide-next_.background-color]:before:right-0 [&>.swiper-wrapper>.swiper-slide-next_.background-color]:before:top-0 [&>.swiper-wrapper>.swiper-slide-next_.background-color]:before:bg-quaternary-color [&>.swiper-wrapper>.swiper-slide-next_.background-color]:before:z-[-1]"
          direction={"vertical"}
          autoplay={true}
          ref={swiperRef}
        >
          {slides?.map((item: any, index: number) => (
            <SwiperSlide key={index} className="">
              <div className="flex items-center relative background-color w-[80vw] justify-between gap-x-4 max-lg:gap-x-1">
                <div className="w-[200px] h-[140px] flex items-center">
                  <Link
                    className="w-[200px] h-[140px] flex items-center"
                    href={`/destination/${replaceSpacesWithDash(
                      item?.tourDestinations?.[0]?.destination?.name as string
                    )}/tours/${replaceSpacesWithDash(item?.seoMeta?.slug)}`}
                  >
                    <img
                      src={item?.bannerImageMedia?.mobileMediaUrl as string}
                      alt="Featured Tour Image"
                      className="w-full my-auto h-4/5 object-cover"
                    />
                  </Link>
                </div>
                <div className="flex-1 flex justify-center flex-col h-[50px] max-lg:ml-2 max-lg:w-[110px]">
                  <Link
                    href={`/destination/${replaceSpacesWithDash(
                      item?.tourDestinations?.[0]?.destination?.name as string
                    )}/tours/${replaceSpacesWithDash(item?.seoMeta?.slug)}`}
                  >
                    <NameHeading className="mb-1 text-[13px] font-[600]">
                      {item?.title}
                    </NameHeading>
                  </Link>
                  <Paragraph classes="mb-0 !text-[11px]">
                    {removeParaTagsFromString(item?.description)}
                  </Paragraph>
                </div>
                <div className="flex-1 flex justify-center flex-col h-[50px] max-lg:w-[100px]">
                  <NameHeading className="mb-1 text-[13px] font-[600] text-center">
                    {item?.planDays} Days
                  </NameHeading>
                  <Paragraph classes="mb-0 !text-[11px] text-center">
                    {item?.planDays - 1} Nights
                  </Paragraph>
                </div>
                {/* <div className="flex-1 flex justify-center flex-col h-[50px]">
                  <NameHeading className="mb-1 text-[13px] font-[600]">
                    11 February
                  </NameHeading>
                  <Paragraph classes="mb-0 !text-[11px]">6:30 AM</Paragraph>
                </div> */}
                <div className="flex-1 flex justify-center flex-col h-[50px] text-center">
                  <NameHeading className="mb-1 text-[13px] font-[600]">
                    $ {item?.price}
                  </NameHeading>
                  {/* <Paragraph classes="mb-0 !text-[11px]">
                    It was $ 2449
                  </Paragraph> */}
                </div>
                {/* <div className="flex-1 flex justify-center flex-col h-[50px]">
                  <NameHeading className="mb-1 text-[13px] font-[600]">
                    $ 560
                  </NameHeading>
                  <Paragraph classes="mb-0 !text-[11px]">Save 20%</Paragraph>
                </div> */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="w-full md:hidden">
        <Swiper
          onSlideChange={handleSlideChange}
          slidesPerView={1}
          ref={swiperRefMobile}
          spaceBetween={10}
        >
          {slides?.map((item: any, index: number) => (
            <SwiperSlide key={index} className="">
              <div className="">
                <div className="w-full mb-5">
                  <Link
                    href={`/destination/${replaceSpacesWithDash(
                      item?.tourDestinations?.[0]?.destination?.name as string
                    )}/tours/${replaceSpacesWithDash(item?.seoMeta?.slug)}`}
                  >
                    <img
                      src={item?.bannerImageMedia?.mobileMediaUrl as string}
                      alt="Featured Tour Image"
                      className="w-full max-[450px]:h-[35vh] h-[45vh] object-cover"
                    />
                  </Link>
                </div>
                <Link
                  href={`/destination/${replaceSpacesWithDash(
                    item?.tourDestinations?.[0]?.destination?.name as string
                  )}/tours/${replaceSpacesWithDash(item?.seoMeta?.slug)}`}
                >
                  <NameHeading className="mb-3 text-[13px] font-[600]">
                    {item?.title}
                  </NameHeading>
                </Link>
                <div className="grid grid-cols-3 grid-rows-1 gap-y-10 gap-x-2 justify-between">
                  <div className="flex relative flex-col justify-center items-start">
                    <span className="absolute left-[105%] top-0 bottom-0 bg-white opacity-40 w-[1px]"></span>
                    {/* <NameHeading className="mb-2 text-[13px] font-[600] capitalize">
                      {item?.meetingPoint}
                    </NameHeading> */}

                    <Paragraph classes="mb-0 text-[10px]">
                      {removeParaTagsFromString(item?.description)}
                    </Paragraph>
                  </div>
                  <div className="flex relative flex-col justify-center items-center">
                    <span className="absolute left-[120%] top-0 bottom-0 bg-white opacity-40 w-[1px]"></span>
                    <NameHeading className="mb-2 text-[13px] font-[600] capitalize">
                      {item?.planDays} Days
                    </NameHeading>
                    <Paragraph classes="mb-0 text-[10px]">
                      {item?.planDays - 1} Nights
                    </Paragraph>
                  </div>
                  <div className="flex flex-col justify-center items-end">
                    <NameHeading className="mb-2 text-[13px] font-[600] capitalize">
                      $ {item?.price}
                    </NameHeading>
                  </div>
                  {/* <div className="flex relative flex-col justify-center items-start">
                    <span className="absolute left-[105%] top-0 bottom-0 bg-white opacity-40 w-[1px]"></span>
                    <NameHeading className="mb-2 text-[13px] font-[600] capitalize">
                      $ 1889
                    </NameHeading>
                    <Paragraph classes="mb-0 text-[10px]">
                      It was $ 2449
                    </Paragraph>
                  </div> */}
                  {/* <div className="flex flex-col justify-center items-center">
                    <NameHeading className="mb-2 text-[13px] font-[600] capitalize">
                      $ 560
                    </NameHeading>
                    <Paragraph classes="mb-0 text-[10px]">Save 20%</Paragraph>
                  </div> */}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
