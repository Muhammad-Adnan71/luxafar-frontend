"use client";
import React, { useEffect, useState } from "react";
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
import FormSelect from "../components-ui/form/formSelect";
import { Button } from "../components-ui/shadcn/ui/button";
import { apiGetAllInspirations } from "services/inspirations";
import { apiTemplateDestinations } from "services/destination";

export type ModalType = {
  isOpen: boolean;
  setIsOpen: () => void;
  onCreate: Function;
};
function AddInspirationHomePage({ onCreate, setIsOpen, isOpen }: ModalType) {
  const { toast } = useToast();
  const methods = useForm<FaqInput>({
    resolver: zodResolver(FaqSchema),
    mode: "onBlur",
  });
  const { reset, handleSubmit, formState } = methods;

  const onSubmitHandler: SubmitHandler<FaqInput> = async (values) => {};
  const [destinations, setDestinations] = useState<
    {
      label: string;
      value: string;
    }[]
  >();
  const [inspiration, setInspiration] = useState<
    {
      label: string;
      value: string;
    }[]
  >();
  const [inspirationResponse, setInspirationResponse] = useState<any[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<any>({});
  const [selectedInspiration, setSelectedInspiration] = useState<any>({});
  const [isMounted, setIsMounted] = useState(false);
  const handleDestination = async (value: string) => {
    setSelectedDestination({
      id: value,
      name: destinations?.find((ele: any) => ele?.value == value)?.label,
    });
  };
  const getDestinations = async () => {
    const response = await apiTemplateDestinations();
    if (response?.status === "success") {
      setDestinations(
        response?.data.map((destination: any) => ({
          label: destination.name,
          value: destination.id.toString(),
        }))
      );
    }
  };
  const getInspirations = async () => {
    try {
      const response = await apiGetAllInspirations({
        ...(selectedDestination?.id && {
          destinationId: selectedDestination.id,
        }),
      });

      if (response?.status === "success") {
        setInspiration(
          response?.data?.map((inspiration: any) => ({
            label: inspiration?.title,
            value: inspiration?.id,
          }))
        );
        setInspirationResponse(response?.data);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    getDestinations();
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      getInspirations();
    }
  }, [selectedDestination.id]);

  const handleAddInspiration = () => {
    const items = {
      destination: selectedDestination,
      inspirations: inspirationResponse?.find(
        (ele: any) => ele?.id == selectedInspiration
      ),
    };

    // updateInspirationList(items);
  };
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-[500px]">
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <div className="flex flex-col">
                  <div>
                    {/* <SearchSelectInput
              onChange={handleDestination}
              value={selectedDestination.id as string}
              placeHolder="Destination"
              items={destinations}
            /> */}
                    <FormSelect
                      name="destinationId"
                      label="Destination"
                      options={destinations ?? []}
                      placeholder="Select Destination"
                    />
                  </div>
                  <div>
                    {/* <SearchSelectInput
              items={inspiration}
              onChange={(value: any) => {
                setSelectedInspiration(value);
              }}
              placeHolder="Inspiration"
            /> */}
                    <FormSelect
                      name="Inspiration"
                      label="Inspiration"
                      options={inspiration ?? []}
                      placeholder="Select Inspiration"
                    />
                  </div>
                </div>
                <Button
                  className=" py-5  flex items-center justify-center gap-1 px-10 disabled:bg-opacity-90 disabled:cursor-default bg-cms-tertiary-color"
                  type="submit"
                >
                  Save
                </Button>
              </form>
            </FormProvider>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default AddInspirationHomePage;
