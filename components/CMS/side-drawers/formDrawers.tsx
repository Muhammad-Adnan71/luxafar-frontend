import React, { ReactNode, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "components/CMS/components-ui/shadcn/ui/sheet";

import Card from "../components-ui/card";
import CardBody from "../components-ui/cardBody";
import FormTextEditor from "../components-ui/form/formTextEditor";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  RegisterUserInput,
  RegisterUserSchema,
} from "lib/validations/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../components-ui/form/formInput";
import { FormResponse } from "lib/types";
import { apiReadForm } from "services/forms";

export type ModalType = {
  isOpen: boolean;
  setIsOpen: () => void;
  children?: ReactNode;
  selectedRow: FormResponse;
  onSuccess: Function;
};
function FormDataDrawer({
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
  const FormType = {
    contact: <Contact selectedRow={selectedRow} />,
    bespokePlan: <Contact selectedRow={selectedRow} />,
    booking: <BookingForm selectedRow={selectedRow} />,
    newsLetter: <NewsLetter selectedRow={selectedRow} />,
  };
  useEffect(() => {
    if (isOpen) {
      changeFormStatus();
    } else {
      reset();
    }
  }, [isOpen]);
  const changeFormStatus = async () => {
    const response = await apiReadForm(selectedRow.id);
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
              <SheetTitle className="ml-1 capitalize">
                {selectedRow?.type}
              </SheetTitle>
              <SheetDescription>
                <div>
                  <Card className="mb-5 ">
                    <CardBody>{FormType[selectedRow?.type]}</CardBody>
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

const Contact = ({ selectedRow }: { selectedRow: FormResponse }) => {
  return (
    <>
      <FormInput
        disabled={true}
        label={"Name"}
        name={"name"}
        value={selectedRow.name}
      />
      <FormInput
        disabled={true}
        label={"Email"}
        name={"email"}
        value={selectedRow.email}
      />
      {selectedRow.phone && (
        <FormInput
          disabled={true}
          label={"Phone Number"}
          name={"phone"}
          value={selectedRow.phone}
        />
      )}
      {selectedRow.subject && (
        <FormInput
          disabled={true}
          label={"Subject"}
          name={"subject"}
          value={selectedRow.subject}
        />
      )}
      <FormTextEditor
        readonly={true}
        label={"Message"}
        name={"message"}
        defaultValue={selectedRow.message}
      />
    </>
  );
};
const NewsLetter = ({ selectedRow }: { selectedRow: FormResponse }) => {
  return (
    <>
      <FormInput
        disabled={true}
        label={"Name"}
        name={"name"}
        value={selectedRow.name}
      />
      <FormInput
        disabled={true}
        label={"Email"}
        name={"email"}
        value={selectedRow.email}
      />
      <FormTextEditor
        readonly={true}
        label={"Message"}
        name={"message"}
        defaultValue={selectedRow.message}
      />
    </>
  );
};

const BookingForm = ({ selectedRow }: { selectedRow: FormResponse }) => {
  return (
    <>
      <FormInput
        disabled={true}
        label={"First Name"}
        name={"name"}
        value={selectedRow.name}
      />
      <FormInput
        disabled={true}
        label={"Last Name"}
        name={"lastName"}
        value={selectedRow.lastName}
      />
      <FormInput
        disabled={true}
        label={"Email"}
        name={"email"}
        value={selectedRow.email}
      />
      <FormInput
        disabled={true}
        label={"Phone Number"}
        name={"phone"}
        value={selectedRow.phone}
      />
      <FormInput
        disabled={true}
        label={"No Of Travelers"}
        name={"noOfTravelers"}
        value={selectedRow.noOfTravelers}
      />
      <FormTextEditor
        readonly={true}
        label={"Message"}
        name={"message"}
        defaultValue={selectedRow.message}
      />
    </>
  );
};

export default FormDataDrawer;
