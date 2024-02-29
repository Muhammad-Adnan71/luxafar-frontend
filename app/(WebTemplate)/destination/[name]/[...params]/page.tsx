import InnerPageBanner from "@template-components/innerPageBanner";
import React from "react";
import Tabs from "@template-components/tabs";
import Overview from "../components/overview";
import DayToDayItinerary from "../components/dayToDayItinerary";
import WhatToExpect from "../components/whatToExpect";
import DatesAndPrices from "../components/datesAndPrices";
import { apiGetTourByNameTemplate } from "services/tour";
import {
  WEB_ROUTES,
  capitalizeFirstLetter,
  removeParaTagsFromString,
  replaceSpacesWithDash,
} from "lib/utils";
export const runtime = "edge";
import { Metadata, ResolvingMetadata } from "next";
import { apiGetTourSeoMeta } from "services/seoMeta";

type Props = {
  params: {
    params: [tourName: string, id: string];
  };
};

export async function generateMetadata({
  params: {
    name,
    params: [destinationName, tourName],
  },
}: any): Promise<Metadata> {
  const tourResponse = await apiGetTourSeoMeta(tourName, name);

  const metaDescription = removeParaTagsFromString(
    tourResponse?.data?.tour?.seoMeta?.description as string
  );

  return {
    title: `${capitalizeFirstLetter(
      tourResponse?.data?.tour?.seoMeta?.title
    )} - Luxafar`,
    description: metaDescription,
    keywords: tourResponse?.data?.tour?.seoMeta?.keywords,

    openGraph: {
      title: `${capitalizeFirstLetter(
        tourResponse?.data?.tour?.seoMeta?.title
      )} - Luxafar`,
      description: metaDescription,
    },
  };
}

