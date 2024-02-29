/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
// import Image from "next/image";
import NameHeading from "@template-components/nameHeading";
import Paragraph from "@template-components/paragraph";
import MainHeading from "@template-components/heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/CMS/components-ui/shadcn/ui/accordion";
import ImageWithLoader from "@template-components/ImageWithLoader";

function SeasonsTabs({ seasonData }: { seasonData: any }) {
  const [activeTab, setActiveTab] = useState(0);
  const [imageLoading, setImageLoading] = useState<any>(true);
  useEffect(() => {
    setImageLoading(true);
  }, [activeTab]);

  return (
    <>
      <div className="max-sm:hidden">
        <div className="flex justify-between mb-14">
          {seasonData?.map((season: any, index: number) => (
            <div
              key={index}
              onClick={() => setActiveTab(index)}
              className={`w-[24%] cursor-pointer transition-all duration-300 px-8 py-7  text-lg text-center font-[600] uppercase max-[900px]:text-base ${
                index === activeTab
                  ? " text-primary-color bg-secondary-color"
                  : "text-white bg-quaternary-color"
              }`}
            >
              {season?.name}
            </div>
          ))}
        </div>

        <div className="flex justify-between max-[900px]:flex-col">
          <div className="w-[48%] max-[900px]:w-full">
            <div className="h-[70vh] max-[900px]:h-[50vh] mb-8">
              <div className="w-full h-full">
                {
                  <>
                    {imageLoading ? (
                      <>
                        <div className={"w-full h-full glass-effect "}>
                          <span></span>
                          <span></span>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                    <img
                      loading={activeTab === 0 ? "eager" : "lazy"}
                      alt={
                        seasonData[activeTab]?.name +
                        " in " +
                        seasonData[activeTab]?.destination?.name +
                        " " +
                        "Tab Image"
                      }
                      src={
                        seasonData[activeTab]?.media?.desktopMediaUrl as string
                      }
                      className={`${"w-full h-full object-cover"} ${
                        imageLoading ? "invisible" : ""
                      }`}
                      onLoad={() => setImageLoading(false)}
                    />
                  </>
                }
              </div>
            </div>
            <div
              data-scroll
              data-scroll-speed="-.5"
              data-scroll-direction="vertical"
              className="flex gap-3"
            >
              {seasonData[activeTab]?.period && (
                <div className="w-[30%]">
                  <NameHeading className="font-[500]">period</NameHeading>
                  <Paragraph classes="opacity-100">
                    <span
                      className="inline-block"
                      data-scroll
                      data-scroll-speed="-.3"
                      data-scroll-direction="horizontal"
                    >
                      {seasonData[activeTab]?.period}
                    </span>
                  </Paragraph>
                </div>
              )}
              {seasonData[activeTab]?.temperature && (
                <div className="w-[30%]">
                  <NameHeading className="font-[500]">Highs & Lows</NameHeading>
                  <Paragraph classes="opacity-100">
                    <span
                      className="inline-block"
                      data-scroll
                      data-scroll-speed="-.3"
                      data-scroll-direction="horizontal"
                    >
                      {seasonData[activeTab]?.temperature}
                    </span>
                  </Paragraph>
                </div>
              )}
            </div>
          </div>
          <div className="w-[45%] max-[900px]:w-full">
            <div
              data-scroll
              data-scroll-speed="-.5"
              data-scroll-direction="vertical"
            >
              <MainHeading classes=" font-[600] xl:text-[65px] text-secondary-color mb-8">
                {seasonData[activeTab]?.name} in{" "}
                {seasonData[activeTab]?.destination?.name}
              </MainHeading>
            </div>
            <Paragraph
              classes="opacity-100"
              htmlText={seasonData[activeTab]?.description}
            ></Paragraph>
            <NameHeading className="font-[500]">
              {seasonData[activeTab]?.eventOccasions.length > 0 ? (
                <span
                  data-scroll
                  data-scroll-speed="-.3"
                  data-scroll-direction="horizontal"
                  className="inline-block"
                >
                  Events & Occasions
                </span>
              ) : (
                ""
              )}
            </NameHeading>
            {
              <Paragraph
                classes="featuresBullet full-opacity"
                htmlText={seasonData[activeTab]?.eventOccasions}
              ></Paragraph>
            }
          </div>
        </div>
      </div>
      <div className="sm:hidden">
        <Accordion type="multiple" defaultValue={["0"]}>
          {seasonData.map((season: any, index: number) => (
            <AccordionItem
              className="border-none mb-3 [&[data-state=open]&>.changeBg]:!bg-secondary-color [&[data-state=open]&>.changeBg]:!text-quaternary-color"
              value={index.toString()}
              key={index}
            >
              <div
                className={`w-full relative changeBg flex justify-between cursor-pointer transition-all duration-300 px-8 py-4  text-lg text-center font-[600] uppercase  ${"text-secondary-color bg-quaternary-color"}`}
              >
                <div className="flex-1 text-[15px] font-[500]">
                  {season?.name}
                </div>
                <AccordionTrigger
                  className={`${"text-white absolute top-[15px] right-[15px] z-20 bg-[transparent] [&[data-state=open]&>.borderChange]:!border-quaternary-color [&[data-state=open]_svg]:!text-quaternary-color "} py-0 `}
                  isIconDivClasses={`${"!border-secondary-color borderChange "} !p-[4px]`}
                  isIconClasses={`${"!text-secondary-color txtChange"} !h-5 !w-5`}
                ></AccordionTrigger>
              </div>

              <AccordionContent className="overflow-visible">
                <div className="flex justify-between max-[900px]:flex-col mt-5">
                  <div className="w-[48%] max-[900px]:w-full">
                    <MainHeading classes="leading-[1] max-sm:mb-8 font-[600] xl:text-[65px] text-secondary-color mb-8 ">
                      {season?.name} in {season?.destination?.name}
                    </MainHeading>
                    <div className="h-[70vh] max-[900px]:h-[50vh] mb-8">
                      <ImageWithLoader
                        loading="eager"
                        classes="w-full h-full object-cover"
                        url={season?.media?.mobileMediaUrl as string}
                      />
                    </div>
                  </div>
                  <div className="w-[45%] max-[900px]:w-full">
                    <Paragraph
                      classes="opacity-70 max-sm:text-[13px]"
                      htmlText={season?.description}
                    ></Paragraph>
                    {season?.eventOccasions ? (
                      <NameHeading className="font-[500]">
                        Events & Occasions
                      </NameHeading>
                    ) : (
                      ""
                    )}
                    <Paragraph
                      classes="featuresBullet full-opacity"
                      htmlText={season?.eventOccasions}
                    ></Paragraph>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}

export default SeasonsTabs;
