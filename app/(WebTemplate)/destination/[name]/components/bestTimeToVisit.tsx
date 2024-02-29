"use client";
import React from "react";
import TourCard from "@template-components/cards/tourCard";
import MainHeading from "@template-components/heading";
import Paragraph from "@template-components/paragraph";
import Container from "components/template/container";
import PlanContactBanner from "@template-components/planContactBanner";
import SeasonsTabs from "./seasonTabs";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import { InspirationResponse, TourResponse } from "lib/types";
import { WEB_ROUTES, replaceSpacesWithDash } from "lib/utils";
import Button from "@template-components/button";

const BestTimeToVisit = ({
  about,
  blogs,
  seasonToVisit,
  featuredTour,
  destination,
}: {
  destination: string;
  featuredTour: TourResponse;
  tour?: TourResponse[];
  blogs?: InspirationResponse[];
  about?: { title: string; description: string };
  seasonToVisit?: any[];
}) => {
  const destinationName =
    destination?.charAt(0)?.toUpperCase() + destination?.slice(1);

  return (
    <Container>
      <div className="flex gap-24 my-20 mb-16 max-md:gap-y-8 max-md:my-12 max-md:flex-col">
        <div className="w-1/2 max-md:w-full">
          <MainHeading classes="mb-10">
            <strong className="block text-secondary-color !font-heading is-inview ml-2">
              Seasons
            </strong>
            to visits
          </MainHeading>
          <Paragraph
            classes="opacity-80"
            htmlText={about?.description}
          ></Paragraph>
        </div>
        {featuredTour && (
          <div className="w-1/2 max-md:w-full">
            <TourCard isFeatured tour={featuredTour} />
          </div>
        )}
      </div>
      <div>
        {seasonToVisit?.length ? (
          <SeasonsTabs seasonData={seasonToVisit} />
        ) : (
          ""
        )}
      </div>
      <div className="py-6 pb-10 max-md:py-8 max-md:pt-0">
        <PlanContactBanner
          classes="my-10 px-[5%]"
          title={
            <>
              Want To{" "}
              <strong className="max-sm:inline sm:inline-block text-secondary-color !font-heading sm:ml-1">
                Plan <br className="sm:hidden" /> Custom Tours?
              </strong>
            </>
          }
          description={`Whatever you want from your ${destinationName} Tour,
            Our team of expert travel designers are ready to help.`}
          buttonText="get bespoke plan"
          buttonURL={WEB_ROUTES.BESPOKE_HOLIDAY}
        />
      </div>
      <div>
        {blogs?.length ? (
          <div className="mb-40 max-md:mb-20">
            <SectionTitleHeader
              classes="mb-10"
              buttonText={blogs.length > 3 ? "Browse All Inspirations" : ""}
              buttonURL={`${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(
                destinationName
              )}`}
              title={
                <>
                  <strong className="text-secondary-color !font-heading">
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
    </Container>
  );
};

export default BestTimeToVisit;
