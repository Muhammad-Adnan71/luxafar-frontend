import React from "react";
import Gallery from "@template-components/gallery";
import PlanContactBanner from "@template-components/planContactBanner";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import Container from "components/template/container";
import TourCardWrapper from "components/template/container/tourCardWrapper";
import Button from "@template-components/button";
import { InspirationResponse, TourResponse } from "lib/types";
import { WEB_ROUTES, replaceSpacesWithDash } from "lib/utils";

export default function Tours({
  destination,
  tours,
  blogs,
  gallery,
}: {
  destination?: string;
  blogs?: InspirationResponse[];
  tours?: TourResponse[];
  gallery: any;
}) {
  const destinationName =
    destination && destination?.charAt(0).toUpperCase() + destination?.slice(1);
  return (
    <Container>
      <div>
        {tours?.length ? (
          <section className="mt-20 mb-14 max-md:mt-12">
            <SectionTitleHeader
              isHeadingAnimated={false}
              classes="mb-20 max-lg:mb-10"
              title={
                <>
                  Browse Our
                  <strong className="block text-secondary-color !font-heading">
                    Tours To {destination}
                  </strong>
                </>
              }
            />
            <TourCardWrapper tours={tours} isExpandable={true} />
            {/* <div className="md:hidden text-center mt-10 mb-5">
              <Button
                classes="!text-[14px] max-sm:!text-[12px]"
                text="Browse All Tour"
              />
            </div> */}
          </section>
        ) : (
          ""
        )}
      </div>
      <section className="my-16 mt-32 max-md:my-4">
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
      <div>
        {blogs?.length ? (
          <section className="my-16">
            <SectionTitleHeader
              classes="mb-20 max-lg:mb-10"
              buttonText={blogs.length > 3 ? "Browse All Inspirations" : ""}
              buttonURL={`${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(
                destinationName
              )}`}
              title={
                <>
                  Articles Related
                  <strong className="block text-secondary-color !font-heading">
                    To {destination}
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
          </section>
        ) : (
          ""
        )}
      </div>
      <section className="my-20 max-md:my-4" id="gallery">
        <SectionTitleHeader
          classes="mb-20 max-md:mb-14 "
          title={
            <>
              <strong className="inline-block text-secondary-color !font-heading">
                Gallery
              </strong>
            </>
          }
        />
        <Gallery classes="mb-40 max-sm:mb-16" images={gallery} />
      </section>
    </Container>
  );
}
