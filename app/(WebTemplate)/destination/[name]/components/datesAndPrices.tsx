"use client";
import Container from "components/template/container";
import React, { useRef, useState } from "react";
import Pricing from "./pricing";
import Subheading from "@template-components/sub-heading";
import MainHeading from "@template-components/heading";
import Paragraph from "@template-components/paragraph";
import FeaturesCard from "@template-components/cards/featuresCard";
import { Swiper, SwiperSlide } from "swiper/react";
import SliderButtons from "@template-components/sliderButtons";
import YouMightAlsoLike from "./youMightAlsoLike";
import ArticlesForYourGuidance from "./articlesForYourGuidance";
import {
  InspirationResponse,
  PrivatePlanResponse,
  TourResponse,
} from "lib/types";
import MainHeadingContent from "@template-components/mainHeadingContent";
import SideHeading from "@template-components/side-heading";

const DatesAndPrices = ({
  relatedTours,
  inspirations,
  noOfDays,
  price,
  airFairIncluded,
  privatePlan,
  makeItPrivateDescription,
  planServices,
  supplementPolicy,
  priceTitle,
  priceDescription,
  inspirationCount,
  destination,
}: {
  destination?: string;
  inspirationCount: number;
  makeItPrivateDescription?: string;
  airFairIncluded?: boolean;
  price?: string;
  noOfDays?: number;
  relatedTours: TourResponse[];
  inspirations: InspirationResponse[];
  privatePlan?: PrivatePlanResponse[];
  planServices: any;
  supplementPolicy: any;
  priceTitle?: string;
  priceDescription?: string;
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
  return (
    <>
      <Container classes="lg:w-4/5 mx-auto max-lg:w-full max-sm:w-full">
        <div className="my-16 mb-10 lg:gap-x-10 max-lg:gap-y-6 max-md:gap-y-16 flex max-lg:flex-col ">
          <div className="lg:w-[66.5%] max-lg:w-full max-lg:order-2">
            <div className="lg:flex lg:flex-col lg:h-full lg:justify-between ">
              <MainHeading classes="mb-12 max-lg:mb-8 max-md:text-center text-secondary-color font-[700]">
                Dates & Prices
              </MainHeading>
              <div className="max-lg:w-4/5 lg:w-full  max-lg:mx-auto max-sm:w-full">
                <div className="grid grid-cols-2 max-sm:grid-cols-1 grid-rows-2 sm:gap-x-8 gap-y-6">
                  <div className="flex justify-center items-center flex-col bg-quaternary-color p-5 py-8 text-center max-sm:order-1">
                    <Subheading classes="text-[22px] font-[600]">
                      Trip Length
                    </Subheading>
                    <Paragraph classes="uppercase opacity-80 font-[500] mb-0 !text-[16px]">
                      {noOfDays} days
                    </Paragraph>
                  </div>

                  <div className="flex justify-center items-center flex-col bg-quaternary-color p-5 py-8 text-center max-sm:order-2 ">
                    <Subheading classes="text-[22px] font-[600]">
                      Trip Cost
                    </Subheading>
                    <SideHeading isRotate={false} classes="mb-2">
                      from
                    </SideHeading>
                    <Paragraph classes="uppercase opacity-80 font-[600] !text-[30px]">
                      ${price ? Number(price) : 0}
                    </Paragraph>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="max-lg:w-4/5 mx-auto">
            <div className="flex h-full justify-end  max-lg:w-full max-lg:mx-auto max-md:w-full max-md:order-1">
              <Pricing
                classes="lg:max-h-[560px] max-[1080px]:max-h-[600px]"
                days={`${noOfDays} days`}
                price={price ? Number(price) : 0}
                airFairIncluded={airFairIncluded}
              />
            </div>
          </div>
        </div>
      </Container>
      <Container>
        {priceTitle && priceDescription && (
          <div className="my-10 w-1/2 max-xl:w-4/5 max-md:w-full">
            <div
              data-scroll
              data-scroll-speed="-.3"
              data-scroll-direction="horizontal"
            >
              <Subheading classes="mb-8 sm:uppercase max-sm:capitalize text-white text-[40px] max-sm:text-[30px] max-sm:text-center max-[400px]:text-[23px]">
                <MainHeadingContent content={priceTitle} />
              </Subheading>
            </div>
            <Paragraph
              classes="max-sm:text-center max-sm:text-[13px]"
              htmlText={priceDescription}
            ></Paragraph>
          </div>
        )}
        <div>
          {privatePlan?.length ? (
            <div className="mb-10 2xl:w-4/5 w-full">
              <div
                data-scroll
                data-scroll-speed="-.3"
                data-scroll-direction="horizontal"
              >
                <Subheading classes="mb-8 uppercase max-sm:capitalize text-white text-[40px] max-sm:text-[30px] max-sm:text-center max-[400px]:text-[23px]">
                  Make it {""}
                  <strong className=" text-secondary-color">private</strong>
                </Subheading>
              </div>
              <div className="mb-3 flex max-lg:justify-between gap-x-20 max-xl:gap-10 max-lg:gap-0 flex-wrap !gap-y-4">
                <>
                  {privatePlan?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className={`${
                        privatePlan.length > 1
                          ? "max-lg:w-1/2"
                          : "max-lg:w-full"
                      } max-lg:text-center ${
                        privatePlan.length > 1 &&
                        index % 2 === 0 &&
                        privatePlan.length !== index + 1
                          ? " max-lg:border-r-[1px]"
                          : ""
                      } max-lg:border-secondary-color`}
                    >
                      <div
                        data-scroll
                        data-scroll-speed="-.3"
                        data-scroll-direction="horizontal"
                      >
                        <Subheading classes=" lg:mr-10 lg:inline-block font-[600] relative max-lg:after:content-none after:absolute after:w-[2px] after:h-full after:top-[3px] after:-right-4 after:bg-secondary-color max-sm:text-[24px] max-[430px]:text-[18px]">
                          {item?.minimumPersons}
                          {item?.maximumPersons
                            ? `${item?.minimumPersons ? "-" : ""}` +
                              item?.maximumPersons
                            : "+"}{" "}
                          Guests
                        </Subheading>
                        <Paragraph classes="mb-5 text-[13px] max-[430px]:text-[12px] max-lg:!leading-5 uppercase lg:inline-block opacity-80">
                          <strong className="text-[30px] max-[430px]:leading-6 max-[430px]:text-[20px] max-lg:inline-block mb-2 max-lg:leading-8 lg:mr-2">
                            ${item?.perPersonRate}
                          </strong>{" "}
                          <br className="lg:hidden" /> Per Person
                        </Paragraph>
                      </div>
                    </div>
                  ))}
                </>
              </div>
              <Paragraph
                classes="max-lg:text-center max-sm:text-[13px]"
                htmlText={makeItPrivateDescription}
              ></Paragraph>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="mb-16 max-md:hidden">
          <div
            data-scroll
            data-scroll-speed="-.3"
            data-scroll-direction="horizontal"
          >
            <Subheading classes="mb-12 uppercase text-white text-[40px]">
              Whats {""}
              <strong className=" text-secondary-color">Included</strong>
            </Subheading>
          </div>
          <div className="grid grid-cols-5 max-xl:grid-cols-4 max-lg:grid-cols-3 gap-y-14  gap-x-20 max-xl:gap-x-10">
            {planServices?.map((data: any, index: number) => {
              return (
                <div key={index} className="text-center">
                  <FeaturesCard
                    cardImage={data?.planService?.media?.desktopMediaUrl}
                    cardHeading={data?.planService?.name}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="md:mb-16 md:hidden">
          <Subheading classes="mb-12 md:uppercase text-center text-white max-md:text-[30px] text-[40px] max-sm:text-[23px]">
            Whats {""}
            <strong className=" text-secondary-color">Included</strong>
          </Subheading>
          <Swiper
            onSlideChange={handleSlideChange}
            slidesPerView={1}
            ref={swiperRef}
          >
            {planServices?.map((data: any, index: number) => {
              return (
                <SwiperSlide key={index}>
                  <div className="w-full mx-auto">
                    <FeaturesCard
                      cardImage={data?.planService?.media?.desktopMediaUrl}
                      cardHeading={data?.planService?.name}
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="mt-4 mb-10">
            <SliderButtons
              classes="flex gap-x-3 justify-end max-md:justify-center"
              lastSlide={lastSlide}
              slideIndex={slideIndex}
              swiperRef={swiperRef}
              sliderLength={planServices?.length}
            />
          </div>
        </div>
        {supplementPolicy?.map((item: any, index: number) => (
          <div key={index} className="w-[70%] max-md:w-full">
            <div
              data-scroll
              data-scroll-speed="-.3"
              data-scroll-direction="horizontal"
            >
              <Subheading classes="mb-8 md:uppercase text-white text-[40px] max-md:text-center max-md:text-[30px] max-sm:text-[23px] ">
                <MainHeadingContent content={item?.title} />
              </Subheading>
            </div>
            <Paragraph
              classes="max-sm:text-[13px] max-sm:text-center"
              htmlText={item?.description}
            ></Paragraph>
            <Paragraph
              classes="italic text-secondary-color opacity-80"
              htmlText={item?.subTitle}
            ></Paragraph>
          </div>
        ))}
        <div>
          {relatedTours?.length ? (
            <div className="my-16 max-md:mt-10">
              <YouMightAlsoLike
                tours={relatedTours}
                destination={destination}
              />
            </div>
          ) : (
            ""
          )}
        </div>
        <div>
          {inspirations?.length ? (
            <div className="my-16 max-md:mt-10">
              <ArticlesForYourGuidance
                inspirations={inspirations}
                destination={destination}
                inspirationCount={inspirationCount}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </Container>
    </>
  );
};

export default DatesAndPrices;
