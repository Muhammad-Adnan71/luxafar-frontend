import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "lib/utils";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const destinationId = url.searchParams.get("destinationId");
  const holidayTypeId = url.searchParams.get("holidayTypeId");
  const pageSize = url.searchParams.get("pageSize");
  const pageNum = url.searchParams.get("pageNum");
  const path = request.nextUrl.searchParams.get("path") || "/";
  try {
    revalidatePath(path);

    const [
      toursCount,
      tours,
      featuredTours,
      upcomingTours,
      page,
      inspirations,
      bespokeQuestion,
    ] = await prisma.$transaction([
      prisma.tours.count({
        where: {
          isActive: true,
          isDeleted: false,
          AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
          ...(destinationId && {
            tourDestinations: {
              some: {
                destinationId: Number(destinationId),
              },
            },
          }),

          ...(holidayTypeId && {
            tourHoliDayType: {
              some: {
                holidayTypeId: Number(holidayTypeId),
              },
            },
          }),
        },
      }),
      prisma.tours.findMany({
        ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
        ...(pageSize && { take: Number(pageSize) }),
        where: {
          isActive: true,
          isDeleted: false,
          AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
          ...(destinationId && {
            tourDestinations: {
              some: {
                destinationId: Number(destinationId),
              },
            },
          }),
          ...(holidayTypeId && {
            tourHoliDayType: {
              some: {
                holidayTypeId: Number(holidayTypeId),
              },
            },
          }),
        },

        orderBy: {
          sortId: "desc",
        },

        include: {
          bannerImageMedia: true,
          tourDestinations: {
            include: {
              destination: true,
            },
          },
          seoMeta: true,
        },
      }),
      prisma.tours.findMany({
        where: {
          isFeatured: true,
          isDeleted: false,
          isActive: true,
          AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
        },
        include: {
          bannerImageMedia: true,
          tourDestinations: {
            include: {
              destination: true,
            },
          },
          seoMeta: true,
        },
      }),
      prisma.tours.findMany({
        where: {
          OR: [{ price: null }, { price: { lte: 0 } }],
          isDeleted: false,
          isActive: true,
        },
        include: {
          bannerImageMedia: true,
          tourDestinations: true,
          seoMeta: true,
        },
      }),
      prisma.pages.findFirst({
        where: {
          name: "tours",
        },
        select: {
          description: true,
          title: true,
          seoMeta: {
            select: {
              slug: true,
              title: true,
              description: true,
              keywords: true,
            },
          },
          content: {
            orderBy: {
              sortId: "asc",
            },
            select: {
              id: true,
              name: true,
              title: true,
              description: true,
              subTitle: true,
              buttonText: true,
              buttonUrl: true,
              sortId: true,
              media: {
                select: {
                  desktopMediaUrl: true,
                  mobileMediaUrl: true,
                },
              },
            },
          },
        },
      }),
      prisma.inspirations.findMany({
        skip: 0,
        take: 3,
        where: {
          isActive: true,
          isDeleted: false,
        },

        orderBy: {
          inspirationSortId: "desc",
        },

        include: {
          media: true,
          destination: true,
          seoMeta: true,
          inspirationDetail: {
            include: {
              media: true,
            },
          },
        },
      }),
      prisma.bespokeQuestion.findMany({
        where: { formType: "bespoke" },
        include: {
          bespokeQuestionOptions: true,
        },
      }),
    ]);
    const [
      toursResponse,
      featuredToursResponse,
      upcomingToursResponse,
      contentResponse,
      inspirationsResponse,
    ] = await Promise.all([
      convertMediaIdsResponseIntoMediaUrl(tours, "bannerImageMedia"),
      convertMediaIdsResponseIntoMediaUrl(featuredTours, "bannerImageMedia"),
      convertMediaIdsResponseIntoMediaUrl(upcomingTours, "bannerImageMedia"),
      convertMediaIdsResponseIntoMediaUrl(page?.content),
      convertMediaIdsResponseIntoMediaUrl(inspirations),
    ]);

    return new NextResponse(
      JSON.stringify({
        data: {
          page: { ...page, content: contentResponse },
          count: toursCount,
          tours: toursResponse.map((item: any) => ({
            ...item,
            destination: item.tourDestinations?.[0]?.destination,
          })),

          featuredTours: featuredToursResponse,
          upcomingTours: upcomingToursResponse,
          inspirations: inspirationsResponse,
          bespokeQuestion,
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
