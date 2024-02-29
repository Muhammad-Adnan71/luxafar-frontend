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
import {
  apiGetTemplateInspirationByDestinationName,
  apiGetTemplateInspirations,
} from "services/inspirations";
import { WEB_ROUTES, replaceSpacesWithDash } from "lib/utils";
import { useLocomotiveScroll } from "react-locomotive-scroll";

function InspirationDestinationComponent({
  inspirations,
  featuredInspiration,
  rowCount,
  destinationName,
}: {
  destinationName: string;
  featuredInspiration: InspirationResponse;
  rowCount: number;
  inspirations: InspirationResponse[];
}) {
  const { scroll } = useLocomotiveScroll();
  const [inspirationsData, setInspirationsData] = useState(inspirations);

  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(rowCount);
  const [currentPage, setCurrentPage] = useState(1);

  const [isMounted, setIsMounted] = useState(false);

  const breadcrumbs = [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "blogs",
      url: WEB_ROUTES.INSPIRATIONS,
    },
    {
      name: destinationName,
      url: ``,
    },
  ];

  const getInspirations = async () => {
    const response = await apiGetTemplateInspirationByDestinationName({
      ...(currentPage && { pageNum: currentPage.toString() }),
      ...(destinationName && { destinationName }),
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
  }, [currentPage]);

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
      {featuredInspiration ? (
        <FeaturedBlog
          blog={featuredInspiration}
          destinationName={destinationName}
        />
      ) : (
        <></>
      )}

      <div className="py-10 pb-16 max-sm:py-6">
        <BlogCardWrapper
          column={3}
          blogs={inspirationsData}
          showAll={false}
          loading={isLoading}
          destinationName={destinationName}
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

export default InspirationDestinationComponent;
