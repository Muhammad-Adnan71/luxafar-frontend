import React from "react";
import Container from "components/template/container";
import Pricing from "./pricing";
import MainHeading from "@template-components/heading";
import Subheading from "@template-components/sub-heading";
import Paragraph from "@template-components/paragraph";
import Link from "next/link";
import YouMightAlsoLike from "./youMightAlsoLike";
import ArticlesForYourGuidance from "./articlesForYourGuidance";
import { InspirationResponse, TourResponse } from "lib/types";

const WhatToExpect = ({
  noOfDays,
  price,
  cuisineDescription,
  departurePoint,
  meetingPoint,
  physicalActivityDescription,
  travelingFromDescription,
  weatherDescription,
  whenToGoDescription,
  airFairIncluded,
  inspirations,
  relatedTours,
  inspirationCount,
  destination,
}: {
  destination?: string;
  inspirationCount: number;
  price?: string;
  noOfDays?: number;
  cuisineDescription?: string;
  departurePoint?: string;
  meetingPoint?: string;
  physicalActivityDescription?: string;
  travelingFromDescription?: string;
  weatherDescription?: string;
  whenToGoDescription?: string;
  airFairIncluded?: boolean;
  relatedTours: TourResponse[];
  inspirations: InspirationResponse[];
}) => {
  return (
    <div className="my-16">
      <Container>
        <div className="flex max-lg:flex-col gap-x-8 justify-between">
          <div className="2xl:w-3/5 lg:w-1/2 max-lg:order-2 max-lg:mb-12 max-md:mb-0">
            <MainHeading classes="mb-14">
              What To
              <strong className="text-secondary-color inline-block ml-3">
                Expect
              </strong>
            </MainHeading>
            <div>
              {physicalActivityDescription?.length ? (
                <div>
                  <div>
                    <Subheading classes="md:uppercase text-white max-sm:text-[24px]">
                      <strong className="text-secondary-color inline-block ">
                        Physical
                      </strong>{" "}
                      Activity
                    </Subheading>
                  </div>
                  <Paragraph
                    classes="mb-14 max-md:mb-14"
                    htmlText={physicalActivityDescription}
                  ></Paragraph>
                </div>
              ) : (
                <div>
                  <div>
                    {meetingPoint?.length ? (
                      <div className="xl:w-[70%]">
                        <div>
                          <Subheading classes="md:uppercase text-white max-sm:text-[24px]">
                            <strong className="text-secondary-color inline-block ">
                              meeting
                            </strong>{" "}
                            point
                          </Subheading>
                        </div>
                        <Paragraph
                          classes="mb-14 max-md:mb-10"
                          htmlText={meetingPoint}
                        ></Paragraph>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div>
                    {departurePoint?.length ? (
                      <div className="lg:w-[70%]">
                        <div
                          data-scroll
                          data-scroll-speed="-.3"
                          data-scroll-direction="horizontal"
                        >
                          <Subheading classes="md:uppercase text-white max-sm:text-[24px]">
                            <strong className="text-secondary-color inline-block ">
                              Departure
                            </strong>{" "}
                            point
                          </Subheading>
                        </div>
                        <Paragraph
                          classes="mb-14 max-md:mb-10"
                          htmlText={departurePoint}
                        ></Paragraph>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="xl:w-[35%] lg:w-2/5 flex justify-end h-full max-lg:order-1 max-lg:mb-12">
            <Pricing
              airFairIncluded={airFairIncluded}
              days={`${noOfDays} days`}
              price={price ? Number(price) : 0}
            />
          </div>
        </div>
        <div className="-mt-[6%]">
          {physicalActivityDescription ? (
            <div>
              <div>
                {meetingPoint?.length ? (
                  <div className="xl:w-[70%]">
                    <div>
                      <Subheading classes="md:uppercase text-white max-sm:text-[24px]">
                        <strong className="text-secondary-color inline-block ">
                          meeting
                        </strong>{" "}
                        point
                      </Subheading>
                    </div>
                    <Paragraph
                      classes="mb-14 max-md:mb-10"
                      htmlText={meetingPoint}
                    ></Paragraph>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div>
                {departurePoint?.length ? (
                  <div className="lg:w-[70%]">
                    <div
                      data-scroll
                      data-scroll-speed="-.3"
                      data-scroll-direction="horizontal"
                    >
                      <Subheading classes="md:uppercase text-white max-sm:text-[24px]">
                        <strong className="text-secondary-color inline-block ">
                          Departure
                        </strong>{" "}
                        point
                      </Subheading>
                    </div>
                    <Paragraph
                      classes="mb-14 max-md:mb-10"
                      htmlText={departurePoint}
                    ></Paragraph>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            ""
          )}
          <div>
            {travelingFromDescription?.length ? (
              <div className="xl:w-[70%]">
                <div
                  data-scroll
                  data-scroll-speed="-.3"
                  data-scroll-direction="horizontal"
                >
                  <Subheading classes="md:uppercase text-white max-sm:text-[24px]">
                    <strong className="text-secondary-color inline-block ">
                      Traveling
                    </strong>{" "}
                    To & From
                  </Subheading>
                </div>
                <Paragraph
                  classes="mb-14 max-md:mb-10"
                  htmlText={travelingFromDescription}
                ></Paragraph>
              </div>
            ) : (
              ""
            )}
          </div>
          <div>
            {weatherDescription?.length ? (
              <div className="xl:w-[70%]">
                <div
                  data-scroll
                  data-scroll-speed="-.3"
                  data-scroll-direction="horizontal"
                >
                  <Subheading classes="md:uppercase text-white max-sm:text-[24px]">
                    <strong className="text-secondary-color inline-block ">
                      Weather
                    </strong>
                  </Subheading>
                </div>
                <Paragraph
                  classes="mb-14 max-md:mb-10"
                  htmlText={weatherDescription}
                ></Paragraph>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="lg:w-[65%]">
            <div>
              {whenToGoDescription?.length ? (
                <div>
                  <div
                    data-scroll
                    data-scroll-speed="-.3"
                    data-scroll-direction="horizontal"
                  >
                    <Subheading classes="md:uppercase font-[600] max-sm:text-[24px]">
                      When to go
                    </Subheading>
                  </div>
                  <Paragraph
                    classes="mb-14 max-md:mb-10"
                    htmlText={whenToGoDescription}
                  ></Paragraph>
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              {cuisineDescription?.length ? (
                <div>
                  <div
                    data-scroll
                    data-scroll-speed="-.3"
                    data-scroll-direction="horizontal"
                  >
                    <Subheading classes="md:uppercase font-[600] max-sm:text-[24px]">
                      Cuisine
                    </Subheading>
                  </div>
                  <Paragraph
                    classes="mb-14 max-md:mb-10"
                    htmlText={cuisineDescription}
                  ></Paragraph>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
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
            <div className="my-16 max-md:mt-2">
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

export default WhatToExpect;
