"use client";
import React from "react";
import MainHeading from "@template-components/heading";
import Paragraph from "@template-components/paragraph";
import Pricing from "./pricing";
import Container from "components/template/container";
import Highlights from "@template-components/highlights";
import Testimonials from "@template-components/testimonials";
import YouMightAlsoLike from "./youMightAlsoLike";
import ArticlesForYourGuidance from "./articlesForYourGuidance";
import {
  InspirationResponse,
  TestimonialResponse,
  TourResponse,
} from "lib/types";
const Overview = ({
  title,
  destination,
  description,
  price,
  airFairIncluded,
  noOfDays,
  highlights,
  testimonials,
  relatedTours,
  inspirations,
  inspirationCount,
}: {
  destination?: string;
  airFairIncluded?: boolean;
  relatedTours: TourResponse[];
  inspirations: InspirationResponse[];
  title?: string;
  description?: string;
  price?: string;
  noOfDays?: number;
  highlights?: any[];
  testimonials: TestimonialResponse[];
  inspirationCount: number;
}) => {
  return (
    <div className="my-16 max-md:my-12">
      <Container>
        <div className="flex justify-between max-md:gap-y-14 max-md:flex-col ">
          <div className="w-[45%] max-md:order-2 max-md:w-full">
            <MainHeading classes=" pb-6 max-md:pb-0 max-sm:leading-[0.9]">
              Overview <br /> About
              <strong className="inline-block text-secondary-color !font-heading ml-3">
                {destination}
              </strong>
            </MainHeading>

            <Paragraph htmlText={description} classes="pt-8 "></Paragraph>
          </div>
          <div className="flex h-full w-[40%] md:justify-end max-md:w-full max-xl:w-[45%] max-md:order-1">
            <Pricing
              airFairIncluded={airFairIncluded}
              days={`${noOfDays} days`}
              price={price ? Number(price) : 0}
            />
          </div>
        </div>
        <div>
          <Highlights highlightsData={highlights} />
        </div>
      </Container>
      <Testimonials testimonials={testimonials} />
      <Container>
        <div>
          {relatedTours?.length ? (
            <div className="my-16 max-md:mt-0">
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
            <div className="my-16 max-md:mt-0">
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
    </div>
  );
};

export default Overview;
