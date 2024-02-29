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
    const response = await prisma.thingsToDo.findMany({
      orderBy: {
        sortId: "asc",
      },
      where: {
        destinationId: id,
      },
      include: { media: true, destination: true },
    });

    let thingsResponse;
    if (response?.length) {
      thingsResponse = await Promise.all(
        response.map(async (things: any) => {
          const { desktopMediaUrl, mobileMediaUrl } =
            things.media as MediaResponse;
          const mediaUrls = await getUploadsUrl({
            desktopMediaUrl,
            mobileMediaUrl,
          });
          return {
            ...things,
            media: {
              ...things?.media,
              desktopMediaUrl: mediaUrls?.data[0].desktopMediaUrl,
              mobileMediaUrl: mediaUrls?.data[1].mobileMediaUrl,
            },
          };
        })
      );
    }

    return new NextResponse(
      JSON.stringify({
        data: thingsResponse,
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
      if (body.thingsToDo?.length) {
        const thingsToDoDB = await prisma.thingsToDo.findMany({
          where: { destinationId: id },
          select: {
            id: true,
          },
        });

        const thingsToDoIds = body.thingsToDo.map((item: any) => item.id);

        const deleteThingsToDoIds = thingsToDoDB
          .filter((item: any) => !thingsToDoIds.includes(item.id))
          .map((item) => item.id);

        const highestSortIdThing = await prisma.thingsToDo.findFirst({
          where: {
            destinationId: Number(id),
          },
          orderBy: { sortId: "desc" },
        });
        const response = await prisma.$transaction([
          ...body.thingsToDo.map((element: any) => {
            const {
              destinationId,
              media,
              id: elementId,
              imageId,
              ...rest
            } = element;
            if (element.id) {
              return prisma.thingsToDo.update({
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
              return prisma.thingsToDo.create({
                data: {
                  ...rest,
                  sortId: highestSortIdThing?.sortId
                    ? highestSortIdThing.sortId + 1
                    : 1,
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
                in: deleteThingsToDoIds,
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
        const response = await prisma.thingsToDo.update({
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
      const response = await prisma.thingsToDo.delete({
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
          message: "Things To Do id is required",
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
