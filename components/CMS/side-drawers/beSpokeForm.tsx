import React, { ReactNode, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "components/CMS/components-ui/shadcn/ui/sheet";

import Card from "../components-ui/card";
import CardBody from "../components-ui/cardBody";
import { FormProvider, useForm } from "react-hook-form";
import {
  RegisterUserInput,
  RegisterUserSchema,
} from "lib/validations/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../components-ui/form/formInput";
import { BeSpokeFormResponse } from "lib/types";
import { apiReadBeSpokeForm } from "services/forms";
import Paragraph from "@template-components/paragraph";

export type ModalType = {
  isOpen: boolean;
  setIsOpen: () => void;
  children?: ReactNode;
  selectedRow: BeSpokeFormResponse;
  onSuccess: Function;
};
function BeSpokeDrawer({
  selectedRow,
  isOpen,
  setIsOpen,
  onSuccess,
}: ModalType) {
  const methods = useForm<RegisterUserInput>({
    resolver: zodResolver(RegisterUserSchema),
    mode: "onBlur",
  });
  const { reset } = methods;

  useEffect(() => {
    if (isOpen) {
      changeFormStatus();
    } else {
      reset();
    }
  }, [isOpen]);
  const changeFormStatus = async () => {
    const response = await apiReadBeSpokeForm(selectedRow.id);
    if (response.status === "success") {
      onSuccess(response.data);
    }
  };
  return (
    <FormProvider {...methods}>
      <form>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent className="w-[700px] h-screen overflow-scroll">
            <SheetHeader>
              <SheetDescription>
                <div>
                  <Card className="mb-5 ">
                    <CardBody>
                      <FormInput
                        disabled={true}
                        label={"Name"}
                        name={"name"}
                        value={selectedRow?.name}
                      />
                      <FormInput
                        disabled={true}
                        label={"Email"}
                        name={"email"}
                        value={selectedRow?.email}
                      />
                      <FormInput
                        disabled={true}
                        label={"Phone"}
                        name={"phoneNumber"}
                        value={
                          selectedRow?.phoneNumber
                            ? selectedRow?.countryCode +
                              selectedRow?.phoneNumber
                            : ""
                        }
                      />
                      {selectedRow?.preferredCountry && (
                        <FormInput
                          disabled={true}
                          label={"where would you like to go"}
                          name={"preferredCountry"}
                          value={selectedRow?.preferredCountry}
                        />
                      )}
                      {selectedRow?.otherCountry && (
                        <FormInput
                          disabled={true}
                          label={"Other Country"}
                          name={"otherCountry"}
                          value={selectedRow?.otherCountry}
                        />
                      )}
                      <FormInput
                        disabled={true}
                        label={"Days"}
                        name={"tripDays"}
                        value={selectedRow?.tripDays}
                      />
                      {selectedRow?.bespokeFormQuestionAndAnswer?.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="p-4 mb-4 border border-cms-secondary-color shadow-md rounded-[10px]"
                          >
                            <Paragraph classes="text-[15px] mb-1">
                              {item?.BespokeQuestion?.question}?
                            </Paragraph>
                            <FormInput
                              type={
                                item?.answer.length > 100 ? "textarea" : "text"
                              }
                              disabled={true}
                              name={"answer"}
                              value={item?.answer}
                            />
                            {item?.additionalText && (
                              <FormInput
                                type="textarea"
                                disabled={true}
                                label={"Additional Text"}
                                name={"answer"}
                                value={item?.additionalText}
                              />
                            )}
                          </div>
                        )
                      )}
                    </CardBody>
                  </Card>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </form>
    </FormProvider>
  );
}

export default BeSpokeDrawer;
