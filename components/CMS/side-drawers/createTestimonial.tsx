import React, { ReactNode, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "components/CMS/components-ui/shadcn/ui/sheet";

import { Label } from "../components-ui/shadcn/ui/label";
import Card from "../components-ui/card";
import CardBody from "../components-ui/cardBody";
import { isFile, removeTags, truncateText } from "lib/utils";
import FormInput from "../components-ui/form/formInput";
import FormTextEditor from "../components-ui/form/formTextEditor";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import SaveButton from "../components-ui/saveButton";
import { TestimonialInput } from "lib/validations/testimonial.schema";
import { useToast } from "../components-ui/shadcn/ui/use-toast";
import SingleImageUploader from "../components-ui/singleImageUploader";
import {
  apiPostTestimonialService,
  apiUpdateTestimonial,
} from "services/testimonial";
import { apiUploadsMediaService } from "services/uploads";
import { handleApiError } from "lib/api-helpers";

export type ModalType = {
  isOpen: boolean;
  setIsOpen: () => void;
  onCreate: Function;
  children?: ReactNode;
  isEdit: boolean;
  selectedRow: any;
  onEdit: Function;
  testimonialLength: number;
};

function CreateTestimonial({
  onCreate,
  isEdit,
  selectedRow,
  isOpen,
  setIsOpen,
  onEdit,
  testimonialLength,
}: ModalType) {
  const { toast } = useToast();

  const methods = useForm<TestimonialInput>({
    // resolver: zodResolver(TestimonialSchema),
    mode: "onBlur",
    values: isEdit
      ? {
          ...selectedRow,
        }
      : {},
  });

  const { reset, handleSubmit } = methods;

  const onSubmitHandler: SubmitHandler<any> = async (values) => {
    const { id, clientImageMedia, destinationImageMedia, ...rest } = values;
    if (isEdit) {
      try {
        const id = selectedRow.id;
        const clientImageMediaResponse =
          isFile(clientImageMedia?.desktopMediaUrl) &&
          (await apiUploadsMediaService({
            desktopMediaUrl: clientImageMedia?.desktopMediaUrl as File,
          }));

        const destinationImageMediaResponse =
          isFile(destinationImageMedia?.desktopMediaUrl) &&
          (await apiUploadsMediaService({
            desktopMediaUrl: destinationImageMedia?.desktopMediaUrl as File,
          }));

        const response = await apiUpdateTestimonial(id, {
          ...rest,
          ...(destinationImageMediaResponse && {
            destinationImageMedia: {
              ...destinationImageMedia,
              desktopMediaUrl:
                destinationImageMediaResponse?.data?.[0]?.desktopMediaUrl,
            },
          }),
          ...(clientImageMediaResponse && {
            clientImageMedia: {
              ...clientImageMedia,
              desktopMediaUrl:
                clientImageMediaResponse?.data?.[0]?.desktopMediaUrl,
            },
          }),
        });

        onEdit(response.data);
        toast({
          title: "Testimonial Edited Successfully",
          variant: "success",
        });
        reset();
      } catch (error: any) {
        handleApiError(error);
      }
    } else {
      try {
        const clientImageMediaResponse = await apiUploadsMediaService({
          desktopMediaUrl: clientImageMedia?.desktopMediaUrl as File,
        });
        const destinationImageMediaResponse = await apiUploadsMediaService({
          desktopMediaUrl: destinationImageMedia?.desktopMediaUrl as File,
        });

        const response = await apiPostTestimonialService({
          ...rest,
          sortId: testimonialLength + 1,
          ...(clientImageMediaResponse && {
            clientImageMedia: {
              ...clientImageMedia,
              desktopMediaUrl:
                clientImageMediaResponse.data[0]?.desktopMediaUrl,
            },
          }),
          ...(destinationImageMediaResponse && {
            destinationImageMedia: {
              ...destinationImageMedia,
              desktopMediaUrl:
                destinationImageMediaResponse.data[0]?.desktopMediaUrl,
            },
          }),
        });

        onCreate(response.data);
        toast({
          title: "Testimonial Created Successfully",
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
      <SheetContent className="w-[800px] h-screen overflow-scroll">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <SheetHeader className="flex justify-between flex-row items-center w-full mb-3">
              <SheetTitle>
                {isEdit
                  ? "Testimonial - " +
                    truncateText(removeTags(selectedRow?.description))
                  : "Create Testimonial"}
              </SheetTitle>
              <SaveButton label="Create Testimonial" isEdit={isEdit} />
            </SheetHeader>
            <SheetDescription>
              <div>
                <Card>
                  <CardBody>
                    <div className="flex  gap-4">
                      <div className=" w-3/4 h-[172px]">
                        <div className=" flex  gap-5">
                          <FormInput
                            label="client"
                            name="clientName"
                            placeholder="Enter Client Name"
                          />
                        </div>

                        <FormInput
                          label="location"
                          name="clientLocation"
                          placeholder="Enter Location"
                        />
                      </div>
                      <div className="flex flex-1 mt-5 w-1/4">
                        <SingleImageUploader name="clientImageMedia" />
                      </div>
                    </div>

                    <div className="">
                      <FormTextEditor label="testimonial" />
                    </div>
                    <div className=" flex  flex-col mt-5 flex-1 h-[300px]">
                      <Label className=" pb-[6px] block capitalize whitespace-nowrap">
                        Destination Image
                      </Label>
                      <SingleImageUploader name="destinationImageMedia" />
                    </div>
                  </CardBody>
                </Card>
              </div>
            </SheetDescription>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}

export default CreateTestimonial;
