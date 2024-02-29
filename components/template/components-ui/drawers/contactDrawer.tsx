import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@template-components/button";
import MainHeading from "@template-components/heading";
import Input from "@template-components/input";
import TextArea from "@template-components/textArea";

import { ChevronLeftIcon } from "lucide-react";
import React, { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useGoogleReCaptcha } from "lib/google-recaptcha";
import { apiPostForms } from "services/forms";
import Success from "@template-components/modals/successDialogue";
import { ContactInput, ContactSchema } from "lib/validations/form.schema";

function ContactDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const methods = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
    mode: "onBlur",
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;
  // if (!pagesWithStickyContactDrawer.includes(pathName)) return "";
  const onSubmitHandler: SubmitHandler<ContactInput> = async (values: any) => {
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
          console.log("form submitted successfully");
          setIsLoading(false);
          setIsOpen(false);
          reset();
          setIsModalOpen(true);
        }
      }
    );
  };

  return (
    <>
      <div
        className={`${
          isOpen ? "w-full z-[99] h-screen absolute top-0 left-0" : ""
        }`}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`fixed top-[50svh] top-[50vh]  translate-y-[-50%]  transition-all duration-300 bg-quaternary-color z-[99] py-8 max-sm:py-7 max-sm:px-5 px-10 w-[400px] max-sm:w-[320px] ${
            isOpen ? "right-[0px] " : "right-[-400px] max-sm:right-[-320px]"
          }`}
        >
          <MainHeading
            classes={
              "!text-[22px] text-secondary-color  text-center !leading-0  mx-auto leading-[1.1] mb-5"
            }
          >
            Ready To <br /> Discover A World of <br /> Unimaginable Luxury
          </MainHeading>
          <div className="relative  mx-auto pb-5 z-20  max-sm:pb-2 ">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <Input
                  name="name"
                  classes={
                    "py-[14px]  px-8 mb-[18px]  max-sm:placeholder:text-center placeholder:opacity-100 max-sm:placeholder:text-[12px] placeholder:text-[12px] bg-quaternary-color !bg-opacity-100 opacity-90 max-sm:py-[10px]"
                  }
                  placeholder="Name"
                />
                <Input
                  name="email"
                  classes={
                    "py-[14px]  px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-[18px] placeholder:opacity-100 max-sm:placeholder:text-[12px] placeholder:text-[12px] bg-quaternary-color !bg-opacity-100 opacity-90 max-sm:py-[10px]"
                  }
                  placeholder="Email Address"
                />
                <Input
                  name="phone"
                  classes={
                    "py-[14px]  px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-[18px] placeholder:opacity-100 max-sm:placeholder:text-[12px] placeholder:text-[12px] bg-quaternary-color !bg-opacity-100 opacity-90 max-sm:py-[10px]"
                  }
                  placeholder="Phone Number"
                />
                <TextArea
                  name="message"
                  rows={10}
                  classes={
                    "py-[14px]  px-8  max-sm:placeholder:text-center mb-[18px] placeholder:opacity-100 max-sm:placeholder:text-[12px] placeholder:text-[12px] bg-quaternary-color !bg-opacity-100 opacity-90 max-sm:py-[10px]"
                  }
                  placeholder="Message"
                />
                <div className="text-center">
                  <Button
                    type="button"
                    buttonType="submit"
                    classes="px-8 py-2  !w-[120px]"
                    text="SEND"
                    isLoading={isLoading}
                  />
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
      <Success
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        message="Our Travel Specialist will get in touch with you shortly."
        title="Thank You"
      />

      <div
        className={`fixed  translate-y-[-50%] top-[50svh] top-[50vh] max-sm:top-[40vh] transition-all  duration-300  bg-secondary-color z-50 px-1 py-5 max-lg:py-4 rounded-tl-2xl rounded-bl-2xl max-lg:rounded-tl-xl max-lg:rounded-bl-xl max-lg:px-[2px] cursor-pointer max-sm:py-3 ${
          isOpen ? "right-[400px] max-sm:right-[320px]" : "right-[0]"
        }`}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <ChevronLeftIcon
          className={`ml-auto text-[#0F4150] h-6 w-6   max-sm:h-5 max-sm:w-5 ${
            isOpen ? "rotate-180" : "rotate-0"
          } `}
        />
      </div>
    </>
  );
}

export default ContactDrawer;
