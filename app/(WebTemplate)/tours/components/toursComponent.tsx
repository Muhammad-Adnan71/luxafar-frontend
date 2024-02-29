"use client";

import { WEB_ROUTES } from "lib/utils";
import React from "react";
import ToursBanner from "./toursBanner";
import Container from "components/template/container";

import UpcomingToursSlider from "./upcomingToursSlider";
import FeaturedTours from "./featuredTours";
import ToursListing from "./toursListing";
import {
  BespokeQuestionResponse,
  InspirationResponse,
  TourResponse,
} from "lib/types";
import PlanContactBanner from "@template-components/planContactBanner";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import Button from "@template-components/button";
import BespokeForm from "./bespokeForm";
import birds from "@public/template/birds.gif";
import Image from "next/image";

function ToursComponent({
  tours,
  featuredTours,
  rowCount,
  upcomingTours,
  inspirations,
  questions,
  page,
}: {
  page: any;
  inspirations: InspirationResponse[];
  featuredTours: TourResponse[];
  upcomingTours: TourResponse[];
  rowCount: number;
  tours: TourResponse[];
  questions: BespokeQuestionResponse[];
}) {
  const breadcrumbs = [
    { name: "home", url: "/" },
    {
      name: "tours",
      url: `${WEB_ROUTES.TOURS}`,
    },
  ];
  const [
    bannerContent,
    bannerVideo1,
    bannerVideo2,
    upcomingToursContent,
    bespokeContent,
  ] = page.content;

  return (
    <>
      <ToursBanner
        breadcrumbs={breadcrumbs}
        mainHeading={bannerContent.title}
        buttonText={bannerContent.buttonText}
        description={bannerContent.description}
        buttonLink={bannerContent.buttonUrl}
        bannerVideo1={bannerVideo1?.media?.desktopMediaUrl}
        bannerVideo2={bannerVideo2?.media?.desktopMediaUrl}
      />

      <UpcomingToursSlider
        slides={upcomingTours}
        title={upcomingToursContent.title}
        description={upcomingToursContent.description}
      />
      <Container>
        <FeaturedTours slides={featuredTours} />
        <ToursListing rowCount={rowCount} tours={tours} />
        <BespokeForm
          questions={questions.slice(0, 2)}
          description={bespokeContent.description}
        />
        <div>
          {inspirations?.length > 0 && (
            <section className="my-20 max-md:mt-12">
              <SectionTitleHeader
                classes=" mb-20 max-lg:mb-10 "
                title={
                  <strong className="block text-secondary-color !font-heading">
                    blogs
                  </strong>
                }
              />
              <BlogCardWrapper
                showAll={true}
                blogs={inspirations?.slice(0, 3)}
              />
              {inspirations.length > 3 && (
                <div className="md:hidden text-center mt-10 max-sm:mt-14">
                  <Button
                    redirect={`${WEB_ROUTES.INSPIRATIONS}`}
                    classes="!text-[14px] max-sm:!text-[11px]"
                    text="see all inspirations"
                  />
                </div>
              )}
            </section>
          )}
        </div>
        <section className="my-20 max-md:mt-0 mb-32">
          <PlanContactBanner
            title={
              <>
                Ready To{" "}
                <strong className="inline-block max-sm:inline text-secondary-color !font-heading sm:ml-2">
                  Plan <br className="sm:hidden" /> Your Tour?
                </strong>
              </>
            }
            description={`Whatever you want from your Tour,
Our team of expert travel designers are ready to help.`}
            buttonText="get bespoke plan"
            buttonURL={`${WEB_ROUTES.BESPOKE_HOLIDAY}`}
          />
        </section>
      </Container>
    </>
  );
}

export default ToursComponent;
