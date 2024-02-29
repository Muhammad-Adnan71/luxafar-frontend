"use client";
import React, { useState } from "react";
import Main from "../container";
import Image from "next/image";
import plane from "../../../public/template/luxafarlogo.png";
import logoMobile from "../../../public/template/mobile_footer-logo.png";
import Paragraph from "./paragraph";
import facebook from "../../../public/template/facebook.png";
import instagram from "../../../public/template/instagram.png";
import Subheading from "./sub-heading";
import CustomLink from "./link";

import Link from "next/link";
import { WEB_ROUTES, inspirationUrl } from "lib/utils";

import { ConfigurationResponse, InspirationResponse } from "lib/types";
import { format } from "date-fns";
import { HoverCard } from "@radix-ui/react-hover-card";
import {
  HoverCardContent,
  HoverCardTrigger,
} from "components/CMS/components-ui/shadcn/ui/hover-card";
import FooterNewsletter from "./footerNewsletter";

const Footer = ({
  configuration,
  inspirations,
}: {
  configuration: ConfigurationResponse;
  inspirations: InspirationResponse[];
}) => {
  return (
    <Main>
      <div className="relative pt-24 pb-16 border-t-[1px] border-b-[1px] border-secondary-color border-opacity-40 max-sm:pt-14">
        <div className="absolute  left-1/2 top-[-70.8px] -translate-x-[50%] max-md:top-[-50px] max-sm:top-[-40px]">
          <Image
            src={plane}
            className="w-[140px] max-md:w-[100px] max-sm:w-[80px]"
            alt="Luxafar Plane Logo"
          />
        </div>
        <div className="grid grid-cols-[2fr_2.5fr_2.5fr_2fr] max-xl:grid-cols-3 gap-10 max-[900px]:grid-cols-1 max-sm:gap-2 max-lg:gap-5">
          <div className="max-sm:mb-10">
            <div className=" mb-12 max-w-[200px] max-[900px]:mb-6 max-sm:mx-auto ">
              <Link href="/">
                <img
                  src={configuration?.media?.desktopMediaUrl as string}
                  alt="Luxafar Logo"
                  className="max-sm:hidden"
                />
                <Image
                  src={logoMobile}
                  className="hidden max-sm:block w-[150px] mx-auto"
                  alt="Luxafar Logo"
                />
              </Link>
            </div>
            <div>
              <div className="mb-8 max-[900px]:mb-5 max-sm:text-center">
                <Paragraph
                  classes={"!text-[12px]"}
                  htmlText={configuration?.siteDescription}
                ></Paragraph>
              </div>
              <div className="mb-12 max-sm:text-center">
                <Paragraph
                  classes={"!text-[12px] max-sm:w-[70%] max-sm:mx-auto"}
                >
                  {configuration?.address}
                </Paragraph>
                <Paragraph classes={"!text-[12px]"}>
                  Email: {configuration?.email}
                </Paragraph>
                {/* <Paragraph classes={"!text-[12px] mb-0"}>
                  Mobile No: {configuration?.phone}
                </Paragraph> */}
                <Link
                  target="_blank"
                  href={`https://wa.me/${configuration?.whatsappNumber?.replace(
                    "+",
                    ""
                  )}`}
                >
                  <Paragraph
                    classes={
                      "!text-[12px] hover:text-secondary-color transition-all "
                    }
                  >
                    WhatsApp No: {configuration?.whatsappNumber}
                  </Paragraph>
                </Link>
              </div>
              <div className="flex w-1/2 justify-between max-sm:mx-auto max-sm:w-2/5">
                <div className="group  relative ">
                  <a href={configuration?.facebookUrl} target="_blank">
                    <Image
                      src={facebook}
                      alt="Luxafar Facebook "
                      className="group-hover:translate-y-[-10px] transition-all max-sm:w-3"
                    />
                    <span className="text-body absolute text-white text-sm opacity-0 group-hover:opacity-60 left-0 -translate-x-[35%] transition-all">
                      Facebook
                    </span>
                  </a>
                </div>
                <div className="group  relative ">
                  <a href={configuration?.facebookUrl} target="_blank">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 512 512"
                      className="group-hover:translate-y-[-5px] transition-all text-[26px] max-sm:text-[20px] fill-secondary-color"
                    >
                      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                    </svg>
                    <span className="text-body absolute text-white text-sm opacity-0 group-hover:opacity-60 left-0 -translate-x-[35%] transition-all">
                      Twitter
                    </span>
                  </a>
                </div>
                <div className="group  relative">
                  <a href={configuration?.instagramUrl} target="_blank">
                    <Image
                      src={instagram}
                      alt="Luxafar instagram "
                      className="group-hover:translate-y-[-10px] transition-all max-sm:w-5"
                    />
                    <span className="text-body absolute text-white text-sm opacity-0 group-hover:opacity-60 left-0 -translate-x-[35%] transition-all">
                      Instagram
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="max-xl:hidden">
            <div className="mb-16 mt-6">
              <Subheading classes={"text-[22px] font-medium"}>blogs</Subheading>
            </div>
            {inspirations?.map((item: any, index: number) => (
              <div key={index}>
                <Link
                  href={inspirationUrl(item)}
                  // href={`${WEB_ROUTES.INSPIRATIONS}/${item?.id}`}
                >
                  <Paragraph
                    classes={
                      "!text-[12px] line-clamp-2 !opacity-100 text-[13px] font-semibold !mb-5 "
                    }
                  >
                    {item?.title}
                  </Paragraph>
                </Link>
                <Paragraph classes={"!mb-5 !text-[12px]"}>
                  {format(new Date(item.createdAt), "dd MMMM yyyy")}
                </Paragraph>
              </div>
            ))}
          </div>
          <div className="max-sm:mx-auto max-sm:text-center">
            <div className="mb-16 mt-6 relative">
              <Subheading
                classes={
                  "text-[22px] font-medium after:content-[''] after:absolute after:-bottom-[25px] max-sm:after:-bottom-[15px] after:left-0 max-sm:after:left-1/2 after:w-[40px] max-sm:after:w-[25px] after:h-[3px] max-sm:after:h-[2px]  max-sm:after:-translate-x-[35%] after:bg-secondary-color"
                }
              >
                Links
              </Subheading>
            </div>
            <div>
              <ul className="flex justify-between gap-x-3 max-sm:block max-[900px]:justify-start max-[900px]:gap-x-20 ">
                <li>
                  <div className="mb-6 max-sm:mb-5 text-[14px] font-medium ">
                    <CustomLink
                      classes="no-underline text-[11px] capitalize "
                      text="About Us"
                      redirect={WEB_ROUTES.ABOUT}
                    />
                  </div>
                  <div className="mb-6 max-sm:mb-5 text-[14px] font-medium">
                    <CustomLink
                      classes="no-underline text-[11px] capitalize"
                      text="Holiday Types"
                      redirect={WEB_ROUTES.HOLIDAY_TYPES}
                    />
                  </div>
                  <div className="mb-6 max-sm:mb-5 text-[14px] font-medium">
                    <CustomLink
                      classes="no-underline text-[11px] capitalize"
                      text="Inspirations"
                      redirect={WEB_ROUTES.INSPIRATIONS}
                    />
                  </div>
                  <div className="mb-6 max-sm:mb-5 text-[14px] font-medium">
                    <HoverCard openDelay={100}>
                      <HoverCardTrigger>
                        <span className="font-body text-[12px] text-secondary-color">
                          Shop
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent
                        align="center"
                        className="px-3 py-2 text-[8px]  w-fit bg-cms-primary-color border-cms-fourth-color text-white font-body dark:bg-gray-800 dark:border-gray-900"
                      >
                        Coming soon
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <div className="mb-6 max-sm:mb-5 text-[14px] font-medium">
                    <CustomLink
                      classes="no-underline text-[11px] capitalize"
                      text="Contact"
                      redirect={WEB_ROUTES.CONTACT}
                    />
                  </div>
                </li>
                <li>
                  <div className="mb-6 max-sm:mb-5 text-[14px] font-medium">
                    <CustomLink
                      classes="no-underline text-[11px] capitalize"
                      text="Privacy Policy"
                      redirect={WEB_ROUTES.PRIVACY_POLICY}
                    />
                  </div>
                  <div className="mb-6 max-sm:mb-5 text-[14px] font-medium">
                    <CustomLink
                      classes="no-underline text-[11px] capitalize"
                      text="Cookie Policy"
                      redirect={WEB_ROUTES.COOKIE_POLICY}
                    />
                  </div>
                  <div className="mb-6 max-sm:mb-5 text-[14px] font-medium">
                    <CustomLink
                      classes="no-underline text-[11px] capitalize"
                      text="Term & Conditions"
                      redirect={WEB_ROUTES.TERMS_AND_CONDITIONS}
                    />
                  </div>
                  {/* <div className="mb-6 max-sm:mb-5 text-[14px] font-medium">
                    <CustomLink
                      classes="no-underline text-[11px] capitalize"
                      text="Useful Info"
                      redirect={WEB_ROUTES.USEFUL_INFORMATION}
                    />
                  </div> */}
                  <div className="mb-6 max-sm:mb-5 text-[14px] font-medium">
                    <CustomLink
                      classes="no-underline text-[11px] capitalize"
                      text="Become A Partner"
                      redirect={WEB_ROUTES.BECOME_A_PARTNER}
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="max-sm:mx-auto max-sm:text-center max-sm:w-full">
            <div className="mb-16 mt-6 relative">
              <Subheading
                classes={
                  "text-[22px] font-medium after:content-[''] after:absolute after:-bottom-[25px] max-sm:after:-bottom-[15px] after:left-0 max-sm:after:left-1/2 after:w-[40px] max-sm:after:w-[25px] after:h-[3px] max-sm:after:h-[2px]  max-sm:after:-translate-x-[35%] after:bg-secondary-color"
                }
              >
                Subscribe
              </Subheading>
            </div>
            <div>
              <FooterNewsletter />
            </div>
          </div>
        </div>
      </div>
      <div className="py-10 mx-auto max-sm:py-8">
        <Paragraph
          classes={
            "!mb-0 !text-[11px] max-sm:text-center max-sm:w-[100%] max-sm:mx-auto max-sm:text-[12px]"
          }
        >
          © {new Date().getFullYear()} LUXAFAR. Powered By &nbsp;
          <Link
            className="text-secondary-color !opacity-100 font-extrabold !text-[12x] max-sm:block max-sm:-mt-1"
            href="https://ideabox.technology"
            target="_blank"
          >
            IDEABOX
          </Link>
        </Paragraph>
      </div>
    </Main>
  );
};

export default Footer;
