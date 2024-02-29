/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import leftquote from "../../../public/template/leftquote.png";
import rightquote from "../../../public/template/rightquote.png";
import Main from "../container";
import Paragraph from "./paragraph";
import NameHeading from "./nameHeading";
import MainHeading from "./heading";
import { Swiper, SwiperSlide } from "swiper/react";
import SliderButtons from "./sliderButtons";
import { TestimonialResponse } from "lib/types";
import ImageWithLoader from "./ImageWithLoader";

const Testimonials = ({
  testimonials,
}: {
  testimonials: TestimonialResponse[];
}) => {
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
  if (!testimonials?.length) {
    return;
  }
  return (
    <div className="py-8 relative max-md:py-14 max-sm:mt-3">
      <div
        data-scroll
        data-scroll-speed="0.8"
        data-scroll-direction="vertical"
        className="absolute left-[5%] -top-[12%] z-10 max-md:hidden"
      >
        <Image
          className="max-w-[150px]"
          src={leftquote}
          alt="Testimonial text Left Quote Symbol"
        />
      </div>

      <div
        data-scroll
        data-scroll-speed="0.4"
        data-scroll-direction="vertical"
        className="absolute z-30 top-[72%] left-[27.5%] max-md:hidden "
      >
        <Image
          className="max-w-[150px]"
          src={rightquote}
          alt="Testimonial text Right Quote Symbol"
        />
      </div>
      <Main>
        <div className="relative">
          <div className=" grid grid-cols-[2fr_1fr] max-lg:grid-cols-[1fr] max-md:flex flex-col max-md:m-[-50px] ">
            <div className="relative -right-10 w-[110%] max-lg:w-full max-lg:right-0 max-md:order-2">
              <Swiper
                spaceBetween={10}
                onSlideChange={handleSlideChange}
                slidesPerView={1}
                ref={swiperRef}
              >
                {testimonials.map((testimonial: any, index: number) => (
                  <SwiperSlide key={index}>
                    <div className="flex pt-16 max-sm:pt-8 pb-12 gap-x-[45px] max-md:flex-col max-md:px-12 ">
                      <div className="  w-1/3 relative max-lg:row-[2] max-lg:col-[1] max-md:order-2 max-md:mt-5 max-md:w-full">
                        <Paragraph
                          classes={"italic line-clamp-[12]"}
                          htmlText={testimonial?.description}
                        ></Paragraph>
                        <NameHeading>{testimonial?.clientName}</NameHeading>
                        <Paragraph>{testimonial?.clientLocation}</Paragraph>
                      </div>
                      <div className="w-2/3 max-lg:row-[2] max-lg:col-[2] max-md:order-1 max-md:col-[1] max-md:mb-2 max-md:w-full ">
                        <div className="relative h-full max-md:right-0">
                          <div className="overflow-hidden absolute -top-[14%] max-lg:-top-[10%] -left-[8%] z-30 w-[110px] h-[110px] max-sm:w-[70px] max-sm:h-[70px] rounded-[50%] border-[4px] border-secondary-color">
                            <img
                              className=" max-sm:max-w-[70px] object-cover"
                              src={
                                testimonial?.clientImageMedia
                                  ?.desktopMediaUrl as string
                              }
                              alt="Client Profile Image Luxafar"
                            />
                          </div>
                          <div className="h-full">
                            <ImageWithLoader
                              url={
                                testimonial.destinationImageMedia
                                  ?.desktopMediaUrl as string
                              }
                              alt="Client Destination Luxafar"
                              classes="z-20 relative w-full h-auto object-cover min-h-[170px]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div
                data-scroll
                data-scroll-speed="1"
                data-scroll-direction="vertical"
                className="absolute z-30 -right-[100px] -bottom-[50px] max-xl:-right-[12%] max-xl:-bottom-[5%] max-md:bottom-[35%]  max-md:-right-[20px] max-sm:bottom-auto  max-sm:top-[150px] max-sm:right-0  "
              ></div>
            </div>
            <div
              data-scroll
              data-scroll-speed="0.5"
              data-scroll-direction="horizontal"
              className="pb-12 pt-20 max-lg:py-0 text-right max-lg:text-center max-lg:row-span-full max-lg:mb-3 max-md:order-1 max-md:mx-auto relative md:-top-5 "
            >
              <MainHeading classes=" sm:uppercase ">
                Client
                <strong className="block -mt-2 text-secondary-color font-heading text-right max-lg:inline max-lg:ml-3 capitalize ">
                  Love
                </strong>
              </MainHeading>
            </div>
          </div>
          {testimonials.length > 1 && (
            <SliderButtons
              sliderLength={2}
              swiperRef={swiperRef}
              lastSlide={lastSlide}
              slideIndex={slideIndex}
              classes="absolute mt-20 z-40 flex right-0 top-1/2 max-lg:top-0 max-md:top-auto max-md:bottom-[25px] testimonial"
            />
          )}
        </div>
      </Main>
    </div>
  );
};

export default Testimonials;
