"use client";
import React, { useEffect, useRef, useState } from "react";
import Main from "../container";
import Subheading from "./sub-heading";
import Paragraph from "./paragraph";
import Image from "next/image";
import compassCover from "../../../public/template/compasscover.png";
import compass from "../../../public/template/compass.png";
import { Swiper, SwiperSlide } from "swiper/react";
import water from "@public/template/water-new.webp";
import useElementVisibility from "./scrollPosition";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const Collection = ({ data }: { data: any | undefined }) => {
  const ref = useRef(null);
  const isVisible = useElementVisibility(ref);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isRotate, setIsRotate] = useState({ count: 0 });

  useEffect(() => {
    if (isVisible) setShowAnimation(isVisible);
  }, [isVisible]);
  const swiperRef = useRef() as any;

  return (
    <>
      <div className="relative max-sm:mt-5" ref={ref}>
        <div className="relative">
          <div className="background_collection max-sm:top-[-260px] left-0 top-[-300px] max-xl:top-[-400px] h-[250vh] max-lg:h-[200vh] max-md:h-[250vh] max-sm:h-[140vh] xl:h-[200vh] 2xl:h-[150vh] max-sm:left-[-100px] ">
            <Image
              loading="eager"
              src={water}
              alt="Water Background"
              className=" w-[150%] max-xl:w-[130%] max-w-[inherit] max-sm:w-[200%]  transition-all sm:animate-[30s_waveMotion_linear_infinite] h-full "
            />
          </div>
          <svg className="max-sm:absolute">
            <defs>
              <filter id="turbulence" x="0" y="0" width="100%" height="100%">
                <feTurbulence
                  id="sea-filter"
                  numOctaves="3"
                  seed="2"
                  baseFrequency="0.02 0.05"
                ></feTurbulence>
                <feDisplacementMap
                  scale="20"
                  in="SourceGraphic"
                ></feDisplacementMap>
              </filter>
            </defs>
          </svg>
        </div>
        <Main>
          <div className="grid grid-cols-[1fr_3fr_1fr] place-items-center gap-6 max-lg:grid-cols-1 max-lg:grid-rows-2 max-sm:grid-rows-[1fr_.5fr] max-sm:gap-y-0 relative">
            <div
              className={
                showAnimation
                  ? " max-lg:row-[2] max-lg:w-1/2 opacity-0 max-lg:hidden animate-[0.7s_zoomIn_0.4s_ease-in-out_forwards]"
                  : "max-lg:row-[2] max-lg:w-1/2 opacity-0 max-lg:hidden"
              }
            >
              <div
                data-scroll
                data-scroll-speed="1"
                data-scroll-direction="vertical"
              >
                <Subheading classes={"max-w-[150px] font-[700]"}>
                  {data[0]?.title}
                </Subheading>
                <Paragraph
                  htmlText={data[0]?.description}
                  classes="max-w-[190px] max-sm:max-w-[auto] leading-tight"
                ></Paragraph>
              </div>
            </div>
            <div className="lg:hidden row-[2] w-full max-md:w-4/5 max-sm:w-full">
              <Swiper
                ref={swiperRef}
                slidesPerView={2}
                breakpoints={{
                  320: {
                    slidesPerView: 1,
                    spaceBetween: 30,
                  },
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 40,
                  },
                }}
                onSlideChange={({ activeIndex }) => {
                  setIsRotate((prev) => ({
                    count: activeIndex,
                  }));
                }}
              >
                <SwiperSlide>
                  <Subheading classes="max-w-[150px] font-[700]">
                    {data[0]?.title}
                  </Subheading>
                  <Paragraph htmlText={data[0]?.description}></Paragraph>
                </SwiperSlide>
                <SwiperSlide>
                  <Subheading classes="max-w-[150px] font-[700]">
                    {data[1]?.title}
                  </Subheading>
                  <Paragraph htmlText={data[1]?.description}></Paragraph>
                </SwiperSlide>
                <SwiperSlide>
                  <Subheading classes="max-w-[150px] font-[700]">
                    {data[2]?.title}
                  </Subheading>
                  <Paragraph htmlText={data[2]?.description}></Paragraph>
                </SwiperSlide>
              </Swiper>
            </div>
            <div className="relative sm:hidden w-[95%] ">
              <Image
                loading="eager"
                id="rotate_image"
                className={`
                   ${
                     showAnimation
                       ? "animate-[3s_compassOuterSpin_ease-in-out_none]"
                       : ""
                   }`}
                style={{
                  transform: `rotateY(${1620 + isRotate.count * 180}deg)`,
                  position: "relative",
                  transitionDuration: "0.6s",
                }}
                src={compassCover}
                alt="compass"
              />
              <div className="absolute w-[32%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                <Image
                  loading="eager"
                  className={
                    showAnimation
                      ? "animate-[80s_compassSpin_3.5s_linear_infinite]"
                      : ""
                  }
                  src={compass}
                  alt="Inner Compass"
                />
              </div>
            </div>
            <div className="relative max-lg:row-[1] max-lg:w-3/5 max-md:w-4/5 max-sm:w-full max-sm:hidden">
              <Image
                loading="eager"
                className={
                  showAnimation
                    ? "animate-[3s_compassOuterSpin_ease-in-out_forwards]"
                    : ""
                }
                src={compassCover}
                alt="compass"
              />
              <div className="absolute w-[32%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                <Image
                  loading="eager"
                  className={
                    showAnimation
                      ? "animate-[80s_compassSpin_3.5s_linear_infinite]"
                      : ""
                  }
                  src={compass}
                  alt="Inner Compass"
                />
              </div>
            </div>
            <div
              className={`gap-y-4 max-lg:hidden opacity-0 ${
                showAnimation
                  ? "animate-[0.7s_zoomIn_0.8s_ease-in-out_forwards]"
                  : ""
              }`}
            >
              <div
                data-scroll
                data-scroll-speed="1"
                data-scroll-direction="vertical"
              >
                <Subheading classes={"max-w-[150px] font-[700]"}>
                  {data[1]?.title}
                </Subheading>
                <Paragraph
                  htmlText={data[1]?.description}
                  classes="max-w-[190px] max-sm:max-w-[auto]"
                ></Paragraph>
              </div>
            </div>
            <div
              className={` col-start-2 col-end-3 w-[300px] max-lg:hidden opacity-0 ${
                showAnimation
                  ? "animate-[0.7s_zoomIn_1.2s_ease-in-out_forwards]"
                  : ""
              }`}
            >
              <div
                data-scroll
                data-scroll-speed="1"
                data-scroll-direction="vertical"
              >
                <Subheading classes=" font-[700]">{data[2]?.title}</Subheading>
                <Paragraph htmlText={data[2]?.description}></Paragraph>
              </div>
            </div>
            <div className="lg:hidden absolute mt-20 flex right-0 top-1/2 max-lg:top-[40%] max-md: max-md:top-auto max-md:bottom-[350px] max-sm:bottom-[42%] z-40">
              <div className="flex">
                <div
                  onClick={() => {
                    swiperRef?.current?.swiper?.slidePrev();
                  }}
                  className={`flex relative justify-center items-center border-[1px] border-secondary-color rounded-full  mr-3 max-sm:mr-2 cursor-pointer w-10 h-10 max-sm:w-9 max-sm:h-9 ${
                    isRotate.count === 0 && "!border-[#757575] "
                  }`}
                >
                  <ChevronLeftIcon
                    className={`text-secondary-color font-[20px] w-[18px]  h-[18px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  ${
                      isRotate.count === 0 && "!text-[#757575] "
                    }`}
                  />
                </div>
                <div
                  onClick={() => {
                    swiperRef?.current?.swiper?.slideNext();
                  }}
                  className={`flex relative justify-center items-center border-[1px] border-secondary-color rounded-full cursor-pointer w-10 h-10 max-sm:w-9 max-sm:h-9 ${
                    isRotate.count === 2 && "!border-[#757575] "
                  }`}
                >
                  <ChevronRightIcon
                    className={`text-secondary-color font-[20px] w-[18px]  h-[18px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                      isRotate.count === 2 && "!text-[#757575] "
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </Main>
      </div>
    </>
  );
};

export default Collection;
