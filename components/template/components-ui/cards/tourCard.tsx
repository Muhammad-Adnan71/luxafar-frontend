/* eslint-disable @next/next/no-img-element */
import React, { useMemo } from "react";
import Paragraph from "@template-components/paragraph";
import Rating from "../../../CMS/components-ui/rating";
import Button from "@template-components/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/CMS/components-ui/shadcn/ui/accordion";
import { TourResponse } from "lib/types";
import {
  removeParaTagsFromString,
  replaceSpacesWithDash,
  truncateText,
} from "lib/utils";
import SideHeading from "@template-components/side-heading";
import ImageWithLoader from "@template-components/ImageWithLoader";
function TourCard({
  isFeatured,
  destination,
  tour,
  isExpanded,
  accordionValue,
  itemValue,
  setItemValue,
  index,
}: {
  isFeatured?: boolean;
  isExpanded?: boolean;
  accordionValue?: string;
  destination?: string;
  tour?: TourResponse;
  itemValue?: string;
  setItemValue?: Function;
  index?: string;
}) {
  const id = tour?.id?.toString();
  const memoizedImage = useMemo(() => {
    return (
      <ImageWithLoader
        alt={
          isFeatured
            ? tour?.title
              ? tour?.title + " " + "Luxafar Featured Tour Card Image"
              : ""
            : tour?.title
            ? tour?.title + " " + "Luxafar Tour Card Image"
            : ""
        }
        loading="lazy"
        classes="w-full h-full object-cover"
        url={tour?.bannerImageMedia?.mobileMediaUrl as string}
      />
    );
  }, [tour?.bannerImageMedia?.mobileMediaUrl]);
  return (
    <div
      className={`bg-quaternary-color p-8 flex gap-8 max-lg:gap-y-6 max-sm:gap-y-4 relative max-lg:flex-col max-lg:px-5 max-sm:p-6 ${
        isFeatured
          ? "max-xl:min-w-[400px] max-lg:min-w-[280px] h-auto"
          : "h-full"
      }`}
    >
      {isFeatured && (
        <div className=" p-[0.3rem] px-3 max-md:px-2 max-md:py-[0.3rem] bg-secondary-color absolute max-md:-top-[10px] -top-[12px]">
          <span className="font-body block uppercase text-[11px] max-md:text-[10px] max-lg:text-[10px] font-[500] text-primary-color">
            Featured Tour
          </span>
        </div>
      )}
      <div
        className={`${
          isFeatured
            ? "w-[50%] h-[198px] max-lg:h-[190px]  max-lg:w-full"
            : "w-[45%] max-h-[310px]  max-md:h-[160px]  max-lg:max-h-[250px] max-lg:w-full"
        } `}
      >
        {memoizedImage}
      </div>
      <div
        className={` flex flex-1 ${
          isFeatured ? "w-[40%] max-lg:w-full" : "w-[55%] max-lg:w-full"
        } overflow-hidden`}
      >
        <div
          className={`${
            isFeatured ? "hidden max-lg:w-full" : "md:hidden max-lg:w-full"
          }  `}
        >
          <Accordion
            type="single"
            collapsible
            defaultValue={isExpanded ? accordionValue : ""}
            value={itemValue}
            onValueChange={(e) => {
              console.log(e, "");
            }}
          >
            <AccordionItem
              className="border-none mb-2 w-full"
              value={index ?? "0"}
            >
              <div className="flex justify-between items-center gap-5 mb-0  max-lg:items-start">
                <h3 className="font-heading max-sm:font-[600] leading-[1.2] text-[30px] text-secondary-color max-sm:text-[20px] line-clamp-3 max-md:mb-5">
                  {tour?.title as string}
                </h3>
                <AccordionTrigger
                  className="bg-quaternary-color py-0"
                  isIconClasses="!h-5 !w-5"
                  isIconDivClasses="!p-[3px] !border-[2px]"
                  onClick={() => {
                    setItemValue &&
                      setItemValue((pre: any) => (pre == index ? "" : index));
                  }}
                ></AccordionTrigger>
              </div>

              <AccordionContent>
                <div className="border-t border-secondary-color">
                  <Paragraph
                    htmlText={removeParaTagsFromString(
                      tour?.description as string
                    )}
                    classes="opacity-1 mt-6 max-md:mb-3"
                  ></Paragraph>
                  <Rating rating={2} handleRating={() => {}} />
                  <div>
                    <SideHeading
                      isRotate={false}
                      classes={"max-sm:text-[10px]"}
                    >
                      From
                    </SideHeading>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-heading text-[#fff] text-[30px] max-md:text-[25px]">
                      ${tour?.price}
                    </p>
                    <span className="font-body text-[#fff] text-[14px] mt-3 max-md:text-[12px]">
                      / Per Person
                    </span>
                  </div>
                  <p className="text-[14px] text-[#fff] max-md:my-3 font-body max-md:text-[12px]">
                    {tour?.planDays} Days Plan
                  </p>
                </div>
              </AccordionContent>
              <Button
                classes="max-md:!mb-0"
                redirect={`/destination/${replaceSpacesWithDash(
                  destination as string
                )}/tours/${replaceSpacesWithDash(tour?.seoMeta?.slug)}`}
                text="view Tour"
              />
            </AccordionItem>
          </Accordion>
        </div>
        <div
          className={`${
            isFeatured ? "block max-sm:gap-y-3" : "max-md:hidden"
          } flex flex-col flex-1 gap-1  ${
            isFeatured ? "justify-center " : "justify-between"
          } max-lg:gap-5 lg:gap-x-[8px]  `}
        >
          <div
            className={`${
              isFeatured ? "" : "border-b border-secondary-color"
            }  `}
          >
            <h3
              className={`font-heading text-[22px] leading-[1.2] font-[600] text-secondary-color mb-4 line-clamp-2 max-xl:text-[18px]  ${
                isFeatured
                  ? "mb-0 max-lg:mb-0 max-sm:text-[20px] leading-[1.4]"
                  : "min-h-[52px]"
              }`}
            >
              {truncateText(tour?.title as string, 25)}
            </h3>
          </div>
          <div className={`${isFeatured ? "w-[100%]" : ""} flex flex-col `}>
            <div>
              <Paragraph
                classes={`${
                  isFeatured
                    ? "md:text-[12px] max-md:text-[11px] max-sm:mb-2 line-clamp-2 mb-2"
                    : "line-clamp-3 md:text-[14px]  min-h-[60px] mb-4"
                }  `}
                htmlText={truncateText(
                  removeParaTagsFromString(tour?.description as string),
                  100
                )}
              ></Paragraph>
              <div className="max-lg:mb-2">
                <Rating rating={2} handleRating={() => {}} />
              </div>
              {!isFeatured && (
                <>
                  <SideHeading
                    isRotate={false}
                    classes={" !text-[10px] mb-[5px] max-lg:mb-[10px]"}
                  >
                    From
                  </SideHeading>
                  <div className="flex items-center gap-2">
                    <p className="font-heading text-[#fff] text-[24px]">
                      ${tour?.price}
                    </p>
                    <span className="font-body text-[#fff] text-[11px] mt-3">
                      / Per Person
                    </span>
                  </div>
                  <p className="text-[10px] text-[#fff] mt-5 mb-5 font-body">
                    {tour?.planDays} Days Plan
                  </p>
                </>
              )}
              {isFeatured && (
                <Button
                  classes={`max-sm:hidden px-3 py-3`}
                  text="View Tours"
                  redirect={`/destination/${replaceSpacesWithDash(
                    destination
                      ? destination
                      : (tour?.destination?.name as string)
                  )}/tours/${replaceSpacesWithDash(tour?.seoMeta?.slug)}`}
                />
              )}
              {isFeatured && (
                <Button
                  classes={`sm:hidden px-3 py-3`}
                  text="see featured tour"
                  redirect={`/destination/${replaceSpacesWithDash(
                    destination
                      ? destination
                      : (tour?.destination?.name as string)
                  )}/tours/${replaceSpacesWithDash(tour?.seoMeta?.slug)}`}
                />
              )}
              {!isFeatured && (
                <Button
                  classes={`px-3 py-3`}
                  text="View Tours"
                  redirect={`/destination/${replaceSpacesWithDash(
                    destination
                      ? destination
                      : (tour?.destination?.name as string)
                  )}/tours/${replaceSpacesWithDash(tour?.seoMeta?.slug)}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TourCard;
