import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "lib/utils";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getUploadsUrl } from "services/uploads";

export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const path = req.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);

  if (!params.name) {
    return new NextResponse(
      JSON.stringify({
        status: "errors",
        message: "Destination name is required",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const destinationExists = await prisma.destinations.findUniqueOrThrow({
      where: {
        isActive: true,
        name: params?.name?.toLowerCase()?.replaceAll("-", " "),
      },
      select: {
        id: true,

        // tourDestinations: {
        //   where: {
        //     tour: {
        //       isDeleted: false,
        //       isActive: true,
        //     },
        //   },
        // },
        placeToVisit: {
          where: {
            isDeleted: false,
            isActive: true,
          },
        },
      },
    });
    if (destinationExists.placeToVisit.length) {
      const [destination, holidayTypes] = await prisma.$transaction([
        prisma.destinations.findUniqueOrThrow({
          where: { isActive: true, id: Number(destinationExists?.id) },
          include: {
            content: {
              include: {
                media: true,
              },
            },
            seoMeta: true,
            tourDestinations: {
              where: {
                tour: {
                  isActive: true,
                  isDeleted: false,
                  AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
                  tourDestinations: {
                    some: {
                      destination: {
                        id: Number(destinationExists?.id),
                      },
                    },
                  },
                },
              },
              include: {
                destination: true,

                tour: {
                  include: {
                    bannerImageMedia: true,
                    accommodationImageMedia: true,
                    dayToDayItinerary: true,
                    seoMeta: true,
                  },
                },
              },
            },
            thingsToDo: {
              orderBy: {
                sortId: "asc",
              },
              where: {
                isDeleted: false,
                isActive: true,
                destinationId: Number(destinationExists?.id),
              },
              include: {
                media: true,
              },
            },
            seasonToVisit: {
              where: {
                destinationId: Number(destinationExists?.id),
              },
              include: {
                destination: true,
                media: true,
              },
            },
            placeToVisit: {
              orderBy: {
                sortId: "asc",
              },
              where: {
                isDeleted: false,
                destinationId: Number(destinationExists?.id),
                isActive: true,
              },
              include: {
                destination: true,
                seoMeta: true,
                media: true,
                reviews: {
                  include: {
                    media: true,
                  },
                },
                attraction: {
                  include: {
                    media: true,
                  },
                },
              },
            },
            inspirations: {
              where: {
                isDeleted: false,
                isActive: true,
                destination: {
                  some: {
                    id: destinationExists.id,
                  },
                },
              },
              include: {
                seoMeta: true,
                media: true,
                destination: true,
              },
            },
            destinationFeatureOffered: {
              where: {
                destinationId: Number(destinationExists?.id),
              },
              include: {
                destinationFeatures: {
                  include: {
                    media: true,
                  },
                },
              },
            },
            gallery: {
              where: { destinationId: Number(destinationExists?.id) },
              include: {
                media: true,
              },
            },
          },
        }),
        prisma.holidayType.findMany({
          where: {
            isActive: true,
          },
          include: {
            media: true,
          },
        }),
      ]);

      const [
        content,
        thingsToDo,
        seasonToVisit,
        placeToVisit,
        inspirations,
        gallery,
        holidayTypesResponse,
      ] = await Promise.all([
        convertMediaIdsResponseIntoMediaUrl(destination.content),
        convertMediaIdsResponseIntoMediaUrl(destination.thingsToDo),
        convertMediaIdsResponseIntoMediaUrl(destination?.seasonToVisit),
        convertMediaIdsResponseIntoMediaUrl(destination?.placeToVisit),
        convertMediaIdsResponseIntoMediaUrl(destination?.inspirations),
        convertMediaIdsResponseIntoMediaUrl(destination?.gallery),
        convertMediaIdsResponseIntoMediaUrl(holidayTypes),
      ]);

      const destinationTours = destination.tourDestinations
        .map((item: any) => {
          return {
            ...item.tour,
            destination: item.destination,
          };
        })
        .sort((a: any, b: any) => a.sortId - b.sortId);
      const tours = await convertMediaIdsResponseIntoMediaUrl(
        destinationTours,
        ["bannerImageMedia"]
      );

      const destinationFeaturesResponse = await Promise.all(
        destination.destinationFeatureOffered.map(async (item: any) => {
          const mediaUrls = await convertMediaIdsResponseIntoMediaUrl(
            item.destinationFeatures
          );
          return { ...item, destinationFeatures: mediaUrls };
        })
      );

      return new NextResponse(
        JSON.stringify({
          data: {
            destination: {
              ...destination,
              destinationFeatureOffered: destinationFeaturesResponse,
              content,
              tours,
              thingsToDo,
              seasonToVisit,
              placeToVisit,
              inspirations,
              gallery,
            },
            holidayTypes: holidayTypesResponse,
          },
          status: "success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return getErrorResponse(500, "Destination has no tours");
    }
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}
