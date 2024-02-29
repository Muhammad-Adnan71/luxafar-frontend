/* eslint-disable @next/next/no-img-element */
"use client";
import ImageWithLoader from "@template-components/ImageWithLoader";
import Breadcrumbs from "@template-components/breadcrumbs";
import Button from "@template-components/button";
import MainHeading from "@template-components/heading";
import Paragraph from "@template-components/paragraph";
import SectionHeading from "@template-components/sectionHeading";
import Main from "components/CMS/containers/main";
import Container from "components/template/container";
import toursBg from "@public/template/tours-bg.png";
import toursCloud from "@public/template/tour-cloud.png";
import toursCompass from "@public/template/tours-compass.png";
import toursCompassFull from "@public/template/tours-compass-1.png";
import suitCase from "@public/template/suitcase.png";
import cloud2 from "@public/template/cloud3.png";
import birds from "@public/template/birds.gif";
import React, {
  ReactNode,
  MouseEventHandler,
  useState,
  useEffect,
} from "react";
import Image from "next/image";

function ToursBanner({
  mainHeading,
  description,
  buttonText,
  buttonLink,
  detailPage,
  breadcrumbs,
  altText,
  onButtonClick,
  bannerVideo1,
  bannerVideo2,
}: {
  altText?: string;
  mainHeading: string | ReactNode;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  detailPage?: boolean;
  breadcrumbs?: any;
  onButtonClick?: MouseEventHandler<HTMLAnchorElement>;
  bannerVideo1: string;
  bannerVideo2: string;
}) {
  const breadcrumbsDefault = [
    { name: "home", url: "" },
    { name: mainHeading as string, url: "" },
  ];
  const [isVisible, setIsVisible] = useState<boolean>(true);

  return (
    <div className="" id="innerPageBanner">
      <div className="relative max-2xl:h-[calc(100vh_-_110px)]  2xl:h-[calc(100vh_-_147px)] max-md:h-[calc(100vh_-_140px)]  -top-[40px] max-md:min-h-[500px]">
        <div className=" w-full h-full bg-[linear-gradient(0deg,rgba(9,39,48,1)_50%,rgba(253,187,45,0)_100%)] opacity-60 ">
          <Image
            src={toursBg}
            alt="tour banner image"
            className="w-full h-full object-cover max-md:object-right-top mix-blend-luminosity"
          />
        </div>

        <Image
          src={cloud2}
          alt="tour banner image"
          className="absolute top-[10%] hidden max-md:block  z-20"
        />
        <Image
          src={birds}
          alt="tour banner image"
          className="absolute max-sm:top-[40%] max-sm:w-[35%] sm:w-[15%] sm:top-[-15%]  right-0  invert z-20 max-sm:animate-[25s_bird_linear_infinite] sm:animate-[25s_birdWeb_linear_infinite]"
        />
        <Image
          src={birds}
          alt="tour banner image"
          className="absolute max-sm:top-[43%] max-sm:w-[40%] sm:w-[17%]  sm:top-[-15%] right-[10px]  invert z-20 max-sm:animate-[25s_bird_linear_infinite] sm:animate-[25s_birdWeb_linear_infinite]"
        />
        <Image
          data-scroll
          data-scroll-speed="0.4"
          data-scroll-direction="horizontal"
          src={toursCloud}
          alt="tour banner image"
          className="absolute top-0 max-md:hidden left-0 w-full h-full object-cover z-20"
        />
        <div className="absolute md:w-3/5 w-[80%] max-sm:min-w-[500px] max-md:-bottom-[120px] max-md:-left-[18%] max-sm:-left-[90px] md:-left-[11%] 2xl:-left-[155px] 2xl:max-w-[864px] -bottom-[32%] max-lg:-bottom-[23%] 2xl:-bottom-[192px]">
          <Image
            src={suitCase}
            alt="Tours SuitCase"
            className="relative z-30 w-full "
          />
          <video
            className="absolute 2xl:top-[38px] top-[5.5%] left-0 w-[65%] z-20 skew-y-[3deg] h-[45%] object-cover"
            loop
            autoPlay={true}
            muted
            preload="none"
            id="videoLoad"
            playsInline={true}
          >
            <source src={bannerVideo1} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div
          onMouseEnter={() => setIsVisible(false)}
          className="absolute -top-[80px] max-md:hidden  max-lg:-top-[35px] w-2/5 -right-[13%] 2xl:max-w-[576px] 2xl:-right-[190px] group transition-all duration-300 ease-in-out"
        >
          <Image
            src={toursCompass}
            alt="Tours Banner Compass"
            className={`relative z-[30] w-full ml-auto  ${
              isVisible ? "invisible opacity-0" : "visible opacity-100"
            } transition-all duration-600 ease-linear`}
          />
          <Image
            src={toursCompassFull}
            alt="Tours Banner Compass"
            className={`absolute top-0 right-0 z-[30] w-full ml-auto opacity-100 visible ${
              isVisible ? "visible opacity-100" : "invisible opacity-0"
            } group-hover:hidden transition-all duration-600 ease-linear`}
          />
          <video
            className={`absolute top-[24.5%]  ${
              isVisible ? "invisible opacity-0" : "visible opacity-100"
            } right-[19%] 2xl:top-[150px] 2xl:right-[113px]  z-20 w-[68.5%] h-[64%] object-cover rounded-full transition-all duration-600 ease-linear`}
            loop
            autoPlay={true}
            muted
            preload="none"
            id="videoLoad"
            playsInline={true}
          >
            <source src={bannerVideo2} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <Container classes="absolute top-[30px] max-md:hidden left-[50%] translate-x-[-50%] z-20">
          <Breadcrumbs
            breadcrumbs={breadcrumbs?.length ? breadcrumbs : breadcrumbsDefault}
            classes="mb-10"
          />
        </Container>
        <Container classes="absolute  max-w-[490px] max-lg:max-w-[440px] text-center mx-auto top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%]  z-40">
          <div>
            <SectionHeading classes={"font-[700] "}>
              {mainHeading}
            </SectionHeading>
            {description && (
              <Paragraph
                htmlText={description}
                classes="max-w-[600px] opacity-100 mb-10 mt-6 max-md:hidden"
              ></Paragraph>
            )}
            {buttonText && (
              <Button
                text={buttonText}
                redirect={buttonLink}
                onClick={onButtonClick}
                classes={`${
                  detailPage && "hidden"
                } px-5 mx-auto max-md:hidden `}
              />
            )}
          </div>
        </Container>
      </div>
      <Container classes="md:hidden mb-20">
        <div>
          {description && (
            <Paragraph
              htmlText={description}
              classes=" opacity-100 mb-6 mt-10"
            ></Paragraph>
          )}
          {buttonText && (
            <Button
              text={buttonText}
              redirect={buttonLink}
              onClick={onButtonClick}
              classes={`${detailPage && "hidden"} px-5  `}
            />
          )}
        </div>
      </Container>
    </div>
  );
}

export default ToursBanner;
