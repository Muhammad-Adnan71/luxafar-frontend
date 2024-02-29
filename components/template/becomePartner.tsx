"use client";
import React, { useMemo, useState } from "react";
import Container from "./container";
import MainHeading from "@template-components/heading";
import Paragraph from "@template-components/paragraph";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@template-components/input";
import Breadcrumbs from "@template-components/breadcrumbs";
import { WEB_ROUTES } from "lib/utils";
import Button from "@template-components/button";
import TextArea from "@template-components/textArea";
import Success from "../template/components-ui/modals/successDialogue";
import { useGoogleReCaptcha } from "lib/google-recaptcha";
import {
  BecomePartnerInput,
  BecomePartnerSchema,
} from "lib/validations/form.schema";
import { apiPostBecomePartnerForms } from "services/forms";
import FormRadio from "@template-components/form/formRadio";
import { BespokeQuestionResponse } from "lib/types";
import FormCheckboxMulti from "@template-components/form/formCheckBoxMulti";

const BecomePartnerForm = ({
  questions,
}: {
  questions: BespokeQuestionResponse[];
}) => {
  const breadCrumbs = [
    { name: "home", url: "/" },
    { name: "Become a partner", url: WEB_ROUTES.BECOME_A_PARTNER },
  ];
  const questionType: any = {
    "1": "Single Choice",
    "2": "Multiple Choice",
    "3": "Text",
  };
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const methods = useForm<BecomePartnerInput>({
    // resolver: zodResolver(BecomePartnerSchema),
    mode: "onBlur",
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;
  const onSubmitHandler: SubmitHandler<any> = async (values: any) => {
    setIsLoading(true);
    const { becomePartnerFormQuestionAndAnswer, ...rest } = values;
    const becomePartnerFormQuestionAndAnswerData = questions.map(
      (ele, index) => ({
        questionId: ele.id,
        ...becomePartnerFormQuestionAndAnswer[index],
      })
    );

    let submitDataQuestions = becomePartnerFormQuestionAndAnswerData.map(
      (ele: any) => {
        return {
          ...ele,
          answer: ele?.answer ? ele?.answer.toString() : "",
        };
      }
    );

    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    executeRecaptcha("enquiryFormSubmit").then(
      async (gReCaptchaToken: string) => {
        const response = await apiPostBecomePartnerForms({
          ...values,
          becomePartnerFormQuestionAndAnswer: submitDataQuestions,
          gReCaptchaToken,
        });
        if (response.status === "success") {
          setIsLoading(false);
          setIsModalOpen(true);
          reset();
        }
      }
    );
  };

  return (
    <div>
      <Container>
        <div className="flex max-md:flex-col max-lg:gap-x-8 max-md:gap-y-6 justify-between gap-x-14 mb-20">
          <div className="w-2/5 max-md:w-full">
            <Breadcrumbs
              breadcrumbs={breadCrumbs}
              classes="mb-10 max-sm:hidden"
            />
            <MainHeading
              classes={"mb-8 md:text-[42px] lg:text-[55px] xl:text-[65px]"}
            >
              Would You <br /> Like to{" "}
              <strong className="inline text-secondary-color">Work</strong>
              <br />
              <strong className="inline text-secondary-color">with us?</strong>
            </MainHeading>
            <Paragraph>
              If you have a product or service you think we would be interested
              in, we would love to hear from you. Please complete the contact
              form below, so we can direct your enquiry to the relevant team.{" "}
              <br />
              <br /> If the opportunity is of interest a member of the team will
              be in touch. We kindly ask that you wait to hear from us.
            </Paragraph>
          </div>
          <div className="w-[50%] max-md:w-full mb-20">
            <Paragraph>What are you contacting us about?</Paragraph>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <div>
                  <Input
                    name="contactingAbout"
                    classes={
                      "py-[15px] px-8 mb-5 max-sm:mb-4 max-sm:py-[18px] max-sm:placeholder:text-center placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                    }
                    placeholder="Your Company / Product Name"
                  />
                  <TextArea
                    rows={8}
                    name="description"
                    classes={
                      "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                    }
                    placeholder="What is your product or service?"
                  />
                  <Input
                    name="webAddress"
                    classes={
                      "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                    }
                    placeholder="Website address (if applicable)"
                  />
                  <div className="mb-14 mt-10">
                    <>
                      {questions.map((item, index) => {
                        return (
                          <div className="mb-10" key={index}>
                            <Paragraph classes="max-sm:text-[12px] max-sm:leading-[1.3] capitalize">
                              {item.question}
                            </Paragraph>
                            {questionType[item.type] === "Single Choice" && (
                              <>
                                <FormRadio
                                  name={`becomePartnerFormQuestionAndAnswer.${index}.answer`}
                                  options={item.bespokeQuestionOptions.map(
                                    (ele: any) => ({
                                      label: ele.label,
                                      value: ele.label,
                                    })
                                  )}
                                />

                                {item.addOtherOption && (
                                  <Input
                                    name={`becomePartnerFormQuestionAndAnswer.${index}.additionalText`}
                                    classes={
                                      "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90 placeholder:capitalize"
                                    }
                                    placeholder={item.textPlaceholder}
                                  />
                                )}
                              </>
                            )}
                            {questionType[item.type] === "Multiple Choice" && (
                              <>
                                <FormCheckboxMulti
                                  name={`becomePartnerFormQuestionAndAnswer.${index}.answer`}
                                  options={item.bespokeQuestionOptions.map(
                                    (ele: any) => ({
                                      label: ele.label,
                                      value: ele.label,
                                    })
                                  )}
                                />
                                {item.addOtherOption && (
                                  <Input
                                    name={`becomePartnerFormQuestionAndAnswer.${index}.additionalText`}
                                    classes={
                                      "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90 placeholder:capitalize"
                                    }
                                    placeholder={item.textPlaceholder}
                                  />
                                )}
                              </>
                            )}
                            {questionType[item.type] === "Text" && (
                              <Input
                                name={`becomePartnerFormQuestionAndAnswer.${index}.answer`}
                                classes={
                                  "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90 placeholder:capitalize"
                                }
                                placeholder={item.textPlaceholder}
                              />
                            )}
                          </div>
                        );
                      })}
                    </>
                  </div>
                  <div className="mb-10">
                    <Paragraph>Your Contact Details</Paragraph>
                    <Input
                      name="name"
                      classes={
                        "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                      }
                      placeholder="Your name"
                    />
                    <Input
                      name="jobTitle"
                      classes={
                        "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                      }
                      placeholder="Job Title"
                    />
                    <Input
                      name="email"
                      classes={
                        "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                      }
                      placeholder="Contact Email"
                    />
                    <Input
                      name="phone"
                      classes={
                        "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                      }
                      placeholder="Contact Telephone Number"
                    />
                  </div>
                </div>
                <div className="max-md:text-center">
                  <Button
                    isLoading={isLoading}
                    type="button"
                    buttonType="submit"
                    classes="px-8 max-sm:px-10 !text-[14px] !py-[10px] max-sm:!text-[12px]"
                    text="submit"
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
      </Container>
    </div>
  );
};

export default BecomePartnerForm;
