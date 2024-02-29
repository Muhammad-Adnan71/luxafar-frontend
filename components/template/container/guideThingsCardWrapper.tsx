import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ThingsDescriptionCard from "@template-components/cards/thingsDescriptionCard";
import SliderButtons from "@template-components/sliderButtons";

function GuideThingsCardWrapper({
  descriptionDetails,
}: {
  descriptionDetails?: any;
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
      <div className="grid grid-cols-2 gap-x-20 gap-y-20 max-xl:gap-x-5 max-md:hidden">
        {descriptionDetails?.map((item: any, index: number) => (
          <div key={index}>
            <ThingsDescriptionCard
              title={item?.destinationFeatures?.name}
              image={item?.destinationFeatures?.media?.desktopMediaUrl}
              descriptionList={item?.description}
            />
          </div>
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
          }}
        >
          {descriptionDetails.map((item: any, index: number) => (
            <SwiperSlide key={index}>
              <ThingsDescriptionCard
                title={item?.destinationFeatures?.name}
                image={item?.destinationFeatures?.media?.desktopMediaUrl}
                descriptionList={item.descriptionList}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <SliderButtons
          sliderLength={descriptionDetails.length}
          swiperRef={swiperRefBlog}
          lastSlide={lastSlide}
          slideIndex={slideIndex}
          classes="absolute -bottom-10 left-[50%] translate-x-[-50%] xl:hidden z-10"
        />
      </div>
    </>
  );
}

export default GuideThingsCardWrapper;
