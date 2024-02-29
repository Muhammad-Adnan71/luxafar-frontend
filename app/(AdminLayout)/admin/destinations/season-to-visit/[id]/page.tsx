"use client";
import React, { useEffect, useState } from "react";
import PageTitle from "components/CMS/components-ui/PageTitle";
import { Button } from "components/CMS/components-ui/shadcn/ui/button";
import Card from "components/CMS/components-ui/card";
import CardBody from "components/CMS/components-ui/cardBody";
import { Label } from "components/CMS/components-ui/shadcn/ui/label";
import ImageUploader from "components/CMS/components-ui/imageUploader";
import FormInput from "components/CMS/components-ui/form/formInput";
import FormTextEditor from "components/CMS/components-ui/form/formTextEditor";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFieldArray,
} from "react-hook-form";

import {
  RegisterUserInput,
  RegisterUserSchema,
} from "lib/validations/user.schema";
import SaveButton from "components/CMS/components-ui/saveButton";
import FormSelect from "components/CMS/components-ui/form/formSelect";
import SubHeading from "components/CMS/components-ui/subHeading";
import { useRouter } from "next/navigation";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import { apiGetAllDestinationService } from "services/destination";
import FormSkeleton from "components/CMS/components-ui/form/skeleton";
import {
  apiGetSeasonsByDestinationId,
  apiPostSeasons,
  apiPutSeasons,
} from "services/season";
import { apiUploadsMediaService } from "services/uploads";
import { isFile } from "lib/utils";

export default function SeasonsToVisitId({
  params: { id },
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const isEdited = id !== "create";
  const { toast } = useToast();
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

  const seasons = ["Summer", "Winter", "Autumn", "Spring"];

  const methods = useForm<any>({
    // resolver: zodResolver(RegisterUserSchema),
    mode: "onBlur",
    defaultValues: isEdited
      ? async () => {
          const response = apiGetSeasonsByDestinationId(Number(id));
          const data = (await response).data;

          return {
            seasonToVisit: [...data],
            destinationId: id.toString(),
          };
        }
      : {
          seasonToVisit: seasons.map((seasonName: string) => ({
            name: seasonName,
            title: "",
            description: "",
            eventOccasions: "",
            period: "",
            temperature: "",
          })),
        },
  });
  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitSuccessful, isLoading },
  } = methods;
  const onSubmitHandler: SubmitHandler<any> = async (values) => {
    if (isEdited) {
      const { seasonToVisit, ...rest } = values;
      const seasonResponse = await Promise.all(
        seasonToVisit.map(async (season: any) => {
          let seasonImageResponse;
          if (
            isFile(season.media?.desktopMediaUrl) ||
            isFile(season.media?.mobileMediaUrl)
          ) {
            seasonImageResponse = await apiUploadsMediaService({
              desktopMediaUrl: season.media?.desktopMediaUrl as File,
              mobileMediaUrl: season.media?.mobileMediaUrl as File,
            });
          }
          return {
            ...season,
            destinationId: Number(values.destinationId),
            media: {
              ...(isFile(season.media?.desktopMediaUrl) && {
                desktopMediaUrl: seasonImageResponse?.data[0]?.desktopMediaUrl,
              }),
              ...(isFile(season.media?.mobileMediaUrl) && {
                mobileMediaUrl: seasonImageResponse?.data[1]?.mobileMediaUrl,
              }),
            },
          };
        })
      );
      const response = await apiPutSeasons(Number(id), {
        ...rest,
        seasonToVisit: seasonResponse,
      });
      if (response.status === "success") {
        toast({
          title: `Seasons successfully Edited`,
          variant: "success",
        });
        router.push("/admin/destinations/season-to-visit");
      }
    } else {
      if (values.destinationId) {
        const { seasonToVisit, ...rest } = values;
        const seasonResponse = await Promise.all(
          seasonToVisit.map(async (season: any) => {
            const response = await apiUploadsMediaService({
              desktopMediaUrl: season?.media?.desktopMediaUrl as File,
              mobileMediaUrl: season?.media?.mobileMediaUrl as File,
            });
            return {
              ...season,
              destinationId: Number(values.destinationId),
              media: {
                desktopMediaUrl: response?.data[0]?.desktopMediaUrl,
                mobileMediaUrl: response?.data[1]?.mobileMediaUrl,
              },
            };
          })
        );
        const response = await apiPostSeasons({
          ...rest,
          seasonToVisit: seasonResponse,
        });
        if (response.status === "success") {
          reset();
          toast({
            title: `Seasons successfully Created`,
            variant: "success",
          });
          router.push("/admin/destinations/season-to-visit");
        }
      } else {
        toast({
          title: `please select DestinationId`,
          variant: "destructive",
        });
      }
    }
  };
  const options = [
    { label: "option1", value: "option1" },
    { label: "option2", value: "option2" },
  ];
  const { fields, append, remove } = useFieldArray({
    name: "seasonToVisit",
    control,
  });
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="pb-10 ">
          <PageTitle>
            {isEdited ? "Seasons - " + id : "Create Seasons"}
          </PageTitle>
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <>
              <Card className="mb-5 bg-primary-color dark:bg-gray-800">
                <CardBody>
                  <FormSelect
                    name="destinationId"
                    options={destinationData.map((item: any) => ({
                      value: item.id.toString(),
                      label: item.name,
                    }))}
                    label="destination"
                    placeholder="Select destination"
                  />
                </CardBody>
              </Card>
              {fields.map((item: any, index: number) => (
                <div key={item.name}>
                  <SubHeading>{item.name}</SubHeading>
                  <Card className="mb-5 bg-primary-color dark:bg-gray-800">
                    <CardBody>
                      <div className="flex gap-5 ">
                        <FormInput
                          label="period"
                          name={`seasonToVisit.${index}.period`}
                          placeholder="Enter period"
                        />
                      </div>
                      <div className="flex gap-5 ">
                        <FormInput
                          label="temperature"
                          name={`seasonToVisit.${index}.temperature`}
                          placeholder="Enter temperature"
                        />
                      </div>
                      <FormTextEditor
                        label="Description"
                        name={`seasonToVisit.${index}.description`}
                      />
                      <FormTextEditor
                        label="Events and occasions"
                        name={`seasonToVisit.${index}.eventOccasions`}
                      />
                      <Label className="pt-4 block">Season Image:</Label>
                      <div className="mt-3">
                        <ImageUploader name={`seasonToVisit.${index}.media`} />
                      </div>
                    </CardBody>
                  </Card>
                </div>
              ))}

              <SaveButton isEdit={isEdited} label="Create Seasons" />
            </>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
