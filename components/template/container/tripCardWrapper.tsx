import TripCard from "@template-components/cards/tripCard";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SliderButtons from "@template-components/sliderButtons";
import { HolidayTypesResponse } from "lib/types";

function TripCardWrapper({ ideas }: { ideas?: HolidayTypesResponse[] }) {
  const swiperRefTrip = useRef() as any;
  const [slideIndex, setSlideIndex] = useState(0);
  const [lastSlide, setLastSlide] = useState<boolean>(false);
  const handleSlideChange = (params: any) => {
    setSlideIndex(params.activeIndex);
    if (swiperRefTrip?.current?.swiper?.isEnd) {
      setLastSlide(true);
    } else {
      setLastSlide(false);
    }
  };
  return (
    <div className="relative">
      <Swiper
        className=" w-full inspirations-slider max-sm:w-[130%] max-sm:translate-x-[-12%] max-sm:[&>.swiper-wrapper>.swiper-slide-next]:relative max-sm:[&>.swiper-wrapper>.swiper-slide:not(&>.swiper-wrapper>.swiper-slide-next)]:opacity-[0.75] max-sm:[&>.swiper-wrapper>.swiper-slide:not(&>.swiper-wrapper>.swiper-slide-next)]:scale-90 max-sm:[&>.swiper-wrapper>.swiper-slide-next]:scale-105 max-sm:[&>.swiper-wrapper>.swiper-slide-next]:z-50 max-sm:[&>.swiper-wrapper>.swiper-slide]:transition-all max-sm:[&>.swiper-wrapper>.swiper-slide]:duration-300"
        ref={swiperRefTrip}
        slidesPerView={3}
        loop={true}
        breakpoints={{
          320: {
            slidesPerView: 3,
            spaceBetween: 0,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
      >
        {ideas?.map((item: any, index: number) => (
          <SwiperSlide key={index} className="my-10">
            <TripCard image={item.media.mobileMediaUrl} name={item.name} />
          </SwiperSlide>
        ))}
      </Swiper>

      <SliderButtons
        sliderLength={ideas?.length}
        swiperRef={swiperRefTrip}
        lastSlide={lastSlide}
        slideIndex={slideIndex}
        classes="absolute -bottom-10 right-0  z-10 max-sm:hidden"
      />
    </div>
  );
}

export default TripCardWrapper;
