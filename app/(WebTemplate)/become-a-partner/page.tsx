import BecomePartnerForm from "components/template/becomePartner";
import React from "react";
import { apiGetAllBecomePartnerQuestionTemplate } from "services/becomePartner";
export const runtime = "edge";
import { Metadata } from "next";
import { apiGetTemplateConfiguration } from "services/configuration";
import { capitalizeFirstLetter, removeParaTagsFromString } from "lib/utils";
import { apiGetPageByIdTemplateService } from "services/pages";
import { apiGetPageSeoMeta } from "services/seoMeta";

export async function generateMetadata(): Promise<Metadata> {
  const {
    data: { page },
  } = await apiGetPageSeoMeta("become a partner");
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

const BecomePartner = async () => {
  const { data } = await apiGetAllBecomePartnerQuestionTemplate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://luxafar.com/become-a-partner",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Become a Partner",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    url: "https://luxafar.com/become-a-partner",
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
      <BecomePartnerForm questions={data} />
    </div>
  );
};

export default BecomePartner;
