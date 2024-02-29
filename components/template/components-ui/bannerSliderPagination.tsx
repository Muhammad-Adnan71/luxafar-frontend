import React from "react";

function BannerSliderPagination({
  onSlideClick,
  activeIndex,
  slides,
}: {
  onSlideClick: Function;
  activeIndex: number;
  slides: any;
}) {
  return (
    <ul className="mt-6  text-[#5A5A5A]  flex max-md:justify-end lg:justify-start max-lg:flex-col max-lg:gap-[3px] max-lg:absolute max-lg:-right-[40px] max-lg:top-[40%] max-[400px]:top-[55%] max-[400px]:-right-[40px] ">
      {slides.map((item: any, index: number) => (
        <li
          onClick={() => onSlideClick(index)}
          key={index}
          className={`hover:text-secondary-color  transition-all text-xs font-semibold font-body cursor-pointer lg:first:pl-0 px-4 max-md:px-4 relative after:absolute after:top-0 after:left-full after:w-[2px] after:h-[20px] after:bg-[#5A5A5A] last:after:hidden max-lg:after:w-[0] max-lg:mb-[12px] max-[350px]:mb-[8px]  
               ${activeIndex === index ? " text-secondary-color " : ""}
          `}
        >
          {index + 1}
        </li>
      ))}
    </ul>
  );
}

export default BannerSliderPagination;
