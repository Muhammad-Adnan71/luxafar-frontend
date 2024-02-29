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
import { apiPostPartnersService, apiPutPartners } from "services/partners";
import { useToast } from "../components-ui/shadcn/ui/use-toast";
import SingleImageUploader from "../components-ui/singleImageUploader";
import { apiUploadsMediaService } from "services/uploads";
import { PartnersResponse } from "lib/types";
import { isFile } from "lib/utils";
import { handleApiError } from "lib/api-helpers";

export type ModalType = {
  isOpen: boolean;
  setIsOpen: () => void;
  onCreate: Function;
  onEdit: Function;
  children?: ReactNode;
  isEdit: boolean;
  selectedRow: any;
  partnersLength: number;
};
function CreatePartners({
  onCreate,
  isEdit,
  selectedRow,
  isOpen,
  setIsOpen,
  onEdit,
  partnersLength,
}: ModalType) {
  const { toast } = useToast();

  const methods = useForm<PartnersResponse>({
    // resolver: zodResolver(PartnersSchema),
    mode: "onBlur",
    values: isEdit ? selectedRow : {},
  });
  const { reset, handleSubmit } = methods;

  const onSubmitHandler: SubmitHandler<PartnersResponse> = async (values) => {
    if (isEdit) {
      try {
        const { id, imageId, media, ...rest } = values;

        const logo =
          isFile(media?.desktopMediaUrl) &&
          (await apiUploadsMediaService({
            desktopMediaUrl: media?.desktopMediaUrl as File,
          }));

        const response = await apiPutPartners(id as number, {
          ...rest,
          ...(logo && {
            media: {
              ...media,
              desktopMediaUrl: logo?.data[0]?.desktopMediaUrl,
            },
          }),
        });

        onEdit(response.data);
        toast({
          title: "Partners Edited Successfully",
          variant: "success",
        });
        reset();
      } catch (error: any) {
        handleApiError(error);
      }
    } else {
      const { media, ...rest } = values;
      try {
        const {
          data: [logo],
        }: any = await apiUploadsMediaService({
          desktopMediaUrl: media?.desktopMediaUrl as File,
        });
        const response = await apiPostPartnersService({
          ...rest,
          sortId: partnersLength + 1,
          media: {
            ...media,
            desktopMediaUrl: logo?.desktopMediaUrl,
          },
        });
        onCreate(response.data);
        reset();
        toast({
          title: "Partners Created Successfully",
          variant: "success",
        });
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
          <SheetTitle>
            <span className="capitalize">
              {isEdit ? "Edit - " + selectedRow.name : "Create Partner"}
            </span>
          </SheetTitle>

          <SheetDescription>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <Card>
                  <CardBody>
                    <div className=" rounded-lg">
                      <FormInput label="URL" name="name" />
                      <FormLabel>Partner Icon</FormLabel>
                      <SingleImageUploader classes="h-[100px]" name="media" />
                    </div>
                  </CardBody>
                  {onCreate && (
                    <div className=" flex justify-end ">
                      <SaveButton isEdit={isEdit} label="create Partner" />
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

export default CreatePartners;
