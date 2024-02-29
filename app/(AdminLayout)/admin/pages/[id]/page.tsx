"use client";
import React, { useEffect, useState } from "react";
import PageTitle from "components/CMS/components-ui/PageTitle";
import Card from "components/CMS/components-ui/card";
import CardBody from "components/CMS/components-ui/cardBody";
import FormInput from "components/CMS/components-ui/form/formInput";
import FormTextEditor from "components/CMS/components-ui/form/formTextEditor";
import { Draggable, Droppable } from "react-beautiful-dnd";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SubHeading from "components/CMS/components-ui/subHeading";
import SaveButton from "components/CMS/components-ui/saveButton";
import { apiGetPageByIdService, apiUpdatePagesService } from "services/pages";
import { PageResponse } from "lib/types";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import FormSkeleton from "components/CMS/components-ui/form/skeleton";
import ImageUploader from "components/CMS/components-ui/imageUploader";
import AddButton from "components/CMS/components-ui/addButton";
import DeleteButton from "components/CMS/components-ui/deleteButton";
import { apiUploadsMediaService } from "services/uploads";
import { isFile, removeTags, truncateText } from "lib/utils";
import { useRouter } from "next/navigation";
import { DialogBox } from "components/CMS/components-ui/modalBox";
import CustomTable from "components/CMS/components-ui/table";
import { Button } from "components/CMS/components-ui/shadcn/ui/button";
import AddInspirationHomePage from "components/CMS/side-drawers/addHomePageInpirations";
import FormSelect from "components/CMS/components-ui/form/formSelect";
import { apiTemplateDestinations } from "services/destination";
import {
  apiChangeSortInspirationsService,
  apiGetAllInspirations,
  apiUpdateInspirationStatus,
} from "services/inspirations";
import FormLabel from "components/CMS/components-ui/form/formLabel";
import CustomSelect from "components/CMS/components-ui/form/select";
import { handleApiError } from "lib/api-helpers";
import VideoUploader from "components/CMS/components-ui/videoUploader";

