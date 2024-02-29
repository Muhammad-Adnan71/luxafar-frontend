import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "lib/utils";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getUploadsUrl } from "services/uploads";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const path = request.nextUrl.searchParams.get("path") || "/";
    revalidatePath(path);
    const destinationNameForSearch = params?.params?.[0]?.replaceAll("-", " ");
    const nameForSearch = params?.params?.[1];

    const tourById = await prisma.tours.findFirstOrThrow({
      where: {
        isDeleted: false,
        seoMeta: {
          slug: nameForSearch,
        },
      },
      include: {
        seoMeta: true,
        tourDestinations: {
          include: {
            destination: true,
          },
        },
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
            planService: {
              include: {
                media: true,
              },
            },
          },
        },
        accommodationImageMedia: true,
        bannerImageMedia: true,
      },
    });
    const [tours, inspirations, inspirationCount, testimonials] =
      await prisma.$transaction([
        prisma.tours.findMany({
          where: {
            isActive: true,
            isDeleted: false,
            NOT: {
              seoMeta: {
                slug: nameForSearch,
              },
            },
            tourDestinations: {
              some: {
                destination: {
                  name: destinationNameForSearch,
                },
              },
            },
          },
          skip: 0,
          take: 2,
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
            isActive: true,
            isDeleted: false,

            destination: {
              some: {
                name: destinationNameForSearch,
              },
            },
          },
          skip: 0,
          take: 3,
          include: {
            media: true,
            destination: true,
            seoMeta: true,
          },
        }),
        prisma.inspirations.count({
          where: {
            isDeleted: false,
            isActive: true,
            destinationId: tourById?.tourDestinations[0]
              .destinationId as number,
          },
        }),
        prisma.testimonial.findMany({
          where: {
            isActive: true,
            isDeleted: false,
          },

          orderBy: { sortId: "asc" },
          include: {
            clientImageMedia: true,
            destinationImageMedia: true,
          },
        }),
      ]);

    const [
      bannerImageResponse,
      accommodationImageResponse,
      highlightsResponse,
      toursResponse,
      inspirationsResponse,
      testimonialsResponse,
    ] = await Promise.all([
      convertMediaIdsResponseIntoMediaUrl(tourById, "bannerImageMedia"),
      convertMediaIdsResponseIntoMediaUrl(tourById, "accommodationImageMedia"),
      convertMediaIdsResponseIntoMediaUrl(tourById?.highlights),
      convertMediaIdsResponseIntoMediaUrl(tours, "bannerImageMedia"),
      convertMediaIdsResponseIntoMediaUrl(inspirations),
      convertMediaIdsResponseIntoMediaUrl(testimonials, [
        "clientImageMedia",
        "destinationImageMedia",
      ]),
    ]);

    const planServiceResponse = await Promise.all(
      tourById?.planService.map(async (item: any) => {
        const planService = await convertMediaIdsResponseIntoMediaUrl(
          item?.planService
        );
        return {
          ...item,
          planService: planService,
        };
      })
    );

    return new NextResponse(
      JSON.stringify({
        data: {
          tour: {
            ...tourById,
            highlights: highlightsResponse,
            planService: planServiceResponse,
            bannerImageMedia: bannerImageResponse.bannerImageMedia,
            accommodationImageMedia:
              accommodationImageResponse.accommodationImageMedia,
          },
          relatedTours: toursResponse,
          inspirations: inspirationsResponse,
          testimonials: testimonialsResponse,
          inspirationCount,
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
