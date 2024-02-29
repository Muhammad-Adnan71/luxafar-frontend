import NameHeading from "@template-components/nameHeading";
import Paragraph from "@template-components/paragraph";
import Container from "components/template/container";
import Image from "next/image";
import React from "react";

const ServiceCard = ({ serviceData }: { serviceData: any }) => {
  return (
    <Container>
      <div className="my-16 max-lg:my-0 max-lg:mb-8 max-md:gap-y-8 flex gap-x-6 max-md:flex-col ">
        {serviceData.map((data: any, index: number) => {
          return (
            <div
              key={index}
              className="w-[32%] max-md:w-full border max-md:border-[2px] border-secondary-color hover:border-[transparent] hover:bg-quaternary-color transition-all duration-300 ease-in-out px-6 py-8 flex gap-x-10 items-centers max-[1170px]:flex-col max-[1170px]:gap-y-5"
            >
              <div className="w-[30%] max-md:w-4/5 max-[1170px]:w-3/5 max-xl:mx-auto">
                <Image
                  className="max-xl:max-w-[90px] max-md:mx-auto max-lg:max-w[80px] max-xl:min-w-[80px] max-lg:min-w-[70px]"
                  src={data.image}
                  alt=""
                />
              </div>
              <div className="w-3/5 max-[1170px]:w-full">
                <NameHeading className="xl:w-4/5 2xl:w-3/5 lg:w-full max-[1170px]:text-center mb-2 text-[13px] leading-[1.4] max-sm:text-[11px] font-[600]">
                  {data.title}
                </NameHeading>
                <Paragraph classes="mb-0 !text-[12px] max-sm:!text-[11px] max-[1170px]:text-center line-clamp-3">
                  {data.description}
                </Paragraph>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default ServiceCard;
