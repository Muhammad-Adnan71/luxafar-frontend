import React from "react";
import DestinationComponent from "./components/destinationComponent";
import { apiTemplateDestinationByName } from "services/destination";
import { Metadata } from "next";
import {
  capitalizeFirstLetter,
  removeParaTagsFromString,
  replaceSpacesWithDash,
} from "lib/utils";
import { apiGetDestinationSeoMeta } from "services/seoMeta";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { name: string };
}): Promise<Metadata> {
  const response = await apiGetDestinationSeoMeta(params.name);

  const metaDescription = removeParaTagsFromString(
    response.data.destination?.seoMeta?.description as string
  );

  return {
    title: `${capitalizeFirstLetter(
      response.data.destination?.seoMeta?.title
    )} - Luxafar`,
    description: metaDescription,
    keywords: response.data.destination?.seoMeta?.keywords,

    openGraph: {
      title: `${capitalizeFirstLetter(
        response.data.destination?.seoMeta?.title
      )} - Luxafar`,
      description: metaDescription,
    },
  };
}
async function Destination({ params }: { params: { name: string } }) {
  const response = await apiTemplateDestinationByName(params.name);
  const metaDescription = removeParaTagsFromString(
    response?.data?.destination?.seoMeta?.description as string
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://luxafar.com/${replaceSpacesWithDash(
        response?.data?.destination?.name
      )}`,
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
    url: `https://luxafar.com/${replaceSpacesWithDash(
      response?.data?.destination?.name
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
      <DestinationComponent
        destination={response.data.destination}
        holidayTypes={response.data.holidayTypes}
      />
    </>
  );
}

export default Destination;
