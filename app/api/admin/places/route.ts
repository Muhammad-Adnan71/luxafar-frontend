import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      reviews,
      attraction,
      media,
      destinationId,
      seoMeta,
      seoMetaId,
      ...rest
    } = await req.json();
    let newSeoMeta;
    if (!seoMetaId) {
      newSeoMeta = await prisma.seoMeta.create({
        data: seoMeta,
      });
    }
    const highestSortIdPlace = await prisma.placeToVisit.findFirst({
      where: {
        destinationId: Number(destinationId),
      },
      orderBy: { sortId: "desc" },
    });
    const place = await prisma.placeToVisit.create({
      data: {
        ...rest,
        sortId: highestSortIdPlace?.sortId ? highestSortIdPlace.sortId + 1 : 1,
        destination: { connect: { id: Number(destinationId) } },
        media: {
          create: media,
        },
        ...(seoMetaId
          ? {
              seoMeta: {
                update: {
                  data: seoMeta,
                },
              },
            }
          : {
              seoMeta: {
                connect: { id: newSeoMeta?.id },
              },
            }),
        reviews: {
          create: reviews.map((ele: any) => ({
            ...ele,
            media: {
              create: ele.media,
            },
          })),
        },
        attraction: {
          create: attraction.map((ele: any) => ({
            ...ele,
            media: {
              create: ele.media,
            },
          })),
        },
      },
      include: {
        reviews: true,
        attraction: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: place,
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
    const destinationCount = await prisma.destinations.count({
      where: {
        placeToVisit: {
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
            {
              placeToVisit: {
                some: {
                  title: {
                    contains: searchParams,
                  },
                },
              },
            },
          ],
        }),
      },
    });

    const destinations = await prisma.destinations.findMany({
      include: {
        placeToVisit: {
          where: {
            isDeleted: false,
          },
          orderBy: {
            sortId: "asc",
          },
        },
      },
      ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
      ...(pageSize && { take: Number(pageSize) }),
      where: {
        placeToVisit: {
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
            {
              placeToVisit: {
                some: {
                  title: {
                    contains: searchParams,
                  },
                },
              },
            },
          ],
        }),
      },
      orderBy: {
        id: "desc",
      },
    });

    return new NextResponse(
      JSON.stringify({
        count: destinationCount,
        data: destinations,
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
      const draggedPlace = await prisma.placeToVisit.findUnique({
        where: {
          id: sourceId,
          destinationId: destinationId,
        },
      });

      await tx.placeToVisit.update({
        where: {
          id: sourceId,
          destinationId: destinationId,
        },
        data: {
          sortId: destinationIdSortId,
        },
      });

      await tx.placeToVisit.updateMany({
        where: {
          AND: {
            NOT: {
              id: sourceId,
            },
            destinationId: destinationId,
            sortId: {
              gte: Math.min(
                draggedPlace?.sortId as number,
                destinationIdSortId
              ),
              lte: Math.max(
                draggedPlace?.sortId as number,
                destinationIdSortId
              ),
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
