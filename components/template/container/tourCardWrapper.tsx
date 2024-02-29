"use client";
import React, { useRef, useState } from "react";
import TourCard from "../components-ui/cards/tourCard";
import { cn } from "lib/utils";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import SliderButtons from "@template-components/sliderButtons";
import { TourResponse } from "lib/types";

function TourCardWrapper({
  classes,
  tours,
  destination,
  isSlider = false,
  isExpandable,
}: {
  classes?: string;
  isExpandable?: boolean;
  destination?: string;
  tours?: TourResponse[];
  isSlider?: boolean;
}) {
  const swiperRefBlog = useRef() as any;
  const [slideIndex, setSlideIndex] = useState(0);
  const [lastSlide, setLastSlide] = useState<boolean>(false);
  const [accordionItemValue, setAccordionItemValue] = useState("");
  const handleSlideChange = (params: any) => {
    setSlideIndex(params.activeIndex);
    if (swiperRefBlog?.current?.swiper?.isEnd) {
      setLastSlide(true);
    } else {
      setLastSlide(false);
    }
    setAccordionItemValue("");
  };

  return (
    <>
      <div className={`${isSlider ? "hidden" : "block"} `}>
        <div
          className={cn([
            `grid grid-cols-2 gap-8 max-md:grid-cols-1 `,
            classes,
          ])}
        >
          {tours?.map((tour: any, index: number) => (
            <TourCard
              destination={destination ? destination : tour?.destination?.name}
              accordionValue={index.toString()}
              isExpanded={isExpandable}
              tour={tour}
              key={index}
            />
          ))}
        </div>
      </div>

      <div className={`relative ${isSlider ? "block" : "hidden"}`}>
        <Swiper
          onSlideChange={handleSlideChange}
          // className="inspirations-slider"
          ref={swiperRefBlog}
          slidesPerView={2}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 40,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            1200: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
          }}
        >
          {tours?.map((tour, index) => (
            <SwiperSlide className="!h-auto" key={index}>
              <TourCard
                destination={destination}
                tour={tour}
                setItemValue={setAccordionItemValue}
                itemValue={accordionItemValue}
                index={index.toString()}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <SliderButtons
          sliderLength={tours?.length}
          swiperRef={swiperRefBlog}
          lastSlide={lastSlide}
          slideIndex={slideIndex}
          classes="mt-10 flex justify-end"
        />
      </div>
    </>
  );
}

export default TourCardWrapper;
