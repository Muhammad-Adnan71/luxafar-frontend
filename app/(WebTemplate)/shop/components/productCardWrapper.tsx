import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import ProductCard from "./productCard";
import SliderButtons from "@template-components/sliderButtons";
import Image from "next/image";
import product5 from "@public/template/shop/product5.png";
import Subheading from "@template-components/sub-heading";
import Paragraph from "@template-components/paragraph";
import Button from "@template-components/button";

const ProductCardWrapper = ({
  productData,
  isHorizontalView,
  isBestSeller,
}: {
  productData: any;
  isHorizontalView: boolean;
  isBestSeller?: boolean;
}) => {
  const swiperRef = useRef() as any;
  const [slideIndex, setSlideIndex] = useState(0);
  const [lastSlide, setLastSlide] = useState<boolean>(false);
  const handleSlideChange = (params: any) => {
    setSlideIndex(params.activeIndex);
    if (swiperRef?.current?.swiper?.isEnd) {
      setLastSlide(true);
    } else {
      setLastSlide(false);
    }
  };

  return (
    <div>
      {!isHorizontalView && (
        <div>
          <Swiper
            onSlideChange={handleSlideChange}
            className="inspirations-slider"
            ref={swiperRef}
            slidesPerView={3}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 0,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1200: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
            }}
          >
            {productData.map((data: any, index: number) => {
              return (
                <SwiperSlide key={index}>
                  <ProductCard
                    isHorizontalView={isHorizontalView}
                    key={index}
                    image={data.image}
                    title={data.title}
                    price={data.price}
                    productRating={data.productRating}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
          <SliderButtons
            lastSlide={lastSlide}
            slideIndex={slideIndex}
            swiperRef={swiperRef}
            sliderLength={productData.length}
            classes="flex justify-end my-8"
          />
        </div>
      )}
      {isHorizontalView && (
        <div>
          <Swiper
            onSlideChange={handleSlideChange}
            ref={swiperRef}
            slidesPerView={2}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 0,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1200: {
                slidesPerView: 2,
                spaceBetween: 50,
              },
            }}
          >
            {productData.map((productData: any, index: number) => {
              return (
                <SwiperSlide
                  className={isBestSeller ? "pt-[16px]" : ""}
                  key={index}
                >
                  <ProductCard
                    image={productData.image}
                    title={productData.title}
                    isBestSeller={isBestSeller}
                    description={productData.description}
                    isHorizontalView={isHorizontalView}
                    imageAltText={productData.imageAltText}
                    key={index}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
          <SliderButtons
            lastSlide={lastSlide}
            slideIndex={slideIndex}
            swiperRef={swiperRef}
            sliderLength={productData.length}
            classes="flex justify-end my-8"
          />
        </div>
      )}
    </div>
  );
};

export default ProductCardWrapper;
