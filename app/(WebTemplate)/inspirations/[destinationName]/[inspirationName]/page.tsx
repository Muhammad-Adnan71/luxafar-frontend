import React from "react";
import Container from "components/template/container";
import Paragraph from "@template-components/paragraph";
import DetailsSection from "../../components/detailsSection";
import PlanContactBanner from "@template-components/planContactBanner";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";
import TourCardWrapper from "components/template/container/tourCardWrapper";
import {
  WEB_ROUTES,
  capitalizeFirstLetter,
  removeParaTagsFromString,
  replaceSpacesWithDash,
} from "lib/utils";
import BlogBanner from "../../components/blog-banner";
import { apiGetTemplateInspirationByName } from "services/inspirations";
import { Metadata, ResolvingMetadata } from "next";
import { apiGetInspirationSeoMeta } from "services/seoMeta";

export async function generateMetadata({
  params,
}: {
  params: { destinationName: string; inspirationName: string };
}): Promise<Metadata> {
  const inspirationTitle = params?.inspirationName;
  const {
    data: { inspiration },
  } = await apiGetInspirationSeoMeta(
    `${params?.destinationName}/${inspirationTitle}`
  );
  const metaDescription = removeParaTagsFromString(
    inspiration?.seoMeta?.description as string
  );

  return {
    title:
      capitalizeFirstLetter(inspiration?.seoMeta?.title) + " " + "- Luxafar",
    description: metaDescription,
    keywords: inspiration?.seoMeta?.keywords,
    openGraph: {
      title:
        capitalizeFirstLetter(inspiration?.seoMeta?.title) + " " + "- Luxafar",
      description: metaDescription,
    },
  };
}
async function DestinationDetail({
  params,
}: {
  params: { destinationName: string; inspirationName: string };
}) {
  const inspirationTitle = params?.inspirationName;
  const {
    data: { inspiration, tours },
  } = await apiGetTemplateInspirationByName(
    `${params?.destinationName}/${inspirationTitle}`
  );
 
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
      name: `${params?.destinationName}`,
      url: `${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(
        params?.destinationName
      )}`,
    },
    {
      name: inspiration?.title,
      url: "",
    },
  ];
  const metaDescription = removeParaTagsFromString(
    inspiration.seoMeta.description as string
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://luxafar.com/${inspiration.seoMeta.slug}`,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Holiday Types",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    url: `https://luxafar.com/${inspiration.seoMeta.slug}`,
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
      <BlogBanner
        classes="h-[calc(100vh_-_330px)]"
        altText={inspiration?.title ? inspiration?.title + " " + "Luxafar" : ""}
        image={inspiration?.media?.desktopMediaUrl}
        mobileImage={inspiration?.media?.mobileMediaUrl}
        breadcrumbs={breadcrumbs}
      />
      <Container classes="py-10 pb-16">
        <h1 className="font-heading text-secondary-color capitalize text-[42px] max-sm:text-[23px] max-lg:w-full font-[600] w-[50%] mb-10">
          {inspiration?.title}
        </h1>
        <Paragraph htmlText={inspiration?.description}></Paragraph>

        <>
          {inspiration?.inspirationDetail?.map((item: any, index: number) => {
            return (
              <DetailsSection
                mobileImage={item?.media?.mobileMediaUrl}
                key={index}
                title={item?.title}
                image={item?.media?.desktopMediaUrl}
                description={item?.description}
              />
            );
          })}
        </>
        <PlanContactBanner
          classes="my-16 max-md:mt-12 max-md:mb-8"
          title={
            <>
              Ready To{" "}
              <strong className="inline text-secondary-color !font-heading sm:ml-2">
                Plan <br className="md:hidden" /> Your Tour?
              </strong>
            </>
          }
          description="Whatever you want from your Tour,
Our team of expert travel designers are ready to help."
          buttonText="get bespoke plan"
          buttonURL={WEB_ROUTES.BESPOKE_HOLIDAY}
        />
        <div>
          {tours?.length ? (
            <div className="my-10">
              <SectionTitleHeader
                classes="mb-10"
                title={
                  <>
                    You Might
                    <span className="block">
                      Also
                      <strong className=" text-secondary-color !font-heading ml-2">
                        like
                      </strong>
                    </span>
                  </>
                }
              />
              <TourCardWrapper tours={tours} />
            </div>
          ) : (
            ""
          )}
        </div>
      </Container>
    </>
  );
}

export default DestinationDetail;
