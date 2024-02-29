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
import { apiPostPlanService, apiPutPlanService } from "services/planServices";
import { useToast } from "../components-ui/shadcn/ui/use-toast";
import { PlanServicesResponse } from "lib/types";
import { apiUploadsMediaService } from "services/uploads";
import SingleImageUploader from "../components-ui/singleImageUploader";
import { isFile } from "lib/utils";

export type ModalType = {
  isOpen: boolean;
  setIsOpen: () => void;
  onCreate: Function;
  onEdit: Function;
  children?: ReactNode;
  isEdit: boolean;
  selectedRow: any;
};
function CreatePlanServices({
  onCreate,
  isEdit,
  selectedRow,
  isOpen,
  setIsOpen,
  onEdit,
}: ModalType) {
  const { toast } = useToast();

  const methods = useForm<PlanServicesResponse>({
    // resolver: zodResolver(PlanServiceSchema),
    mode: "onBlur",
    values: isEdit ? selectedRow : {},
  });
  const { reset, handleSubmit, formState } = methods;

  const onSubmitHandler: SubmitHandler<PlanServicesResponse> = async (
    values
  ) => {
    if (isEdit) {
      const { id, imageId, media, ...rest } = values;
      let logoImageResponse;
      if (isFile(media?.desktopMediaUrl)) {
        logoImageResponse = await apiUploadsMediaService({
          desktopMediaUrl: media?.desktopMediaUrl as File,
        });
      }

      const response = await apiPutPlanService(id as number, {
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
          title: "Plan Service Edited Successfully",
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
        const response = await apiPostPlanService({
          ...rest,
          media: {
            ...media,
            desktopMediaUrl: logoImageResponse.data[0]?.desktopMediaUrl,
          },
        });

        if (response.status == "success") {
          onCreate(response.data);
          toast({
            title: "Plan Service Created Successfully",
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
              {isEdit ? "Edit - " + selectedRow.name : "Create Plan Service"}
            </span>
          </SheetTitle>

          <SheetDescription>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <Card>
                  <CardBody>
                    <div className=" rounded-lg">
                      <FormInput label="Name" name="name" />
                      <FormLabel>Plan Icon</FormLabel>
                      <SingleImageUploader classes="h-[72px]" name="media" />
                    </div>
                  </CardBody>
                  {onCreate && (
                    <div className=" flex justify-end ">
                      <SaveButton isEdit={isEdit} label="create Plan Service" />
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

export default CreatePlanServices;
