"use client";
import React, { useEffect, useState } from "react";
import PageTitle from "components/CMS/components-ui/PageTitle";
import Card from "components/CMS/components-ui/card";
import CardBody from "components/CMS/components-ui/cardBody";
import { Label } from "components/CMS/components-ui/shadcn/ui/label";
import ImageUploader from "components/CMS/components-ui/imageUploader";
import FormInput from "components/CMS/components-ui/form/formInput";
import FormTextEditor from "components/CMS/components-ui/form/formTextEditor";
import Tabs from "components/CMS/components-ui/tabs";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFieldArray,
} from "react-hook-form";

import TourOverview from "../components/overview";
import TourDayToDayItinerary from "../components/daytodayitinerary";
import TourWhatToExpect from "../components/whattoexpect";
import TourDatesAndPrice from "../components/datesandprice";
import SaveButton from "components/CMS/components-ui/saveButton";
import FormCheckbox from "components/CMS/components-ui/form/formCheckbox";
import { apiGetAllDestinationService } from "services/destination";
import { apiGetHolidayTypes } from "services/holidayTypes";
import { HolidayTypesResponse, PlanServicesResponse } from "lib/types";
import { apiGetTourById, apiPostTour, apiPutTour } from "services/tour";
import { toast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import { MultiSelect } from "components/CMS/components-ui/form/multiSelect";
import { apiGetAllPlanServices } from "services/planServices";
import FormSkeleton from "components/CMS/components-ui/form/skeleton";
import { apiUploadsMediaService } from "services/uploads";
import { friendlySlug, friendlyUrl, isFile } from "lib/utils";
import { useRouter } from "next/navigation";
import SubHeading from "components/CMS/components-ui/subHeading";

type Framework = Record<"value" | "label", string>;

export default function TourCreateEdit({
  params: { id },
}: {
  params: { id: string };
}) {
  const isEdited = id !== "create";
  const [destinationData, setDestinationData] = useState([]);
  const [holidayTypesData, setHolidayTypesData] = useState<
    HolidayTypesResponse[]
  >([]);
  const router = useRouter();
  const [planServicesData, setPlanServicesData] = useState<
    PlanServicesResponse[]
  >([]);

  useEffect(() => {
    apiGetAllDestination();
    getAllHolidays();
    getAllPlanServices();
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

  const getAllHolidays = async () => {
    const response = await apiGetHolidayTypes();
    if (response?.status === "success") {
      setHolidayTypesData(response.data);
    }
  };
  const getAllPlanServices = async () => {
    const response = await apiGetAllPlanServices();
    if (response?.status === "success") {
      setPlanServicesData(response.data);
    }
  };

  const tabsContent = [
    { label: "overview", content: <TourOverview /> },
    { label: "Day To Day Itinerary", content: <TourDayToDayItinerary /> },
    { label: "Dates And Prices", content: <TourDatesAndPrice /> },
    { label: "What To Expect", content: <TourWhatToExpect /> },
  ];

  const methods = useForm<any>({
    // resolver: zodResolver(RegisterUserSchema),
    mode: "onBlur",
    defaultValues: isEdited
      ? async () => {
          const response = apiGetTourById(Number(id));
          const {
            tourDestinations,
            tourHoliDayType,
            planService,
            airFairIncluded,
            ...rest
          } = (await response).data;

          if (planService.length > 0) {
            const planServiceIds = planService?.map((item: any) => ({
              value: item.planService.id.toString(),
              label: item.planService.name,
            }));
            setSelectedPlanService(planServiceIds);
          }
          if (tourDestinations.length > 0) {
            const destinationIds = tourDestinations?.map((item: any) => ({
              value: item.destination.id.toString(),
              label: item.destination.name,
            }));
            setSelectedDestination(destinationIds);
          }
          if (tourHoliDayType.length > 0) {
            const holidayTypeIds = tourHoliDayType?.map((item: any) => ({
              value: item.holidayType.id.toString(),
              label: item.holidayType.name,
            }));
            setSelectedHolidayType(holidayTypeIds);
          }

          return {
            ...rest,
            // destinationId: data.destinationId?.toString(),
            // holidayTypeId: data.holidayTypeId?.toString(),
            airFairIncluded: airFairIncluded ? "yes" : "no",
            planService: [
              ...planService.map((item: any) => ({
                planeServiceId: Number(item.planeServiceId),
              })),
            ],
            destinations: [
              ...tourDestinations.map((item: any) => ({
                destinationId: Number(item.destinationId),
              })),
            ],
            holidayType: [
              ...tourHoliDayType.map((item: any) => ({
                holidayTypeId: Number(item.holidayTypeId),
              })),
            ],
          };
        }
      : {
          airFairIncluded: "no",
          highlights: [
            {
              description: "",
            },
          ],
          privatePlan: [
            {
              minimumPersons: "",
              maximumPersons: "",
              perPersonRate: "",
            },
          ],
          supplementPolicy: [
            {
              title: "",
              subTitle: "",
              description: "",
            },
          ],
          dayToDayItinerary: [
            {
              accommodation: "",
              destination: "",
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

  const {
    fields: planServiceFields,
    append: planServiceAppend,
    remove: planServiceRemove,
  } = useFieldArray({
    name: "planService",
    control,
  });
  const {
    fields: destinationFields,
    append: destinationAppend,
    remove: destinationRemove,
  } = useFieldArray({
    name: "destinations",
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

  const [selectedPlanService, setSelectedPlanService] = useState<Framework[]>(
    []
  );
  const [selectedDestination, setSelectedDestination] = useState<Framework[]>(
    []
  );
  const [selectedHolidayType, setSelectedHolidayType] = useState<Framework[]>(
    []
  );

  const onSubmitHandler: SubmitHandler<any> = async (values) => {
    if (isEdited) {
      const {
        accommodationImageMedia,
        bannerImageMedia,
        highlights,
        seoMeta,
        price,
        ...rest
      } = values;
      const { title, slug, ...restSeoMeta } = seoMeta;
      let accommodationImageMediaResponse;
      let bannerImageMediaResponse;
      if (
        isFile(accommodationImageMedia?.desktopMediaUrl) ||
        isFile(accommodationImageMedia?.mobileMediaUrl)
      ) {
        accommodationImageMediaResponse = await apiUploadsMediaService({
          desktopMediaUrl: accommodationImageMedia?.desktopMediaUrl as File,
          mobileMediaUrl: accommodationImageMedia?.mobileMediaUrl as File,
        });
      }
      if (
        isFile(bannerImageMedia?.desktopMediaUrl) ||
        isFile(bannerImageMedia?.mobileMediaUrl)
      ) {
        bannerImageMediaResponse = await apiUploadsMediaService({
          desktopMediaUrl: bannerImageMedia?.desktopMediaUrl as File,
          mobileMediaUrl: bannerImageMedia?.mobileMediaUrl as File,
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
      const response = await apiPutTour(Number(id), {
        ...rest,
        seoMeta: {
          ...restSeoMeta,
          title: title?.length ? title : friendlySlug(rest.title),
          slug: slug?.length ? friendlyUrl(slug) : friendlyUrl(rest.title),
        },
        price: Number(price),
        // destinationId: Number(values.destinationId),
        airFairIncluded: values.airFairIncluded == "yes" ? true : false,
        highlights: highlightsResponse,
        planDays: Number(values.planDays),
        // holidayTypeId: Number(values.holidayTypeId),
        ...(accommodationImageMediaResponse && {
          accommodationImageMedia: {
            ...(isFile(accommodationImageMedia?.desktopMediaUrl) && {
              desktopMediaUrl:
                accommodationImageMediaResponse?.data[0]?.desktopMediaUrl,
            }),
            ...(isFile(accommodationImageMedia?.mobileMediaUrl) && {
              mobileMediaUrl:
                accommodationImageMediaResponse?.data[1]?.mobileMediaUrl,
            }),
          },
        }),
        ...(bannerImageMediaResponse && {
          bannerImageMedia: {
            ...(isFile(bannerImageMedia?.desktopMediaUrl) && {
              desktopMediaUrl:
                bannerImageMediaResponse?.data[0]?.desktopMediaUrl,
            }),
            ...(isFile(bannerImageMedia?.mobileMediaUrl) && {
              mobileMediaUrl: bannerImageMediaResponse?.data[1]?.mobileMediaUrl,
            }),
          },
        }),
      });
      if (response.status === "success") {
        router.push("/admin/destinations/tours");
        reset();
        toast({
          title: `Tour successfully Updated`,
          variant: "success",
        });
      }
    } else {
      const {
        accommodationImageMedia,
        bannerImageMedia,
        highlights,
        seoMeta,
        price,
        ...rest
      } = values;
      const { title, slug, ...restSeoMeta } = seoMeta;
      const accommodationImageMediaResponse = await apiUploadsMediaService({
        desktopMediaUrl: accommodationImageMedia?.desktopMediaUrl as File,
        mobileMediaUrl: accommodationImageMedia?.mobileMediaUrl as File,
      });
      const bannerImageMediaResponse = await apiUploadsMediaService({
        desktopMediaUrl: bannerImageMedia?.desktopMediaUrl as File,
        mobileMediaUrl: bannerImageMedia?.mobileMediaUrl as File,
      });
      if (
        accommodationImageMediaResponse?.status === "success" &&
        bannerImageMediaResponse?.status === "success"
      ) {
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

        const response = await apiPostTour({
          ...rest,
          seoMeta: {
            ...restSeoMeta,
            title: title?.length ? title : friendlySlug(rest.title),
            slug: slug?.length ? friendlyUrl(slug) : friendlyUrl(rest.title),
          },
          price: Number(price),
          airFairIncluded: values.airFairIncluded == "yes" ? true : false,
          highlights: highlightsResponse,
          planDays: Number(values.planDays),

          accommodationImageMedia: {
            desktopMediaUrl:
              accommodationImageMediaResponse.data[0]?.desktopMediaUrl,
            mobileMediaUrl:
              accommodationImageMediaResponse.data[1]?.mobileMediaUrl,
          },
          bannerImageMedia: {
            desktopMediaUrl: bannerImageMediaResponse.data[0]?.desktopMediaUrl,
            mobileMediaUrl: bannerImageMediaResponse.data[1]?.mobileMediaUrl,
          },
        });
        if (response.status === "success") {
          router.push("/admin/destinations/tours");
          reset();
          toast({
            title: `Tour successfully Created`,
            variant: "success",
          });
        }
      }
    }
  };

  const handlePlanServiceSelection = (type: string, itemValue: any) => {
    if (type == "add") {
      planServiceAppend({ planeServiceId: Number(itemValue.value) });
    } else {
      let index = planServiceFields.findIndex(
        (item: any) => Number(item.planeServiceId) === Number(itemValue.value)
      );
      planServiceRemove(index);
    }
  };
  const handleDestinationSelection = (type: string, itemValue: any) => {
    if (type == "add") {
      destinationAppend({ destinationId: Number(itemValue.value) });
    } else {
      let index = destinationFields.findIndex(
        (item: any) => Number(item.destinationId) === Number(itemValue.value)
      );
      destinationRemove(index);
    }
  };
  const handleHolidayTypeSelection = (type: string, itemValue: any) => {
    if (type == "add") {
      holidayTypeAppend({ holidayTypeId: Number(itemValue.value) });
    } else {
      let index = holidayTypeFields.findIndex(
        (item: any) => Number(item.holidayTypeId) === Number(itemValue.value)
      );
      holidayTypeRemove(index);
    }
  };
  const name = methods.getValues("title");
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="pb-10 ">
          <PageTitle>
            {isEdited && name ? "tours - " + name : "Create Tours"}
          </PageTitle>

          {isLoading ? (
            <FormSkeleton />
          ) : (
            <>
              <Card className="mb-5 bg-primary-color dark:bg-gray-800">
                <CardBody>
                  <div className="flex gap-5">
                    <div className="w-full">
                      <div className="flex gap-5 ">
                        <MultiSelect
                          label="destination"
                          placeholder="Select destination"
                          options={destinationData.map((item: any) => ({
                            value: item.id.toString(),
                            label: item.name,
                          }))}
                          handleSelection={handleDestinationSelection}
                          setSelected={setSelectedDestination}
                          selected={selectedDestination}
                        />
                        {/* <FormSelect
                          name="holidayTypeId"
                          options={holidayTypesData.map((item: any) => ({
                            value: item.id.toString(),
                            label: item.name,
                          }))}
                          label="Holiday Type"
                          placeholder="Select  Holiday Type"
                        /> */}
                        <MultiSelect
                          label="Holiday Type"
                          placeholder="Select  Holiday Type"
                          options={holidayTypesData.map((item: any) => ({
                            value: item.id.toString(),
                            label: item.name,
                          }))}
                          handleSelection={handleHolidayTypeSelection}
                          setSelected={setSelectedHolidayType}
                          selected={selectedHolidayType}
                        />
                      </div>
                      <div className="flex gap-5 ">
                        <FormInput
                          label="Name"
                          name="title"
                          placeholder="Enter Name"
                        />
                        <FormInput
                          label="price"
                          name="price"
                          placeholder="Enter Price"
                        />
                      </div>
                      <div className="flex gap-5 ">
                        <MultiSelect
                          label="What Includes"
                          placeholder="Select Services"
                          options={planServicesData.map((item) => ({
                            value: item.id ? item.id.toString() : "0",
                            label: item.name,
                          }))}
                          handleSelection={handlePlanServiceSelection}
                          setSelected={setSelectedPlanService}
                          selected={selectedPlanService}
                        />
                      </div>
                    </div>
                  </div>
                  <FormTextEditor label="Locations" name="description" />
                  <Label className="pt-4 block">Banner Image:</Label>
                  <div className="mt-3">
                    <ImageUploader name="bannerImageMedia" />
                  </div>
                  <Label className="pt-4 block">Accommodation Image:</Label>
                  <div className="mt-3">
                    <ImageUploader name="accommodationImageMedia" />
                  </div>
                </CardBody>
              </Card>

              <Card className="mb-5 bg-primary-color dark:bg-gray-800">
                <CardBody>
                  <div className="flex gap-5 ">
                    <FormInput
                      label="meeting Point"
                      name="meetingPoint"
                      placeholder="Enter Meeting Point"
                    />

                    <FormInput
                      label="Departure Point"
                      name="departurePoint"
                      placeholder="Enter Departure Point"
                    />
                  </div>
                  <div className="flex gap-5 items-center">
                    <div className="w-[50%]">
                      <FormInput
                        label="plan Days"
                        name="planDays"
                        placeholder="Enter Plan Days"
                      />
                    </div>
                    <div className="w-[50%] flex gap-5">
                      <FormCheckbox
                        label="Air Fair included"
                        name="airFairIncluded"
                      />
                    </div>
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
              <Tabs tabsContent={tabsContent} defaultValue="overview" />
              <SaveButton isEdit={isEdited} label="Create Tour" />
            </>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
