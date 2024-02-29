import React from "react";
import TourCard from "@template-components/cards/tourCard";
import Paragraph from "@template-components/paragraph";
import PlanContactBanner from "@template-components/planContactBanner";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import Container from "components/template/container";
import PlaceCardWrapper from "components/template/container/placeCardWrapper";
import TourCardWrapper from "components/template/container/tourCardWrapper";
import TripCardWrapper from "components/template/container/tripCardWrapper";

import {
  HolidayTypesResponse,
  InspirationResponse,
  TourResponse,
} from "lib/types";
import MainHeading from "@template-components/heading";
import { WEB_ROUTES, replaceSpacesWithDash } from "lib/utils";
import Button from "@template-components/button";

export default function PlaceToVisit({
  destination,
  tours,
  blogs,
  places,
  ideas,
  about,
  featuredTour,
}: {
  destination?: string;
  featuredTour: TourResponse;
  about?: { title: string; description: string };
  ideas?: HolidayTypesResponse[];
  places?: { image: any; title: string; description: string }[];
  blogs?: InspirationResponse[];
  tours?: TourResponse[];
}) {
  const destinationName =
    destination && destination?.charAt(0).toUpperCase() + destination?.slice(1);

  const toursWithoutFeatured = tours?.filter(
    (item: any) => featuredTour?.id !== item.id
  );

  return (
    <Container>
      <div className="flex gap-24 md:justify-between max-lg:gap-x-10 my-20 max-sm:my-12 max-sm:gap-y-12 max-md:flex-col">
        <div className="w-1/2 max-lg:w-2/5 max-md:w-full">
          <MainHeading classes={"whitespace-nowrap mb-7"}>
            get
            <strong className="text-secondary-color !font-heading is-inview ml-2">
              Inspired
            </strong>
          </MainHeading>
          <Paragraph
            classes="opacity-1"
            htmlText={about?.description}
          ></Paragraph>
        </div>
        {featuredTour ? (
          <div className="w-1/2 max-md:w-full">
            <TourCard
              destination={destination}
              isFeatured
              tour={featuredTour}
            />
          </div>
        ) : (
          ""
        )}
      </div>
      <div>
        {places?.length ? (
          <div className="mb-20">
            <SectionTitleHeader
              isHeadingAnimated={false}
              classes=" mb-20 max-lg:mb-10"
              title={
                <>
                  <strong className="inline-block text-secondary-color !font-heading ">
                    Places
                  </strong>
                  <span className="ml-3">Where</span>
                  <span className="block"> you can go</span>
                </>
              }
            />
            <PlaceCardWrapper places={places} />
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="mb-20 max-md:mb-12 max-md:mt-5">
        <SectionTitleHeader
          classes="mb-20 max-lg:mb-10 max-sm:mb-0"
          title={
            <>
              Get
              <strong className="inline-block text-secondary-color !font-heading ml-3">
                Trip Ideas
              </strong>
            </>
          }
        />
        <TripCardWrapper ideas={ideas} />
      </div>
      <div className="mb-20 max-md:mb-12">
        {blogs?.length ? (
          <div>
            <SectionTitleHeader
              classes="mb-20 max-lg:mb-10"
              buttonText={blogs.length > 3 ? "Browse All Inspirations" : ""}
              buttonURL={`${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(
                destinationName
              )}`}
              title={
                <>
                  <strong className="inline-block text-secondary-color !font-heading">
                    Blogs
                  </strong>
                </>
              }
            />
            <BlogCardWrapper
              showAll={true}
              blogs={blogs?.slice(0, 3)}
              destinationName={destinationName}
            />
            {blogs.length > 3 && (
              <div className="md:hidden text-center mt-10 max-sm:mt-14">
                <Button
                  redirect={`${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(
                    destinationName
                  )}`}
                  classes="!text-[14px] max-sm:!text-[11px]"
                  text="see all inspirations"
                />
              </div>
            )}
          </div>
        ) : (
          ""
        )}
      </div>
      <div>
        {toursWithoutFeatured?.length ? (
          <section className="my-16 max-md:mt-8 max-md:mb-0">
            <SectionTitleHeader
              classes="mb-20 max-lg:mb-10"
              title={
                <>
                  Recommended
                  <strong className="block text-secondary-color !font-heading md:ml-2">
                    Tours
                  </strong>
                </>
              }
            />
            <TourCardWrapper
              destination={destination}
              tours={toursWithoutFeatured}
              isSlider={true}
            />
          </section>
        ) : (
          ""
        )}
      </div>
      <section className="my-16 mb-40 max-md:mb-20">
        <PlanContactBanner
          title={
            <>
              Ready To
              <strong className="inline-block text-secondary-color !font-heading sm:ml-2">
                Plan Your Tour?
              </strong>
            </>
          }
          description={`Whatever you want from your ${destinationName} Tour,
            Our team of expert travel designers are ready to help.`}
          buttonText="get bespoke plan"
          buttonURL={WEB_ROUTES.BESPOKE_HOLIDAY}
        />
      </section>
    </Container>
  );
}
