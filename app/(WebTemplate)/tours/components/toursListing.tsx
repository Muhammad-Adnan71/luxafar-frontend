import MainHeading from "@template-components/heading";
import MainHeadingContent from "@template-components/mainHeadingContent";
import Pagination from "@template-components/pagination";
import SearchSelectInput from "@template-components/searchSelect";
import CardLoading from "components/template/container/cardLoading";
import TourCardLoading from "components/template/container/tourCardLoading";
import TourCardWrapper from "components/template/container/tourCardWrapper";
import { TourResponse } from "lib/types";
import React, { useEffect, useState } from "react";
import { apiTemplateDestinations } from "services/destination";
import { apiTemplateGetAllHolidayTypes } from "services/holidayTypes";
import { apiGetTemplateTours } from "services/tour";

function ToursListing({
  rowCount,
  tours,
}: {
  rowCount: number;
  tours: TourResponse[];
}) {
  const [selectedDestination, setSelectedDestination] = useState<any>({});
  const [selectedHolidayTypes, setSelectedHolidayTypes] = useState<string>();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(rowCount);
  const [toursData, setToursData] = useState<TourResponse[]>(tours);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      getInspirations();
      setIsLoading(true);
    }
  }, [selectedDestination.id, selectedHolidayTypes, currentPage]);

  const getInspirations = async () => {
    const response = await apiGetTemplateTours({
      ...(selectedDestination?.id && {
        destinationId: selectedDestination.id,
      }),
      ...(selectedHolidayTypes && { holidayTypeId: selectedHolidayTypes }),
      ...(currentPage && { pageNum: currentPage.toString() }),
      ...{ pageSize: "8" },
    });
    if (response?.status === "success") {
      setToursData(response.data.tours);
      setCount(response?.data?.count);
      setIsLoading(false);
    }
  };

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
  return (
    <div>
      <MainHeading>
        Browse Our
        <MainHeadingContent
          content={'"tours"'}
          strongClasses="mt-2 inline-block "
        />
      </MainHeading>
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
      <div className="">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-8 max-md:grid-cols-1">
            {[1, 2, 3, 4, 5, 6].map((item: any) => (
              <TourCardLoading key={item} />
            ))}
          </div>
        ) : (
          <TourCardWrapper tours={toursData} />
        )}
      </div>
      <Pagination
        totalResults={count}
        onPagination={(currentPage: number, e: any) => {
          setCurrentPage(currentPage);
        }}
        currentPage={currentPage}
        resultsPerPage={9}
      />
    </div>
  );
}

export default ToursListing;
