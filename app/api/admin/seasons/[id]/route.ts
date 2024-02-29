import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { MediaResponse } from "lib/types";
import { NextResponse } from "next/server";
import { getUploadsUrl } from "services/uploads";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);
    const response = await prisma.seasonToVisit.findMany({
      where: {
        destinationId: id,
      },
      include: { media: true },
    });

    let seasonResponse;
    if (response?.length) {
      seasonResponse = await Promise.all(
        response.map(async (season: any) => {
          const { desktopMediaUrl, mobileMediaUrl } =
            season.media as MediaResponse;
          const mediaUrls = await getUploadsUrl({
            desktopMediaUrl,
            mobileMediaUrl,
          });
          return {
            ...season,
            media: {
              ...season?.media,
              desktopMediaUrl: mediaUrls?.data[0].desktopMediaUrl,
              mobileMediaUrl: mediaUrls?.data[1].mobileMediaUrl,
            },
          };
        })
      );
    }

    return new NextResponse(
      JSON.stringify({
        data: seasonResponse,
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

export async function PUT(
  req: Request,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);
    const body = await req.json();

    if (id) {
      if (body.seasonToVisit?.length) {
        const seasonsDB = await prisma.seasonToVisit.findMany({
          where: { destinationId: id },
          select: {
            id: true,
          },
        });

        const seasonsIds = body.seasonToVisit.map((item: any) => item.id);

        const deleteSeasonIds = seasonsDB
          .filter((item: any) => !seasonsIds.includes(item.id))
          .map((item) => item.id);

        const response = await prisma.$transaction([
          ...body.seasonToVisit.map((element: any) => {
            const {
              destinationId,
              media,
              id: elementId,
              imageId,
              ...rest
            } = element;
            if (element.id) {
              return prisma.seasonToVisit.update({
                where: {
                  id: element.id,
                },
                data: {
                  ...rest,
                  media: { update: media },
                  destination: { connect: { id: destinationId } },
                },
              });
            } else {
              return prisma.seasonToVisit.create({
                data: {
                  ...rest,
                  destination: { connect: { id: destinationId } },
                  media: {
                    create: media,
                  },
                },
              });
            }
          }),
          prisma.thingsToDo.deleteMany({
            where: {
              id: {
                in: deleteSeasonIds,
              },
            },
          }),
        ]);

        return new NextResponse(
          JSON.stringify({
            data: response,
            status: "success",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        const response = await prisma.seasonToVisit.update({
          where: {
            id,
          },
          data: { ...body },
        });
        return new NextResponse(
          JSON.stringify({
            status: "success",
            data: response,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } else {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "destination id is required",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);

    if (id) {
      const response = await prisma.seasonToVisit.delete({
        where: {
          id: id,
        },
      });

      return new NextResponse(
        JSON.stringify({
          data: response,
          status: "success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Season id is required",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}
