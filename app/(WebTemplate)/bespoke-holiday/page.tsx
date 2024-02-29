import BespokeForm from "components/template/bespokeForm";
import React from "react";
import { apiGetAllBespokeQuestionTemplate } from "services/bespoke";
export const runtime = "edge";
import { Metadata } from "next";
import { capitalizeFirstLetter, removeParaTagsFromString } from "lib/utils";

import { apiGetPageSeoMeta } from "services/seoMeta";

export async function generateMetadata(): Promise<Metadata> {
  const {
    data: { page },
  } = await apiGetPageSeoMeta("bespoke holiday");
  const metaDescription = removeParaTagsFromString(
    page?.seoMeta?.description as string
  );
  return {
    title: `${capitalizeFirstLetter(page?.seoMeta?.title)} - Luxafar`,
    description: metaDescription,
    openGraph: {
      title: `${capitalizeFirstLetter(page?.seoMeta?.title)} - Luxafar`,
      description: metaDescription,
    },
  };
}

const BespokePlane = async () => {
  const { data } = await apiGetAllBespokeQuestionTemplate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://luxafar.com/bespoke-holiday",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Bespoke Holiday",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    url: "https://luxafar.com/bespoke-holiday",
    image: "https://luxafar.com/template/logo.png",
    description: "metaDescription",
    sameAs: [
      "https://www.facebook.com/luxafarofficial",
      "https://www.instagram.com/luxafar",
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BespokeForm questions={data} />
    </div>
  );
};

export default BespokePlane;
