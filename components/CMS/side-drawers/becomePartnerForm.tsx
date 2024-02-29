import React, { ReactNode, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "components/CMS/components-ui/shadcn/ui/sheet";

import Card from "../components-ui/card";
import CardBody from "../components-ui/cardBody";
import FormTextEditor from "../components-ui/form/formTextEditor";
import { FormProvider, useForm } from "react-hook-form";
import {
  RegisterUserInput,
  RegisterUserSchema,
} from "lib/validations/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../components-ui/form/formInput";
import { BecomePartnerFormResponse } from "lib/types";
import { apiReadBecomePartnerForm } from "services/forms";
import Paragraph from "@template-components/paragraph";

export type ModalType = {
  isOpen: boolean;
  setIsOpen: () => void;
  children?: ReactNode;
  selectedRow: BecomePartnerFormResponse;
  onSuccess: Function;
};
function BecomePartnerDrawer({
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
    const response = await apiReadBecomePartnerForm(selectedRow.id);
    if (response.status === "success") {
      onSuccess(response.data);
    }
  };
  return (
    <FormProvider {...methods}>
      <form>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent className="w-[500px] h-screen overflow-scroll">
            <SheetHeader>
              <SheetDescription>
                <div>
                  <Card className="mb-5 ">
                    <CardBody>
                      <FormInput
                        disabled={true}
                        label={"Your Company / Product Name"}
                        name={"contactingAbout"}
                        value={selectedRow?.contactingAbout}
                      />
                      <FormTextEditor
                        readonly={true}
                        label={"What is Your Product Service"}
                        name={"description"}
                        defaultValue={selectedRow?.description}
                      />
                      <FormInput
                        disabled={true}
                        label={"Web Address (if applicable)"}
                        name={"webAddress"}
                        value={selectedRow?.webAddress}
                      />
                      <FormInput
                        disabled={true}
                        label={"Name"}
                        name={"name"}
                        value={selectedRow?.name}
                      />
                      <FormInput
                        disabled={true}
                        label={"Job Title"}
                        name={"jobTitle"}
                        value={selectedRow?.jobTitle}
                      />
                      <FormInput
                        disabled={true}
                        label={"Email"}
                        name={"email"}
                        value={selectedRow?.email}
                      />
                      <FormInput
                        disabled={true}
                        label={"Phone Number"}
                        name={"phone"}
                        value={selectedRow?.phone}
                      />
                      {selectedRow?.becomePartnerFormQuestionAndAnswer?.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="p-4 mb-4 border border-cms-secondary-color shadow-md rounded-[10px]"
                          >
                            <Paragraph classes="text-[15px] mb-1">
                              {item?.BespokeQuestion?.question}?
                            </Paragraph>
                            <FormInput
                              disabled={true}
                              name={"answer"}
                              value={item?.answer}
                            />
                            {item?.additionalText && (
                              <FormInput
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

export default BecomePartnerDrawer;
