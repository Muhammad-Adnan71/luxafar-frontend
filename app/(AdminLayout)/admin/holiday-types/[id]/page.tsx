"use client";
import React, { useEffect, useState } from "react";
import PageTitle from "components/CMS/components-ui/PageTitle";
import Card from "components/CMS/components-ui/card";
import CardBody from "components/CMS/components-ui/cardBody";
import { Label } from "components/CMS/components-ui/shadcn/ui/label";
import ImageUploader from "components/CMS/components-ui/imageUploader";
import SubHeading from "components/CMS/components-ui/subHeading";
import FormTextEditor from "components/CMS/components-ui/form/formTextEditor";
import FormInput from "components/CMS/components-ui/form/formInput";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SaveButton from "components/CMS/components-ui/saveButton";
import DeleteButton from "components/CMS/components-ui/deleteButton";
import AddButton from "components/CMS/components-ui/addButton";
import { HolidayTypesResponse } from "lib/types";
import {
  apiGetHolidayTypes,
  apiGetHolidayTypesById,
  apiPostHolidayTypes,
  apiPutHolidayType,
} from "services/holidayTypes";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import FormSkeleton from "components/CMS/components-ui/form/skeleton";
import { apiUploadsMediaService } from "services/uploads";
import { friendlySlug, friendlyUrl, isFile } from "lib/utils";
import { useRouter } from "next/navigation";

