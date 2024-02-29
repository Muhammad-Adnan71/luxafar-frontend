"use client";
import Image from "next/image";
import React from "react";
import Subheading from "@template-components/sub-heading";
import FavoriteButton from "./favoriteButton";
import Paragraph from "@template-components/paragraph";
import Rating from "components/CMS/components-ui/rating";
import Button from "@template-components/button";
import starIcon from "@public/template/shop/starIcon.png";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/CMS/components-ui/shadcn/ui/accordion";

const ProductCard = ({
  title,
  price,
  image,
  imageAltText,
  productRating,
  isHorizontalView,
  description,
  isBestSeller,
}: {
  title: string;
  price?: number;
  image: any;
  isBestSeller?: boolean;
  description?: string;
  imageAltText?: string;
  productRating?: number;
  isHorizontalView?: boolean;
}) => {
  return (
    <div>
      {!isHorizontalView && (
        <div className="bg-quaternary-color">
          <div className="bg-shop-banner-color">
            <Image
              className="w-full max-md:max-h-[357px] object-cover"
              src={image}
              alt={imageAltText ? imageAltText : ""}
            />
          </div>
          <div className="p-6 pb-8 ">
            <div className="gap-x-8 flex justify-between ">
              <Link className="w-3/5" href="/shop/product/1">
                <Subheading classes="text-[24px] max-[430px]:text-[20px] leading-[1.1] capitalize font-[600]">
                  {title}
                </Subheading>
              </Link>
              <FavoriteButton isFavorite={true} />
            </div>
            <div className="pt-2 flex items-baseline justify-between ">
              <Paragraph classes="lg:text-[20px] font-[600] mb-0">
                ${price}.00
              </Paragraph>
              <Rating
                size={25}
                rating={productRating ? productRating : 0}
                handleRating={() => {}}
              />
            </div>
          </div>
        </div>
      )}
      {isHorizontalView && (
        <>
          <div className="max-sm:flex-col max-sm:gap-y-5 relative p-9 max-lg:p-6 flex gap-x-9 bg-quaternary-color">
            {isBestSeller && (
              <div className="absolute bg-secondary-color -top-4 left-9 z-full">
                <Image className="w-[25px] h-[28px]" src={starIcon} alt="" />
              </div>
            )}
            <div className="w-1/2 max-sm:w-full  flex-1">
              <Image
                className="w-full h-full sm:max-h-[200px] object-cover"
                src={image}
                alt={imageAltText ? imageAltText : ""}
              />
            </div>
            <div className="w-1/2 max-sm:hidden ">
              <Subheading classes="font-[600] line-clamp-3 xl:mb-5 xl:w-[90%] text-[28px] border-b border-secondary-color pb-5">
                {title}
              </Subheading>
              <Paragraph classes="xl:text-[11px] line-clamp-3 xl:w-[65%] xl:leading-[1.4]">
                {description}
              </Paragraph>
              <Button
                redirect="/shop/product/1"
                classes="xl:text-[10px] xl:px-[15px] xl:py-2"
                text={isBestSeller ? "Shop now" : "preorder"}
              />
            </div>
            <div className="sm:hidden">
              <Accordion type="single" collapsible>
                <AccordionItem className="border-none mb-2 w-full" value="1">
                  <div className="flex justify-between items-center gap-5 mb-0  max-lg:items-start">
                    <h3 className="font-heading max-sm:font-[600] max-sm:w-4/5 text-[30px] text-secondary-color max-sm:text-[22px] max-sm:pb-[15px] max-sm:mb-2 line-clamp-2 max-md:mb-5">
                      {title}
                    </h3>
                    <AccordionTrigger
                      className="bg-quaternary-color py-0"
                      isIconClasses="!h-5 !w-5"
                      isIconDivClasses="!p-[3px] !border-[2px]"
                    ></AccordionTrigger>
                  </div>

                  <AccordionContent>
                    <Paragraph classes="xl:text-[11px] max-sm:text-[11px] max-sm:w-4/5 line-clamp-3 xl:w-[65%] xl:leading-[1.4] max-sm:leading-[1.3]">
                      {description}
                    </Paragraph>
                  </AccordionContent>
                  <Button
                    redirect="/shop/product/1"
                    classes="xl:text-[10px] xl:px-[15px] xl:py-2"
                    text={isBestSeller ? "Shop now" : "preorder"}
                  />
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCard;
