import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "lib/utils";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const path = request.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);
  try {
    const place = await prisma.placeToVisit.findFirstOrThrow({
      where: {
        isDeleted: false,
        isActive: true,
        seoMeta: {
          slug: params?.name,
        },
      },
      include: {
        seoMeta: true,
        destination: {
          include: {
            content: {
              include: {
                media: true,
              },
            },
          },
        },
        media: true,
        reviews: {
          include: {
            media: true,
          },
        },
        attraction: {
          include: { media: true },
        },
      },
    });

    const [tours, inspirations, inspirationsCount, places] =
      await prisma.$transaction([
        prisma.tours.findMany({
          where: {
            isActive: true,
            isDeleted: false,
            AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
            tourDestinations: {
              some: {
                destination: {
                  id: place?.destinationId,
                },
              },
            },
          },
          take: 2,
          orderBy: {
            id: "desc",
          },
          include: {
            bannerImageMedia: true,
            // destination: true,
            seoMeta: true,
            tourDestinations: {
              include: {
                destination: true,
              },
            },
          },
        }),
        prisma.inspirations.findMany({
          where: {
            isDeleted: false,
            destination: {
              some: {
                id: place?.destinationId,
              },
            },
            isActive: true,
          },
          take: 3,
          orderBy: {
            id: "desc",
          },
          include: {
            seoMeta: true,
            destination: true,
            media: true,
          },
        }),
        prisma.inspirations.count({
          where: {
            isDeleted: false,
            destination: {
              some: {
                id: place?.destinationId,
              },
            },
            isActive: true,
          },
        }),
        prisma.placeToVisit.findMany({
          where: {
            isDeleted: false,
            isActive: true,
            destinationId: place?.destinationId,
            seoMeta: {
              slug: {
                not: params?.name,
              },
            },
          },

          take: 3,
          include: {
            seoMeta: true,
            media: true,
            destination: true,
          },
        }),
      ]);

    const [
      placeResponse,
      attractionsResponse,
      reviewsResponse,
      toursResponse,
      inspirationsResponse,
      placesResponse,
      placeContentResponse,
    ]: any = await Promise.all([
      convertMediaIdsResponseIntoMediaUrl(place),
      convertMediaIdsResponseIntoMediaUrl(place?.attraction),
      convertMediaIdsResponseIntoMediaUrl(place?.reviews),
      convertMediaIdsResponseIntoMediaUrl(tours, "bannerImageMedia"),
      convertMediaIdsResponseIntoMediaUrl(inspirations),
      convertMediaIdsResponseIntoMediaUrl(places),
      convertMediaIdsResponseIntoMediaUrl(place.destination?.content),
    ]);

    return new NextResponse(
      JSON.stringify({
        data: {
          place: {
            ...placeResponse,
            destination: {
              ...place.destination,
              content: placeContentResponse,
            },
            reviews: reviewsResponse,
            attraction: attractionsResponse,
          },
          recommendedTours: toursResponse,
          inspirations: inspirationsResponse,
          places: placesResponse,
          inspirationsCount,
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
