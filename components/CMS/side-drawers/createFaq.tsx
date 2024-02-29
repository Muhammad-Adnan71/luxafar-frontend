"use client";
import React, { ReactNode, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "components/CMS/components-ui/shadcn/ui/sheet";
import Card from "../components-ui/card";
import CardBody from "../components-ui/cardBody";
import SaveButton from "../components-ui/saveButton";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useToast } from "../components-ui/shadcn/ui/use-toast";
import { apiPostFaqs, apiPutFaqs } from "services/faqs";
import { FaqInput, FaqSchema } from "lib/validations/faqs.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextEditor from "../components-ui/form/formTextEditor";
import { handleApiError } from "lib/api-helpers";

export type ModalType = {
  isOpen: boolean;
  setIsOpen: () => void;
  onCreate: Function;
  children?: ReactNode;
  isEdit: boolean;
  selectedRow: any;
  onEdit: Function;
};
function CreateFaq({
  onCreate,
  isEdit,
  selectedRow,
  isOpen,
  setIsOpen,
  onEdit,
}: ModalType) {
  const { toast } = useToast();
  const methods = useForm<FaqInput>({
    resolver: zodResolver(FaqSchema),
    mode: "onBlur",
    values: isEdit ? selectedRow : {},
  });
  const { reset, handleSubmit, formState } = methods;

  const onSubmitHandler: SubmitHandler<FaqInput> = async (values) => {
    if (isEdit) {
      try {
        const id = selectedRow.id;
        const response = await apiPutFaqs(id, values);
        onEdit(response.data);
        toast({
          title: "Faq Edited Successfully",
          variant: "success",
        });
        reset();
      } catch (error: any) {
        handleApiError(error);
      }
    } else {
      try {
        const response = await apiPostFaqs(values);
        onCreate(response.data);
        toast({
          title: "Faq Created Successfully",
          variant: "success",
        });
        reset();
      } catch (error: any) {
        handleApiError(error);
      }
    }
  };
  useEffect(() => {
    reset();
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-[500px]">
        <SheetHeader>
          <SheetTitle>{isEdit ? "FAQ " : "Create Faq"}</SheetTitle>
          <SheetDescription>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <Card>
                  <CardBody>
                    <FormTextEditor label="Question" name="question" />

                    <FormTextEditor label="Answer" name="answer" />
                  </CardBody>
                </Card>
                <div className="flex justify-end">
                  <SaveButton isEdit={isEdit} label="Create Faq" />
                </div>
              </form>
            </FormProvider>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default CreateFaq;
