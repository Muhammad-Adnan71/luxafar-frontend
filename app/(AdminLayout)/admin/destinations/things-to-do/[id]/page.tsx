"use client";
import React, { useEffect, useState } from "react";
import PageTitle from "components/CMS/components-ui/PageTitle";
import { Button } from "components/CMS/components-ui/shadcn/ui/button";
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
import {
  RegisterUserInput,
  RegisterUserSchema,
} from "lib/validations/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import SaveButton from "components/CMS/components-ui/saveButton";
import FormSelect from "components/CMS/components-ui/form/formSelect";
import DeleteButton from "components/CMS/components-ui/deleteButton";
import AddButton from "components/CMS/components-ui/addButton";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import { apiGetAllDestinationService } from "services/destination";
import FormSkeleton from "components/CMS/components-ui/form/skeleton";
import {
  apiGetThingsToDoById,
  apiPostThingsToDo,
  apiPutThingsToDo,
} from "services/thingsToDo";
import { useRouter } from "next/navigation";
import { apiUploadsMediaService } from "services/uploads";
import { isFile } from "lib/utils";

export default function ThingsToDoId({
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
  const methods = useForm<any>({
    // resolver: zodResolver(RegisterUserSchema),
    mode: "onBlur",
    defaultValues: isEdited
      ? async () => {
          const response = apiGetThingsToDoById(Number(id));
          const data = (await response).data;

          return {
            thingsToDo: [...data],
            destinationId: id.toString(),
          };
        }
      : {
          thingsToDo: [
            {
              destinationId: "",
              title: "",
              description: "",
            },
          ],
        },
  });
  const {
    reset,
    handleSubmit,
    control,
    formState: { isLoading },
  } = methods;
  const onSubmitHandler: SubmitHandler<any> = async (values) => {
    if (isEdited) {
      const { thingsToDo, ...rest } = values;
      const thingsResponse = await Promise.all(
        thingsToDo.map(async (thing: any) => {
          let thingsImageResponse;
          if (
            isFile(thing.media?.desktopMediaUrl) ||
            isFile(thing.media?.mobileMediaUrl)
          ) {
            thingsImageResponse = await apiUploadsMediaService({
              desktopMediaUrl: thing.media?.desktopMediaUrl as File,
              mobileMediaUrl: thing.media?.mobileMediaUrl as File,
            });
          }
          return {
            ...thing,
            destinationId: Number(values.destinationId),
            media: {
              ...(isFile(thing.media?.desktopMediaUrl) && {
                desktopMediaUrl: thingsImageResponse?.data[0]?.desktopMediaUrl,
              }),
              ...(isFile(thing.media?.mobileMediaUrl) && {
                mobileMediaUrl: thingsImageResponse?.data[1]?.mobileMediaUrl,
              }),
            },
          };
        })
      );
      const response = await apiPutThingsToDo(Number(id), {
        ...rest,
        thingsToDo: thingsResponse,
      });
      if (response.status === "success") {
        toast({
          title: `Things To do successfully Edited`,
          variant: "success",
        });
        router.push("/admin/destinations/things-to-do");
      }
    } else {
      if (values.destinationId) {
        const { thingsToDo, ...rest } = values;
        const thingsResponse = await Promise.all(
          thingsToDo.map(async (thing: any) => {
            const response = await apiUploadsMediaService({
              desktopMediaUrl: thing?.media?.desktopMediaUrl as File,
              mobileMediaUrl: thing?.media?.mobileMediaUrl as File,
            });
            return {
              ...thing,
              destinationId: Number(values.destinationId),
              media: {
                desktopMediaUrl: response?.data[0]?.desktopMediaUrl,
                mobileMediaUrl: response?.data[1]?.mobileMediaUrl,
              },
            };
          })
        );

        const response = await apiPostThingsToDo({
          ...rest,
          thingsTodo: thingsResponse,
        });
        if (response.status === "success") {
          reset();
          toast({
            title: `Things To do successfully Created`,
            variant: "success",
          });
          router.push("/admin/destinations/things-to-do");
        }
      } else {
        toast({
          title: `please select DestinationId`,
          variant: "destructive",
        });
      }
    }
  };

  const { fields, append, remove } = useFieldArray({
    name: "thingsToDo",
    control,
  });

  const handleAddMore = () => {
    append({
      destinationId: "",
      title: "",
      description: " ",
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="pb-10 ">
          <PageTitle>
            {isEdited ? "Things To Do - " : "Create Things To Do"}
          </PageTitle>
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
              {fields.map((item, index) => (
                <Card
                  className="mb-5 bg-primary-color dark:bg-gray-800"
                  key={index}
                >
                  <CardBody>
                    <div className="flex justify-between">
                      <SubHeading>Thing {index + 1}</SubHeading>
                      <DeleteButton
                        onClick={() => {
                          remove(index);
                        }}
                      />
                    </div>
                    <FormInput
                      label="name"
                      name={`thingsToDo.${index}.title`}
                      placeholder="Enter Destination name"
                    />

                    <FormTextEditor
                      label="Destination"
                      name={`thingsToDo.${index}.description`}
                    />

                    <Label className="py-4 pt-3 mb-3 block">Image:</Label>
                    <div className="mt-3">
                      <ImageUploader name={`thingsToDo.${index}.media`} />
                    </div>
                  </CardBody>
                </Card>
              ))}
              <AddButton
                onClick={() => {
                  handleAddMore();
                }}
                classes="ml-auto"
              />

              <SaveButton isEdit={isEdited} label="Create Things To Do" />
            </>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
