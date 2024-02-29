import React from "react";
import PlaceDetails from "../../components/placeDetails";
import { apiGetTemplatePlacesByName } from "services/places";
import { Metadata } from "next";
import {
  capitalizeFirstLetter,
  removeParaTagsFromString,
  replaceSpacesWithDash,
} from "lib/utils";
export const runtime = "edge";
export async function generateMetadata({
  params,
}: {
  params: {
    name: string;
    placeName: string;
  };
}): Promise<Metadata> {
  const response = await apiGetTemplatePlacesByName(params.placeName);

  const metaDescription = removeParaTagsFromString(
    response?.data?.place?.seoMeta?.description as string
  );

  return {
    title: `${capitalizeFirstLetter(
      response?.data?.place?.seoMeta?.title
    )} - Luxafar`,
    description: metaDescription,
    keywords: response?.data?.place?.seoMeta?.keywords,
    openGraph: {
      title: `${capitalizeFirstLetter(
        response?.data?.place?.seoMeta?.title
      )} - Luxafar`,
      description: metaDescription,
    },
  };
}
async function PlaceDetail({
  params,
}: {
  params: {
    name: string;
    placeName: string;
  };
}) {
  const response = await apiGetTemplatePlacesByName(params.placeName);
  const metaDescription = removeParaTagsFromString(
    response?.data?.place?.seoMeta?.description as string
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://luxafar.com/${replaceSpacesWithDash(
        response?.data?.place?.seoMeta?.slug
      )}`,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Places",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    url: `https://luxafar.com/${replaceSpacesWithDash(
      response?.data?.place?.seoMeta?.slug
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
      <PlaceDetails data={response.data} destination={params.name} />;
    </>
  );
}

export default PlaceDetail;
