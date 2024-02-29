import React from "react";
import HolidayBannerDetail from "../components/holidayBannerDetail";
import MainHeading from "@template-components/heading";
import Container from "components/template/container";
import Paragraph from "@template-components/paragraph";
import HolidaySlider from "../components/holidaySlider";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";
import TourCardWrapper from "components/template/container/tourCardWrapper";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import PlanContactBanner from "@template-components/planContactBanner";
import {
  WEB_ROUTES,
  capitalizeFirstLetter,
  removeParaTagsFromString,
  replaceSpacesWithDash,
} from "lib/utils";
import { apiTemplateByNameHolidayType } from "services/holidayTypes";
import MainHeadingContent from "@template-components/mainHeadingContent";
export const runtime = "edge";
import { Metadata, ResolvingMetadata } from "next";
import { apiGetSeoMetaHolidayType } from "services/seoMeta";

export async function generateMetadata({
  params,
  searchParams,
}: any): Promise<Metadata> {
  const name = params.name;
  const response = await apiGetSeoMetaHolidayType(name);
  const metaDescription = removeParaTagsFromString(
    response?.data?.holidayType?.seoMeta?.description as string
  );

  return {
    title: `${capitalizeFirstLetter(
      response?.data?.holidayType?.seoMeta?.title
    )} - Luxafar`,
    description: metaDescription,
    keywords: response?.data?.holidayType?.seoMeta?.keywords,
    openGraph: {
      title: `${capitalizeFirstLetter(
        response?.data?.holidayType?.seoMeta?.title
      )} - Luxafar`,
      description: metaDescription,
    },
  };
}

async function HolidayTypeDetail({
  params: { name },
}: {
  params: { name: string };
}) {
  const response = await apiTemplateByNameHolidayType(name);
  const metaDescription = removeParaTagsFromString(
    response?.data?.holidayType.seoMeta.description as string
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://luxafar.com/${replaceSpacesWithDash(
        response?.data?.holidayType.seoMeta.slug
      )}`,
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
    url: `https://luxafar.com/${replaceSpacesWithDash(
      response?.data?.holidayType.seoMeta.slug
    )}`,
    image: "https://luxafar.com/template/logo.png",
    description: metaDescription,
    sameAs: [
      "https://www.facebook.com/luxafarofficial",
      "https://www.instagram.com/luxafar",
    ],
  };

  const breadCrumbs = [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "holiday types",
      url: WEB_ROUTES.HOLIDAY_TYPES,
    },
    {
      name: response?.data?.holidayType?.name,
      url: `${WEB_ROUTES.HOLIDAY_TYPES}/${replaceSpacesWithDash(
        response?.data?.holidayType?.name
      )}`,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HolidayBannerDetail
        title={response?.data?.holidayType.name}
        image={response?.data?.holidayType?.media?.desktopMediaUrl}
        mobileImage={response?.data?.holidayType?.media?.mobileMediaUrl}
        breadcrumbs={breadCrumbs}
      />
      <Container classes="py-10">
        <div className="flex md:items-center   gap-10 max-md:flex-col">
          <MainHeading
            classes={
              "xl:text-[56px] max-lg:text-[48px] max-sm:text-[42px] max-sm:leading-[0.9] w-[40%] max-md:w-full"
            }
          >
            <MainHeadingContent
              content={response?.data?.holidayType.mainSectionHeading}
            />
          </MainHeading>

          <div className="w-[60%] max-md:w-full">
            <Paragraph
              htmlText={response?.data?.holidayType.mainSectionDescription}
            />
          </div>
        </div>
        <div className="py-10 max-md:mb-0">
          <HolidaySlider slides={response?.data?.holidayType.highlights} />
        </div>
        <>
          {response?.data?.tours?.length > 0 ? (
            <div className="my-16 max-md:mb-8 max-md:mt-4">
              <SectionTitleHeader
                classes="mb-10"
                title={
                  <>
                    Recommended
                    <strong className="inline-block text-secondary-color !font-heading xl:ml-3">
                      Tours
                    </strong>
                  </>
                }
              />
              <TourCardWrapper tours={response.data.tours} />
            </div>
          ) : (
            ""
          )}
        </>
        <div>
          {response?.data?.inspirations.length ? (
            <section className="my-10 max-md:mb-8">
              <SectionTitleHeader
                classes=" my-10 mt-0 "
                title={
                  <>
                    <strong className="inline-block text-secondary-color !font-heading">
                      Blogs
                    </strong>
                  </>
                }
              />
              <BlogCardWrapper blogs={response?.data?.inspirations} />
            </section>
          ) : (
            ""
          )}
        </div>
        <section className="my-16 max-md:mt-0 max-md:mb-8">
          <PlanContactBanner
            classes="my-10"
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
        </section>
      </Container>
    </>
  );
}

export default HolidayTypeDetail;
