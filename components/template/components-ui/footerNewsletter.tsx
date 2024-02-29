import React, { useState } from "react";
import Input from "./input";
import TextArea from "./textArea";
import Button from "./button";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FooterSubscribeInput,
  FooterSubscribeSchema,
} from "lib/validations/form.schema";
import Success from "./modals/successDialogue";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { apiPostForms } from "services/forms";
function FooterNewsletter() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const methods = useForm<FooterSubscribeInput>({
    resolver: zodResolver(FooterSubscribeSchema),
    mode: "onBlur",
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmitHandler: SubmitHandler<FooterSubscribeInput> = async (
    values: any
  ) => {
    setIsLoading(true);
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    executeRecaptcha("enquiryFormSubmit").then(
      async (gReCaptchaToken: string) => {
        const response = await apiPostForms({
          ...values,
          gReCaptchaToken,
          type: "newsLetter",
        });
        setIsLoading(false);
        if (response.status === "success") {
          reset();
          setIsModalOpen(true);
        }
      }
    );
  };
  return (
    <>
      {" "}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <Input
            name="name"
            classes={
              "px-2 mb-[18px] rounded-[3px] max-sm:placeholder:text-center max-sm:px-5"
            }
            placeholder="Name"
          />
          <Input
            name="email"
            classes={
              "px-2 mb-[18px] rounded-[3px] max-sm:placeholder:text-center max-sm:px-5"
            }
            placeholder="Email Address"
          />
          <TextArea
            name="message"
            classes={
              "!px-2 mb-5 rounded-[3px] max-sm:placeholder:text-center max-sm:px-5"
            }
            placeholder="Message"
            rows={8}
          />
          <Button
            type="button"
            buttonType="submit"
            classes="!text-[11px]"
            text="SUBSCRIBE"
            isLoading={isLoading}
          />
        </form>
      </FormProvider>
      <Success
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        message="Our Travel Specialist will get in touch with you shortly."
        title="Thank You"
      />
    </>
  );
}

export default FooterNewsletter;
