"use client";
import Input from "@template-components/input";
import TextArea from "@template-components/textArea";
import Button from "@template-components/button";

import React, { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Success from "@template-components/modals/successDialogue";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { apiPostForms } from "services/forms";
import {
  ContactPageInput,
  ContactPageSchema,
} from "lib/validations/form.schema";

function Form() {
  const methods = useForm<ContactPageInput>({
    resolver: zodResolver(ContactPageSchema),
    mode: "onBlur",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;
  const onSubmitHandler: SubmitHandler<ContactPageInput> = async (
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
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="">
            <Input
              name="name"
              classes={
                "py-[20px] px-12 mb-5 max-sm:py-[18px] max-sm:placeholder:text-center placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
              }
              placeholder="Name"
            />
            <div className="flex gap-3 max-sm:flex-col max-sm:gap-0">
              <div className="w-1/2 max-sm:w-full">
                <Input
                  name="email"
                  classes={
                    "py-[20px] px-12 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                  }
                  placeholder="Email Address"
                />
              </div>
              <div className="w-1/2 max-sm:w-full">
                <Input
                  name="phone"
                  classes={
                    "py-[20px] px-12 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                  }
                  placeholder="Phone Number"
                />
              </div>
            </div>
            <Input
              name="subject"
              classes={
                "py-[20px] px-12 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
              }
              placeholder="Subject"
            />
            <TextArea
              rows={10}
              name="message"
              classes={
                "py-[20px] px-12 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
              }
              placeholder="Message"
            />

            <div className="max-md:text-center max-sm:mt-6">
              <Button
                isLoading={isLoading}
                type="button"
                buttonType="submit"
                classes="px-14 max-sm:px-12 !text-[14px] !py-[11px] max-sm:!text-[12px]"
                text="SEND"
              />
            </div>
          </div>
          <Success
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            message="Our Travel Specialist will get in touch with you shortly."
            title="Thank You"
          />
        </form>
      </FormProvider>
    </>
  );
}

export default Form;
