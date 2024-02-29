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
import SaveButton from "components/CMS/components-ui/saveButton";
import FormSelect from "components/CMS/components-ui/form/formSelect";
import DeleteButton from "components/CMS/components-ui/deleteButton";
import AddButton from "components/CMS/components-ui/addButton";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import {
  apiGenerateRssFeed,
  apiGetInspirationById,
  apiPostInspiration,
  apiPutInspiration,
} from "services/inspirations";
import FormSkeleton from "components/CMS/components-ui/form/skeleton";
import { InspirationResponse } from "lib/types";
import { apiGetHolidayTypes } from "services/holidayTypes";
import { apiGetAllDestinationService } from "services/destination";
import { apiUploadsMediaService } from "services/uploads";
import { friendlySlug, friendlyUrl, isFile } from "lib/utils";
import { useRouter } from "next/navigation";
import { apiGetNewInspiration } from "services/sitemap";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { InfoIcon } from "lucide-react";
import { MultiSelect } from "components/CMS/components-ui/form/multiSelect";
type Framework = Record<"value" | "label", string>;
export default function InspirationId({
  params: { id },
}: {
  params: { id: string };
}) {
  const isEdited = id !== "create";
  const router = useRouter();
  const { toast } = useToast();
  const [holidayTypes, setHolidayTypes] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any>([]);
  const [selectedDestination, setSelectedDestination] = useState<Framework[]>(
    []
  );
  const [selectedHolidayType, setSelectedHolidayType] = useState<Framework[]>(
    []
  );
  const methods = useForm<any>({
    mode: "onBlur",
    defaultValues: isEdited
      ? async () => {
          const response = apiGetInspirationById(Number(id));
          const data = (await response).data;
          const destinationIds = data?.destination?.map((item: any) => ({
            value: item.id.toString(),
            label: item.name,
          }));
          setSelectedDestination(destinationIds);
          const holidayTypeIds = data?.holidayType?.map((item: any) => ({
            value: item.id.toString(),
            label: item.name,
          }));
          setSelectedHolidayType(holidayTypeIds);
          return {
            ...data,
            destination: [
              ...data?.destination?.map((item: any) => ({
                id: Number(item.id),
              })),
            ],
            holidayType: [
              ...data?.holidayType?.map((item: any) => ({
                id: Number(item.id),
              })),
            ],
          };
        }
      : {
          inspirationDetail: [{}],
        },
  });
  const {
    reset,
    handleSubmit,
    control,
    formState: { isLoading },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    name: "inspirationDetail",
    control,
  });
  const {
    fields: destinationFields,
    append: destinationAppend,
    remove: destinationRemove,
  } = useFieldArray({
    name: "destination",
    control,
  });

  const {
    fields: holidayTypeFields,
    append: holidayTypeAppend,
    remove: holidayTypeRemove,
  } = useFieldArray({
    name: "holidayType",
    control,
  });
  const handleAddMore = () => {
    append({
      title: "",
      description: "",
    });
  };

  const onSubmitHandler: SubmitHandler<any> = async (
    values: InspirationResponse
  ) => {
    const data = {
      ...values,
      readingTime: values.readingTime ? Number(values.readingTime) : null,
    };

    if (isEdited) {
      const { media, inspirationDetail, seoMeta, ...rest } = data;
      const { title, slug, ...restSeoMeta } = seoMeta;
      let inspirationImageResponse;

      if (isFile(media?.desktopMediaUrl) || isFile(media?.mobileMediaUrl)) {
        inspirationImageResponse = await apiUploadsMediaService({
          desktopMediaUrl: media?.desktopMediaUrl as File,
          mobileMediaUrl: media?.mobileMediaUrl as File,
        });
      }
      const detailsResponse = await Promise.all(
        inspirationDetail.map(async (detail: any, index: any) => {
          let detailImageResponse;

          if (
            isFile(detail.media?.desktopMediaUrl) ||
            isFile(detail.media?.mobileMediaUrl)
          ) {
            detailImageResponse = await apiUploadsMediaService({
              desktopMediaUrl: detail.media?.desktopMediaUrl as File,
              mobileMediaUrl: detail.media?.mobileMediaUrl as File,
            });
          }
          return {
            ...detail,
            sortId: index,
            media: {
              ...(isFile(detail.media?.desktopMediaUrl) && {
                desktopMediaUrl: detailImageResponse?.data[0]?.desktopMediaUrl,
              }),
              ...(isFile(detail.media?.mobileMediaUrl) && {
                mobileMediaUrl: detailImageResponse?.data[1]?.mobileMediaUrl,
              }),
            },
          };
        })
      );
      const response = await apiPutInspiration(data.id as number, {
        ...rest,
        seoMeta: {
          ...restSeoMeta,
          title: title?.length ? title : friendlySlug(rest.title as string),
          slug: slug?.length
            ? friendlyUrl(slug)
            : friendlyUrl(rest.title as string),
        },
        inspirationDetail: detailsResponse,
        ...(inspirationImageResponse && {
          media: {
            ...(isFile(media?.desktopMediaUrl) && {
              desktopMediaUrl:
                inspirationImageResponse.data[0]?.desktopMediaUrl,
            }),
            ...(isFile(media?.mobileMediaUrl) && {
              mobileMediaUrl: inspirationImageResponse.data[1]?.mobileMediaUrl,
            }),
          },
        }),
      });
      if (response.status === "success") {
        const newInspirationResponse = await apiGetNewInspiration();
        await apiGenerateRssFeed(newInspirationResponse.data);
        router.push("/admin/inspirations");
        toast({
          title: `Inspiration successfully Edited`,
          variant: "success",
        });
      }
    } else {
      const { media, inspirationDetail, seoMeta, ...rest } = data;
      const inspirationImageResponse = await apiUploadsMediaService({
        desktopMediaUrl: media?.desktopMediaUrl as File,
        mobileMediaUrl: media?.mobileMediaUrl as File,
      });
      const inspirationDetailImageResponse = await Promise.all(
        inspirationDetail.map(async (inspirationDetail: any, index) => {
          const response = await apiUploadsMediaService({
            desktopMediaUrl: inspirationDetail?.media?.desktopMediaUrl as File,
            mobileMediaUrl: inspirationDetail?.media?.mobileMediaUrl as File,
          });
          return {
            ...inspirationDetail,
            sortId: index,
            media: {
              desktopMediaUrl: response?.data[0]?.desktopMediaUrl,
              mobileMediaUrl: response?.data[1]?.mobileMediaUrl,
            },
          };
        })
      );

      if (inspirationImageResponse?.status === "success") {
        const { title, slug, ...restSeoMeta } = seoMeta;
        const response = await apiPostInspiration({
          ...rest,
          seoMeta: {
            ...restSeoMeta,
            title: title?.length ? title : friendlySlug(rest.title as string),
            slug: slug?.length ? slug : friendlyUrl(rest.title as string),
          },
          inspirationDetail: inspirationDetailImageResponse,
          media: {
            desktopMediaUrl: inspirationImageResponse.data[0]?.desktopMediaUrl,
            mobileMediaUrl: inspirationImageResponse.data[1]?.mobileMediaUrl,
          },
        });
        if (response.status === "success") {
          const newInspirationResponse = await apiGetNewInspiration();
          await apiGenerateRssFeed(newInspirationResponse.data);
          router.push("/admin/inspirations");
          toast({
            title: `Inspiration SuccessFully Created`,
            variant: "success",
          });
          reset();
        }
      }
    }
  };

  const getHolidayTypes = async () => {
    const response = await apiGetHolidayTypes({ active: "true" });
    if (response.status) {
      setHolidayTypes(
        response.data.map((item) => ({
          label: item.name,
          value: item.id?.toString(),
        }))
      );
    }
  };
  useEffect(() => {
    getHolidayTypes();
    getAllActiveDestinations();
  }, []);

  const getAllActiveDestinations = async () => {
    const response = await apiGetAllDestinationService({
      active: "true",
      sortBy: "name",
    });
    if (response.status === "success") {
      setDestinations(
        response.data.map((item: any) => ({
          label: item.name,
          value: item.id.toString(),
        }))
      );
    }
  };

  const handleDestinationSelection = (type: string, itemValue: any) => {
    if (type == "add") {
      destinationAppend({ id: Number(itemValue.value) });
    } else {
      let index = destinationFields.findIndex(
        (item: any) => Number(item.id) === Number(itemValue.value)
      );
      destinationRemove(index);
    }
  };
  const handleHolidayTypeSelection = (type: string, itemValue: any) => {
    if (type == "add") {
      holidayTypeAppend({ id: Number(itemValue.value) });
    } else {
      let index = holidayTypeFields.findIndex(
        (item: any) => Number(item.id) === Number(itemValue.value)
      );
      holidayTypeRemove(index);
    }
  };
  const title = methods.getValues("title");
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="pb-10 ">
          <PageTitle>
            {isEdited && title
              ? "Inspiration - " + title
              : "Inspiration - Create"}
          </PageTitle>
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <>
              <Card className="mb-5 bg-primary-color dark:bg-gray-800">
                <CardBody>
                  <div className="flex gap-5">
                    {/* <FormSelect
                      name="destinationId"
                      options={destinations}
                      label="destination"
                      placeholder="Select Destination"
                    /> */}
                    <MultiSelect
                      label="destination"
                      placeholder="Select Destination"
                      options={destinations}
                      handleSelection={handleDestinationSelection}
                      setSelected={setSelectedDestination}
                      selected={selectedDestination}
                    />
                    {/* <FormSelect
                      name="holidayTypeId"
                      options={holidayTypes}
                      label="Holiday Type"
                      placeholder="Select Holiday Type"
                    /> */}
                    <MultiSelect
                      label="Holiday Type"
                      placeholder="Select  Holiday Type"
                      options={holidayTypes}
                      handleSelection={handleHolidayTypeSelection}
                      setSelected={setSelectedHolidayType}
                      selected={selectedHolidayType}
                    />
                  </div>
                  <div className="flex gap-5">
                    <FormInput
                      label="Title"
                      name="title"
                      placeholder="Enter Inspiration Title"
                    />
                    <FormInput
                      label="Reading Time"
                      name="readingTime"
                      placeholder="Enter Reading Time"
                    />
                  </div>

                  <FormTextEditor label="Description" />

                  <Label className="py-4 mt-3 mb-3">Inspiration Image</Label>
                  <div className="mt-3">
                    <ImageUploader name="media" />
                  </div>
                </CardBody>
              </Card>
              <SubHeading>Seo & Meta</SubHeading>
              <Card className="mb-5 bg-primary-color dark:bg-gray-800">
                <CardBody>
                  <div className="relative">
                    <FormInput
                      label="Meta Title"
                      name={`seoMeta.title`}
                      placeholder="Enter Meta Title"
                    />
                    <div className="absolute top-3 left-20">
                      <HoverCard openDelay={300}>
                        <HoverCardTrigger>
                          {
                            <InfoIcon className="w-[15px] h-[15px]  text-white" />
                          }
                        </HoverCardTrigger>
                        <HoverCardContent className="px-3 py-2 text-xs  w-fit bg-cms-primary-color border-cms-fourth-color max-w-[200px] text-white font-normal dark:bg-gray-800 dark:border-gray-900">
                          As per Google Guidelines Maximum Characters Limit: 60
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </div>

                  <div className="relative">
                    <FormInput
                      label="Slug"
                      name={`seoMeta.slug`}
                      placeholder="Enter Slug"
                    />
                    <div className="absolute top-3 left-12">
                      <HoverCard openDelay={300}>
                        <HoverCardTrigger>
                          {
                            <InfoIcon className="w-[15px] h-[15px] text-white" />
                          }
                        </HoverCardTrigger>
                        <HoverCardContent className="px-3 max-w-[200px] py-2 text-xs  w-fit bg-cms-primary-color border-cms-fourth-color text-white font-normal dark:bg-gray-800 dark:border-gray-900">
                          As per Google Guidelines Maximum Characters Limit: 60
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </div>
                  <div className="relative">
                    <FormInput
                      label="Keywords"
                      name={`seoMeta.keywords`}
                      placeholder="Enter Keywords"
                    />
                    <div className="absolute top-3 left-20">
                      <HoverCard openDelay={300}>
                        <HoverCardTrigger>
                          {
                            <InfoIcon className="w-[15px] h-[15px] text-white" />
                          }
                        </HoverCardTrigger>
                        <HoverCardContent className="px-3 py-2 max-w-[200px] text-xs  w-fit bg-cms-primary-color border-cms-fourth-color text-white font-normal dark:bg-gray-800 dark:border-gray-900">
                          5 to 10 Keywords
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </div>
                  <div className="relative">
                    <FormTextEditor
                      label="Meta Description"
                      name={`seoMeta.description`}
                    />
                    <div className="absolute top-3 left-32">
                      <HoverCard openDelay={300}>
                        <HoverCardTrigger>
                          {
                            <InfoIcon className="w-[15px] h-[15px] text-white" />
                          }
                        </HoverCardTrigger>
                        <HoverCardContent className="px-3 max-w-[220px] py-2 text-xs  w-fit bg-cms-primary-color border-cms-fourth-color text-white font-normal dark:bg-gray-800 dark:border-gray-900">
                          As per Google Guidelines Maximum Characters Limit: 160
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </div>
                </CardBody>
              </Card>
              {fields?.map((item: any, index: number) => (
                <Card
                  className="mb-5 bg-primary-color dark:bg-gray-800"
                  key={index}
                >
                  <CardBody>
                    <div className=" flex justify-between">
                      <SubHeading>Section {index + 1}</SubHeading>
                      <DeleteButton onClick={() => remove(index)} />
                    </div>
                    <FormInput
                      label="Main Heading"
                      name={`inspirationDetail.${index}.title`}
                      placeholder="Enter Main Heading"
                    />

                    <FormTextEditor
                      label="Description"
                      name={`inspirationDetail.${index}.description`}
                    />
                    <Label className="py-4 mt-3 mb-3">Inspiration Image</Label>
                    <div className="mt-3">
                      <ImageUploader
                        name={`inspirationDetail.${index}.media`}
                      />
                    </div>
                  </CardBody>
                </Card>
              ))}
              <AddButton onClick={handleAddMore} classes="ml-auto" />
              <SaveButton isEdit={isEdited} label="Create Inspiration" />
            </>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
