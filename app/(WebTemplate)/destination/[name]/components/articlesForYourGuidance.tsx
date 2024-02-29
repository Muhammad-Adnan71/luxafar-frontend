import MainHeading from "@template-components/heading";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import React from "react";
import { InspirationResponse } from "lib/types";
import Button from "@template-components/button";
import { WEB_ROUTES, replaceSpacesWithDash } from "lib/utils";

const ArticlesForYourGuidance = ({
  inspirations,
  inspirationCount,
  destination,
}: {
  destination?: string;
  inspirationCount?: number;
  inspirations?: InspirationResponse[];
}) => {
  return (
    <>
      <div
        data-scroll
        data-scroll-speed=".2"
        data-scroll-direction="vertical"
        className="flex justify-between items-center"
      >
        <MainHeading classes="mb-10">
          <span
            data-scroll
            data-scroll-speed=".5"
            data-scroll-direction="vertical"
            className="inline-block"
          >
            <strong className="text-secondary-color font-[700] inline-block">
              Articles
            </strong>
          </span>{" "}
          For Your <br className="max-sm:hidden" />
          Guidance
        </MainHeading>
        {inspirationCount && inspirationCount > 3 && (
          <Button
            redirect={`${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(
              destination
            )}`}
            classes="!text-[12px] max-sm:!text-[11px] max-md:hidden "
            text="browse all inspirations"
          />
        )}
      </div>
      <BlogCardWrapper blogs={inspirations} destinationName={destination} />
      {inspirationCount && inspirationCount > 3 && (
        <div className="md:hidden text-center mt-10 max-sm:mt-14">
          <Button
            redirect={`${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(
              destination
            )}`}
            classes="!text-[12px] max-sm:!text-[11px]"
            text="browse all inspirations"
          />
        </div>
      )}
    </>
  );
};

export default ArticlesForYourGuidance;
