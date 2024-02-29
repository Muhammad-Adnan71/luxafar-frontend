"use client";

import React, { useEffect, useState } from "react";
import PageTitle from "components/CMS/components-ui/PageTitle";
import Card from "components/CMS/components-ui/card";
import CardBody from "components/CMS/components-ui/cardBody";
import ImageUploader from "components/CMS/components-ui/imageUploader";
import FormInput from "components/CMS/components-ui/form/formInput";
import FormTextEditor from "components/CMS/components-ui/form/formTextEditor";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { BannerSchemaInput, BannerSchema } from "lib/validations/banner.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  apiGetBannerById,
  apiPostBanner,
  apiPutBanner,
} from "services/banners";

import SaveButton from "components/CMS/components-ui/saveButton";
import { BannerResponse } from "lib/types";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import FormSkeleton from "components/CMS/components-ui/form/skeleton";
import { apiUploadsMediaService } from "services/uploads";
import { isFile } from "lib/utils";
import { useRouter } from "next/navigation";
import { handleApiError } from "lib/api-helpers";

function BannerCreateEdit({ params: { id } }: { params: { id: string } }) {
  const isEdited = id !== "create";
  const { toast } = useToast();
  const router = useRouter();

  const methods = useForm({
    mode: "onBlur",
    defaultValues: isEdited
      ? async () => {
          const response = apiGetBannerById(Number(id));
          return (await response).data;
        }
      : {},
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, isLoading },
  } = methods;

  const onSubmitHandler: SubmitHandler<any> = async (values) => {
    const { media, ...rest } = values;
    if (!isEdited) {
      try {
        const slideImageResponse = await apiUploadsMediaService({
          desktopMediaUrl: media?.desktopMediaUrl as File,
          mobileMediaUrl: media?.mobileMediaUrl as File,
        });
        await apiPostBanner({
          ...rest,
          media: {
            desktopMediaUrl: slideImageResponse?.data[0]?.desktopMediaUrl,
            mobileMediaUrl: slideImageResponse?.data[1]?.mobileMediaUrl,
          },
        });

        router.push("/admin/banner");
        toast({
          title: `Slide SuccessFully Created`,
          variant: "success",
        });
        reset();
      } catch (error: any) {
        handleApiError(error);
      }
    } else {
      try {
        let slideImageResponse;
        if (isFile(media?.desktopMediaUrl) || isFile(media?.mobileMediaUrl)) {
          slideImageResponse = await apiUploadsMediaService({
            desktopMediaUrl: media?.desktopMediaUrl as File,
            mobileMediaUrl: media?.mobileMediaUrl as File,
          });
        }

        await apiPutBanner(parseInt(values.id), {
          ...rest,
          ...(slideImageResponse && {
            media: {
              ...(isFile(media?.desktopMediaUrl) && {
                desktopMediaUrl: slideImageResponse.data[0]?.desktopMediaUrl,
              }),
              ...(isFile(media?.mobileMediaUrl) && {
                mobileMediaUrl: slideImageResponse.data[1]?.mobileMediaUrl,
              }),
            },
          }),
        });

        router.push("/admin/banner");
        toast({
          title: `Slide SuccessFully Edited`,
          variant: "success",
        });
      } catch (error: any) {
        handleApiError(error);
      }
    }
  };
  const bannerId = methods.getValues("id");
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="flex justify-between items-center">
          <PageTitle>
            {isEdited && bannerId ? "Slides - " + bannerId : "Create Slide"}
          </PageTitle>
        </div>
        <div className="pb-10">
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <Card className="mb-2">
              <CardBody>
                <div>
                  <FormInput
                    label="title"
                    name="title"
                    placeholder="Enter Slide Title"
                  />

                  <div className="flex gap-5 mt-4">
                    <FormInput
                      label="button Text"
                      name="buttonText"
                      placeholder="Enter Button Text"
                    />
                    <FormInput
                      label="button Url"
                      name="buttonUrl"
                      placeholder="Enter Button URL"
                    />
                  </div>

                  <div className="mb-3">
                    <FormTextEditor label="description" name="description" />
                  </div>

                  <ImageUploader name="media" />
                </div>
              </CardBody>
            </Card>
          )}
          <SaveButton isEdit={isEdited} label="Create Banner Slide" />
        </div>
      </form>
    </FormProvider>
  );
}

export default BannerCreateEdit;
