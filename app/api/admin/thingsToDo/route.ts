import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    body.thingsTodo.forEach(async (element: any, index: number) => {
      const { destinationId, media, ...rest } = element;

      await prisma.thingsToDo.create({
        data: {
          ...rest,
          sortId: index + 1,
          destination: { connect: { id: destinationId } },
          media: {
            create: media,
          },
        },
      });
    });

    return new NextResponse(
      JSON.stringify({
        data: " created successfully",
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

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pageSize = url.searchParams.get("pageSize");
  const pageNum = url.searchParams.get("pageNum");
  const searchParams = url.searchParams.get("searchParams");

  try {
    const [destinationCount, destinationsWithThingsToDo] =
      await prisma.$transaction([
        prisma.destinations.count({
          where: {
            thingsToDo: {
              some: {
                isDeleted: false,
              },
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
          ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
          ...(pageSize && { take: Number(pageSize) }),

          where: {
            thingsToDo: {
              some: {
                isDeleted: false,
              },
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
          include: {
            thingsToDo: {
              orderBy: {
                sortId: "asc",
              },
            },
          },
        }),
      ]);

    return new NextResponse(
      JSON.stringify({
        count: destinationCount,
        data: destinationsWithThingsToDo,
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

export async function PUT(req: NextRequest) {
  try {
    const { sourceId, sortPosition, destinationIdSortId, destinationId } =
      await req.json();
    if (!sourceId || !sortPosition || destinationIdSortId === undefined) {
      return getErrorResponse(400, "failed validations");
    }

    await prisma.$transaction(async (tx) => {
      const draggedTour = await prisma.thingsToDo.findUnique({
        where: {
          id: sourceId,
          destinationId: destinationId,
        },
      });

      await tx.thingsToDo.update({
        where: {
          id: sourceId,
          destinationId: destinationId,
        },
        data: {
          sortId: destinationIdSortId,
        },
      });

      await tx.thingsToDo.updateMany({
        where: {
          AND: {
            NOT: {
              id: sourceId,
            },
            destinationId: destinationId,
            sortId: {
              gte: Math.min(draggedTour?.sortId as number, destinationIdSortId),
              lte: Math.max(draggedTour?.sortId as number, destinationIdSortId),
            },
          },
        },
        data: {
          ...(sortPosition > 0
            ? { sortId: { increment: 1 } }
            : { sortId: { decrement: 1 } }),
        },
      });
    });

    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: "updated successfully",
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
