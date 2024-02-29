import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const checkExistingSeason = await prisma.seasonToVisit.findMany({
      where: { destinationId: Number(body.destinationId) },
    });
    if (checkExistingSeason?.length > 0) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Season is created with this destination",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      const response = await prisma.$transaction([
        ...body.seasonToVisit.map((element: any) => {
          const { destinationId, media, ...rest } = element;
          return prisma.seasonToVisit.create({
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
    return getErrorResponse(500, error.message);
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pageSize = url.searchParams.get("pageSize");
  const pageNum = url.searchParams.get("pageNum");
  const searchParams = url.searchParams.get("searchParams");

  try {
    const destinationCount = await prisma.destinations.count({
      where: {
        seasonToVisit: {
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
    });
    const destinationsWithSeasons = await prisma.destinations.findMany({
      include: { seasonToVisit: true },
      ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
      ...(pageSize && { take: Number(pageSize) }),

      where: {
        ...(searchParams && {
          OR: [
            {
              name: {
                contains: searchParams,
              },
            },
          ],
        }),
        seasonToVisit: {
          some: { id: { not: undefined } },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
    return new NextResponse(
      JSON.stringify({
        data: destinationsWithSeasons,
        status: "success",
        count: destinationCount,
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
