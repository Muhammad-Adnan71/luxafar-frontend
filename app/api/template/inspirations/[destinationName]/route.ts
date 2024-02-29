import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "lib/utils";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { destinationName: string } }
) {
  try {
    if (!params?.destinationName) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Destination Name is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const path = req.nextUrl.searchParams.get("path") || "/";
    revalidatePath(path);
    const url = new URL(req.url);
    const pageSize = url.searchParams.get("pageSize");
    const pageNum = url.searchParams.get("pageNum");
    const destinationName = params?.destinationName?.replaceAll("-", " ");

    const [featuredInspiration, inspirationCount, inspirations] =
      await prisma.$transaction(async (tx) => {
        let featuredInspiration = await tx.inspirations.findFirst({
          where: {
            isDeleted: false,
            isFeatured: true,
            ...(destinationName && {
              destination: { some: { name: destinationName } },
            }),
          },
          include: {
            media: true,
            destination: true,
            seoMeta: true,
          },
        });

        if (!featuredInspiration) {
          featuredInspiration = await tx.inspirations.findFirst({
            where: {
              isDeleted: false,
              ...(destinationName && {
                destination: { some: { name: destinationName } },
              }),
              sortId: 1,
            },

            include: {
              media: true,
              destination: true,
              seoMeta: true,
            },
          });
        }
        const inspirationCount = await tx.inspirations.count({
          where: {
            isDeleted: false,
            isFeatured: false,
            isActive: true,
            ...(destinationName && {
              destination: { some: { name: destinationName } },
            }),
          },
        });
        const inspirations = await tx.inspirations.findMany({
          ...(pageNum && {
            skip: (Number(pageNum) - 1) * Number(pageSize),
          }),
          ...(pageSize && { take: Number(pageSize) }),
          where: {
            isDeleted: false,
            isFeatured: false,
            id: {
              not: featuredInspiration?.id,
            },
            isActive: true,
            ...(destinationName && {
              destination: { some: { name: destinationName } },
            }),
          },

          orderBy: {
            id: "asc",
          },

          include: {
            media: true,
            seoMeta: true,
            destination: true,
            inspirationDetail: {
              include: {
                media: true,
              },
            },
          },
        });
        return [featuredInspiration, inspirationCount, inspirations];
      });

    const [inspirationsResponse, featuredInspirationResponse] =
      await Promise.all([
        convertMediaIdsResponseIntoMediaUrl(inspirations),
        convertMediaIdsResponseIntoMediaUrl(featuredInspiration),
      ]);

    return new NextResponse(
      JSON.stringify({
        count: inspirationCount,
        data: {
          inspirations: inspirationsResponse,
          featuredInspiration: featuredInspirationResponse,
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
