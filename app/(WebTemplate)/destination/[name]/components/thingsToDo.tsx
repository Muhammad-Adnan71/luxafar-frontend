import TourCard from "@template-components/cards/tourCard";
import Paragraph from "@template-components/paragraph";
import ThingsSection from "@template-components/thingsSection";
import Container from "components/template/container";
import React from "react";
import PlanContactBanner from "@template-components/planContactBanner";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import GuideThingsCardWrapper from "components/template/container/guideThingsCardWrapper";
import {
  DestinationFeatureOfferedResponse,
  InspirationResponse,
  TourResponse,
} from "lib/types";
import MainHeading from "@template-components/heading";
import { WEB_ROUTES, replaceSpacesWithDash } from "lib/utils";
import { useRouter } from "next/navigation";
import { useLocomotiveScroll } from "react-locomotive-scroll";
import Button from "@template-components/button";
export default function ThingsToDo({
  about,
  thingsToDo,
  blogs,
  tour,
  featuredTour,
  destinationFeatureOffered,
  destination,
}: {
  destination: string;
  featuredTour: TourResponse;
  thingsToDo?: any[];
  destinationFeatureOffered: DestinationFeatureOfferedResponse[];
  tour?: TourResponse[];
  about?: { title: string; description: string };
  blogs?: InspirationResponse[];
}) {
  const destinationName =
    destination && destination?.charAt(0).toUpperCase() + destination?.slice(1);
  const router = useRouter();
  const { scroll } = useLocomotiveScroll();
  return (
    <Container>
      <section className="mb-12 mt-20 max-md:mt-12">
        <div className="flex xl:gap-20 max-xl:gap-10 justify-between mb-16 max-md:mb-10 max-lg:flex-col">
          <div className="w-1/2 max-lg:w-full">
            <MainHeading classes="mb-10 max-md:mb-0">
              <strong className="block text-secondary-color !font-heading is-inview ">
                ultimate guide
              </strong>
              for things to do
            </MainHeading>
          </div>
          {featuredTour && (
            <div className="md:min-w-[492px] w-[45%] max-lg:hidden">
              <TourCard isFeatured tour={featuredTour} />
            </div>
          )}
        </div>

        <Paragraph
          htmlText={about?.description}
          classes="opacity-1"
        ></Paragraph>
        {featuredTour && (
          <div className="md:w-[492px] max-md:w-full mr-auto lg:hidden pt-10">
            <TourCard isFeatured tour={featuredTour} />
          </div>
        )}
      </section>
      <div>
        {thingsToDo?.length ? (
          <section className="my-16 max-xl:my-10">
            {thingsToDo?.map((item: any, index: number) => (
              <div key={index} className="pb-10 max-md:pb-0">
                <ThingsSection
                  altText={
                    item?.title ? item.title + " " + "Luxafar Things To Do" : ""
                  }
                  title={item.title}
                  image={item.media}
                  description={item.description}
                  imgRight={index % 2 === 0 ? true : false}
                  key={index}
                ></ThingsSection>
              </div>
            ))}
          </section>
        ) : (
          ""
        )}
      </div>
      <div>
        {destinationFeatureOffered?.length ? (
          <section className="my-16 max-md:my-0 max-md:mb-4">
            <GuideThingsCardWrapper
              descriptionDetails={destinationFeatureOffered}
            />
          </section>
        ) : (
          ""
        )}
      </div>
      <section className="my-16 max-md:my-10">
        <PlanContactBanner
          classes="my-10"
          title={
            <>
              Ready To
              <strong className="inline-block max-sm:inline text-secondary-color !font-heading sm:ml-2">
                {" "}
                Plan <br className="sm:hidden" /> Your Tour?
              </strong>
            </>
          }
          description={`Whatever you want from your ${destinationName} Tour,
            Our team of expert travel designers are ready to help.`}
          buttonText="get bespoke plan"
          buttonURL={WEB_ROUTES.BESPOKE_HOLIDAY}
        />
      </section>
      <div>
        {blogs?.length ? (
          <section className="mt-16 max-md:mt-0 mb-40 max-md:mb-20">
            <SectionTitleHeader
              classes="mb-20 max-lg:mb-10"
              title={
                <>
                  <strong className="text-secondary-color !font-heading">
                    Blogs
                  </strong>
                </>
              }
              buttonText={blogs.length > 3 ? "Browse All Inspirations" : ""}
              buttonURL={`${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(
                destinationName
              )}`}
              buttonClick={(e: any) => {
                e.preventDefault();
                router.push(
                  `${WEB_ROUTES.DESTINATION}/${replaceSpacesWithDash(
                    destinationName as string
                  )}?tab=places-to-visit`
                );
                const headerHeight =
                  document.getElementsByTagName("header")[0]?.offsetHeight;
                const innerPageBanner = document.getElementById(
                  "innerPageBanner"
                ) as HTMLElement;
                scroll.scrollTo(innerPageBanner?.offsetHeight + headerHeight, {
                  duration: 500,
                  disableLerp: true,
                });
              }}
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
          </section>
        ) : (
          ""
        )}
      </div>
    </Container>
  );
}
