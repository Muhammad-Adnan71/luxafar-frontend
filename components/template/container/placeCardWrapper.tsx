import PlaceCard from "@template-components/cards/placeCard";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SliderButtons from "@template-components/sliderButtons";
import { replaceSpacesWithDash } from "lib/utils";

function PlaceCardWrapper({
  places,
  destination,
}: {
  destination?: string;
  places?: any;
}) {
  const swiperRefBlog = useRef() as any;
  const [slideIndex, setSlideIndex] = useState(0);
  const [lastSlide, setLastSlide] = useState<boolean>(false);
  const handleSlideChange = (params: any) => {
    setSlideIndex(params.activeIndex);
    if (swiperRefBlog?.current?.swiper?.isEnd) {
      setLastSlide(true);
    } else {
      setLastSlide(false);
    }
  };
  return (
    <>
      <div className="grid grid-cols-3 gap-5 gap-y-10 max-md:hidden">
        {places?.map((place: any, index: number) => (
          <PlaceCard
            key={index}
            image={place?.media?.mobileMediaUrl}
            title={place.title}
            description={place.description}
            buttonURL={`/destination/${replaceSpacesWithDash(
              place?.destination?.name as string
            )}/place/${replaceSpacesWithDash(place?.seoMeta?.slug)}`}
            buttonText="Read More"
          />
        ))}
      </div>
      <div className="relative md:hidden">
        <Swiper
          onSlideChange={handleSlideChange}
          className="inspirations-slider"
          ref={swiperRefBlog}
          slidesPerView={3}
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
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
        >
          {places?.map((place: any, index: number) => (
            <SwiperSlide key={index}>
              <PlaceCard
                image={place?.media?.mobileMediaUrl}
                title={place.title}
                description={place.description}
                buttonURL={`/destination/${replaceSpacesWithDash(
                  place?.destination?.name as string
                )}/place/${replaceSpacesWithDash(place?.seoMeta?.slug)}`}
                buttonText="Read More"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <SliderButtons
          sliderLength={places?.length}
          swiperRef={swiperRefBlog}
          lastSlide={lastSlide}
          slideIndex={slideIndex}
          classes="absolute -bottom-2 right-0 xl:hidden z-10"
        />
      </div>
    </>
  );
}

export default PlaceCardWrapper;