export default function PageCreateEdit({
  params: { id },
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const methods = useForm<PageResponse>({
    // resolver: zodResolver(PagesSchema),
    mode: "onBlur",
    defaultValues: async () => {
      const response = apiGetPageByIdService(Number(id));
      return (await response).data;
    },
  });
  const { toast } = useToast();
  const {
    handleSubmit,
    control,
    getValues,

    formState: { isLoading, errors },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    name: "content",
    control,
  });

  const onSubmitHandler: SubmitHandler<PageResponse> = async (values) => {
    const { id, content, ...rest } = values;
    let contentsResponse;
    if (content) {
      contentsResponse = await Promise.all(
        content.map(async ({ media, ...restContent }) => {
          if (isFile(media?.desktopMediaUrl) || isFile(media?.mobileMediaUrl)) {
            const response = await apiUploadsMediaService({
              desktopMediaUrl: media?.desktopMediaUrl as File,
              mobileMediaUrl: media?.mobileMediaUrl as File,
            });

            return {
              ...restContent,
              media: {
                ...(isFile(media?.desktopMediaUrl) && {
                  desktopMediaUrl: response?.data[0]?.desktopMediaUrl,
                }),
                ...(isFile(media?.mobileMediaUrl) && {
                  mobileMediaUrl: response?.data[1]?.mobileMediaUrl,
                }),
              },
            };
          } else return { ...restContent };
        })
      );
    }

    const response: any = await apiUpdatePagesService(Number(id), {
      ...rest,
      content: contentsResponse,
    });
    if (response?.status === "success") {
      router.push("/admin/pages");
      toast({
        title: `${response.data.name} successfully Updated`,
        variant: "success",
      });
    }
  };

  const uniqueSection: string[] = [];
  const checkSectionUniqueness = (sectionName: string) => {
    return uniqueSection.includes(sectionName)
      ? false
      : uniqueSection.push(sectionName);
  };
  const handleAddMore = () => {
    append({
      name: " ",
      title: " ",
      subTitle: " ",
      description: " ",
      buttonText: " ",
      buttonUrl: " ",
    });
  };

  const pageName = getValues("name");
  const isExpandable = getValues("isExpandable");

  const [inspirationsList, setInspirationsList] = useState<any>([]);

  const tableHeader = [
    {
      key: "id",
      name: "id",
    },
    {
      key: "title",
      name: "title",
      render: (value: any, row: any) => truncateText(value),
    },
    {
      key: "destination",
      name: "destination",
      render: (value: any, row: any) =>
        row?.destination
          ?.reduce((acc: any, curr: any) => acc + curr?.name, "")
          ?.toString(),
    },
    {
      key: "description",
      name: "description",
      render: (value: any, row: any) => truncateText(removeTags(value)),
    },
  ];

  const [destinations, setDestinations] = useState<
    {
      label: string;
      value: string;
    }[]
  >();
  const [inspiration, setInspiration] = useState<
    {
      label: string;
      value: string;
    }[]
  >();
  const [selectedDestination, setSelectedDestination] = useState<any>();
  const [selectedInspiration, setSelectedInspiration] = useState<any>();
  const [isMounted, setIsMounted] = useState(false);

  const getDestinations = async () => {
    const response = await apiTemplateDestinations();
    if (response?.status === "success") {
      setDestinations(
        response?.data.map((destination: any) => ({
          label: destination.name,
          value: destination.id.toString(),
        }))
      );
    }
  };
  const getInspirations = async () => {
    try {
      const response = await apiGetAllInspirations({
        ...(selectedDestination && {
          destinationId: selectedDestination,
        }),
      });

      if (response?.status === "success") {
        setInspiration(
          response?.data?.map((inspiration: any) => ({
            label: inspiration?.title,
            value: inspiration?.id.toString(),
          }))
        );
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const getAllHomePageInspirations = async () => {
    const response = await apiGetAllInspirations({
      isHomePageSort: "true",
    });

    if (response?.status === "success") {
      setInspirationsList(
        response?.data.sort(
          (a: any, b: any) => a.homePageSortId - b.homePageSortId
        )
      );
    }
  };

  const handleAddInspiration = (value: string) => {
    setSelectedInspiration(value);
  };
  const handleDestination = (value: string) => {
    setSelectedDestination(value);
  };

  const handleButtonAddInspiration = async () => {
    const checkInspirationExist = inspirationsList.find(
      (ele: any) => ele.id === Number(selectedInspiration)
    );
    if (checkInspirationExist) {
      toast({
        title: `Inspiration Already Added`,
        variant: "destructive",
      });
    } else {
      const response = await apiUpdateInspirationStatus(selectedInspiration, {
        isHomePageSort: true,
      });

      if (response.status === "success") {
        setInspirationsList((prev: any) => [...prev, response.data]);
        toast({
          title: `Inspiration Add to Home Page Successfully`,
          variant: "success",
        });
      }
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) {
      return;
    }
    const sortPosition = result.source.index - result.destination.index;
    const destinationItem = inspirationsList[result.destination.index];
    const draggedItem = inspirationsList.find(
      (ele: any) => ele.id === Number(result.draggableId)
    )!;
    const items = inspirationsList
      .map((ele: any) => {
        if (ele.id === Number(result.draggableId)) {
          return {
            ...ele,
            homePageSortId: Number(destinationItem.homePageSortId),
          };
        } else if (
          sortPosition < 0 &&
          destinationItem?.homePageSortId >= ele?.homePageSortId &&
          draggedItem?.homePageSortId <= ele?.homePageSortId
        ) {
          return {
            ...ele,
            homePageSortId: ele.homePageSortId - 1,
          };
        } else if (
          sortPosition > 0 &&
          draggedItem?.homePageSortId >= ele?.homePageSortId &&
          destinationItem?.homePageSortId <= ele?.homePageSortId
        ) {
          return {
            ...ele,
            homePageSortId: ele.homePageSortId + 1,
          };
        } else return ele;
      })
      .sort((a: any, b: any) => a.homePageSortId - b.homePageSortId);
    if (sortPosition) {
      try {
        setInspirationsList(items);
        await apiChangeSortInspirationsService({
          homePageSort: true,
          sourceId: Number(result.draggableId),
          sortPosition,
          destinationIdSortId: destinationItem.homePageSortId,
          destinationId: destinationItem.destinationId,
        });

        toast({ title: "Inspiration Sort Saved", variant: "success" });
      } catch (error: any) {
        handleApiError(error);
      }
    }
  };
  const handleDelete = async (row: any) => {
    const response = await apiUpdateInspirationStatus(row.id, {
      isHomePageSort: false,
    });

    if (response.status === "success") {
      setInspirationsList((prev: any) =>
        prev.filter((ele: any) => ele.id !== row.id)
      );
      toast({
        title: `Inspiration remove from Home Page Successfully`,
        variant: "success",
      });
    }
  };

  useEffect(() => {
    if (pageName === "home") {
      getDestinations();
      getAllHomePageInspirations();
    }
  }, [pageName]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      getInspirations();
    }
  }, [selectedDestination]);
  return (
    <div className="pb-10 ">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <PageTitle>{pageName ? `Pages - ${pageName} ` : "Pages"}</PageTitle>
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <>
              <SubHeading>Seo & Meta</SubHeading>
              <Card className="mb-5 bg-primary-color dark:bg-gray-800">
                <CardBody>
                  <div className="relative">
                    <FormInput
                      label="Meta Title"
                      name={`seoMeta.title`}
                      placeholder="Enter Meta Title"
                      informationText=" As per Google Guidelines Maximum Characters Limit: 60 "
                    />
                  </div>
                  <div className="relative">
                    <FormInput
                      label="Keywords"
                      name={`seoMeta.keywords`}
                      placeholder="Enter Keywords"
                      informationText=" 5 to 10 Keywords "
                    />
                  </div>
                  <div className="relative"></div>
                  <div className="relative">
                    <FormTextEditor
                      label="Meta Description"
                      name={`seoMeta.description`}
                      informationText=" As per Google Guidelines Maximum Characters Limit: 160"
                    />
                  </div>
                </CardBody>
              </Card>

              {fields?.map((item: any, index: number) => {
                return (
                  <>
                    {checkSectionUniqueness(item.name) && (
                      <SubHeading>{item?.name}</SubHeading>
                    )}

                    <Card
                      className="mb-5 bg-primary-color dark:bg-gray-800"
                      key={index}
                    >
                      <CardBody>
                        {!item?.createByDefault && (
                          <DeleteButton
                            classes="ml-auto block"
                            onClick={() => remove(index)}
                          />
                        )}
                        <div className="flex gap-5">
                          {item?.name && !item?.createByDefault && (
                            <FormInput
                              label="name"
                              name={`content.${index}.name`}
                              placeholder="Enter Section name"
                            />
                          )}
                          {item?.title !== null && (
                            <FormInput
                              label="Main Heading"
                              name={`content.${index}.title`}
                              placeholder="Enter Main Heading"
                              errorMessage={
                                errors?.content?.[index]?.title?.message
                              }
                            />
                          )}
                          {item?.subTitle !== null && (
                            <FormInput
                              label="Sub Heading"
                              name={`content.${index}.subTitle`}
                              placeholder="Enter Sub Heading"
                            />
                          )}
                        </div>
                        <div className="flex gap-5">
                          {item?.buttonText !== null && (
                            <FormInput
                              label="Button Text"
                              name={`content.${index}.buttonText`}
                              placeholder="Enter Button Text"
                            />
                          )}
                          {item?.buttonUrl !== null && (
                            <FormInput
                              label="Button URL"
                              name={`content.${index}.buttonUrl`}
                              placeholder="Enter Button URL"
                            />
                          )}
                        </div>
                        {item?.description !== null && (
                          <FormTextEditor
                            label="Description"
                            name={`content.${index}.description`}
                          />
                        )}
                        {item?.imageId && item?.media?.type === "image" && (
                          <ImageUploader name={`content.${index}.media`} />
                        )}
                        {item?.imageId && item?.media?.type === "video" && (
                          <VideoUploader name={`content.${index}.media`} />
                        )}
                        {item?.name === "journey" && (
                          <>
                            <div className="w-full flex justify-center items-center gap-5 ">
                              <div className="flex gap-2 w-full">
                                <div className="relative mb-3 w-full">
                                  <FormLabel>Destination</FormLabel>
                                  <CustomSelect
                                    name={"name"}
                                    options={destinations ?? []}
                                    placeholder={"Select Destination"}
                                    value={selectedDestination as string}
                                    onChange={handleDestination}
                                  />
                                </div>
                                <div className="relative mb-3 w-full">
                                  <FormLabel>inspirations</FormLabel>
                                  <CustomSelect
                                    name={"inspirations"}
                                    options={inspiration ?? []}
                                    placeholder={"Select Inspiration"}
                                    value={selectedInspiration as string}
                                    onChange={handleAddInspiration}
                                  />
                                </div>
                              </div>

                              <Button
                                onClick={handleButtonAddInspiration}
                                variant="outline"
                                type="button"
                                className="bg-cms-tertiary-color flex-1 whitespace-nowrap mt-5"
                              >
                                Add Inspiration
                              </Button>
                            </div>
                            <CustomTable
                              onDragEnd={handleDragEnd}
                              isDraggable
                              isPageSizeEnable={false}
                              tableContent={inspirationsList}
                              tableHeadings={tableHeader}
                              isActionButtons={true}
                              actionHandles={{
                                onDelete: (row: any) => handleDelete(row),
                              }}
                            />
                          </>
                        )}
                      </CardBody>
                    </Card>
                  </>
                );
              })}

              {isExpandable && (
                <AddButton classes="ml-auto" onClick={handleAddMore} />
              )}
              <SaveButton isEdit={true} />
            </>
          )}
        </form>
      </FormProvider>
    </div>
  );
}
