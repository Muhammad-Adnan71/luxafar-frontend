"use client";
import PageTitle from "components/CMS/components-ui/PageTitle";
import Card from "components/CMS/components-ui/card";
import CardBody from "components/CMS/components-ui/cardBody";
import FormInput from "components/CMS/components-ui/form/formInput";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { UpdateUserSchema } from "lib/validations/user.schema";
import SaveButton from "components/CMS/components-ui/saveButton";
import { apiGetUserProfile, apiUpdateCurrentUser } from "services/auth";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import SingleImageUploader from "components/CMS/components-ui/singleImageUploader";
import useAuthStore from "store/useAuthUser";
import { isFile } from "lib/utils";
import { apiUploadsMediaService } from "services/uploads";
import FormSkeleton from "components/CMS/components-ui/form/skeleton";
import { handleApiError } from "lib/api-helpers";
import { zodResolver } from "@hookform/resolvers/zod";

function Profile() {
  const { setAuthUser } = useAuthStore();

  const { toast } = useToast();
  const methods = useForm<any>({
    // resolver: zodResolver(UpdateUserSchema),
    mode: "onBlur",
    defaultValues: async () => {
      const response = apiGetUserProfile();
      const data = (await response).data.user;

      return { ...data };
    },
  });
  const {
    handleSubmit,
    formState: { isLoading },
  } = methods;

  const onSubmitHandler: SubmitHandler<any> = async (values: any) => {
    let profileResponse;
    const { media, ...restValues } = values;
    if (isFile(values?.media?.desktopMediaUrl)) {
      profileResponse = await apiUploadsMediaService({
        desktopMediaUrl: values?.media?.desktopMediaUrl as File,
      });
    }
    try {
      const response = await apiUpdateCurrentUser({
        ...restValues,
        ...(isFile(values?.media?.desktopMediaUrl) && {
          media: {
            ...values?.media,
            desktopMediaUrl: profileResponse?.data[0]?.desktopMediaUrl,
          },
        }),
      });
      setAuthUser(response.data.user);
      toast({
        title: "Profile Updated Successfully",
        variant: "success",
      });
    } catch (error: any) {
      handleApiError(error);
    }
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        {isLoading ? (
          <div className="mt-10">
            <FormSkeleton />
          </div>
        ) : (
          <div className="pb-10">
            <PageTitle>Profile</PageTitle>
            <div>
              <Card>
                <CardBody>
                  <div className="flex gap-5">
                    <div className=" w-5/6">
                      <FormInput
                        label="name"
                        name="name"
                        placeholder="Enter Name"
                      />
                      <FormInput
                        label="Email"
                        name="email"
                        placeholder="Enter Email"
                      />
                      <div className="flex gap-5 ">
                        <FormInput
                          label="old password"
                          name="oldPassword"
                          type="password"
                          placeholder="Enter Old Password"
                        />
                        <FormInput
                          label="new password "
                          name="newPassword"
                          type="password"
                          placeholder="Enter new Password"
                        />
                      </div>
                    </div>
                    <div className="w-1/6 flex mt-5">
                      <SingleImageUploader name="media" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            <SaveButton isEdit={true} />
          </div>
        )}
      </form>
    </FormProvider>
  );
}

export default Profile;
