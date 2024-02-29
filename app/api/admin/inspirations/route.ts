import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      inspirationDetail,
      destination,
      holidayType,
      seoMeta,
      media,
      ...rest
    } = await req.json();
    const highestSortIdInspirations = await prisma.inspirations.findFirst({
      where: {
        destination: {
          some: {
            id: Number(destination[0].id),
          },
        },
      },
      orderBy: { sortId: "desc" },
    });
    const highestInspirationSortId = await prisma.inspirations.findFirst({
      orderBy: { inspirationSortId: "desc" },
    });
    const inspiration = await prisma.inspirations.create({
      data: {
        ...rest,
        sortId: highestSortIdInspirations?.sortId
          ? highestSortIdInspirations.sortId + 1
          : 1,
        inspirationSortId: highestInspirationSortId?.inspirationSortId
          ? highestInspirationSortId.inspirationSortId + 1
          : 1,

        destination: {
          connect: destination,
        },

        holidayType: {
          connect: holidayType,
        },
        media: {
          create: media,
        },
        seoMeta: {
          create: seoMeta,
        },
        inspirationDetail: {
          create: [
            ...inspirationDetail.map(
              ({ media: inspirationMedia, ...item }: any) => ({
                ...item,
                media: {
                  create: inspirationMedia,
                },
              })
            ),
          ],
        },
      },
      include: {
        inspirationDetail: true,
        destination: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: inspiration,
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
  const groupBy = url.searchParams.get("groupBy");
  const searchParams = url.searchParams.get("searchParams");
  const destinationId = url.searchParams.get("destinationId");
  const isHomePageSort = url.searchParams.get("isHomePageSort");
  try {
    if (groupBy === "destination") {
      const destinationCount = await prisma.destinations.count({
        where: {
          inspirations: {
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
                inspirations: {
                  some: {
                    OR: [
                      {
                        title: {
                          contains: searchParams,
                        },
                      },
                      {
                        holidayType: {
                          some: {
                            name: {
                              contains: searchParams,
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            ],
          }),
        },
      });
      const destinations = await prisma.destinations.findMany({
        ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
        ...(pageSize && { take: Number(pageSize) }),
        include: {
          inspirations: {
            orderBy: {
              sortId: "asc",
            },
            include: {
              destination: true,
              inspirationDetail: true,
              holidayType: true,
            },
          },
        },
        where: {
          inspirations: {
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
                inspirations: {
                  some: {
                    OR: [
                      {
                        title: {
                          contains: searchParams,
                        },
                      },
                      {
                        holidayType: {
                          some: {
                            name: {
                              contains: searchParams,
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            ],
          }),
        },
        orderBy: {
          id: "asc",
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
    } else {
      const inspirationsCount = await prisma.inspirations.count({
        where: {
          isDeleted: false,
          ...(isHomePageSort && { isHomePageSort: true }),
          ...(destinationId && {
            destination: {
              some: {
                id: Number(destinationId),
              },
            },
          }),
          ...(searchParams && {
            OR: [
              {
                title: {
                  contains: searchParams,
                },
              },
              {
                destination: {
                  some: {
                    name: {
                      contains: searchParams,
                    },
                  },
                },
              },
              {
                holidayType: {
                  some: {
                    name: {
                      contains: searchParams,
                    },
                  },
                },
              },
            ],
          }),
        },
      });

      const inspirations = await prisma.inspirations.findMany({
        ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
        ...(pageSize && { take: Number(pageSize) }),
        include: {
          destination: true,
          holidayType: true,
          inspirationDetail: true,
        },
        orderBy: {
          inspirationSortId: "desc",
        },
        where: {
          isDeleted: false,
          ...(isHomePageSort && { isHomePageSort: true }),
          ...(destinationId && {
            destination: {
              some: {
                id: Number(destinationId),
              },
            },
          }),
          ...(searchParams && {
            OR: [
              {
                title: {
                  contains: searchParams,
                },
              },
              {
                destination: {
                  some: {
                    name: {
                      contains: searchParams,
                    },
                  },
                },
              },
              {
                holidayType: {
                  some: {
                    name: {
                      contains: searchParams,
                    },
                  },
                },
              },
            ],
          }),
        },
      });

      return new NextResponse(
        JSON.stringify({
          count: inspirationsCount,
          data: inspirations,
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

export async function PUT(req: NextRequest) {
  try {
    const {
      sourceId,
      sortPosition,
      destinationIdSortId,
      destinationId,
      homePageSort,
      inspirationPageSort,
    } = await req.json();

    if (!sourceId || !sortPosition || destinationIdSortId === undefined) {
      return getErrorResponse(400, "failed validations");
    }

    if (homePageSort) {
      await prisma.$transaction(async (tx) => {
        const draggedPlace = await prisma.inspirations.findUnique({
          where: {
            isHomePageSort: true,
            id: sourceId,
          },
        });

        await tx.inspirations.update({
          where: {
            isHomePageSort: true,
            id: sourceId,
          },
          data: {
            homePageSortId: destinationIdSortId,
          },
        });

        await tx.inspirations.updateMany({
          where: {
            AND: {
              isHomePageSort: true,
              NOT: {
                id: sourceId,
              },

              homePageSortId: {
                gte: Math.min(
                  draggedPlace?.homePageSortId as number,
                  destinationIdSortId
                ),
                lte: Math.max(
                  draggedPlace?.homePageSortId as number,
                  destinationIdSortId
                ),
              },
            },
          },
          data: {
            ...(sortPosition > 0
              ? { homePageSortId: { increment: 1 } }
              : { homePageSortId: { decrement: 1 } }),
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
    } else if (inspirationPageSort) {
      await prisma.$transaction(async (tx) => {
        const draggedPlace = await prisma.inspirations.findUnique({
          where: {
            id: sourceId,
          },
        });

        await tx.inspirations.update({
          where: {
            id: sourceId,
          },
          data: {
            inspirationSortId: destinationIdSortId,
          },
        });

        await tx.inspirations.updateMany({
          where: {
            AND: {
              NOT: {
                id: sourceId,
              },
              inspirationSortId: {
                gte: Math.min(
                  draggedPlace?.inspirationSortId as number,
                  destinationIdSortId
                ),
                lte: Math.max(
                  draggedPlace?.inspirationSortId as number,
                  destinationIdSortId
                ),
              },
            },
          },
          data: {
            ...(sortPosition > 0
              ? { inspirationSortId: { decrement: 1 } }
              : { inspirationSortId: { increment: 1 } }),
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
    } else {
      await prisma.$transaction(async (tx) => {
        const draggedPlace = await prisma.inspirations.findFirst({
          where: {
            id: sourceId,
            destination: {
              some: {
                id: destinationId,
              },
            },
          },
        });

        await tx.inspirations.update({
          where: {
            id: sourceId,
            destination: {
              some: {
                id: destinationId,
              },
            },
          },
          data: {
            sortId: destinationIdSortId,
          },
        });

        await tx.inspirations.updateMany({
          where: {
            AND: {
              NOT: {
                id: sourceId,
              },
              destination: {
                some: {
                  id: destinationId,
                },
              },
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
    }
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}
