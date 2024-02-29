"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocomotiveScroll } from "react-locomotive-scroll";
import InnerPageBanner from "@template-components/innerPageBanner";
import Tabs from "@template-components/tabs";
import BestTimeToVisit from "./bestTimeToVisit";
import ThingsToDo from "./thingsToDo";
import GetBespokePlane from "./getBespokePlane";
import Tours from "./tours";
import PlaceToVisit from "./placeToVisit";
import { WEB_ROUTES, replaceSpacesWithDash } from "lib/utils";
import { HolidayTypesResponse } from "lib/types";

function DestinationComponent({
  destination,
  holidayTypes,
}: {
  holidayTypes: HolidayTypesResponse[];
  destination: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { scroll } = useLocomotiveScroll();
  const activeTab = searchParams.get("tab") as string;
  const pagesShowGalleryButton = [null, "travel-guide", "tours"];
  const [image, setImage] = useState<any>();

  const scrollToHash = (event: any, element_id: string, offset: number) => {
    event.preventDefault();

    const element = document.getElementById(element_id) as HTMLElement;
    const elementPositionOnWindow: number = element?.getBoundingClientRect().y;
    scroll.scrollTo(elementPositionOnWindow - offset, {
      duration: 500,
      disableLerp: true,
    });
  };

  const getBespokePlan = destination?.content?.find(
    (item: any) => item?.name === "get bespoke plan"
  );
  const thingsToDo = destination?.content?.find(
    (item: any) => item?.name === "things to do"
  );
  const placeToVisit = destination?.content?.find(
    (item: any) => item?.name === "places to visit"
  );
  const seasonsToVisit = destination?.content?.find(
    (item: any) => item?.name === "Seasons to visit"
  );
  const featuredTour = destination?.tours?.find(
    (item: any) => item.isFeatured === true
  );

  useEffect(() => {
    const bannerImage = destination?.content?.find(
      (ele: any) =>
        ele.name.toLocaleLowerCase() ===
        activeTab?.replaceAll("-", " ")?.toLocaleLowerCase()
    );
    setImage(bannerImage ? bannerImage?.media : getBespokePlan?.media);
  }, [searchParams]);

  const tabsContent = [
    {
      label: "travel-guide",
      onClick: () => {
        router.push(
          `/destination/${replaceSpacesWithDash(
            destination?.name
          )}?tab=travel-guide`
        );
      },
      content: (
        <GetBespokePlane
          about={getBespokePlan}
          destination={{ id: destination?.id, name: destination?.name }}
          places={destination?.placeToVisit}
          tours={destination?.tours?.slice(0, 2)}
          blogs={destination?.inspirations}
          gallery={destination?.gallery}
        />
      ),
    },
    {
      label: "tours",
      content: (
        <Tours
          gallery={destination.gallery}
          destination={destination?.name}
          tours={destination?.tours}
          blogs={destination?.inspirations}
        />
      ),
      onClick: () => {
        router.push(
          `/destination/${replaceSpacesWithDash(destination?.name)}?tab=tours`
        );
      },
    },
    {
      label: "places-to-visit",
      content: (
        <>
          <PlaceToVisit
            featuredTour={featuredTour}
            about={placeToVisit}
            destination={destination?.name}
            tours={destination?.tours}
            blogs={destination?.inspirations}
            places={destination?.placeToVisit}
            ideas={holidayTypes}
          />
        </>
      ),
      onClick: () => {
        router.push(
          `/destination/${replaceSpacesWithDash(
            destination?.name
          )}?tab=places-to-visit`
        );
      },
    },
    {
      label: "things-to-do",
      content: (
        <ThingsToDo
          destination={destination?.name}
          featuredTour={featuredTour}
          tour={destination?.tours}
          about={thingsToDo}
          blogs={destination?.inspirations}
          thingsToDo={destination?.thingsToDo}
          destinationFeatureOffered={destination?.destinationFeatureOffered}
        />
      ),
      onClick: () => {
        router.push(
          `/destination/${replaceSpacesWithDash(
            destination?.name
          )}?tab=things-to-do`
        );
      },
    },
    {
      label: "seasons-to-visit",
      content: (
        <BestTimeToVisit
          destination={destination?.name}
          featuredTour={featuredTour}
          tour={destination?.tours}
          about={seasonsToVisit}
          blogs={destination?.inspirations}
          seasonToVisit={destination?.seasonToVisit}
        />
      ),
      onClick: () => {
        router.push(
          `/destination/${replaceSpacesWithDash(
            destination?.name
          )}?tab=seasons-to-visit`
        );
      },
    },
  ];

  const breadcrumbs = [
    { name: "home", url: "/" },
    {
      name: destination?.name as string,
      url: `${WEB_ROUTES.DESTINATION}/${replaceSpacesWithDash(
        destination?.name
      )}`,
    },
  ];
  let isMobile: any;
  if (typeof window !== "undefined") {
    isMobile = window && window.screen.width < 640;
  }

  const tabsRoutes = [
    "travel-guide",
    "tours",
    "places-to-visit",
    "things-to-do",
    "seasons-to-visit",
  ];
  return (
    <>
      <InnerPageBanner
        breadcrumbs={breadcrumbs}
        image={
          isMobile
            ? image?.mobileMediaUrl
              ? image?.mobileMediaUrl
              : image?.desktopMediaUrl
            : image?.desktopMediaUrl
        }
        mainHeading={destination?.name}
        buttonText={
          pagesShowGalleryButton?.includes(activeTab) ? "gallery" : ""
        }
        description={destination?.description!}
        onButtonClick={(e: any) => {
          scrollToHash(e, "gallery", 100);
        }}
      />
      <Tabs
        defaultValue={
          tabsRoutes.includes(activeTab?.toLowerCase())
            ? activeTab
            : "travel-guide"
        }
        tabsContent={tabsContent}
      />
    </>
  );
}

export default DestinationComponent;
