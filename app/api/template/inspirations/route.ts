import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "lib/utils";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const destinationId = url.searchParams.get("destinationId");
  const holidayTypeId = url.searchParams.get("holidayTypeId");
  const pageSize = url.searchParams.get("pageSize");
  const pageNum = url.searchParams.get("pageNum");
  const path = req.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);

  try {
    const [inspirationCount, inspirations, featuredInspirations] =
      await prisma.$transaction([
        prisma.inspirations.count({
          where: {
            isFeatured: false,
            isActive: true,
            isDeleted: false,
            ...(destinationId && { destinationId: Number(destinationId) }),
            ...(holidayTypeId && { holidayTypeId: Number(holidayTypeId) }),
          },
        }),
        prisma.inspirations.findMany({
          ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
          ...(pageSize && { take: Number(pageSize) }),
          where: {
            isFeatured: false,
            isActive: true,
            isDeleted: false,
            ...(destinationId && {
              destination: { some: { id: Number(destinationId) } },
            }),
            ...(holidayTypeId && {
              holidayType: { some: { id: Number(holidayTypeId) } },
            }),
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
        prisma.inspirations.findMany({
          where: {
            isFeatured: true,
            isDeleted: false,
            isActive: true,
          },
          include: {
            media: true,
            destination: true,
            seoMeta: true,
          },
        }),
      ]);
    const [inspirationResponse, featuredInspirationsResponse] =
      await Promise.all([
        convertMediaIdsResponseIntoMediaUrl(inspirations),
        convertMediaIdsResponseIntoMediaUrl(featuredInspirations),
      ]);

    return new NextResponse(
      JSON.stringify({
        count: inspirationCount,
        data: {
          inspirations: inspirationResponse,
          ...(featuredInspirations.length && {
            featuredInspirations: featuredInspirationsResponse,
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
