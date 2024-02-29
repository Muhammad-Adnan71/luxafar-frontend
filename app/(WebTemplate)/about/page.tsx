/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Linkedin } from "lucide-react";

import Breadcrumbs from "@template-components/breadcrumbs";
import MainHeading from "@template-components/heading";
import Paragraph from "@template-components/paragraph";
import PlanContactBanner from "@template-components/planContactBanner";
import Container from "components/template/container";

import compassCover from "@public/template/compasscover.png";
import compass from "@public/template/compass.png";
import {
  WEB_ROUTES,
  capitalizeFirstLetter,
  removeParaTagsFromString,
} from "lib/utils";
import { apiGetPageByIdTemplateService } from "services/pages";
import Compass from "./components/compass";
import MainHeadingContent from "@template-components/mainHeadingContent";
import { Metadata } from "next";
import { apiGetPageSeoMeta } from "services/seoMeta";
export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const {
    data: { page },
  } = await apiGetPageSeoMeta("about us");

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

async function About() {
  const breadCrumbs = [
    { name: "home", url: "/" },
    { name: "about us", url: WEB_ROUTES.ABOUT },
  ];
  const {
    data: { page },
  } = await apiGetPageByIdTemplateService("about us");
  const philosophy = page?.content?.find(
    (content: any) => content.name === "philosophy section"
  );
  const story = page?.content?.find(
    (content: any) => content.name === "story section"
  );
  const founders = page?.content?.filter(
    (content: any) => content.name === "About Founder"
  );
  const metaDescription = removeParaTagsFromString(page?.page?.description);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://luxafar.com/about",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "About",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    url: "https://luxafar.com/about",
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
        <div className="flex max-lg:flex-col">
          <div className="w-[50%] order-1 max-lg:order-2 max-lg:w-full">
            <MainHeading
              isHeadingH1={true}
              classes={"max-sm:hidden mb-16 max-lg:mb-5 max-lg:mt-5 "}
            >
              <MainHeadingContent content={philosophy?.title} />
            </MainHeading>

            <div
              data-scroll
              data-scroll-speed=".8"
              data-scroll-direction="vertical"
            >
              <h6 className="font-body text-[24px] max-sm:text-[18px] font-[500] text-secondary-color italic w-[60%] max-lg:w-[80%] my-5 max-lg:my-3">
                {philosophy?.subTitle}
              </h6>
            </div>
            <div
              data-scroll
              data-scroll-speed=".3"
              data-scroll-direction="horizontal"
            >
              <span className="font-body max-sm:text-[13px] opacity-30 text-white uppercase py-5 block max-lg:py-3 max-sm:mb-7 ">
                Erica Jong
              </span>
            </div>
            <Paragraph htmlText={philosophy?.description}></Paragraph>
          </div>

          <Compass />
          <div className="relative w-1/2 max-lg:row-[1] max-lg:w-4/5 mx-auto max-md:w-4/5 max-sm:w-full max-sm:hidden self-baseline order-2">
            <Image
              className="lg:min-w-[120%] lg:relative lg:-left-[20%] lg:-top-[10%] lg:-translate-y-[10%]"
              src={compassCover}
              alt="compass Luxafar"
            />
            <div className="absolute lg:w-[37%] max-lg:w-[32%] top-1/2 left-1/2 max-lg:-translate-x-1/2 max-lg:-translate-y-1/2 lg:-translate-x-[76%] lg:-translate-y-[71%] ">
              <Image
                className="animate-[80s_compassSpin_linear_infinite]"
                src={compass}
                alt="Inner Compass Luxafar"
              />
            </div>
          </div>
        </div>

        <div className="py-10 flex gap-10 max-sm:gap-y-[1.2rem] items-center max-lg:flex-col">
          <div className="w-[45%] max-lg:w-full">
            <div
              data-scroll
              data-scroll-speed=".6"
              data-scroll-direction="vertical"
            >
              <MainHeading classes={"mb-16 max-lg:mb-5 max-sm:!text-[42px]"}>
                <MainHeadingContent content={story?.title} />
              </MainHeading>
            </div>
          </div>
          <div className="w-[50%] max-lg:w-full">
            <Paragraph htmlText={story?.description}></Paragraph>
          </div>
        </div>
        <div className="py-10 max-sm:!pt-0 flex gap-10 max-sm:gap-y-10 items-center max-lg:flex-col">
          <div className="w-[50%] max-lg:w-full order-1 max-lg:order-2">
            <Paragraph htmlText={founders?.[0]?.description}></Paragraph>
          </div>
          <div className="w-[50%] max-lg:w-full order-2 max-lg:order-1">
            <div className="w-[400px] group h-[400px] max-sm:w-4/5  max-sm:h-auto relative  mx-auto bg-primary-color overflow-hidden rounded-[50%] hover:bg-secondary-color ">
              <img
                src={founders?.[0]?.media?.desktopMediaUrl as string}
                alt="Ghazal Sajid"
                className={`${
                  founders?.[0]?.media?.mobileMediaUrl && "max-md:hidden"
                } w-[100%] h-[100%] object-cover rounded-[50%]`}
              />
              {founders?.[0]?.media?.mobileMediaUrl && (
                <img
                  src={founders?.[0]?.media?.mobileMediaUrl as string}
                  alt="Ghazal Sajid"
                  className="w-[100%] h-[100%] md:hidden object-cover rounded-[50%]"
                />
              )}
              <div className="w-full h-full bg-secondary-color bg-opacity-70 absolute top-0 left-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all rounded-[50%]">
                <Link
                  target="_blank"
                  href={"https://www.linkedin.com/in/ghazal-sajid-575a4115/"}
                >
                  <Linkedin className="text-[#fff] w-10 h-10" />
                </Link>
              </div>
            </div>
            <span className="text-center font-body text-secondary-color max-sm:text-[14px] font-[600] block mt-10 max-sm:!mt-5 ">
              GHAZAL SAJID
            </span>
          </div>
        </div>
        <div className="py-10 max-sm:!pt-0 flex gap-10 max-sm:gap-y-10 items-center max-lg:flex-col">
          <div className="w-[50%] max-lg:w-full lg:order-2 max-lg:order-2">
            <Paragraph htmlText={founders?.[1]?.description}></Paragraph>
          </div>
          <div className="w-[50%] max-lg:w-full lg:order-1 max-lg:order-1">
            <div className="w-[400px] group h-[400px] max-sm:w-4/5  max-sm:h-auto relative  mx-auto bg-primary-color overflow-hidden rounded-[50%] hover:bg-secondary-color ">
              <img
                src={founders?.[1]?.media?.desktopMediaUrl as string}
                alt="PRAYAS CHAUDHARY"
                className={`${
                  founders?.[1]?.media?.mobileMediaUrl && "max-md:hidden"
                } w-[100%] h-[100%] object-cover rounded-[50%]`}
              />
              {founders?.[1]?.media?.mobileMediaUrl && (
                <img
                  src={founders?.[1]?.media?.mobileMediaUrl as string}
                  alt="PRAYAS CHAUDHARY"
                  className="w-[100%] h-[100%] md:hidden object-cover rounded-[50%]"
                />
              )}
              <div className="w-full h-full bg-secondary-color bg-opacity-70 absolute top-0 left-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all rounded-[50%]">
                <Link
                  target="_blank"
                  href={
                    "https://www.linkedin.com/in/prayasc?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                  }
                >
                  <Linkedin className="text-[#fff] w-10 h-10" />
                </Link>
              </div>
            </div>
            <span className="text-center font-body text-secondary-color max-sm:text-[14px] font-[600] block mt-10 max-sm:!mt-5 ">
              PRAYAS CHAUDHARY
            </span>
          </div>
        </div>
        <section className="my-16 max-sm:!my-0">
          <PlanContactBanner
            classes="my-10 max-sm:mt-0"
            title={
              <>
                Ready To
                <strong className="inline max-sm:inline text-secondary-color !font-heading sm:ml-1">
                  {" "}
                  Plan Your Tour?
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

export default About;
