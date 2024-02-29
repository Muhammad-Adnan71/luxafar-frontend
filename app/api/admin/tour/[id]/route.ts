import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { MediaResponse } from "lib/types";
import { convertMediaIdsResponseIntoMediaUrl, isNumeric } from "lib/utils";
import { NextResponse } from "next/server";
import { getUploadsUrl } from "services/uploads";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);
    const tourById = await prisma.tours.findFirst({
      where: {
        id: id,
      },
      include: {
        seoMeta: true,
        highlights: {
          include: {
            media: true,
          },
        },
        dayToDayItinerary: true,
        privatePlan: true,
        supplementPolicy: true,
        planService: {
          include: {
            planService: true,
          },
        },
        tourDestinations: {
          include: {
            destination: true,
          },
        },
        tourHoliDayType: {
          include: {
            holidayType: true,
          },
        },
        accommodationImageMedia: true,
        bannerImageMedia: true,
      },
    });

    const [bannerImageMediaResponse, accommodationImageMediaResponse] =
      await Promise.all([
        convertMediaIdsResponseIntoMediaUrl(tourById, "bannerImageMedia"),
        convertMediaIdsResponseIntoMediaUrl(
          tourById,
          "accommodationImageMedia"
        ),
      ]);
    let highlightsResponse;

    if (tourById?.highlights) {
      highlightsResponse = await Promise.all(
        tourById?.highlights.map(async (highlight: any) => {
          const highlightResponse = await convertMediaIdsResponseIntoMediaUrl(
            highlight
          );
          return {
            ...highlightResponse,
          };
        })
      );
    }

    return new NextResponse(
      JSON.stringify({
        data: {
          ...tourById,
          highlights: highlightsResponse,
          bannerImageMedia: bannerImageMediaResponse.bannerImageMedia,
          accommodationImageMedia:
            accommodationImageMediaResponse.accommodationImageMedia,
        },
        status: "success",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}

// this route needs to refactor
export async function PUT(
  req: Request,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);
    const body = await req.json();

    if (id) {
      if (
        body.highlights?.length ||
        body.dayToDayItinerary?.length ||
        body.privatePlan?.length ||
        body.supplementPolicy?.length
      ) {
        const {
          highlights,
          dayToDayItinerary,
          privatePlan,
          supplementPolicy,
          planService,
          accommodationImageMedia,
          bannerImageMedia,
          destinationId,
          bannerImageId,
          accommodationImageId,
          holidayTypeId,
          id,
          destinations,
          holidayType,
          seoMeta,
          seoMetaId,
          ...rest
        } = body;

        const highlightsDB = await prisma.highlights.findMany({
          where: { tourId: id },
          select: {
            id: true,
          },
        });

        const highlightIds = highlights.map((item: any) => item.id);

        const deleteHighlightIds = highlightsDB
          .filter((item: any) => !highlightIds.includes(item.id))
          .map((item) => item.id);

        const dayToDayItineraryDB = await prisma.dayToDayItinerary.findMany({
          where: { tourId: id },
          select: {
            id: true,
          },
        });

        const dayToDayItineraryIds = dayToDayItinerary.map(
          (item: any) => item.id
        );

        const deleteDayToDayItineraryIds = dayToDayItineraryDB
          .filter((item: any) => !dayToDayItineraryIds.includes(item.id))
          .map((item) => item.id);

        const privatePlanDB = await prisma.privatePlan.findMany({
          where: { tourId: id },
          select: {
            id: true,
          },
        });

        const privatePlanIds = privatePlan.map((item: any) => item.id);

        const deletePrivatePlanIds = privatePlanDB
          .filter((item: any) => !privatePlanIds.includes(item.id))
          .map((item) => item.id);

        const supplementPolicyDB = await prisma.supplementPolicy.findMany({
          where: { tourId: id },
          select: {
            id: true,
          },
        });

        const supplementPolicyIds = supplementPolicy.map(
          (item: any) => item.id
        );

        const deleteSupplementPolicyIds = supplementPolicyDB
          .filter((item: any) => !supplementPolicyIds.includes(item.id))
          .map((item) => item.id);

        const addTourId = await planService.map((item: any) => ({
          ...item,
          tourId: id,
        }));
        const addTourIdOnDestination = await destinations.map((des: any) => ({
          ...des,
          tourId: id,
        }));
        const addTourIdOnHolidayType = await holidayType.map((des: any) => ({
          ...des,
          tourId: id,
        }));
        let newSeoMeta;
        if (!seoMetaId) {
          newSeoMeta = await prisma.seoMeta.create({
            data: seoMeta,
          });
        }
        const response = await prisma.$transaction([
          prisma.tours.update({
            where: {
              id: id,
            },
            data: {
              ...rest,
              // destination: { connect: { id: destinationId } },
              // holiDayType: { connect: { id: holidayTypeId } },
              ...(seoMetaId
                ? {
                    seoMeta: {
                      update: {
                        data: seoMeta,
                      },
                    },
                  }
                : {
                    seoMeta: {
                      connect: { id: newSeoMeta?.id },
                    },
                  }),
              accommodationImageMedia: {
                update: accommodationImageMedia,
              },
              bannerImageMedia: {
                update: bannerImageMedia,
              },
            },
            include: {
              highlights: true,
              dayToDayItinerary: true,
              privatePlan: true,
              supplementPolicy: true,
              accommodationImageMedia: true,
              bannerImageMedia: true,
            },
          }),
          ...highlights.map((element: any) => {
            const {
              media: elementMedia,
              id: elementId,
              imageId: elementImageId,
              holidayTypeId,
              tourId,
              ...restElement
            } = element;
            if (elementId) {
              return prisma.highlights.update({
                where: {
                  id: element.id,
                },
                data: { ...restElement, media: { update: elementMedia } },
              });
            } else {
              return prisma.highlights.create({
                data: {
                  tour: {
                    tourId,
                    connect: {
                      id: id,
                    },
                  },
                  ...restElement,
                  media: {
                    create: elementMedia,
                  },
                },
              });
            }
          }),
          ...dayToDayItinerary.map((element: any) => {
            const {
              id: elementId,
              holidayTypeId,
              tourId,
              ...restElement
            } = element;
            if (element.id) {
              return prisma.dayToDayItinerary.update({
                where: {
                  id: elementId,
                },
                data: { ...restElement },
              });
            } else {
              return prisma.dayToDayItinerary.create({
                data: {
                  tours: {
                    tourId,
                    connect: {
                      id: id,
                    },
                  },
                  ...restElement,
                },
              });
            }
          }),
          ...privatePlan.map((element: any) => {
            const {
              id: elementId,
              holidayTypeId,
              tourId,
              ...restElement
            } = element;
            if (elementId) {
              return prisma.privatePlan.update({
                where: {
                  id: elementId,
                },
                data: { ...restElement },
              });
            } else {
              return prisma.privatePlan.create({
                data: {
                  tours: {
                    tourId,
                    connect: {
                      id: id,
                    },
                  },
                  ...restElement,
                },
              });
            }
          }),
          ...supplementPolicy.map((element: any) => {
            const {
              id: elementId,
              holidayTypeId,
              tourId,
              ...restElement
            } = element;
            if (elementId) {
              return prisma.supplementPolicy.update({
                where: {
                  id: elementId,
                },
                data: { ...restElement },
              });
            } else {
              return prisma.supplementPolicy.create({
                data: {
                  tours: {
                    tourId,
                    connect: {
                      id: id,
                    },
                  },
                  ...restElement,
                },
              });
            }
          }),
          prisma.highlights.deleteMany({
            where: {
              id: {
                in: deleteHighlightIds,
              },
            },
          }),
          prisma.privatePlan.deleteMany({
            where: {
              id: {
                in: deletePrivatePlanIds,
              },
            },
          }),
          prisma.dayToDayItinerary.deleteMany({
            where: {
              id: {
                in: deleteDayToDayItineraryIds,
              },
            },
          }),
          prisma.supplementPolicy.deleteMany({
            where: {
              id: {
                in: deleteSupplementPolicyIds,
              },
            },
          }),

          prisma.toursToPlanService.deleteMany({
            where: { tourId: id },
          }),

          prisma.toursToPlanService.createMany({
            data: [...addTourId],
          }),

          prisma.tourDestinations.deleteMany({
            where: { tourId: id },
          }),

          prisma.tourDestinations.createMany({
            data: [...addTourIdOnDestination],
          }),
          prisma.tourHolidayType.deleteMany({
            where: { tourId: id },
          }),

          prisma.tourHolidayType.createMany({
            data: [...addTourIdOnHolidayType],
          }),
        ]);

        let bannerMediaUrl;
        let accommodationMediaUrl;

        if (response[0].bannerImageMedia?.desktopMediaUrl) {
          bannerMediaUrl = await getUploadsUrl({
            desktopMediaUrl: response[0].bannerImageMedia
              ?.desktopMediaUrl as string,
            mobileMediaUrl: response[0].bannerImageMedia
              ?.mobileMediaUrl as string,
          });
        }
        if (response[0]?.accommodationImageMedia?.desktopMediaUrl) {
          accommodationMediaUrl = await getUploadsUrl({
            desktopMediaUrl: response[0].accommodationImageMedia
              ?.desktopMediaUrl as string,
            mobileMediaUrl: response[0].accommodationImageMedia
              ?.mobileMediaUrl as string,
          });
        }

        return new NextResponse(
          JSON.stringify({
            data: {
              ...response[0],
              ...(bannerMediaUrl && {
                bannerImageMedia: {
                  ...response[0].bannerImageMedia,
                  desktopMediaUrl: bannerMediaUrl?.data[0].desktopMediaUrl,
                  mobileMediaUrl: bannerMediaUrl?.data[1].mobileMediaUrl,
                },
              }),
              ...(accommodationMediaUrl && {
                accommodationImageMedia: {
                  ...response[0].accommodationImageMedia,
                  desktopMediaUrl:
                    accommodationMediaUrl?.data[0].desktopMediaUrl,
                  mobileMediaUrl: accommodationMediaUrl?.data[1].mobileMediaUrl,
                },
              }),
            },
            status: "success",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        if (body.isActive !== undefined) {
          const tour = await prisma.tours.update({
            where: {
              id,
            },
            data: { ...body },
          });
          return new NextResponse(
            JSON.stringify({
              status: "success",
              data: tour,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } else {
          await prisma.tours.updateMany({
            where: {
              // destinationId: Number(body.destinationId),
              tourDestinations: {
                some: {
                  destination: { id: { in: body.destinationId } },
                },
              },
            },
            data: { isFeatured: false },
          });
          const tour = await prisma.tours.update({
            where: {
              id,
              // destinationId: Number(body.destinationId),
              tourDestinations: {
                some: {
                  destination: { id: { in: body.destinationId } },
                },
              },
            },
            data: { isFeatured: body.isFeatured },
          });

          return new NextResponse(
            JSON.stringify({
              status: "success",
              // data: tour,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      }
    } else {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "tour id is required",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}

export async function DELETE(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    if (!isNumeric(id)) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "tour id is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const tour = await prisma.tours.update({
      where: {
        id: Number(id),
      },
      data: {
        isDeleted: true,
      },
      include: {
        highlights: true,
        dayToDayItinerary: true,
        privatePlan: true,
        supplementPolicy: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: tour,
        status: "success",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}
