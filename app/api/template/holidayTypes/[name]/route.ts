import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "lib/utils";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  if (!params.name) {
    return new NextResponse(
      JSON.stringify({
        status: "errors",
        message: "Holiday type name is required",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const path = req.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);
  try {
    const [holidayType, tours, inspirations] = await prisma.$transaction(
      async (tx) => {
        const holidayType = await tx.holidayType.findFirstOrThrow({
          where: {
            isActive: true,

            seoMeta: {
              slug: params.name,
            },
          },
          include: {
            media: true,
            seoMeta: true,
            highlights: {
              include: {
                media: true,
              },
            },
          },
        });
        const tours = await tx.tours.findMany({
          where: {
            isActive: true,
            isDeleted: false,
            AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
            tourHoliDayType: {
              some: {
                holidayType: {
                  id: holidayType.id,
                },
              },
            },
          },
          orderBy: {
            id: "desc",
          },
          take: 2,
          include: {
            seoMeta: true,
            bannerImageMedia: true,
            tourDestinations: {
              include: {
                destination: true,
              },
            },
          },
        });
        const inspirations = await tx.inspirations.findMany({
          where: {
            isActive: true,
            isDeleted: false,
            holidayType: {
              some: {
                id: holidayType.id,
              },
            },
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
        });

        return [holidayType, tours, inspirations];
      }
    );

    const mediaUrls = await convertMediaIdsResponseIntoMediaUrl(holidayType);
    const [highlights, toursResponse, inspirationsResponse] = await Promise.all(
      [
        convertMediaIdsResponseIntoMediaUrl(holidayType?.highlights),
        convertMediaIdsResponseIntoMediaUrl(tours, "bannerImageMedia"),
        convertMediaIdsResponseIntoMediaUrl(inspirations),
      ]
    );

    return new NextResponse(
      JSON.stringify({
        data: {
          holidayType: {
            ...holidayType,
            highlights,
            media: {
              ...holidayType?.media,
              ...mediaUrls.media,
            },
          },
          tours: toursResponse.map((item: any) => {
            const { tourDestinations, ...rest } = item;
            return {
              ...rest,
              destination: tourDestinations[0].destination,
            };
          }),
          inspirations: inspirationsResponse,
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
