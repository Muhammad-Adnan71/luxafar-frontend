import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUploadsUrl } from "services/uploads";

// this route needs to refactor
export async function POST(req: NextRequest) {
  try {
    const {
      highlights,
      dayToDayItinerary,
      privatePlan,
      supplementPolicy,
      accommodationImageMedia,
      bannerImageMedia,
      planService,
      destinations,
      holidayType,
      seoMeta,
      seoMetaId,
      ...rest
    } = await req.json();
    let bannerMedia;
    let accommodationMedia;
    let newSeoMeta;
    if (!seoMetaId) {
      newSeoMeta = await prisma.seoMeta.create({
        data: seoMeta,
      });
    }

    if (accommodationImageMedia) {
      accommodationMedia = await prisma.media.create({
        data: accommodationImageMedia,
      });
    }
    if (bannerImageMedia) {
      bannerMedia = await prisma.media.create({
        data: bannerImageMedia,
      });
    }
    const highestSortIdTour = await prisma.tours.findFirst({
      where: {
        tourDestinations: {
          some: {
            destinationId: Number(destinations[0].destinationId),
          },
        },
      },
      orderBy: { sortId: "desc" },
    });

    const tours = await prisma.tours.create({
      data: {
        ...rest,
        sortId: highestSortIdTour?.sortId ? highestSortIdTour.sortId + 1 : 1,
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

        ...(bannerMedia && {
          bannerImageMedia: { connect: { id: bannerMedia.id } },
        }),
        ...(accommodationMedia && {
          accommodationImageMedia: { connect: { id: accommodationMedia.id } },
        }),

        highlights: {
          create: highlights.map((ele: any) => ({
            ...ele,
            media: {
              create: ele.media,
            },
          })),
        },
        dayToDayItinerary: {
          createMany: {
            data: [...dayToDayItinerary],
          },
        },
        privatePlan: {
          createMany: {
            data: [...privatePlan],
          },
        },
        supplementPolicy: {
          createMany: {
            data: [...supplementPolicy],
          },
        },
      },
      include: {
        highlights: true,
        dayToDayItinerary: true,
        privatePlan: true,
        supplementPolicy: true,
        bannerImageMedia: true,
        accommodationImageMedia: true,
      },
    });

    let addTourId = await planService.map((item: any) => ({
      ...item,
      tourId: tours.id,
    }));

    await prisma.toursToPlanService.createMany({
      data: [...addTourId],
    });

    let addTourIdOnDestination = await destinations.map((des: any) => ({
      ...des,
      tourId: tours.id,
    }));

    await prisma.tourDestinations.createMany({
      data: [...addTourIdOnDestination],
    });

    let addTourIdOnHolidayType = await holidayType.map((des: any) => ({
      ...des,
      tourId: tours.id,
    }));

    await prisma.tourHolidayType.createMany({
      data: [...addTourIdOnHolidayType],
    });

    let bannerMediaUrl;
    let accommodationMediaUrl;

    if (tours.bannerImageMedia?.desktopMediaUrl) {
      bannerMediaUrl = await getUploadsUrl({
        desktopMediaUrl: tours.bannerImageMedia?.desktopMediaUrl as string,
        mobileMediaUrl: tours.bannerImageMedia?.mobileMediaUrl as string,
      });
    }
    if (tours?.accommodationImageMedia?.desktopMediaUrl) {
      accommodationMediaUrl = await getUploadsUrl({
        desktopMediaUrl: tours.accommodationImageMedia
          ?.desktopMediaUrl as string,
        mobileMediaUrl: tours.accommodationImageMedia?.mobileMediaUrl as string,
      });
    }

    return new NextResponse(
      JSON.stringify({
        data: {
          ...tours,
          ...(bannerMediaUrl && {
            bannerImageMedia: {
              ...tours.bannerImageMedia,
              desktopMediaUrl: bannerMediaUrl?.data[0].desktopMediaUrl,
              mobileMediaUrl: bannerMediaUrl?.data[1].mobileMediaUrl,
            },
          }),
          ...(accommodationMediaUrl && {
            accommodationImageMedia: {
              ...tours.accommodationImageMedia,
              desktopMediaUrl: accommodationMediaUrl?.data[0].desktopMediaUrl,
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
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const destinationId = url.searchParams.get("destinationId");
  const isActive = url.searchParams.get("active");
  const pageSize = url.searchParams.get("pageSize");
  const pageNum = url.searchParams.get("pageNum");
  const searchParams = url.searchParams.get("searchParams");
  const orderBy = url.searchParams.get("orderBy") as "asc" | "desc";

  try {
    if (destinationId) {
      const [toursCount, allTours] = await prisma.$transaction([
        prisma.tours.count({
          where: {
            tourDestinations: {
              some: {
                destination: {
                  id: Number(destinationId),
                },
              },
            },
            ...(isActive && { isActive: true }),
            ...(searchParams && {
              OR: [
                {
                  title: {
                    contains: searchParams,
                  },
                },
                {
                  tourDestinations: {
                    some: {
                      destination: {
                        name: {
                          contains: searchParams,
                        },
                      },
                    },
                  },
                },
              ],
            }),
          },
        }),
        prisma.tours.findMany({
          ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
          ...(pageSize && { take: Number(pageSize) }),

          where: {
            tourDestinations: {
              some: {
                destination: {
                  id: Number(destinationId),
                },
              },
            },
            ...(isActive && { isActive: true }),
            ...(searchParams && {
              OR: [
                {
                  title: {
                    contains: searchParams,
                  },
                },
                {
                  tourDestinations: {
                    some: {
                      destination: {
                        name: {
                          contains: searchParams,
                        },
                      },
                    },
                  },
                },
              ],
            }),
          },
          ...(orderBy && {
            orderBy: {
              id: orderBy,
            },
          }),
          include: {
            tourDestinations: {
              include: {
                destination: true,
              },
            },
            highlights: true,
            dayToDayItinerary: true,
            privatePlan: true,
            supplementPolicy: true,
            planService: true,
          },
        }),
      ]);

      return new NextResponse(
        JSON.stringify({
          count: toursCount,
          data: allTours,
          status: "success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      const [destinations, destinationsCount] = await prisma.$transaction([
        prisma.destinations.findMany({
          ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
          ...(pageSize && { take: Number(pageSize) }),
          ...(orderBy && {
            orderBy: {
              name: "asc",
            },
          }),
          where: {
            tourDestinations: {
              some: {
                tour: {
                  isDeleted: false,
                },
              },
            },
            ...(searchParams && {
              OR: [
                {
                  name: {
                    contains: searchParams,
                  },
                },
                {
                  tourDestinations: {
                    some: {
                      tour: {
                        title: {
                          contains: searchParams,
                        },
                      },
                    },
                  },
                },
              ],
            }),
          },
          include: {
            tourDestinations: {
              where: {
                tour: {
                  isDeleted: false,
                },
              },
              orderBy: {
                tour: {
                  sortId: "asc",
                },
              },
              include: {
                tour: true,
              },
            },
          },
        }),
        prisma.destinations.count({
          where: {
            tourDestinations: {
              some: {
                tour: {
                  isDeleted: false,
                },
              },
            },
            ...(searchParams && {
              OR: [
                {
                  name: {
                    contains: searchParams,
                  },
                },
                {
                  tourDestinations: {
                    some: {
                      tour: {
                        title: {
                          contains: searchParams,
                        },
                      },
                    },
                  },
                },
              ],
            }),
          },
        }),
      ]);

      return new NextResponse(
        JSON.stringify({
          count: destinationsCount,
          data: destinations,
          status: "success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { sourceId, sortPosition, destinationIdSortId, destinationId } =
      await req.json();
    if (!sourceId || !sortPosition || destinationIdSortId === undefined) {
      return getErrorResponse(400, "failed validations");
    }

    await prisma.$transaction(async (tx) => {
      const draggedTour = await prisma.tours.findUnique({
        where: {
          id: sourceId,
          tourDestinations: {
            some: {
              destinationId: destinationId,
            },
          },
        },
      });

      await tx.tours.update({
        where: {
          id: sourceId,
          tourDestinations: {
            some: {
              destinationId: destinationId,
            },
          },
        },
        data: {
          sortId: destinationIdSortId,
        },
      });

      await tx.tours.updateMany({
        where: {
          AND: {
            NOT: {
              id: sourceId,
            },
            tourDestinations: {
              some: {
                destinationId: destinationId,
              },
            },
            sortId: {
              gte: Math.min(draggedTour?.sortId as number, destinationIdSortId),
              lte: Math.max(draggedTour?.sortId as number, destinationIdSortId),
            },
          },
        },
        data: {
          ...(sortPosition > 0
            ? { sortId: { increment: 1 } }
            : { sortId: { decrement: 1 } }),
        },
      });
    });

    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: "updated successfully",
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
