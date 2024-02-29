"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import PageTitle from "components/CMS/components-ui/PageTitle";
import Card from "components/CMS/components-ui/card";
import CardBody from "components/CMS/components-ui/cardBody";
import FormSelect from "components/CMS/components-ui/form/formSelect";
import React, { useEffect, useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import SaveButton from "components/CMS/components-ui/saveButton";
import SingleImageUploader from "components/CMS/components-ui/singleImageUploader";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import { apiGetAllDestinationService } from "services/destination";
import { apiUploadsMediaService } from "services/uploads";
import { isFile } from "lib/utils";
import {
  apiGetGalleryByDestinationId,
  apiPostGallery,
  apiPutGallery,
} from "services/gallery";
import FormSkeleton from "components/CMS/components-ui/form/skeleton";
import { useRouter } from "next/navigation";

function GalleryId({ params: { id } }: { params: { id: string } }) {
  const isEdited = id !== "create";
  const { toast } = useToast();
  const router = useRouter();
  const [destinationData, setDestinationData] = useState([]);
  useEffect(() => {
    apiGetAllDestination();
  }, []);

  const apiGetAllDestination = async () => {
    const response = await apiGetAllDestinationService({
      active: "true",
      sortBy: "name",
    });
    if (response?.status === "success") {
      setDestinationData(response.data);
    }
  };
  const methods = useForm<any>({
    // resolver: zodResolver(RegisterUserSchema),
    mode: "onBlur",
    defaultValues: isEdited
      ? async () => {
          const response = apiGetGalleryByDestinationId(Number(id));
          const data = (await response).data;

          return {
            gallery: [...data],
            destinationId: id.toString(),
          };
        }
      : {
          gallery: [1, 2, 3, 4, 5, 6, 7, 8].map(() => ({
            media: "",
          })),
        },
  });
  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitSuccessful, isLoading },
  } = methods;
  useFieldArray({
    name: "gallery",
    control,
  });
  const onSubmitHandler: SubmitHandler<any> = async (values) => {
    if (isEdited) {
      const { gallery, ...rest } = values;
      const galleryResponse = await Promise.all(
        gallery.map(async (img: any) => {
          let galleryImageResponse;
          if (isFile(img.media?.desktopMediaUrl)) {
            galleryImageResponse = await apiUploadsMediaService({
              desktopMediaUrl: img.media?.desktopMediaUrl as File,
            });
          }
          return {
            ...img,
            destinationId: Number(values.destinationId),
            media: {
              ...(isFile(img.media?.desktopMediaUrl) && {
                desktopMediaUrl: galleryImageResponse?.data[0]?.desktopMediaUrl,
              }),
            },
          };
        })
      );
      const response = await apiPutGallery(Number(id), {
        ...rest,
        gallery: galleryResponse,
      });
      if (response.status === "success") {
        toast({
          title: `Gallery successfully Edited`,
          variant: "success",
        });
        router.push("/admin/destinations/gallery");
      }
    } else {
      if (values.destinationId) {
        const { gallery, ...rest } = values;
        const galleryResponse = await Promise.all(
          gallery.map(async (img: any) => {
            const response = await apiUploadsMediaService({
              desktopMediaUrl: img?.media?.desktopMediaUrl as File,
            });
            return {
              ...img,
              destinationId: Number(values.destinationId),
              media: {
                desktopMediaUrl: response?.data[0]?.desktopMediaUrl,
              },
            };
          })
        );
        const response = await apiPostGallery({
          ...rest,
          gallery: galleryResponse,
        });
        if (response.status === "success") {
          reset();
          toast({
            title: `Gallery successfully Created`,
            variant: "success",
          });
          router.push("/admin/destinations/gallery");
        }
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="pb-10 ">
          <PageTitle>Create Gallery</PageTitle>
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <>
              <Card className="mb-5 bg-primary-color dark:bg-gray-800">
                <CardBody>
                  <FormSelect
                    name="destinationId"
                    label="Destination"
                    options={destinationData.map((item: any) => ({
                      value: item.id.toString(),
                      label: item.name,
                    }))}
                    placeholder="Select Destination"
                  />
                </CardBody>
              </Card>
              <Card className="mb-5 bg-primary-color dark:bg-gray-800">
                <CardBody>
                  <div className="grid  grid-rows-[300px,200px,200px] max-md:grid-rows-[300px,200px,200px,200px] max-sm:grid-rows-[180px_150px_155px_180px]  gap-3 overflow-hidden">
                    <div className="grid grid-cols-2 gap-3 max-md:hidden">
                      <div className="overflow-hidden flex">
                        <SingleImageUploader name={`gallery.${0}.media`} />
                      </div>
                      <div className="grid grid-cols-2 gap-3 overflow-hidden">
                        <div className="flex">
                          <SingleImageUploader name={`gallery.${1}.media`} />
                        </div>
                        <div className="grid grid-rows-[repeat(2,minmax(0px,_200px))] gap-3 overflow-hidden">
                          <SingleImageUploader name={`gallery.${2}.media`} />
                          <SingleImageUploader name={`gallery.${3}.media`} />
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      <SingleImageUploader name={`gallery.${4}.media`} />
                    </div>
                    <div className="grid grid-cols-3 max-md:grid-cols-2 gap-3">
                      <SingleImageUploader name={`gallery.${5}.media`} />
                      <SingleImageUploader name={`gallery.${6}.media`} />
                      <SingleImageUploader name={`gallery.${7}.media`} />
                    </div>
                  </div>
                </CardBody>
              </Card>
              <SaveButton isEdit={isEdited} label="Create Gallery" />
            </>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

export default GalleryId;
