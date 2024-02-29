import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Swiper as SwiperRef } from "swiper";

const SliderButtons = ({
  swiperRef,
  slideIndex,
  lastSlide,
  classes,
  sliderLength,
}: {
  swiperRef: { current: { swiper: SwiperRef } };
  slideIndex: number;
  lastSlide: boolean;
  classes: string;
  sliderLength?: number;
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const currentBreakPoint =
      swiperRef?.current?.swiper?.currentBreakpoint || 1;
    const slidesPerView: number =
      (swiperRef?.current?.swiper?.originalParams?.breakpoints?.[
        currentBreakPoint
      ]?.slidesPerView as number) || 1;
    setIsVisible((sliderLength as number) > slidesPerView);
  }, [swiperRef]);

  if (!isVisible) return <></>;
  return (
    <div className={classes}>
      <div className="flex">
        <button
          onClick={() => {
            swiperRef?.current?.swiper?.slidePrev();
          }}
          className={`relative flex justify-center items-center border-[1px] border-secondary-color rounded-full  mr-3 max-sm:mr-2 cursor-pointer w-10 h-10 max-sm:w-9 max-sm:h-9  ${
            slideIndex === 0 && "!border-[#757575]"
          } `}
        >
          <ChevronLeftIcon
            className={` absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary-color font-[20px] w-[18px]  h-[18px] ${
              slideIndex === 0 && "!text-[#757575]"
            } `}
          />
        </button>
        <button
          onClick={() => {
            swiperRef?.current?.swiper?.slideNext();
          }}
          className={` relative flex justify-center items-center border-[1px] border-secondary-color rounded-full cursor-pointer w-10 h-10 max-sm:w-9 max-sm:h-9  ${
            lastSlide && "!border-[#757575]"
          }  `}
        >
          <ChevronRightIcon
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary-color font-[20px] w-[18px]  h-[18px] ${
              lastSlide && "!text-[#757575]"
            } `}
          />
        </button>
      </div>
    </div>
  );
};

export default SliderButtons;
