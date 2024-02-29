"use client";
import React from "react";
import MainHeading from "./heading";
import Main from "../container";
import SideHeading from "./side-heading";
import Paragraph from "./paragraph";
import { ContentResponse, FaqResponse } from "lib/types";
import MainHeadingContent from "./mainHeadingContent";

const Faqs = ({
  data,
  faqs,
}: {
  faqs: FaqResponse[];
  data: ContentResponse | undefined;
}) => {
  return (
    <Main>
      <div className="relative mt-36  max-lg:mt-16 max-sm:mt-5 max-sm:mb-5">
        <div
          data-scroll
          data-scroll-speed="-1"
          data-scroll-direction="vertical"
          className="absolute -left-[5%] top-8 max-xl:-left-[10%] max-sm:static"
        >
          <SideHeading classes="max-sm:text-[12px] max-sm:block max-sm:text-center max-sm:rotate-0">
            {data?.subTitle}
          </SideHeading>
        </div>
      </div>
      <div className="w-1/2 pb-4 max-md:w-3/5 max-sm:w-4/5 max-sm:text-center max-sm:mx-auto max-sm:pb-0 max-[500px]:w-full">
        <MainHeading>
          <div
            data-scroll
            data-scroll-speed="-0.4"
            data-scroll-direction="vertical"
          >
            <MainHeadingContent content={data?.title} />
          </div>
        </MainHeading>
      </div>

      <div className="flex gap-[12%] mt-24 max-sm:flex-col max-sm:mt-12">
        <div className="w-1/2 max-sm:w-full">
          {faqs?.slice(0, 3).map((faq: any, index: number) => {
            return (
              <div className="mb-20 max-sm:mb-10" key={index}>
                <Paragraph
                  classes={"!text-secondary-color !opacity-100 font-[600]"}
                  htmlText={faq.question}
                ></Paragraph>
                <Paragraph htmlText={faq.answer}></Paragraph>
              </div>
            );
          })}
        </div>
        <div className="w-1/2 max-sm:w-full">
          {faqs?.slice(3, 6).map((faq: any, index: number) => {
            return (
              <div className="mb-20 max-sm:mb-10" key={index}>
                <Paragraph
                  classes={"!text-secondary-color !opacity-100 font-[600]"}
                  htmlText={faq.question}
                ></Paragraph>
                <Paragraph htmlText={faq.answer}></Paragraph>
              </div>
            );
          })}
        </div>
      </div>
    </Main>
  );
};

export default Faqs;
