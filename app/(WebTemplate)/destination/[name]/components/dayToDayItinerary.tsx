/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import MainHeading from "@template-components/heading";
import Container from "components/template/container";
import Pricing from "./pricing";
import ItineraryAccordion from "./itineraryAccordion";
import ArticlesForYourGuidance from "./articlesForYourGuidance";
import YouMightAlsoLike from "./youMightAlsoLike";
import { InspirationResponse, TourResponse } from "lib/types";
import ImageWithLoader from "@template-components/ImageWithLoader";

const DayToDayItinerary = ({
  noOfDays,
  price,
  airFairIncluded,
  tourScheduleData,
  accommodationImage,
  relatedTours,
  inspirations,
  destination,
  inspirationCount,
}: {
  inspirationCount: number;
  airFairIncluded?: boolean;
  price?: string;
  noOfDays?: number;
  tourScheduleData?: any;
  accommodationImage: any;
  relatedTours: TourResponse[];
  inspirations: InspirationResponse[];
  destination?: string;
}) => {
  const valuesIndexes = tourScheduleData.map((item: any, index: number) =>
    index.toString()
  );
  const [values, setValues] = useState(valuesIndexes);

  const handleAccordion = (index: string) => {
    setValues((prev: any) => {
      if (prev.includes(index)) return prev.filter((ele: any) => ele !== index);
      else return [...prev, index];
    });
  };
  const handleCollapseAll = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (values.length) setValues([]);
    else setValues(valuesIndexes);
  };

  return (
    <>
      <div className="my-16">
        <Container>
          <div className="flex max-h-[525px] gap-x-6 justify-between overflow-y-hidden">
            <div className="xl:w-[68%] lg:w-1/2 h-full max-md:hidden">
              <div className="w-full h-full">
                <ImageWithLoader
                  alt={"Tour Accommodation Image Luxafar"}
                  loading="eager"
                  classes="w-full h-full object-cover"
                  url={accommodationImage}
                />
              </div>
            </div>
            <div className="flex xl:w-fit md:justify-end lg:w-[45%] max-md:w-full max-md:mx-auto h-full">
              <Pricing
                days={`${noOfDays} days`}
                price={price ? Number(price) : 0}
                airFairIncluded={airFairIncluded}
              />
            </div>
          </div>
          <div className="my-16 max-md:mb-8 flex max-md:flex-col max-md:gap-y-7 md:items-end justify-between">
            <div
              data-scroll
              data-scroll-speed="-.5"
              data-scroll-direction="horizontal"
            >
              <MainHeading>
                <strong className="text-secondary-color font-[700]">
                  Itinerary
                </strong>{" "}
                &<br /> Accommodations
              </MainHeading>
            </div>
            <div className="align-bottom">
              <span
                className="max-sm:text-[11px] underline uppercase cursor-pointer text-secondary-color"
                onClick={handleCollapseAll}
              >
                {values.length ? "collapse all" : "Expand all"}
              </span>
            </div>
          </div>
          <div>
            <ItineraryAccordion
              tourScheduleData={tourScheduleData}
              onAccordion={handleAccordion}
              values={values}
            />
          </div>
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
                  destination={destination}
                  inspirationCount={inspirationCount}
                  inspirations={inspirations}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default DayToDayItinerary;
