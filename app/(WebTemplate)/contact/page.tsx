import React from "react";
import Breadcrumbs from "@template-components/breadcrumbs";
import MainHeading from "@template-components/heading";
import Paragraph from "@template-components/paragraph";
import Container from "components/template/container";
import PlanContactBanner from "@template-components/planContactBanner";
import {
  WEB_ROUTES,
  capitalizeFirstLetter,
  removeParaTagsFromString,
} from "lib/utils";
import { apiGetPageByIdTemplateService } from "services/pages";
import Form from "./components/form";
import MainHeadingContent from "@template-components/mainHeadingContent";
export const runtime = "edge";
import { Metadata } from "next";
import { apiGetPageSeoMeta } from "services/seoMeta";

export async function generateMetadata(): Promise<Metadata> {
  const {
    data: { page },
  } = await apiGetPageSeoMeta("contact");

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

const Contact = async () => {
  const breadCrumbs = [
    { name: "home", url: "/" },
    { name: "contact us", url: WEB_ROUTES.CONTACT },
  ];

  const {
    data: { page },
  } = await apiGetPageByIdTemplateService("contact");
  const { content, ...rest } = page;
  const metaDescription = removeParaTagsFromString(page?.page?.description);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://luxafar.com/contact",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Contact",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    url: "https://luxafar.com/contact",
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
      <Container classes="pb-20">
        <Breadcrumbs breadcrumbs={breadCrumbs} classes="mb-10 max-sm:hidden" />
        <div className=" flex gap-10 max-[900px]:flex-col">
          <div className="w-[50%] max-[900px]:w-full">
            <div
              data-scroll
              data-scroll-speed="1"
              data-scroll-direction="vertical"
            >
              <MainHeading
                isHeadingH1={true}
                classes=" mb-10 max-sm:!text-[43px]"
              >
                <MainHeadingContent content={content?.[0].title} />
              </MainHeading>
            </div>

            <Paragraph htmlText={content?.[0].description} />
          </div>
          <div className="w-[50%] max-[900px]:w-full">
            <Form />
          </div>
        </div>
        <div className="py-20 max-sm:pt-10 max-sm:pb-0">
          <PlanContactBanner
            classes="my-10 px-[5%]"
            title={
              <>
                Want To
                <strong className="inline-block max-sm:inline text-secondary-color !font-heading sm:ml-2">
                  Plan Your Tours?
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
    </>
  );
};

export default Contact;
