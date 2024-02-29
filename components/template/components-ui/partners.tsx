"use client";
import React, { useRef, useState, useEffect } from "react";
import SideHeading from "./side-heading";
import MainHeading from "./heading";
import Main from "../container";
import { Swiper, SwiperSlide } from "swiper/react";
import useElementVisibility from "./scrollPosition";
import Link from "next/link";
import { ContentResponse, PartnersResponse } from "lib/types";
import MainHeadingContent from "./mainHeadingContent";

const Partners = ({
  data,
  partners,
}: {
  partners: PartnersResponse[];
  data?: ContentResponse;
}) => {
  const ref = useRef(null);
  const isVisible = useElementVisibility(ref);
  const [active, setActive] = useState(false);
  const firstPartnersLength = Math.floor(partners?.length / 2);
  const firstPartners = partners?.slice(0, firstPartnersLength);
  const secondPartners = partners?.slice(firstPartnersLength, partners?.length);
  useEffect(() => {
    if (isVisible) setActive(isVisible);
  }, [isVisible]);

  return (
    <Main>
      <div ref={ref} className=" text-center max-sm:text-left ">
        <div className="pb-28 mt-28 max-sm:mt-20 max-sm:pb-8 max-sm:mb-[30px]">
          <div
            data-scroll
            data-scroll-speed="0.3"
            data-scroll-direction="horizontal"
          >
            <SideHeading isRotate={false} classes={"mb-6 max-sm:mb-3"}>
              {data?.subTitle}
            </SideHeading>
          </div>

          <MainHeading>
            <MainHeadingContent
              content={data?.title}
              strongClasses={"uppercase block"}
            />
          </MainHeading>
        </div>
        <div
          data-scroll
          data-scroll-speed="1"
          data-scroll-direction="horizontal"
          className="pb-16 2xl:pb-24 max-md:pb-12"
        >
          <Swiper
            slidesPerView={5}
            className="items_center"
            breakpoints={{
              320: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 60,
              },
            }}
          >
            {firstPartners?.map((partners: any, index: number) => {
              return (
                <SwiperSlide key={index}>
                  <Link
                    target="_blank"
                    href={partners?.name ? partners?.name : ""}
                  >
                    <img
                      className="w-[120px] cursor-pointer 2xl:w-[150px] mx-auto opacity-30 transition-opacity hover:opacity-70"
                      src={partners.media.desktopMediaUrl as string}
                      alt="Partners Image"
                    />
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div
          data-scroll
          data-scroll-speed="-1"
          data-scroll-direction="horizontal"
          className="pb-24 max-md:pb-0"
        >
          <Swiper
            slidesPerView={5}
            className="items_center"
            breakpoints={{
              320: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 60,
              },
            }}
          >
            {secondPartners?.map((partners: any, index: number) => {
              return (
                <SwiperSlide key={index}>
                  <Link
                    target="_blank"
                    href={partners?.name ? partners?.name : ""}
                  >
                    <img
                      loading="eager"
                      className="w-[120px] cursor-pointer 2xl:w-[150px] mx-auto opacity-30 transition-opacity hover:opacity-70"
                      src={partners.media.desktopMediaUrl}
                      alt="Partners Image"
                    />
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </Main>
  );
};

export default Partners;
