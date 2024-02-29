import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "lib/utils";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get("path") || "/";
    revalidatePath(path);

    const [destinations, inspirations, configuration] =
      await prisma.$transaction([
        prisma.destinations.findMany({
          where: {
            isActive: true,
          },
          include: {
            placeToVisit: {
              where: {
                isActive: true,
                isDeleted: false,
              },
            },
          },
        }),
        prisma.inspirations.findMany({
          where: {
            isActive: true,
            isDeleted: false,
          },
          include: {
            destination: true,
            seoMeta: true,
          },
          orderBy: {
            id: "desc",
          },
          take: 3,
        }),
        prisma.configuration.findFirst({
          include: {
            media: true,
          },
        }),
      ]);

    const configurationResponse = await convertMediaIdsResponseIntoMediaUrl(configuration);
    return new NextResponse(
      JSON.stringify({
        data: {
          destinations,
          inspirations,
          configuration: configurationResponse,
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
