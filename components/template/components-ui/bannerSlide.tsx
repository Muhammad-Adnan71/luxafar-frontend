"use client";
import React from "react";
import Button from "./button";
import { getLastWordInString, getStringWithoutLastWord } from "lib/utils";
import { BannerResponse } from "lib/types";

function BannerSlide({
  activeSlide,
  slide,
  isLoading,
}: {
  isLoading: boolean;
  activeSlide: boolean;
  slide: BannerResponse;
}) {
  return (
    <>
      <div className={activeSlide ? "block " : "hidden"}>
        <h2 className="min-w-[600px] max-lg:min-w-[380px] max-sm:!min-w-[auto] font-heading text-[86px] tracking-tight  max-xl:text-[62px] max-lg:text-[52px] max-md:text-[48px] text-white  max-sm:text-[48px] max-[430px]:text-[42px] max-[380px]:text-[40px] ">
          <div>
            <span className="block opacity-0 -translate-x-[100%] max-sm:animate-[0.7s_slider_0.3s_ease-in-out_forwards] sm:animate-[0.7s_sliderText_0.3s_ease-in-out_forwards]">
              {getStringWithoutLastWord(slide.title)}
            </span>
          </div>
          <div>
            <strong className="block font-semibold -translate-x-[100%] opacity-0 animate-[0.7s_slider_0.3s_ease-in-out_forwards] text-secondary-color lg:-mt-3">
              {getLastWordInString(slide.title)}
            </strong>
          </div>
        </h2>
        <div
          className="font-body opacity-0 text-white my-6 text-[16px] 2xl:text-[18px] 2xl:max-w-[300px] max-w-[250px] leading-snug -translate-x-[100%] animate-[0.7s_sliderLeft_0.3s_ease-in-out_forwards] max-sm:text-[14px]"
          dangerouslySetInnerHTML={{
            __html: slide.description,
          }}
        ></div>
        <div>
          <div
            className={
              !isLoading
                ? `mt-12 max-lg:mt-6 -translate-x-[200%] animate-[0.7s_sliderLeft_0.4s_ease-in-out_forwards]`
                : "mt-12 max-lg:mt-6 -translate-x-[100%]"
            }
          >
            {slide.buttonText && (
              <Button text={slide.buttonText} redirect={slide.buttonUrl} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default BannerSlide;
