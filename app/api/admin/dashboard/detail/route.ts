import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "lib/utils";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get("path") || "/";
    revalidatePath(path);

    const [
      destinationCount,
      toursCount,
      inspirationsCount,
      testimonialCount,
      destinations,
    ] = await prisma.$transaction([
      prisma.destinations.count({}),
      prisma.tours.count({
        where: {
          isDeleted: false,
        },
      }),
      prisma.inspirations.count({
        where: {
          isDeleted: false,
        },
      }),
      prisma.testimonial.count({
        where: {
          isDeleted: false,
        },
      }),
      prisma.destinations.findMany({
        take: 8,
        include: {
          tourDestinations: {
            include: {
              tour: true,
            },
          },
          content: {
            include: {
              media: true,
            },
          },
        },
        orderBy: {
          id: "desc",
        },
      }),
    ]);
    const destinationMediaResponse = await Promise.all([
      ...destinations?.map(async (destination) => {
        const content = await convertMediaIdsResponseIntoMediaUrl(
          destination?.content
        );
        return {
          ...destination,
          content,
        };
      }),
    ]);

    return new NextResponse(
      JSON.stringify({
        data: {
          destinations: destinationMediaResponse,
          count: {
            destinations: destinationCount,
            tours: toursCount,
            inspirations: inspirationsCount,
            testimonial: testimonialCount,
          },
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
