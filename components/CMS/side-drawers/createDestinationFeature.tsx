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
import FormInput from "../components-ui/form/formInput";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import SaveButton from "../components-ui/saveButton";
import FormLabel from "../components-ui/form/formLabel";
import { useToast } from "../components-ui/shadcn/ui/use-toast";
import {
  apiPosDestinationFeature,
  apiPutDestinationFeature,
} from "services/destinationFeatures";
import SingleImageUploader from "../components-ui/singleImageUploader";
import { DestinationFeaturesResponse } from "lib/types";
import { apiUploadsMediaService } from "services/uploads";

export type ModalType = {
  isOpen: boolean;
  setIsOpen: () => void;
  onCreate: Function;
  onEdit: Function;
  children?: ReactNode;
  isEdit: boolean;
  selectedRow: any;
};
function CreateDestinationFeature({
  onCreate,
  isEdit,
  selectedRow,
  isOpen,
  setIsOpen,
  onEdit,
}: ModalType) {
  const { toast } = useToast();
  const methods = useForm<DestinationFeaturesResponse>({
    // resolver: zodResolver(DestinationFeatureSchema),
    mode: "onBlur",
    values: isEdit ? selectedRow : {},
  });
  const { reset, handleSubmit, formState } = methods;

  const onSubmitHandler: SubmitHandler<DestinationFeaturesResponse> = async (
    values
  ) => {
    if (isEdit) {
      const { id, imageId, media, ...rest } = values;
      let logoImageResponse;
      if (typeof media?.desktopMediaUrl === "object") {
        logoImageResponse = await apiUploadsMediaService({
          desktopMediaUrl: media?.desktopMediaUrl as File,
        });
      }

      const response = await apiPutDestinationFeature(id as number, {
        ...rest,
        ...(logoImageResponse && {
          media: {
            ...media,
            desktopMediaUrl: logoImageResponse.data[0]?.desktopMediaUrl,
          },
        }),
      });
      if (response.status === "success") {
        onEdit(response.data);
        toast({
          title: "Destination Feature Edited Successfully",
          variant: "success",
        });
        reset();
      }
    } else {
      const { media, ...rest } = values;

      const logoImageResponse = await apiUploadsMediaService({
        desktopMediaUrl: media?.desktopMediaUrl as File,
      });

      if (logoImageResponse?.status === "success") {
        const response = await apiPosDestinationFeature({
          ...rest,
          media: {
            ...media,
            desktopMediaUrl: logoImageResponse.data[0]?.desktopMediaUrl,
          },
        });

        if (response.status == "success") {
          onCreate(response.data);
          toast({
            title: "Destination Feature Created Successfully",
            variant: "success",
          });
          reset();
        }
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
          <SheetTitle>
            <span className="capitalize">
              {isEdit
                ? "Edit - " + selectedRow.name
                : "Create Destination Feature"}
            </span>
          </SheetTitle>

          <SheetDescription>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <Card>
                  <CardBody>
                    <div className=" rounded-lg">
                      <FormInput label="Name" name="name" />
                      <FormLabel>Feature Icon</FormLabel>
                      <SingleImageUploader classes="h-[72px]" name="media" />
                    </div>
                  </CardBody>
                  {onCreate && (
                    <div className=" flex justify-end ">
                      <SaveButton isEdit={isEdit} label="create Feature" />
                    </div>
                  )}
                </Card>
              </form>
            </FormProvider>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default CreateDestinationFeature;
