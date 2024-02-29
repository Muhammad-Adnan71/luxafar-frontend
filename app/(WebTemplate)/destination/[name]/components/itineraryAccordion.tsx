import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/CMS/components-ui/shadcn/ui/accordion";
import Subheading from "@template-components/sub-heading";
import Paragraph from "@template-components/paragraph";
import NameHeading from "@template-components/nameHeading";

const ItineraryAccordion = ({
  tourScheduleData,
  values,
  onAccordion,
}: {
  tourScheduleData: any;
  values: any;
  onAccordion: any;
}) => {
  return (
    <>
      {tourScheduleData.map((data: any, index: number) => {
        const dayNumber =
          index + 1 < 10 ? `0${index + 1}` : (index + 1).toString();
        return (
          <Accordion key={index} type="multiple" value={values}>
            <AccordionItem
              value={index.toString()}
              className="border-none mb-2"
            >
              <AccordionTrigger
                className="bg-quaternary-color px-14 max-md:px-6 py-6 max-md:py-4"
                onClick={() => onAccordion(index.toString())}
              >
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <Subheading classes="mb-0 max-sm:text-[20px] font-[700]">
                      Day {dayNumber}
                    </Subheading>
                    <Paragraph classes="max-md:hidden uppercase pr-[40px] text-[12px] opacity-100 text-right mb-0">
                      {data.place}
                    </Paragraph>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="py-8 px-14 max-md:px-0">
                  <Paragraph classes="md:hidden uppercase inline-block px-[3px] !mb-3 bg-secondary-color text-primary-color !text-[10px] opacity-100">
                    {data.place}
                  </Paragraph>
                  <div className="flex md:items-center md:mb-3 gap-6 max-md:gap-y-0 max-md:flex-col ">
                    <NameHeading className="font-[700] text-[11px] max-md:text-[10px] !mb-0 relative max-md:after:content-none after:absolute after:w-[2px] after:h-[12px] after:top-[3px] after:-right-[12px]  after:bg-secondary-color">
                      Accommodation
                    </NameHeading>
                    <Paragraph classes="uppercase opacity-100  max-md:leading-[0.65rem] max-md:mb-3 !text-[10px] md:mb-0">
                      {data.hotel}
                    </Paragraph>
                  </div>
                  <div>
                    <Paragraph
                      classes="mb-0 opacity-70"
                      htmlText={data.acitvity}
                    ></Paragraph>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </>
  );
};

export default ItineraryAccordion;
