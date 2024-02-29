"use client";
import React, { useState } from "react";
import Main from "../container";
import SideHeading from "./side-heading";
import MainHeading from "./heading";
import Input from "./input";
import TextArea from "./textArea";
import Button from "./button";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useGoogleReCaptcha } from "lib/google-recaptcha";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiPostForms } from "services/forms";
import Success from "./modals/successDialogue";
import {
  ContactHomeInput,
  ContactHomeSchema,
} from "lib/validations/form.schema";
import { ContentResponse } from "lib/types";
import MainHeadingContent from "./mainHeadingContent";

export const ContactForm = ({
  data,
}: {
  data: ContentResponse | undefined;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
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
        console.log(gReCaptchaToken, "response Google reCaptcha server");
        const response = await apiPostForms({ ...values, gReCaptchaToken });
        if (response.status === "success") {
          setIsLoading(false);
          reset();
          setIsModalOpen(true);
        }
      }
    );
  };

  return (
    <Main>
      <div className="py-40 max-lg:py-40 max-md:py-20 max-sm:py-10 max-sm:!pb-28">
        <div className="text-center pb-16">
          <div
            data-scroll
            data-scroll-speed="0.3"
            data-scroll-direction="horizontal"
            className="pb-6 max-sm:pb-3"
          >
            <SideHeading isRotate={false}>{data?.subTitle}</SideHeading>
          </div>
          <MainHeading
            classes={"!text-[50px] max-[400px]:!text-[42px] 2xl:!text-[60px]"}
          >
            <div
              data-scroll
              data-scroll-speed="0.4"
              data-scroll-direction="vertical"
            >
              <MainHeadingContent content={data?.title} />
            </div>
          </MainHeading>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="relative w-[60%] mx-auto pb-10 z-20 max-lg:w-4/5 max-sm:w-full max-sm:pb-6 ">
              <Input
                name="name"
                classes={
                  "py-[20px] px-12 mb-[18px] max-sm:py-[18px] max-sm:placeholder:text-center placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-[#092730] !bg-opacity-100 opacity-90 max-sm:px-5"
                }
                placeholder="Name"
              />
              <Input
                name="email"
                classes={
                  "py-[20px] px-12 max-sm:py-[18px] max-sm:placeholder:text-center mb-[18px] placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-[#092730] !bg-opacity-100 opacity-90 max-sm:px-5"
                }
                placeholder="Email Address"
              />
              <Input
                name="subject"
                classes={
                  "py-[20px] px-12 max-sm:py-[18px] max-sm:placeholder:text-center mb-[18px] placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-[#092730] !bg-opacity-100 opacity-90 max-sm:px-5"
                }
                placeholder="Subject"
              />
              <TextArea
                name="message"
                rows={10}
                classes={
                  "py-[20px] px-12 max-sm:py-[18px] max-sm:placeholder:text-center mb-3 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-[#092730] !bg-opacity-100 opacity-90 max-sm:px-5"
                }
                placeholder="Message"
              />
              <div
                data-scroll
                data-scroll-speed="1.4"
                data-scroll-direction="vertical"
                className="absolute bottom-[20%] -right-[20%] -z-[1] 2xl:-right-[18%] 2xl:bottom-[15%]"
              >
                {/* <Image
              className="w-[250px] animate-[0.7s_zoomIn_1.5s_ease-in-out_forwards,wiggle_3s_ease-in-out_infinite] 2xl:max-w-[300px]  max-sm:w-[200px]"
              src={clubs}
              alt="Clubs Object"
            /> */}
              </div>
            </div>
            <div className="text-center">
              <Button
                isLoading={isLoading}
                type="button"
                buttonType="submit"
                classes="px-12 max-sm:px-16 !w-[150px]"
                text="SEND"
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
    </Main>
  );
};

export default ContactForm;
