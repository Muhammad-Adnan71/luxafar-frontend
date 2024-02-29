"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import upload from "@public/template/upload-image.png";
import PageTitle from "components/CMS/components-ui/PageTitle";
import Card from "components/CMS/components-ui/card";
import CardBody from "components/CMS/components-ui/cardBody";
import { Label } from "components/CMS/components-ui/shadcn/ui/label";
import { Input } from "components/CMS/components-ui/shadcn/ui/input";
import FormInput from "components/CMS/components-ui/form/formInput";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ConfigurationInput } from "lib/validations/configuration.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import SaveButton from "components/CMS/components-ui/saveButton";
import FormTextEditor from "components/CMS/components-ui/form/formTextEditor";
import {
  apiPostConfiguration,
  apiGetAllConfiguration,
} from "services/configuration";
import { ConfigurationResponse } from "lib/types";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import FormSkeleton from "components/CMS/components-ui/form/skeleton";
import SingleImageUploader from "components/CMS/components-ui/singleImageUploader";
import { apiUploadsMediaService } from "services/uploads";

export default function Configuration() {
  const { toast } = useToast();

  const methods = useForm<ConfigurationResponse>({
    mode: "onBlur",

    defaultValues: async () => {
      const response = apiGetAllConfiguration();
      return (await response).data;
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful, isLoading: formLoading },
  } = methods;

  const onSubmitHandler: SubmitHandler<ConfigurationResponse> = async (
    values: ConfigurationResponse
  ) => {
    const { id, logoId, media, ...rest } = values;
    if (typeof media?.desktopMediaUrl === "string") {
      const response = await apiPostConfiguration({
        ...rest,
      });
      if (response.status == "success") {
        toast({
          title: "Save Changes Successfully",
          variant: "success",
        });
      }
    } else {
      const logoImageResponse = await apiUploadsMediaService({
        desktopMediaUrl: media?.desktopMediaUrl as File,
      });
      if (logoImageResponse?.status === "success") {
        const response = await apiPostConfiguration({
          ...rest,
          media: {
            ...media,
            desktopMediaUrl: logoImageResponse.data[0]?.desktopMediaUrl,
          },
        });
        if (response.status == "success") {
          toast({
            title: "Save Changes Successfully",
            variant: "success",
          });
        }
      }
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="pb-10">
            <PageTitle>Configuration - Settings</PageTitle>
            <div>
              {formLoading ? (
                <FormSkeleton />
              ) : (
                <>
                  <Card>
                    <CardBody>
                      <div className="flex gap-5">
                        <div className=" w-5/6">
                          <div className="flex gap-5">
                            <FormInput
                              label="title"
                              name="title"
                              placeholder=" Enter Title"
                            />
                            <FormInput
                              label="Email"
                              name="email"
                              placeholder="Enter Email Address"
                            />
                          </div>
                          <div className="flex gap-5">
                            <FormInput
                              label="phone"
                              name="phone"
                              placeholder="Enter Phone Number"
                            />
                            <FormInput
                              label="Whatsapp Number"
                              name="whatsappNumber"
                              placeholder="Enter Whatsapp number"
                            />
                          </div>
                        </div>
                        <div className="w-1/6 flex mt-5">
                          <SingleImageUploader
                            name="media"
                            classes="flex flex-1"
                          />
                        </div>
                      </div>
                      <FormInput
                        label="address"
                        name="address"
                        placeholder="Enter Address"
                      />
                      <FormTextEditor
                        label="Description"
                        name="siteDescription"
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <FormInput
                            label="facebook"
                            name="facebookUrl"
                            placeholder="Enter Facebook URL"
                          />
                        </div>
                        <div>
                          <FormInput
                            label="instagram"
                            name="instagramUrl"
                            placeholder="Enter Instagram URL"
                          />
                        </div>
                        <div>
                          <FormInput
                            label="Twitter"
                            name="twitterUrl"
                            placeholder="Enter Twitter URL"
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                  <div className="flex justify-end">
                    <SaveButton label="Save Changes" />
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
