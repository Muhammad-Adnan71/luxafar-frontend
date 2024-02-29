"use client";
import React, { useEffect, useRef, useState } from "react";
import Button from "./button";
import MainHeading from "./heading";
import SideHeading from "./side-heading";
import plane from "@public/template/plane.webp";
import cloud from "@public/template/Untitled-1.png";
import Image from "next/image";
import Paragraph from "./paragraph";
import useElementVisibility from "./scrollPosition";
import { useUserAgent, parse } from "next-useragent";
import { WEB_ROUTES } from "lib/utils";
import { ContentResponse } from "lib/types";
import MainHeadingContent from "./mainHeadingContent";
import Container from "../container";

export const runtime = "edge";

function About({ data }: { data: ContentResponse | undefined }) {
  const ref = useRef(null);
  const isVisible = useElementVisibility(ref);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (isVisible) setActive(isVisible);
  }, [isVisible]);

  let isSafari = false;
  const userAgent = useUserAgent(
    typeof window !== "undefined" ? window.navigator.userAgent : ""
  );
  const descriptionContent = data?.description?.split("<p><br></p>");

  isSafari = userAgent.isSafari;

  return (
    <Container>
      <div
        className="flex max-md:flex-col max-xl:pb-0 max-sm:pb-0 max-sm:mt-6"
        ref={ref}
      >
        <div className="w-1/2 max-xl:w-4/5 max-md:order-2 max-md:w-full ">
          <div className=" flex w-full gap-16 max-xl:gap-2 max-xl:flex-col max-md:-mt-10">
            <div className="w-1/2 max-xl:w-4/5 max-md:w-full">
              <Paragraph htmlText={descriptionContent?.[0]}></Paragraph>
              <Paragraph htmlText={descriptionContent?.[1]}></Paragraph>
            </div>
            <div className="w-1/2 max-xl:w-4/5 max-md:w-full">
              <Paragraph htmlText={descriptionContent?.[2]}></Paragraph>
              <Paragraph htmlText={descriptionContent?.[3]}></Paragraph>
            </div>
          </div>
          <div className="mt-6 max-xl:mt-2 relative z-40">
            <Button
              data-scroll
              data-scroll-speed="1"
              classes="cursor-pointer "
              text=" View More"
              redirect={WEB_ROUTES.ABOUT}
            />
          </div>
        </div>
        <div className="w-1/2 max-2xl:w-1/2 relative max-xl:w-[90%]">
          <div className="text-right">
            <div className="absolute top-[10%] -right-[22%] max-lg:top-[5%] max-sm:top-[9%] max-sm:-right-[27%]">
              <SideHeading classes="">
                <div
                  data-scroll
                  data-scroll-direction="horizontal"
                  data-scroll-speed="-0.5"
                >
                  {data?.subTitle}
                </div>
              </SideHeading>
            </div>
            <div className="text-right ml-auto ">
              <MainHeading
                isHeadingH1={true}
                data-scroll
                data-scroll-speed="1.5"
                classes="max-md:text-[50px] max-[500px]:text-[40px] "
              >
                <MainHeadingContent
                  content={data?.title}
                  strongClasses="mt-2 inline-block"
                />
              </MainHeading>
            </div>
            <div className="w-full absolute max-md:relative max-md:-top-28 max-sm:-top-16">
              <div>
                <Image
                  src={plane}
                  alt="plane Image Luxafar"
                  className={
                    active
                      ? "translate_plane w-[135%] opacity-50 translate-x-[30%] max-sm:top-[25px] translate-y-[30%] max-md:relative max-md:top-0 max-md:right-0 absolute max-w-none -top-28 z-20 -right-[34%] max-xl:-top-20 max-lg:-top-16"
                      : " w-[135%] max-md:relative opacity-50 max-md:top-0 max-md:right-0 max-sm:top-[25px] absolute max-w-none -top-28 z-20 -right-[34%] max-xl:-top-20 max-lg:-top-16 translate-x-[30%] translate-y-[30%]"
                  }
                />
              </div>
              <div
                className={`mix-blend-screen ${isSafari && "smokePosition"} `}
                data-scroll
                data-scroll-speed="1"
                data-scroll-direction="horizontal"
              >
                <Image
                  src={cloud}
                  alt="Cloud Image Luxafar"
                  className={`w-[135%] absolute top-20 max-w-none opacity-90 -right-[70%] z-10 max-md:-z-[0] max-xl:top-20 max-lg:top-12 max-md:top-32 max-sm:top-28 mix-blend-screen ${
                    isSafari && "smokePosition"
                  }  `}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
export default About;
