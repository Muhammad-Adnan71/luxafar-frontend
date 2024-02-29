import React from "react";
import HolidayBanner from "./components/holidayBanner";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";

import Container from "components/template/container";
import ThingsSection from "@template-components/thingsSection";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import PlanContactBanner from "@template-components/planContactBanner";
import {
  WEB_ROUTES,
  capitalizeFirstLetter,
  removeParaTagsFromString,
} from "lib/utils";
import { apiGetPageByIdTemplateService } from "services/pages";
import { apiTemplateGetAllHolidayTypes } from "services/holidayTypes";
import { Metadata } from "next";
import { apiGetPageSeoMeta } from "services/seoMeta";
export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const {
    data: { page },
  } = await apiGetPageSeoMeta("holiday type");

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
async function HolidayTypes() {
  const response = await apiGetPageByIdTemplateService("holiday type");
  const responseHolidayType = await apiTemplateGetAllHolidayTypes();

  const breadCrumbs = [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "holiday types",
      url: WEB_ROUTES.HOLIDAY_TYPES,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://luxafar.com/holiday-types}`,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Holiday Type",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    url: `https://luxafar.com/holiday-types`,
    image: "https://luxafar.com/template/logo.png",
    description: response?.data?.page?.seoMeta?.description,
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
      <HolidayBanner
        image={response?.data?.page?.content?.[0]?.media?.desktopMediaUrl}
        title="Holiday Types"
        mobileImage={response?.data?.page?.content?.[0]?.media?.mobileMediaUrl}
        breadcrumbs={breadCrumbs}
        buttonText="GET BESPOKE PLANS"
        buttonURL={WEB_ROUTES.BESPOKE_HOLIDAY}
      />
      <Container>
        <div className="py-10">
          <SectionTitleHeader
            classes="mb-10"
            title={
              <>
                Choose Your
                <strong className="block text-secondary-color !font-heading">
                  Holiday Type
                </strong>
              </>
            }
          />
          {responseHolidayType?.data?.holidayTypes?.map(
            (item: any, index: number) => (
              <div key={index} className="pb-10">
                <ThingsSection
                  headingClasses="w-full max-2xl:!text-[46px]"
                  classes={`bg-quaternary-color  max-lg:[&>.txtPadding]:px-10 max-sm:[&>.txtPadding]:px-6 max-lg:[&>.txtPadding]:pb-10 ${
                    index % 2 !== 0 ? "lg:pl-10" : "lg:pr-10"
                  }`}
                  title={item?.name}
                  image={item?.media}
                  description={item?.description}
                  buttonText={"learn more"}
                  buttonURL={`${WEB_ROUTES.HOLIDAY_TYPES}/${item?.seoMeta?.slug}`}
                  imgRight={index % 2 !== 0}
                />
              </div>
            )
          )}
        </div>
        <div>
          {responseHolidayType?.data?.inspirations?.length ? (
            <div className="my-10 max-md:mt-0">
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
              <BlogCardWrapper
                showAll={true}
                blogs={responseHolidayType?.data?.inspirations}
              />
            </div>
          ) : (
            ""
          )}
        </div>
        <section className="my-16 max-md:mt-0">
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

export default HolidayTypes;
