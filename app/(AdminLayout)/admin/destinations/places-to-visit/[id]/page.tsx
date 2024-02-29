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
import {
  RegisterUserInput,
  RegisterUserSchema,
} from "lib/validations/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import SaveButton from "components/CMS/components-ui/saveButton";
import FormSelect from "components/CMS/components-ui/form/formSelect";
import DeleteButton from "components/CMS/components-ui/deleteButton";
import AddButton from "components/CMS/components-ui/addButton";
import Image from "next/image";
import upload from "@public/template/upload-image.png";
import { apiGetAllDestinationService } from "services/destination";
import { apiGetPlacesById, apiPostPlace, apiPutPlace } from "services/places";
import { toast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import FormSkeleton from "components/CMS/components-ui/form/skeleton";
import SingleImageUploader from "components/CMS/components-ui/singleImageUploader";
import { apiUploadsMediaService } from "services/uploads";
import { friendlySlug, friendlyUrl, isFile } from "lib/utils";
import { useRouter } from "next/navigation";

export default function PlacesToVisitId({
  params: { id },
}: {
  params: { id: string };
}) {
  const isEdited = id !== "create";
  const router = useRouter();
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
          const response = apiGetPlacesById(Number(id));
          const data = (await response).data;

          return {
            ...data,
            destinationId: data.destinationId.toString(),
          };
        }
      : {
          reviews: [
            {
              name: "",
              location: "",
              description: "",
            },
          ],
          attraction: [
            {
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
    formState: { isSubmitSuccessful, isLoading },
  } = methods;
  const onSubmitHandler: SubmitHandler<any> = async (values) => {
    if (isEdited) {
      const { media, reviews, attraction, destinationId, ...rest } = values;
      let placeImageResponse;

      if (isFile(media?.desktopMediaUrl) || isFile(media?.mobileMediaUrl)) {
        placeImageResponse = await apiUploadsMediaService({
          desktopMediaUrl: media?.desktopMediaUrl as File,
          mobileMediaUrl: media?.mobileMediaUrl as File,
        });
      }

      let reviewsResponse;
      if (reviews?.length) {
        reviewsResponse = await Promise.all(
          reviews.map(async (review: any) => {
            let reviewsImageResponse;
            if (
              isFile(review.media?.desktopMediaUrl) ||
              isFile(review.media?.mobileMediaUrl)
            ) {
              reviewsImageResponse = await apiUploadsMediaService({
                desktopMediaUrl: review.media?.desktopMediaUrl as File,
                mobileMediaUrl: review.media?.mobileMediaUrl as File,
              });
            }
            return {
              ...review,
              media: {
                ...(isFile(review.media?.desktopMediaUrl) && {
                  desktopMediaUrl:
                    reviewsImageResponse?.data[0]?.desktopMediaUrl,
                }),
                ...(isFile(review.media?.mobileMediaUrl) && {
                  mobileMediaUrl: reviewsImageResponse?.data[1]?.mobileMediaUrl,
                }),
              },
            };
          })
        );
      }
      let attractionResponse;
      if (attraction?.length) {
        attractionResponse = await Promise.all(
          attraction.map(async (attr: any) => {
            let attractionImageResponse;
            if (
              isFile(attr.media?.desktopMediaUrl) ||
              isFile(attr.media?.mobileMediaUrl)
            ) {
              attractionImageResponse = await apiUploadsMediaService({
                desktopMediaUrl: attr.media?.desktopMediaUrl as File,
                mobileMediaUrl: attr.media?.mobileMediaUrl as File,
              });
            }
            return {
              ...attr,
              media: {
                ...(isFile(attr.media?.desktopMediaUrl) && {
                  desktopMediaUrl:
                    attractionImageResponse?.data[0]?.desktopMediaUrl,
                }),
                ...(isFile(attr.media?.mobileMediaUrl) && {
                  mobileMediaUrl:
                    attractionImageResponse?.data[1]?.mobileMediaUrl,
                }),
              },
            };
          })
        );
      }

      const response = await apiPutPlace(Number(id), {
        ...rest,
        destinationId: Number(destinationId),
        reviews: reviewsResponse,
        attraction: attractionResponse,
        ...(placeImageResponse && {
          media: {
            ...(isFile(media?.desktopMediaUrl) && {
              desktopMediaUrl: placeImageResponse.data[0]?.desktopMediaUrl,
            }),
            ...(isFile(media?.mobileMediaUrl) && {
              mobileMediaUrl: placeImageResponse.data[1]?.mobileMediaUrl,
            }),
          },
        }),
      });
      if (response.status === "success") {
        reset();
        router.push("/admin/destinations/places-to-visit");
        toast({
          title: `Place successfully Updated`,
          variant: "success",
        });
      }
    } else {
      const { media, reviews, attraction, seoMeta, ...rest } = values;
      const { title, slug, ...restSeoMeta } = seoMeta;

      const placeBannerResponse = await apiUploadsMediaService({
        desktopMediaUrl: values?.media?.desktopMediaUrl as File,
        mobileMediaUrl: values?.media?.mobileMediaUrl as File,
      });
      if (placeBannerResponse?.status === "success") {
        const reviewResponse = await Promise.all(
          reviews.map(async (rev: any) => {
            const response = await apiUploadsMediaService({
              desktopMediaUrl: rev?.media?.desktopMediaUrl as File,
              mobileMediaUrl: rev?.media?.mobileMediaUrl as File,
            });
            return {
              ...rev,
              media: {
                desktopMediaUrl: response?.data[0]?.desktopMediaUrl,
                mobileMediaUrl: response?.data[1]?.mobileMediaUrl,
              },
            };
          })
        );

        const attractionResponse = await Promise.all(
          attraction.map(async (attr: any) => {
            const response = await apiUploadsMediaService({
              desktopMediaUrl: attr?.media?.desktopMediaUrl as File,
              mobileMediaUrl: attr?.media?.mobileMediaUrl as File,
            });
            return {
              ...attr,
              media: {
                desktopMediaUrl: response?.data[0]?.desktopMediaUrl,
                mobileMediaUrl: response?.data[1]?.mobileMediaUrl,
              },
            };
          })
        );
        let data = {
          ...rest,
          seoMeta: {
            ...restSeoMeta,
            title: title?.length ? title : friendlySlug(rest.title),
            slug: slug?.length ? slug : friendlyUrl(rest.title),
          },
          reviews: reviewResponse,
          attraction: attractionResponse,
          media: {
            desktopMediaUrl: placeBannerResponse.data[0]?.desktopMediaUrl,
            mobileMediaUrl: placeBannerResponse.data[1]?.mobileMediaUrl,
          },
        };
        const response = await apiPostPlace(data);
        if (response.status === "success") {
          reset();
          router.push("/admin/destinations/places-to-visit");
          toast({
            title: `Place successfully Created`,
            variant: "success",
          });
        }
      }
    }
  };

  const {
    fields: reviewsFields,
    append: reviewsAppend,
    remove: reviewsRemove,
  } = useFieldArray({
    name: "reviews",
    control,
  });
  const {
    fields: attractionFields,
    append: attractionAppend,
    remove: attractionRemove,
  } = useFieldArray({
    name: "attraction",
    control,
  });

  const name = methods.getValues("title");
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="pb-10 ">
          <PageTitle>
            {isEdited && name
              ? "Place To Visit - " + name
              : "Create Place To Visit"}
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
                  <FormInput
                    label="Place Title"
                    name="title"
                    placeholder="Enter Place Title"
                  />

                  <FormTextEditor
                    label="Place Description"
                    name="description"
                  />
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

              <SubHeading>Attractions</SubHeading>
              <Card className="mb-5 bg-primary-color dark:bg-gray-800">
                <CardBody>
                  <FormTextEditor
                    label="Attraction Description"
                    name="attractionDescription"
                  />
                </CardBody>
              </Card>
              {attractionFields.map((item: any, index: number) => (
                <Card
                  className="mb-5 bg-primary-color dark:bg-gray-800"
                  key={index}
                >
                  <CardBody>
                    <div className="flex justify-between">
                      <SubHeading>Attraction {index + 1}</SubHeading>
                      <DeleteButton
                        onClick={() => {
                          attractionRemove(index);
                        }}
                      />
                    </div>
                    <FormInput
                      label="Place Title"
                      name={`attraction.${index}.title`}
                      placeholder="Enter Place Title"
                    />

                    <FormTextEditor
                      label="Place Description"
                      name={`attraction.${index}.description`}
                    />
                    <Label className="py-4 pt-3 mb-3 block">Image:</Label>
                    <div className="mt-3">
                      <ImageUploader name={`attraction.${index}.media`} />
                    </div>
                  </CardBody>
                </Card>
              ))}
              <AddButton
                onClick={() => {
                  attractionAppend({
                    title: "",
                    description: "",
                  });
                }}
                classes="ml-auto"
              />
              <SaveButton isEdit={isEdited} label="Create Place" />
            </>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
