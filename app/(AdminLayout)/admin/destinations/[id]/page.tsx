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
  useForm,
  useFieldArray,
} from "react-hook-form";
import SaveButton from "components/CMS/components-ui/saveButton";
import { apiGetAllDestinationFeatures } from "services/destinationFeatures";
import { MultiSelect } from "components/CMS/components-ui/form/multiSelect";
import {
  apiCreateDestinationService,
  apiGetDestinationByIdService,
  apiUpdateDestinationService,
} from "services/destination";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import { apiUploadsMediaService } from "services/uploads";
import FormSkeleton from "components/CMS/components-ui/form/skeleton";
import { friendlySlug, isFile } from "lib/utils";
import { useRouter } from "next/navigation";

type Framework = Record<"value" | "label", string>;

export default function DestinationId({
  params: { id },
}: {
  params: { id: string };
}) {
  const { toast } = useToast();
  const [featureData, setFeaturesData] = useState<any>([]);
  const [selected, setSelected] = useState<Framework[]>([]);
  const router = useRouter();
  const isEdited = id !== "create";
  const destinationContent = [
    { name: "get bespoke plan" },
    { name: "tours" },
    { name: "places to visit" },
    { name: "things to do" },
    { name: "Seasons to visit" },
  ];

  useEffect(() => {
    getDestinationFeatures();
  }, []);

  const getDestinationFeatures = async () => {
    const response = await apiGetAllDestinationFeatures({ isActive: true });
    if (response.status === "success") {
      const featureOptions = response.data.map((feature: any) => ({
        value: feature.id,
        label: feature.name,
      }));
      setFeaturesData(featureOptions);
    }
  };

  const methods = useForm<any>({
    // resolver: zodResolver(DestinationSchema),
    mode: "onBlur",
    defaultValues: isEdited
      ? async () => {
          const response = apiGetDestinationByIdService(Number(id));
          const data = (await response).data;
          const selectedDestinationFeatureId =
            data.destinationFeatureOffered.map((item: any) => ({
              value: item.destinationFeatures.id.toString(),
              label: item.destinationFeatures.name,
            }));

          const sortedContent = destinationContent.map((item: any) => {
            const sortItem = data.content.find((ele) => ele.name === item.name);
            return sortItem
              ? sortItem
              : {
                  name: "tours",
                };
          });

          setSelected(selectedDestinationFeatureId);
          return {
            ...data,
            content: sortedContent,
            destinationFeatureOffered: data.destinationFeatureOffered?.map(
              (item: any) => ({
                ...item,
                name: item.destinationFeatures.name,
              })
            ),
          };
        }
      : {
          content: destinationContent,
        },
  });
  const {
    handleSubmit,
    control,
    reset,
    formState: { isLoading },
  } = methods;
  const { fields: content } = useFieldArray({
    name: "content",
    control,
  });
  const {
    fields: destinationFeatureOfferedFields,
    append: destinationFeatureOfferedAppend,
    remove: destinationFeatureOfferedRemove,
  } = useFieldArray({
    name: "destinationFeatureOffered",
    control,
  });
  const onSubmitHandler: SubmitHandler<any> = async (values) => {
    const data = {
      ...values,
      destinationFeatureOffered: values.destinationFeatureOffered.map(
        (ele: any) => ({
          description: ele.description,
          destinationFeatureId: ele.destinationFeatureId,
        })
      ),
    };
    if (isEdited) {
      const { content, ...restData } = data;
      const contentResponse = await Promise.all(
        content.map(async (contentItem: any) => {
          let contentImageResponse;
          if (
            isFile(contentItem.media?.desktopMediaUrl) ||
            isFile(contentItem.media?.mobileMediaUrl)
          ) {
            contentImageResponse = await apiUploadsMediaService({
              desktopMediaUrl: contentItem.media?.desktopMediaUrl as File,
              mobileMediaUrl: contentItem.media?.mobileMediaUrl as File,
            });
          }
          return {
            ...contentItem,
            media: {
              ...(isFile(contentItem.media?.desktopMediaUrl) && {
                desktopMediaUrl: contentImageResponse?.data[0]?.desktopMediaUrl,
              }),
              ...(isFile(contentItem.media?.mobileMediaUrl) && {
                mobileMediaUrl: contentImageResponse?.data[1]?.mobileMediaUrl,
              }),
            },
          };
        })
      );
      const response: any = await apiUpdateDestinationService(Number(id), {
        ...restData,
        content: contentResponse,
      });
      if (response?.status === "success") {
        router.push("/admin/destinations");
        toast({
          title: `Destination successfully Updated`,
          variant: "success",
        });
      }
    } else {
      const { content, seoMeta, ...restData } = data;
      const { title, ...restSeoMeta } = seoMeta;
      const contentResponse = await Promise.all(
        content.map(async (contentItem: any, index: number) => {
          const response = await apiUploadsMediaService({
            desktopMediaUrl: contentItem?.media?.desktopMediaUrl as File,
            mobileMediaUrl: contentItem?.media?.mobileMediaUrl as File,
          });
          return {
            ...contentItem,
            sortId: index,
            media: {
              desktopMediaUrl: response?.data[0]?.desktopMediaUrl,
              mobileMediaUrl: response?.data[1]?.mobileMediaUrl,
            },
          };
        })
      );

      const response: any = await apiCreateDestinationService({
        ...restData,
        seoMeta: {
          ...restSeoMeta,
          title: title.length ? title : friendlySlug(restData.name),
        },
        content: contentResponse,
      });
      if (response?.status === "success") {
        toast({
          title: `Destination successfully Created`,
          variant: "success",
        });
        reset();
        setSelected([]);
        router.push("/admin/destinations");
      }
    }
  };

  const handleSelection = (type: string, selectedItems: any) => {
    if (type == "add") {
      destinationFeatureOfferedAppend({
        name: selectedItems.label,
        description: "",
        destinationFeatureId: selectedItems.value,
      });
    } else {
      let index = destinationFeatureOfferedFields.findIndex(
        (item: any) =>
          Number(item.destinationFeatureId) === Number(selectedItems.value)
      );
      destinationFeatureOfferedRemove(index);
    }
  };
  const destinationName = methods.getValues("name");
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="pb-10 ">
          <PageTitle>
            {isEdited && destinationName
              ? "destination - " + destinationName
              : "Create Destination"}
          </PageTitle>

          {!isLoading ? (
            <>
              <Card className="mb-5 bg-primary-color dark:bg-gray-800">
                <CardBody>
                  <div className="flex gap-5">
                    <FormInput
                      label="name"
                      name="name"
                      placeholder="Enter Destination name"
                    />
                  </div>

                  <FormTextEditor
                    label="About Destination"
                    name="description"
                  />
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
              <SubHeading>Destination Features</SubHeading>
              <Card className="mb-5 bg-primary-color dark:bg-gray-800">
                <CardBody>
                  <MultiSelect
                    setSelected={setSelected}
                    selected={selected}
                    placeholder="Select Destination Features"
                    label="Destination Features"
                    options={featureData}
                    handleSelection={handleSelection}
                  />
                </CardBody>
              </Card>

              {destinationFeatureOfferedFields.map(
                (featureOffered: any, index: number) => {
                  return (
                    <div key={index}>
                      <SubHeading>{featureOffered.name}</SubHeading>

                      <Card className="mb-5 bg-primary-color dark:bg-gray-800">
                        <CardBody>
                          <FormTextEditor
                            label="Description"
                            name={`destinationFeatureOffered.${index}.description`}
                          />
                        </CardBody>
                      </Card>
                    </div>
                  );
                }
              )}

              {content.map((detail: any, index: number) => {
                return (
                  <div key={index}>
                    <SubHeading>{detail.name}</SubHeading>
                    <Card className="mb-5 bg-primary-color dark:bg-gray-800">
                      <CardBody>
                        <FormTextEditor
                          label="Description"
                          name={`content.${index}.description`}
                        />
                        <Label className="py-4 mt-3 mb-3">Inner Banner:</Label>
                        <div className="mt-3">
                          <ImageUploader name={`content.${index}.media`} />
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                );
              })}
              <SaveButton isEdit={isEdited} label="create destination" />
            </>
          ) : (
            <FormSkeleton />
          )}
        </div>
      </form>
    </FormProvider>
  );
}
