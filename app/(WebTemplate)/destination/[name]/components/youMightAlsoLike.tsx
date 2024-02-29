import MainHeading from "@template-components/heading";
import TourCardWrapper from "components/template/container/tourCardWrapper";
import React from "react";
import { TourResponse } from "lib/types";

const YouMightAlsoLike = ({
  tours,
  destination,
}: {
  destination?: string;
  tours?: TourResponse[];
}) => {
  return (
    <>
      <div data-scroll data-scroll-speed="1" data-scroll-direction="vertical">
        <MainHeading classes="mb-10">
          You Might <br /> Also{" "}
          <span
            className="inline-block"
            data-scroll
            data-scroll-speed=".5"
            data-scroll-direction="vertical"
          >
            <strong className="text-secondary-color inline-block font-[700]">
              Like
            </strong>
          </span>
        </MainHeading>
      </div>
      <div data-scroll data-scroll-speed=".3" data-scroll-direction="vertical">
        <TourCardWrapper
          isSlider={true}
          tours={tours}
          destination={destination}
        />
      </div>
    </>
  );
};

export default YouMightAlsoLike;
