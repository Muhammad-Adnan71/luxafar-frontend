import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const checkDestinationGallery = await prisma.gallery.findFirst({
      where: { destinationId: Number(body.destinationId) },
    });
    if (checkDestinationGallery) {
      return getErrorResponse(500, "Gallery already exists");
    } else {
      const response = await prisma.$transaction([
        ...body.gallery.map((element: any) => {
          const { destinationId, media, ...rest } = element;
          return prisma.gallery.create({
            data: {
              ...rest,
              destination: { connect: { id: destinationId } },
              media: {
                create: media,
              },
            },
          });
        }),
      ]);

      return new NextResponse(
        JSON.stringify({
          data: response[0],
          status: "success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: any) {
    return;
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pageSize = url.searchParams.get("pageSize");
  const pageNum = url.searchParams.get("pageNum");
  const searchParams = url.searchParams.get("searchParams");

  try {
    const [destinationCount, destinationsWithGallery] =
      await prisma.$transaction([
        prisma.destinations.count({
          where: {
            gallery: {
              some: { id: { not: undefined } },
            },
            ...(searchParams && {
              OR: [
                {
                  name: {
                    contains: searchParams,
                  },
                },
              ],
            }),
          },
        }),
        prisma.destinations.findMany({
          include: { gallery: true },
          ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
          ...(pageSize && { take: Number(pageSize) }),

          where: {
            gallery: {
              some: { id: { not: undefined } },
            },

            ...(searchParams && {
              OR: [
                {
                  name: {
                    contains: searchParams,
                  },
                },
              ],
            }),
          },
          orderBy: {
            id: "desc",
          },
        }),
      ]);

    return new NextResponse(
      JSON.stringify({
        count: destinationCount,
        data: destinationsWithGallery,
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
