/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useState } from "react";
import readIcon from "@public/template/read-icon.png";
import NextImage from "next/image";
import Paragraph from "@template-components/paragraph";
import Button from "@template-components/button";
import { InspirationResponse } from "lib/types";
import { format } from "date-fns";
import {
  inspirationUrl,
  removeParaTagsFromString,
  truncateText,
} from "lib/utils";
import ImageWithLoader from "@template-components/ImageWithLoader";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import SliderButtons from "@template-components/sliderButtons";

function FeaturedBlog({
  blogs,
  blog,
  destinationName,
}: {
  destinationName?: string;
  blog?: InspirationResponse;
  blogs?: InspirationResponse[];
}) {
  let isMobile: any;
  if (typeof window !== "undefined") {
    isMobile = window && window.screen.width < 640;
  }
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
    <>
      {blog ? (
        <div className="flex gap-10 max-sm:gap-y-0 max-sm:mt-0 mt-8 max-lg:flex-col">
          <div className="w-[40%] order-1 flex flex-col max-lg:w-full max-lg:order-2">
            {blog.isFeatured && (
              <span
                data-scroll
                data-scroll-speed="-.2"
                data-scroll-direction="horizontal"
                className="inline-block p-1 px-2 uppercase bg-secondary-color text-primary-color font-body text-[12px] font-semibold order-1 w-fit max-lg:hidden"
              >
                featured
              </span>
            )}
            <div
              data-scroll
              data-scroll-speed=".5"
              data-scroll-direction="veritcal"
            >
              <h1 className="font-heading sm:text-[48px] max-sm:my-8 max-sm:text-[23px] text-secondary-color my-5 mt-7 font-[600] order-2">
                {blog?.title}
              </h1>
            </div>
            <div className="flex max-lg:mt-6 max-lg:order-[-1] max-sm:mb-0 max-sm:justify-between gap-4 mt-2 order-3 ">
              {blog.isFeatured && (
                <span className="block p-1 px-2 max-sm:text-[10px] uppercase bg-secondary-color text-primary-color font-body text-[12px] font-semibold lg:hidden max-sm:leading-[1.2]">
                  featured
                </span>
              )}

              <Paragraph classes="max-lg:mb-0 max-sm:text-[10px]">
                {blog && format(new Date(blog.createdAt), "dd MMMM yyyy")}
              </Paragraph>
              {blog?.readingTime ? (
                <Paragraph classes="flex gap-2 max-lg:mb-0 max-sm:text-[10px]">
                  <NextImage src={readIcon} alt="" className="w-6 " />
                  {blog?.readingTime} Mins
                </Paragraph>
              ) : (
                ""
              )}
            </div>
            <Paragraph
              classes="order-4 max-lg:order-3"
              htmlText={truncateText(
                removeParaTagsFromString(blog?.description as string),
                500
              )}
            ></Paragraph>
            <Button
              redirect={inspirationUrl(blog, destinationName)}
              text="read more "
              classes="order-5 max-lg:order-4"
            />
          </div>
          <div
            data-scroll
            data-scroll-speed="1"
            data-scroll-direction="vertical"
            className="w-[60%] order-2 max-lg:w-full max-lg:order-1"
          >
            <ImageWithLoader
              alt={blog?.title ? blog?.title : ""}
              classes={"w-full h-full min-h-[320px] object-cover"}
              url={
                isMobile
                  ? blog?.media?.mobileMediaUrl
                    ? blog?.media?.mobileMediaUrl
                    : blog?.media?.desktopMediaUrl
                  : blog?.media?.desktopMediaUrl
              }
            />
          </div>
        </div>
      ) : (
        <div className="relative max-sm:mt-5">
          <Swiper
            spaceBetween={30}
            onSlideChange={handleSlideChange}
            className="w-full "
            ref={swiperRefBlog}
            slidesPerView={1}
          >
            {blogs?.map((blog: any, index: number) => (
              <SwiperSlide key={index}>
                <div className="flex gap-10 max-sm:gap-y-0 max-sm:mt-0 mt-8 max-lg:flex-col">
                  <div className="w-[40%] order-1 flex flex-col max-lg:w-full max-lg:order-2">
                    <span
                      data-scroll
                      data-scroll-speed="-.2"
                      data-scroll-direction="horizontal"
                      className="inline-block p-1 px-2 uppercase bg-secondary-color text-primary-color font-body text-[12px] font-semibold order-1 w-fit max-lg:hidden"
                    >
                      featured
                    </span>
                    <div
                      data-scroll
                      data-scroll-speed=".5"
                      data-scroll-direction="veritcal"
                    >
                      <h1 className="font-heading sm:text-[48px] max-sm:my-8 max-sm:text-[23px] text-secondary-color my-5 mt-7 font-[600] order-2">
                        {blog?.title}
                      </h1>
                    </div>
                    <div className="flex max-lg:mt-6 max-lg:order-[-1] max-sm:mb-0 max-sm:justify-between gap-4 mt-2 order-3 ">
                      <span className="block p-1 px-2 max-sm:text-[10px] uppercase bg-secondary-color text-primary-color font-body text-[12px] font-semibold lg:hidden max-sm:leading-[1.2]">
                        featured
                      </span>

                      <Paragraph classes="max-lg:mb-0 max-sm:text-[10px]">
                        {blog &&
                          format(new Date(blog.createdAt), "dd MMMM yyyy")}
                      </Paragraph>
                      {blog?.readingTime ? (
                        <Paragraph classes="flex gap-2 max-lg:mb-0 max-sm:text-[10px]">
                          <NextImage src={readIcon} alt="" className="w-6 " />
                          {blog?.readingTime} Mins
                        </Paragraph>
                      ) : (
                        ""
                      )}
                    </div>
                    <Paragraph
                      classes="order-4 max-lg:order-3"
                      htmlText={truncateText(
                        removeParaTagsFromString(blog?.description as string),
                        500
                      )}
                    ></Paragraph>
                    <Button
                      redirect={inspirationUrl(blog, destinationName)}
                      text="read more "
                      classes="order-5 max-lg:order-4"
                    />
                  </div>
                  <div
                    data-scroll
                    data-scroll-speed="1"
                    data-scroll-direction="vertical"
                    className="w-[60%] order-2 max-lg:w-full max-lg:order-1"
                  >
                    <ImageWithLoader
                      alt={blog?.title ? blog?.title : ""}
                      classes={"w-full h-full min-h-[320px] object-cover"}
                      url={
                        isMobile
                          ? blog?.media?.mobileMediaUrl
                            ? blog?.media?.mobileMediaUrl
                            : blog?.media?.desktopMediaUrl
                          : blog?.media?.desktopMediaUrl
                      }
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <SliderButtons
            sliderLength={blogs?.length}
            swiperRef={swiperRefBlog}
            lastSlide={lastSlide}
            slideIndex={slideIndex}
            classes="absolute right-0 -top-5  z-20"
          />
        </div>
      )}
    </>
  );
}

export default FeaturedBlog;
