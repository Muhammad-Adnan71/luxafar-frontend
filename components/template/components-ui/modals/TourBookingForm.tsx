import React, { useState } from "react";
import Input from "@template-components/input";
import Paragraph from "@template-components/paragraph";
import Button from "@template-components/button";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import Success from "./successDialogue";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import FormSelect from "@template-components/form/formSelect";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  BookingFormInput,
  BookingFormSchema,
} from "lib/validations/form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiPostForms } from "services/forms";
import { DatePickerWithRange } from "@template-components/form/formDatePicker";
const z = require("zod");

export default function TourBookingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { executeRecaptcha } = useGoogleReCaptcha();
  const methods = useForm<BookingFormInput>({
    resolver: zodResolver(BookingFormSchema),
    mode: "onBlur",
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
  } = methods;
  const onSubmitHandler: SubmitHandler<BookingFormInput> = async (
    values: any
  ) => {
    setIsLoading(true);
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    executeRecaptcha("enquiryFormSubmit").then(
      async (gReCaptchaToken: string) => {
        const { travelingDate, ...rest } = values;
        const response = await apiPostForms({
          ...rest,
          gReCaptchaToken,
          type: "booking",
          travelingStartDate: travelingDate.from,
          travelingEndDate: travelingDate.to,
        });
        if (response.status === "success") {
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
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.DialogTrigger asChild>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(true);
            }}
            type="button"
            buttonType="button"
            classes="xl:text-[11px] w-full max-sm:w-fit !py-4 z-0 after:z-0"
            text="Reserve This Tour"
          />
        </Dialog.DialogTrigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-[black] bg-opacity-[0.447] data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[750px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-primary-color p-[60px] max-sm:p-[30px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none max-sm:overflow-y-auto">
            <button
              className="text-secondary-color hover:bg-quaternary-color focus:shadow-cms-secondary-color absolute top-[25px] right-[25px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_1px] z-[20] focus:outline-none z-[-9]"
              aria-label="Close"
              onClick={() => setIsOpen(false)}
            >
              <Cross1Icon className="w-3 h-3" />
            </button>

            <div className="w-full">
              <Paragraph classes="font-bold text-secondary-color !text-[18px] max-md:text-center pb-5 max-sm:pb-0">
                BOOKING FORM
              </Paragraph>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                  <div className="flex gap-3 max-sm:flex-col max-sm:gap-0">
                    <div className="w-1/2 max-sm:w-full">
                      <Input
                        name="name"
                        classes={
                          "py-[15px] px-8 mb-5 max-sm:mb-4 max-sm:py-[18px] max-sm:placeholder:text-center placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                        }
                        placeholder="First Name"
                      />
                    </div>
                    <div className="w-1/2 max-sm:w-full">
                      <Input
                        name="lastName"
                        classes={
                          "py-[15px] px-8 mb-5 max-sm:mb-4 max-sm:py-[18px] max-sm:placeholder:text-center placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                        }
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                  <Input
                    name="email"
                    classes={
                      "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                    }
                    placeholder="Email Address"
                  />

                  <Input
                    name="phone"
                    classes={
                      "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                    }
                    placeholder="Phone Number"
                  />
                  <div className="flex gap-3 max-sm:flex-col max-sm:gap-0">
                    <div className="w-1/2 max-sm:w-full">
                      <FormSelect
                        name="noOfTravelers"
                        placeHolder="No Of Travelers"
                        options={[
                          { label: "1-5", value: "1-5" },
                          { label: "6-10", value: "6-10" },
                          { label: "More", value: "More" },
                        ]}
                      />
                    </div>
                    <div className="relative  mb-4 w-1/2 max-sm:w-full">
                      <DatePickerWithRange
                        name="travelingDate"
                        placeholder="Select Traveling Dates"
                        errorMessage={errors?.travelingDate?.message}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end items-center mt-3 max-sm:mt-0 max-sm:flex-col max-sm:gap-y-5">
                    <Button
                      isLoading={isLoading}
                      type="button"
                      buttonType="submit"
                      classes="px-8 max-sm:px-10 !text-[14px] !py-[10px] max-sm:!text-[12px]"
                      text="SEND"
                    />
                  </div>
                </form>
              </FormProvider>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Success
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        message="Our Travel Specialist will get in touch with you shortly."
        title="Thank You"
      />
    </>
  );
}
