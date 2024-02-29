"use client";
import React, { useEffect, useState } from "react";
import Breadcrumbs from "@template-components/breadcrumbs";
import Container from "components/template/container";
import SearchSelectInput from "@template-components/searchSelect";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import Pagination from "@template-components/pagination";
import PlanContactBanner from "@template-components/planContactBanner";
import { InspirationResponse } from "lib/types";
import FeaturedBlog from "./featuredBlog";
import { apiTemplateDestinations } from "services/destination";
import { apiTemplateGetAllHolidayTypes } from "services/holidayTypes";
import { apiGetTemplateInspirations } from "services/inspirations";
import { WEB_ROUTES } from "lib/utils";
import { useLocomotiveScroll } from "react-locomotive-scroll";

function InspirationsComponent({
  inspirations,
  featuredInspirations,
  rowCount,
}: {
  featuredInspirations: InspirationResponse[];
  rowCount: number;
  inspirations: InspirationResponse[];
}) {
  const { scroll } = useLocomotiveScroll();
  const [inspirationsData, setInspirationsData] = useState(inspirations);
  const [destinations, setDestinations] = useState<
    {
      label: string;
      value: string;
    }[]
  >();
  const [holidayTypes, setHolidayTypes] = useState<
    {
      label: string;
      value: string;
    }[]
  >();

  const [selectedDestination, setSelectedDestination] = useState<any>({});
  const [selectedHolidayTypes, setSelectedHolidayTypes] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(rowCount);
  const [currentPage, setCurrentPage] = useState(1);

  const handleDestination = (value: string) => {
    setSelectedDestination({
      id: value,
      name: destinations?.find((ele: any) => ele?.value == value)?.label,
    });
    setCurrentPage(1);
  };
  const handleHolidayType = (value: string) => {
    setSelectedHolidayTypes(value);
    setCurrentPage(1);
  };
  const [isMounted, setIsMounted] = useState(false);

  const breadcrumbs = [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "blogs",
      url: "",
    },
  ];

  useEffect(() => {
    getDestinations();
    getHolidayTypes();
  }, []);

  const getDestinations = async () => {
    const response = await apiTemplateDestinations();
    if (response?.status === "success") {
      setDestinations(
        response?.data.map((destination: any) => ({
          label: destination?.name,
          value: destination?.id?.toString(),
        }))
      );
    }
  };

  const getHolidayTypes = async () => {
    const response = await apiTemplateGetAllHolidayTypes();
    if (response.status === "success") {
      setHolidayTypes(
        response.data?.holidayTypes?.map((destination: any) => ({
          label: destination?.name,
          value: destination?.id?.toString(),
        }))
      );
    }
  };

  const getInspirations = async () => {
    const response = await apiGetTemplateInspirations({
      ...(selectedDestination?.id && {
        destinationId: selectedDestination.id,
      }),
      ...(selectedHolidayTypes && { holidayTypeId: selectedHolidayTypes }),
      ...(currentPage && { pageNum: currentPage.toString() }),
      ...{ pageSize: "9" },
    });
    if (response?.status === "success") {
      setInspirationsData(response.data.inspirations);
      setCount(response?.count);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      getInspirations();
      setIsLoading(true);
    }
  }, [selectedDestination.id, selectedHolidayTypes, currentPage]);
  const scrollToHash = (event: any, element_id: string, offset: number) => {
    event.preventDefault();

    const element = document.getElementById(element_id) as HTMLElement;
    const elementPositionOnWindow: number = element?.getBoundingClientRect().y;
    scroll.scrollTo(elementPositionOnWindow - offset, {
      duration: 500,
      disableLerp: true,
    });
  };

  return (
    <Container>
      <Breadcrumbs breadcrumbs={breadcrumbs} classes="max-md:hidden" />
      {featuredInspirations?.length ? (
        <FeaturedBlog
          blogs={featuredInspirations}

        />
      ) : (
        <></>
      )}
      <div
        className="flex gap-5 justify-start md:items-end my-10 max-md:flex-col"
        id="inspiration"
      >
        <div className="w-[32%] max-md:w-full md:min-w-[276px] ">
          <SearchSelectInput
            onChange={handleDestination}
            value={selectedDestination.id as string}
            label="Select By Destination"
            placeHolder="Click here to select destination"
            items={destinations}
          />
        </div>
        <div className="w-[32%] max-md:w-full md:min-w-[276px]">
          <SearchSelectInput
            onChange={handleHolidayType}
            value={selectedHolidayTypes as string}
            label="Select By Holiday Type"
            placeHolder="Click here to select Holiday Type"
            items={holidayTypes}
          />
        </div>
        <div className="w-[32%] max-md:w-full">
          <button
            onClick={(e) => {
              e.preventDefault();
              setSelectedDestination({});
              setSelectedHolidayTypes("");
            }}
            className="font-body text-secondary-color w-fit pb-3 block font-[600] text-[11px] underline underline-offset-4 "
          >
            CLEAR ALL
          </button>
        </div>
      </div>
      <div className="py-10 pb-16 max-sm:py-6">
        <BlogCardWrapper
          column={3}
          blogs={inspirationsData}
          showAll={false}
          loading={isLoading}
          destinationName={selectedDestination?.name}
        />

        <Pagination
          totalResults={count}
          onPagination={(currentPage: number, e: any) => {
            setCurrentPage(currentPage);
            scrollToHash(e, "inspiration", 1000);
          }}
          currentPage={currentPage}
          resultsPerPage={9}
        />
        <PlanContactBanner
          classes="my-10 max-sm:my-20 "
          title={
            <>
              Ready To{" "}
              <strong className="inline max-sm:inline text-secondary-color !font-heading sm:ml-1">
                Plan <br className="md:hidden" /> Your Tour?
              </strong>
            </>
          }
          description="Whatever you want from your Tour,
Our team of expert travel designers are ready to help."
          buttonText="get bespoke plan"
          buttonURL={WEB_ROUTES.BESPOKE_HOLIDAY}
        />
      </div>
    </Container>
  );
}

export default InspirationsComponent;
