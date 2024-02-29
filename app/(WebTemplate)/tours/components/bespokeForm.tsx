import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@template-components/button";
import CodeInput from "@template-components/codeInput";
import FormCheckboxMulti from "@template-components/form/formCheckBoxMulti";
import FormRadio from "@template-components/form/formRadio";
import MainHeading from "@template-components/heading";
import Input from "@template-components/input";
import Paragraph from "@template-components/paragraph";
import SelectInput from "@template-components/select";
import { BespokeQuestionResponse } from "lib/types";
import { WEB_ROUTES, cn, countriesCode } from "lib/utils";
import {
  BespokeQuestionInput,
  bespokeQuestionSchema,
} from "lib/validations/bespokeform.schema";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { apiTemplateDestinations } from "services/destination";
import useBespokeStore from "store/useBespoke";

function BespokeForm({
  questions,
  description,
}: {
  questions: BespokeQuestionResponse[];
  description: string;
}) {
  const methods = useForm<BespokeQuestionInput>({
    resolver: zodResolver(bespokeQuestionSchema),
    mode: "onBlur",
  });
  const router = useRouter();
  const bespokeStore = useBespokeStore();
  const { handleSubmit } = methods;
  const [destination, setDestination] = useState<any>([]);
  const [selectedCode, setSelectedCode] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string>();
  const onSubmitHandler: SubmitHandler<any> = async (values: any) => {
    setIsLoading(true);
    const allValues = { selectedCode, selectedDestination, ...values };

    bespokeStore.setBespokeResponse(allValues);
    router.push(WEB_ROUTES.BESPOKE_HOLIDAY);
    setIsLoading(false);
    // const { bespokeFormQuestionAndAnswer, ...rest } = values;
    // const bespokeFormQuestionAndAnswerData = questions.map((ele, index) => ({
    //   questionId: ele.id,
    //   ...bespokeFormQuestionAndAnswer[index],
    // }));
    // let submitDataQuestions = bespokeFormQuestionAndAnswerData.map(
    //   (ele: any) => {
    //     return {
    //       ...ele,
    //       answer: ele?.answer ? ele?.answer.toString() : "",
    //     };
    //   }
    // );
    // if (!executeRecaptcha) {
    //   console.log("Execute recaptcha not yet available");
    //   return;
    // }
    // executeRecaptcha("enquiryFormSubmit").then(
    //   async (gReCaptchaToken: string) => {
    //     try {
    //       const response = await apiBespokeForm({
    //         ...values,
    //         countryCode: selectedCode,
    //         preferredCountry: selectedDestination,
    //         bespokeFormQuestionAndAnswer: submitDataQuestions,
    //         gReCaptchaToken,
    //       });
    //       if (response.status === "success") {
    //         setIsLoading(false);
    //         reset();
    //         setTimeout(() => {
    //           window.open(
    //             "https://calendly.com/bespoke-holidays/",
    //             "_blank",
    //             "noopener,noreferrer"
    //           );
    //         }, 1000);
    //         setIsModalOpen(true);
    //       }
    //     } catch (error) {
    //       setIsLoading(false);
    //     }
    //   }
    // );
  };
  useEffect(() => {
    getDestination();
  }, []);

  const getDestination = async () => {
    const response = await apiTemplateDestinations();
    if (response.status === "success") {
      setDestination(
        response.data.map((ele: any) => ({
          label: ele.name,
          value: ele.name,
        }))
      );
    }
  };
  const questionType: any = {
    "1": "Single Choice",
    "2": "Multiple Choice",
    "3": "Text",
  };
  return (
    <div>
      <div className="flex justify-between max-lg:flex-col mt-20 max-md:mt-12">
        <MainHeading
          isHeadingH1={true}
          classes={
            "mb-8 md:text-[42px] lg:text-[55px] xl:text-[65px] 2xl:text-[74px] w-[40%] max-lg:w-3/5 max-sm:w-full"
          }
        >
          Lets&rsquo;s Plan <br className="max-sm:hidden" /> Your{" "}
          <br className="sm:hidden" />
          <strong className="inline text-secondary-color">Journey</strong>
        </MainHeading>
        <Paragraph
          classes="w-[40%] max-lg:w-4/5 max-sm:w-full"
          htmlText={description}
        ></Paragraph>
      </div>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="flex justify-between gap-x-12  max-lg:flex-col">
              <div className="w-1/2 max-lg:w-full">
                <Input
                  name="name"
                  classes={
                    "py-[15px] px-8 mb-8 max-sm:mb-4 max-sm:py-[18px] max-sm:placeholder:text-center placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                  }
                  placeholder="Name"
                />
                <div className="flex max-lg:gap-x-1 max-sm:gap-x-2 gap-x-6 justify-between mb-1 max-sm:mb-4">
                  <div className="w-1/5 max-lg:w-[22%] max-sm:w-[32%] rounded-md relative border-[#6F6A5A] ">
                    <CodeInput
                      name="countryCode"
                      placeHolder={"Code"}
                      onChange={(value: any) => {
                        setSelectedCode(value.split(" ")?.[0]);
                      }}
                      classes={cn([
                        "py-[15px] px-8 mb-8 max-sm:mb-4 max-sm:py-[18px] max-sm:text-center placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90  max-sm:h-[54px] opacity-90 placeholder:text-[#949393] leading-[1] max-sm:mb-0 [&>.arrowIcon]:!right-[5px] [&>.arrowIcon]:opacity-80",
                      ])}
                      value={selectedCode as string}
                      items={[
                        ...countriesCode.map((item: any, index: any) => ({
                          value: item.code.toString(),
                          label: `${item.code}  ${item.name}`,
                        })),
                      ]}
                    />
                  </div>
                  <div className="w-3/4">
                    <Input
                      name="phoneNumber"
                      classes={
                        "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center  placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                      }
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
                <Input
                  name="tripDays"
                  classes={
                    "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                  }
                  placeholder="Trip Length (Days)"
                />
              </div>
              <div className="w-1/2 max-lg:w-full">
                <Input
                  name="email"
                  classes={
                    "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-8 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                  }
                  placeholder="Email Address"
                />
                <SelectInput
                  wrapperClass="h-auto"
                  name="preferredCountry"
                  placeHolder={"Where would you like to go?"}
                  onChange={(value: any) => setSelectedDestination(value)}
                  classes={cn([
                    "py-[17px] px-8 mb-9 max-sm:mb-4 max-sm:py-[18px] max-sm:text-center placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90 max-sm:h-[54px] opacity-90 placeholder:text-[#949393] leading-[1] max-sm:mb-4 [&>.arrowIcon]:!right-[5px] [&>.arrowIcon]:opacity-80 !h-auto",
                  ])}
                  value={selectedDestination as string}
                  items={[
                    ...destination,
                    { label: "Somewhere Else", value: "somewhere else" },
                  ]}
                />
                {selectedDestination === "somewhere else" && (
                  <Input
                    name="otherCountry"
                    classes={
                      "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90 !h-auto"
                    }
                    placeholder="Please Specify Other Country"
                  />
                )}
              </div>
            </div>
            <div className="flex mt-4 gap-x-12 max-lg:flex-col ">
              {questions?.map((item, index) => {
                return (
                  <div className="mb-10 w-[50%] max-lg:w-full" key={index}>
                    <Paragraph classes="max-sm:text-[12px] max-sm:leading-[1.3] capitalize">
                      {item.question}
                    </Paragraph>
                    {questionType[item.type] === "Single Choice" && (
                      <>
                        <FormRadio
                          classes="flex-row md:flex-nowrap "
                          name={`bespokeFormQuestionAndAnswer.${index}.answer`}
                          options={item.bespokeQuestionOptions?.map(
                            (ele: any) => ({
                              label: ele.label,
                              value: ele.label,
                            })
                          )}
                        />

                        {item.addOtherOption && (
                          <Input
                            name={`bespokeFormQuestionAndAnswer.${index}.additionalText`}
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
                          name={`bespokeFormQuestionAndAnswer.${index}.answer`}
                          options={item.bespokeQuestionOptions?.map(
                            (ele: any) => ({
                              label: ele.label,
                              value: ele.label,
                            })
                          )}
                        />
                        {item.addOtherOption && (
                          <Input
                            name={`bespokeFormQuestionAndAnswer.${index}.additionalText`}
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
                        name={`bespokeFormQuestionAndAnswer.${index}.answer`}
                        classes={
                          "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90 placeholder:capitalize"
                        }
                        placeholder={item.textPlaceholder}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="max-md:text-center">
              <Button
                isLoading={isLoading}
                type="button"
                buttonType="submit"
                classes="px-8 max-sm:px-10 !text-[14px] !py-[10px] max-sm:!text-[12px]"
                text="Proceed to Next"
              />
            </div>
            
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default BespokeForm;
