import Container from "components/template/container";
import React, { useState } from "react";
import ImageThumbnails from "@template-components/imageThumbnails";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";
import TourCardWrapper from "components/template/container/tourCardWrapper";
import MainHeading from "@template-components/heading";
import Paragraph from "@template-components/paragraph";
import Subheading from "@template-components/sub-heading";
import Input from "@template-components/input";
import TextArea from "@template-components/textArea";
import Button from "@template-components/button";
import {
  RadioGroup,
  RadioGroupItem,
} from "components/CMS/components-ui/shadcn/ui/radio-group";
import { Label } from "components/CMS/components-ui/shadcn/ui/label";
import PlanContactBanner from "@template-components/planContactBanner";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import Gallery from "@template-components/gallery";
import PlaceCardWrapper from "components/template/container/placeCardWrapper";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  ContactHomeInput,
  ContactHomeSchema,
} from "lib/validations/form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiPostForms } from "services/forms";
import Success from "@template-components/modals/successDialogue";
import { ContentResponse, InspirationResponse, TourResponse } from "lib/types";
import { WEB_ROUTES, replaceSpacesWithDash } from "lib/utils";
import { useLocomotiveScroll } from "react-locomotive-scroll";
import { useRouter } from "next/navigation";

export default function GetBespokePlane({
  destination,
  places,
  about,
  tours,
  blogs,
  gallery,
}: {
  about?: ContentResponse;
  gallery: any;
  destination?: { name: string; id: string };
  places?: { image: any; title: string; description: string }[];
  blogs?: InspirationResponse[];
  tours?: TourResponse[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const methods = useForm<ContactHomeInput>({
    resolver: zodResolver(ContactHomeSchema),
    mode: "onBlur",
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  const onSubmitHandler: SubmitHandler<ContactHomeInput> = async (
    values: any
  ) => {
    setIsLoading(true);
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    executeRecaptcha("enquiryFormSubmit").then(
      async (gReCaptchaToken: string) => {
        const response = await apiPostForms({ ...values, gReCaptchaToken });
        if (response.status === "success") {
          setIsLoading(false);
          reset();
          setIsModalOpen(true);
        }
      }
    );
  };

  const destinationName =
    destination &&
    destination?.name?.charAt(0).toUpperCase() + destination?.name?.slice(1);
  const { scroll } = useLocomotiveScroll();
  return (
    <Container>
      <section className="my-20 max-md:mt-16">
        <div className="flex gap-20 w-full max-lg:gap-12 max-md:flex-col">
          <div className="w-[45%] max-md:w-full">
            <MainHeading classes={"pb-16 max-md:pb-5"}>
              All About
              <strong className="block text-secondary-color !font-heading is-inview">
                {destination?.name}
              </strong>
            </MainHeading>

            <Paragraph
              htmlText={about?.description}
              classes="md:pb-2"
            ></Paragraph>
            {places?.length ? (
              <ImageThumbnails
                thumbnails={places}
                classes="mt-12 max-md:mt-7"
                destination={destination}
              />
            ) : (
              ""
            )}
          </div>
          <div className="w-[55%] max-md:w-full">
            <Subheading classes="!text-[18px] pb-12 pt-10 !font-body uppercase font-semibold max-md:!text-center max-md:!text-[12px] max-md:!pb-8 max-md:!pt-5">
              Contact Destination Expert
            </Subheading>
            <div className="">
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                  <Input
                    name="name"
                    classes={
                      "py-[20px] px-12 mb-[18px] placeholder:text-white max-sm:py-[14px] max-sm:px-6 max-sm:placeholder:text-center placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-[transparent]  opacity-90"
                    }
                    placeholder="Name"
                  />
                  <Input
                    name="email"
                    classes={
                      "py-[20px] px-12 max-sm:py-[14px] max-sm:px-6 placeholder:text-white max-sm:placeholder:text-center mb-[18px] placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-[transparent] opacity-90"
                    }
                    placeholder="Email Address"
                  />
                  <Input
                    name="subject"
                    classes={
                      "py-[20px] px-12 max-sm:py-[14px] max-sm:px-6 placeholder:text-white max-sm:placeholder:text-center mb-[18px] placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-[transparent] opacity-90"
                    }
                    placeholder="Subject"
                  />
                  <TextArea
                    rows={10}
                    name="message"
                    classes={
                      "py-[20px] px-12 max-sm:py-[14px] max-sm:px-6 placeholder:text-white max-sm:placeholder:text-center mb-2 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-[transparent] opacity-90"
                    }
                    placeholder="Message"
                  />
                  <Paragraph classes="opacity-70 pt-3 font-light max-sm:!text-[12px] !text-[18px] max-md:text-center">
                    Want to receive latest tour updates from us?
                  </Paragraph>
                  <RadioGroup
                    className="flex gap-7 mt-5 mb-10 max-md:justify-center"
                    defaultValue="no"
                  >
                    <div className="flex items-center space-x-3 ">
                      <RadioGroupItem
                        value="yes"
                        id="r2"
                        className="border-secondary-color w-[20px] h-[20px] max-sm:w-[15px] max-sm:h-[15px] border-[2px]"
                      />
                      <Label
                        htmlFor="r2"
                        className="text-[18px] max-sm:text-[14px] opacity-70 font-light"
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="no"
                        id="r3"
                        className="border-secondary-color w-[20px] h-[20px] max-sm:w-[15px] max-sm:h-[15px] border-[2px]"
                      />
                      <Label
                        htmlFor="r3"
                        className="text-[18px] max-sm:text-[14px] opacity-70 font-light"
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                  <div className="max-md:text-center">
                    <Button
                      type="button"
                      buttonType="submit"
                      classes="px-14 max-sm:px-12 !text-[14px] !py-[11px] max-sm:!text-[12px]"
                      text="SEND"
                      isLoading={isLoading}
                    />
                  </div>
                </form>
              </FormProvider>
              <Success
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                message="Our Travel Specialist will get in touch with you shortly."
                title="Thank You"
              />
            </div>
          </div>
        </div>
      </section>
      <div>
        {tours?.length ? (
          <section className="my-20 max-md:mb-10  max-md:mt-0">
            <SectionTitleHeader
              buttonClick={(e: any) => {
                e.preventDefault();
                router.push(
                  `${WEB_ROUTES.DESTINATION}/${replaceSpacesWithDash(
                    destination?.name as string
                  )}?tab=tours`
                );
                const headerHeight =
                  document.getElementsByTagName("header")[0]?.offsetHeight;
                const innerPageBanner = document.getElementById(
                  "innerPageBanner"
                ) as HTMLElement;
                scroll.scrollTo(innerPageBanner?.offsetHeight + headerHeight, {
                  duration: 500,
                  disableLerp: true,
                });
              }}
              classes="mb-20 max-lg:mb-10"
              title={
                <>
                  Browse Our
                  <strong className="block text-secondary-color !font-heading">
                    Tours To {destination?.name}
                  </strong>
                </>
              }
              buttonText="Browse All Tour"
            />
            <TourCardWrapper tours={tours} />
            <div className="md:hidden text-center mt-10">
              <Button
                redirect={`${WEB_ROUTES.DESTINATION}/${replaceSpacesWithDash(
                  destination?.name as string
                )}?tab=tours`}
                classes="!text-[14px] max-sm:mb-0 max-sm:!text-[12px]"
                text="Browse All Tour"
              />
            </div>
          </section>
        ) : (
          ""
        )}
      </div>
      <div>
        {places?.length ? (
          <section className="my-20 max-md:mt-0">
            <SectionTitleHeader
              classes="mb-20 max-lg:mb-10"
              mainHeadingClasses="max-sm:!text-[42px] max-[430px]:!text-[36px] max-[380px]:!text-[30px]"
              title={
                <>
                  Browse
                  <strong className="text-secondary-color !font-heading ml-3">
                    Attractions
                  </strong>
                  <span className="block">
                    For Your
                    <strong className="text-secondary-color !font-heading ml-3">
                      Itinerary
                    </strong>
                  </span>
                </>
              }
              buttonText="see all attractions"
              buttonClick={(e: any) => {
                e.preventDefault();
                router.push(
                  `${WEB_ROUTES.DESTINATION}/${replaceSpacesWithDash(
                    destination?.name as string
                  )}?tab=places-to-visit`
                );
                const headerHeight =
                  document.getElementsByTagName("header")[0]?.offsetHeight;
                const innerPageBanner = document.getElementById(
                  "innerPageBanner"
                ) as HTMLElement;
                scroll.scrollTo(innerPageBanner?.offsetHeight + headerHeight, {
                  duration: 500,
                  disableLerp: true,
                });
              }}
            />
            <PlaceCardWrapper
              destination={destination?.name}
              places={places?.slice(0, 3)}
            />

            <div className="md:hidden text-center mt-10 max-sm:mt-14">
              <Button
                redirect={`${WEB_ROUTES.DESTINATION}/${replaceSpacesWithDash(
                  destination?.name as string
                )}?tab=places-to-visit`}
                classes="!text-[14px] max-sm:!text-[11px]"
                text="see all attractions"
              />
            </div>
          </section>
        ) : (
          ""
        )}
      </div>
      <section className="my-20 max-md:mt-0">
        <PlanContactBanner
          title={
            <>
              Ready To
              <strong className="inline-block max-sm:inline text-secondary-color !font-heading sm:ml-2">
                Plan <br className="sm:hidden" /> Your Tour?
              </strong>
            </>
          }
          description={`Whatever you want from your ${destinationName} Tour,
Our team of expert travel designers are ready to help.`}
          buttonText="get bespoke plan"
          buttonURL={`${WEB_ROUTES.BESPOKE_HOLIDAY}`}
        />
      </section>
      <div>
        {blogs?.length ? (
          <section className="my-20 max-md:mt-0">
            <SectionTitleHeader
              classes=" mb-20 max-lg:mb-10 "
              title={
                <>
                  Articles Related
                  <strong className="block text-secondary-color !font-heading">
                    To {destination?.name}
                  </strong>
                </>
              }
              buttonText={blogs.length > 3 ? "Browse All Inspirations" : ""}
              buttonURL={`${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(
                destination?.name
              )}`}
            />
            <BlogCardWrapper
              showAll={true}
              blogs={blogs?.slice(0, 3)}
              destinationName={destination?.name}
            />
            {blogs.length > 3 && (
              <div className="md:hidden text-center mt-10 max-sm:mt-14">
                <Button
                  redirect={`${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(
                    destination?.name
                  )}`}
                  classes="!text-[14px] max-sm:!text-[11px]"
                  text="see all inspirations"
                />
              </div>
            )}
          </section>
        ) : (
          ""
        )}
      </div>
      <section className="my-20 max-md:mt-0 max-md:mb-0" id="gallery">
        <SectionTitleHeader
          classes="mb-20 max-md:mb-14"
          title={
            <>
              <strong className="inline-block text-secondary-color !font-heading">
                Gallery
              </strong>
            </>
          }
        />
        <Gallery classes="mb-40 max-sm:mb-16" images={gallery} />
      </section>
    </Container>
  );
}
