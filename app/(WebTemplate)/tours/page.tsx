import { Metadata } from "next";
import React from "react";
import ToursComponent from "./components/toursComponent";
import { apiGetTemplateTours } from "services/tour";
import { apiGetTemplateInspirations } from "services/inspirations";
import { apiGetAllBespokeQuestionTemplate } from "services/bespoke";
import { capitalizeFirstLetter, removeParaTagsFromString } from "lib/utils";
import {
  apiGetPageByIdTemplateService,
  apiGetToursPageService,
} from "services/pages";
import { apiGetPageSeoMeta } from "services/seoMeta";

export const runtime = "edge";
export async function generateMetadata(): Promise<Metadata> {
  const {
    data: { page },
  } = await apiGetPageSeoMeta("tours");

  const metaDescription = removeParaTagsFromString(
    page?.seoMeta?.description as string
  );

  return {
    title: `${capitalizeFirstLetter(page?.seoMeta?.title)} - Luxafar`,
    description: metaDescription,
    keywords: page?.seoMeta?.keywords,

    openGraph: {
      title: `${capitalizeFirstLetter(page?.seoMeta?.title)} - Luxafar`,
      description: metaDescription,
    },
  };
}

async function Tours() {
  const {
    data: {
      page,
      featuredTours,
      tours,
      upcomingTours,
      count,
      inspirations,
      bespokeQuestion,
    },
  } = await apiGetToursPageService({ pageSize: "8", pageNum: "1" });


  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      // "@id": `https://luxafar.com/${replaceSpacesWithDash(
      //   response?.data?.destination?.name
      // )}`,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Destination",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    // url: `https://luxafar.com/${replaceSpacesWithDash(
    //   response?.data?.destination?.name
    // )}`,
    image: "https://luxafar.com/template/logo.png",
    // description: metaDescription,
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
      <ToursComponent
        page={page}
        featuredTours={featuredTours}
        tours={tours}
        upcomingTours={upcomingTours}
        inspirations={inspirations}
        rowCount={count}
        questions={bespokeQuestion}
      />
    </>
  );
}

export default Tours;