const TourDetailPage = async ({
  params: {
    name,
    params: [destinationName, tourName],
  },
}: {
  params: any;
}) => {
  const tourResponse = await apiGetTourByNameTemplate(tourName, name);

  const tabsContent = [
    {
      label: "overview",
      content: (
        <Overview
          airFairIncluded={tourResponse.data.tour.airFairIncluded}
          title={tourResponse?.data?.tour?.overviewTitle}
          description={tourResponse?.data?.tour?.overviewDescription}
          noOfDays={tourResponse?.data?.tour?.planDays}
          price={tourResponse?.data?.tour?.price}
          highlights={tourResponse?.data?.tour?.highlights}
          testimonials={tourResponse?.data?.testimonials}
          relatedTours={tourResponse.data.relatedTours}
          inspirations={tourResponse.data.inspirations}
          inspirationCount={tourResponse?.data?.inspirationCount}
          destination={name}
        />
      ),
    },
    {
      label: "day to day itinerary",
      content: (
        <DayToDayItinerary
          relatedTours={tourResponse.data.relatedTours}
          inspirations={tourResponse.data.inspirations}
          airFairIncluded={tourResponse.data.tour.airFairIncluded}
          noOfDays={tourResponse?.data?.tour?.planDays}
          price={tourResponse?.data?.tour?.price}
          tourScheduleData={tourResponse?.data?.tour?.dayToDayItinerary?.map(
            (item: any) => ({
              place: item?.destination,
              hotel: item?.accommodation,
              acitvity: item?.description,
            })
          )}
          accommodationImage={
            tourResponse?.data?.tour?.accommodationImageMedia?.desktopMediaUrl
          }
          inspirationCount={tourResponse?.data?.inspirationCount}
          destination={name}
        />
      ),
    },
    {
      label: "dates & prices",
      content: (
        <DatesAndPrices
          makeItPrivateDescription={
            tourResponse.data.tour.makeItPrivateDescription
          }
          supplementPolicy={tourResponse.data.tour.supplementPolicy}
          priceTitle={tourResponse.data.tour.pricingTitle}
          priceDescription={tourResponse.data.tour.pricingDescription}
          planServices={tourResponse.data.tour.planService}
          privatePlan={tourResponse.data.tour.privatePlan}
          airFairIncluded={tourResponse.data.tour.airFairIncluded}
          noOfDays={tourResponse?.data?.tour?.planDays}
          price={tourResponse?.data?.tour?.price}
          relatedTours={tourResponse.data.relatedTours}
          inspirations={tourResponse.data.inspirations}
          inspirationCount={tourResponse?.data?.inspirationCount}
          destination={name}
        />
      ),
    },
    {
      label: "what to expect",
      content: (
        <WhatToExpect
          relatedTours={tourResponse.data.relatedTours}
          inspirations={tourResponse.data.inspirations}
          airFairIncluded={tourResponse.data.tour.airFairIncluded}
          noOfDays={tourResponse?.data?.tour?.planDays}
          price={tourResponse?.data?.tour?.price}
          cuisineDescription={tourResponse?.data?.tour?.cuisineDescription}
          departurePoint={tourResponse?.data?.tour?.departurePoint}
          meetingPoint={tourResponse?.data?.tour?.meetingPoint}
          physicalActivityDescription={
            tourResponse?.data?.tour?.physicalActivityDescription
          }
          travelingFromDescription={
            tourResponse?.data?.tour?.travelingFromDescription
          }
          weatherDescription={tourResponse?.data?.tour?.weatherDescription}
          whenToGoDescription={tourResponse?.data?.tour?.whenToGoDescription}
          inspirationCount={tourResponse?.data?.inspirationCount}
          destination={name}
        />
      ),
    },
  ];

  const tourTitle = tourResponse?.data?.tour?.title;
  const breadcrumbs = [
    { name: "home", url: "/" },
    {
      name: name,
      url: `${WEB_ROUTES.DESTINATION}/${replaceSpacesWithDash(name)}`,
    },
    { name: tourTitle ? tourTitle : "", url: "" },
  ];
  let isMobile;
  if (typeof window !== "undefined") {
    isMobile = window && window.screen.width < 640;
  }
  const metaDescription = removeParaTagsFromString(
    tourResponse?.data?.tour?.seoMeta?.description as string
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://luxafar.com/${replaceSpacesWithDash(
        tourResponse?.data?.tour?.seoMeta?.slug
      )}`,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Tours",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    url: `https://luxafar.com/${replaceSpacesWithDash(
      tourResponse?.data?.tour?.seoMeta?.slug
    )}`,
    image: "https://luxafar.com/template/logo.png",
    description: metaDescription,
    sameAs: [
      "https://www.facebook.com/luxafarofficial",
      "https://www.instagram.com/luxafar",
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InnerPageBanner
        breadcrumbs={breadcrumbs}
        altText={
          tourResponse?.data?.tour?.title + "" + "Luxafar Tour Banner Image"
        }
        image={
          isMobile
            ? tourResponse.data.tour.bannerImageMedia?.mobileMediaUrl
              ? tourResponse.data.tour.bannerImageMedia?.mobileMediaUrl
              : tourResponse.data.tour.bannerImageMedia?.desktopMediaUrl
            : tourResponse.data.tour.bannerImageMedia?.desktopMediaUrl
        }
        mainHeading={
          <span
            className={`
            ${
              tourResponse?.data?.tour?.title &&
              tourResponse?.data?.tour?.title?.length > 50
                ? "md:w-[800px]"
                : "md:w-[600px]"
            }
             block max-sm:text-center max-sm:w-[250px]`}
          >
            {tourResponse?.data?.tour?.title}
          </span>
        }
        buttonText="Back to tours"
        buttonLink={`/destination/${replaceSpacesWithDash(
          tourResponse?.data?.tour?.destination?.name as string
        )}?tab=tours`}
        description=""
        detailPage={true}
      />
      <Tabs
        detailPage={true}
        defaultValue="overview"
        tabsContent={tabsContent}
      />
    </>
  );
};

export default TourDetailPage;