export default function HolidayTypeId({
  params: { id },
}: {
  params: { id: string };
}) {
  const isEdited = id !== "create";
  const router = useRouter();
  const { toast } = useToast();
  const methods = useForm<any>({
    // resolver: zodResolver(),
    mode: "onBlur",
    defaultValues: isEdited
      ? async () => {
          const response = apiGetHolidayTypesById(Number(id));
          return (await response).data;
        }
      : {
          highlights: [
            {
              description: "",
            },
          ],
        },
  });
  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitSuccessful, isLoading },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    name: "highlights",
    control,
  });

  const onSubmitHandler: SubmitHandler<any> = async (
    values: HolidayTypesResponse
  ) => {
    if (isEdited) {
      const { media, highlights, seoMeta, ...rest } = values;
      const { title, slug, ...restSeoMeta } = seoMeta;
      let holidayImageResponse;

      if (isFile(media?.desktopMediaUrl) || isFile(media?.mobileMediaUrl)) {
        holidayImageResponse = await apiUploadsMediaService({
          desktopMediaUrl: media?.desktopMediaUrl as File,
          mobileMediaUrl: media?.mobileMediaUrl as File,
        });
      }

      const highlightsResponse = await Promise.all(
        highlights.map(async (highlight: any) => {
          let highlightImageResponse;

          if (
            isFile(highlight.media?.desktopMediaUrl) ||
            isFile(highlight.media?.mobileMediaUrl)
          ) {
            highlightImageResponse = await apiUploadsMediaService({
              desktopMediaUrl: highlight.media?.desktopMediaUrl as File,
              mobileMediaUrl: highlight.media?.mobileMediaUrl as File,
            });
          }
          return {
            ...highlight,
            media: {
              ...(isFile(highlight.media?.desktopMediaUrl) && {
                desktopMediaUrl:
                  highlightImageResponse?.data[0]?.desktopMediaUrl,
              }),
              ...(isFile(highlight.media?.mobileMediaUrl) && {
                mobileMediaUrl: highlightImageResponse?.data[1]?.mobileMediaUrl,
              }),
            },
          };
        })
      );

      const response = await apiPutHolidayType(values.id as number, {
        ...rest,
        seoMeta: {
          ...restSeoMeta,
          title: title?.length ? title : friendlySlug(rest.name),
          slug: slug?.length ? friendlyUrl(slug) : friendlyUrl(rest.name),
        },
        highlights: highlightsResponse,
        ...(holidayImageResponse && {
          media: {
            ...(isFile(media?.desktopMediaUrl) && {
              desktopMediaUrl: holidayImageResponse.data[0]?.desktopMediaUrl,
            }),
            ...(isFile(media?.mobileMediaUrl) && {
              mobileMediaUrl: holidayImageResponse.data[1]?.mobileMediaUrl,
            }),
          },
        }),
      });
      if (response.status === "success") {
        router.push("/admin/holiday-types");
        toast({
          title: `Holiday Type successfully Edited`,
          variant: "success",
        });
      }
    } else {
      const { media, highlights, seoMeta, ...rest } = values;
      const HolidayBannerResponse = await apiUploadsMediaService({
        desktopMediaUrl: values?.media?.desktopMediaUrl as File,
        mobileMediaUrl: values?.media?.mobileMediaUrl as File,
      });

      if (HolidayBannerResponse?.status === "success") {
        const highlightsResponse = await Promise.all(
          highlights.map(async (highlight: any) => {
            const response = await apiUploadsMediaService({
              desktopMediaUrl: highlight?.media?.desktopMediaUrl as File,
              mobileMediaUrl: highlight?.media?.mobileMediaUrl as File,
            });
            return {
              ...highlight,
              media: {
                desktopMediaUrl: response?.data[0]?.desktopMediaUrl,
                mobileMediaUrl: response?.data[1]?.mobileMediaUrl,
              },
            };
          })
        );
        const { title, slug, ...restSeoMeta } = seoMeta;
        const response = await apiPostHolidayTypes({
          ...rest,
          seoMeta: {
            ...restSeoMeta,
            title: title?.length ? title : friendlySlug(rest.name),
            slug: slug?.length ? friendlyUrl(slug) : friendlyUrl(rest.name),
          },
          highlights: highlightsResponse,
          media: {
            desktopMediaUrl: HolidayBannerResponse.data[0]?.desktopMediaUrl,
            mobileMediaUrl: HolidayBannerResponse.data[1]?.mobileMediaUrl,
          },
        });
        if (response.status === "success") {
          reset();
          router.push("/admin/holiday-types");
          toast({
            title: `Holiday Type successfully Created`,
            variant: "success",
          });
        }
      }
    }
  };

  const handleAddMore = () => {
    append({
      description: " ",
    });
  };
  const title = methods.getValues("name");

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="pb-10 ">
          <PageTitle>
            {isEdited ? "Holiday Type - " + title : "Create - Holiday Type"}
          </PageTitle>
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <>
              <Card className="mb-5 bg-primary-color dark:bg-gray-800">
                <CardBody>
                  <div className="flex gap-5">
                    <FormInput
                      label="name"
                      name="name"
                      placeholder="Enter Holiday Type Name"
                    />
                  </div>

                  <FormTextEditor label="Description" name="description" />

                  <Label className="py-4 mt-3 mb-3">Holiday Type Image</Label>
                  <div className="mt-3">
                    <ImageUploader name="media" />
                  </div>
                </CardBody>
              </Card>
              <SubHeading>Seo & Meta</SubHeading>
              <Card className="mb-5 bg-primary-color dark:bg-gray-800">
                <CardBody>
                  <FormInput
                    label="Meta Title"
                    name={`seoMeta.title`}
                    placeholder="Enter Meta Title"
                    informationText=" As per Google Guidelines Maximum Characters Limit: 60 "
                  />
                  <FormInput
                    label="Slug"
                    name={`seoMeta.slug`}
                    placeholder="Enter Slug"
                    // informationText=" 5 to 10 Keywords "
                  />
                  <FormInput
                    label="Keywords"
                    name={`seoMeta.keywords`}
                    placeholder="Enter Keywords"
                    informationText=" 5 to 10 Keywords "
                  />
                  <FormTextEditor
                    label="Meta Description"
                    name={`seoMeta.description`}
                    informationText=" As per Google Guidelines Maximum Characters Limit: 160"
                  />
                </CardBody>
              </Card>
              <SubHeading>Main Section</SubHeading>
              <Card className="mb-5 bg-primary-color dark:bg-gray-800">
                <CardBody>
                  <FormInput
                    label="Main Heading"
                    name="mainSectionHeading"
                    placeholder="Enter Main Heading"
                  />

                  <FormTextEditor
                    label="Description"
                    name="mainSectionDescription"
                  />
                </CardBody>
              </Card>
              <SubHeading>Highlights</SubHeading>

              {fields?.map((item: any, index: number) => (
                <Card
                  className="mb-5 bg-primary-color dark:bg-gray-800"
                  key={index}
                >
                  <CardBody>
                    <div className="flex justify-between">
                      <SubHeading>Slide {index + 1}</SubHeading>
                      <DeleteButton onClick={() => remove(index)} />
                    </div>
                    <Label className="py-4 mt-3 mb-3">Highlight Image</Label>
                    <div className="mt-3">
                      <ImageUploader name={`highlights.${index}.media`} />
                    </div>
                    <FormTextEditor
                      label="Description"
                      name={`highlights.${index}.description`}
                    />
                  </CardBody>
                </Card>
              ))}
              <AddButton onClick={() => handleAddMore()} classes="ml-auto" />
              <SaveButton isEdit={isEdited} label="Create Holiday Type " />
            </>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
