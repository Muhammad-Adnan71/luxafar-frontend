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
    const response = await prisma.gallery.findMany({
      where: {
        destinationId: id,
      },
      include: { media: true }
    });

    let galleryResponse;
    if (response?.length) {
      galleryResponse = await Promise.all(
        response.map(async (img: any) => {
          const { desktopMediaUrl, mobileMediaUrl } =
            img.media as MediaResponse;
          const mediaUrls = await getUploadsUrl({
            desktopMediaUrl,
            mobileMediaUrl,
          });
          return {
            ...img,
            media: {
              ...img?.media,
              desktopMediaUrl: mediaUrls?.data[0].desktopMediaUrl,
              mobileMediaUrl: mediaUrls?.data[1].mobileMediaUrl,
            },
          };
        })
      );
    }

    return new NextResponse(
      JSON.stringify({
        data: galleryResponse,
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
      if (body.gallery?.length) {
        const seasonsDB = await prisma.gallery.findMany({
          where: { destinationId: id },
          select: {
            id: true,
          },
        });

        // const seasonsIds = body.seasonToVisit.map((item: any) => item.id);

        // const deleteSeasonIds = seasonsDB
        //   .filter((item: any) => !seasonsIds.includes(item.id))
        //   .map((item) => item.id);

        const response = await prisma.$transaction([
          ...body.gallery.map((element: any) => {
            const { destinationId, media, id, imageId, ...rest } = element
            if (element.id) {
              return prisma.gallery.update({
                where: {
                  id: element.id,
                },
                data: { ...rest, media: { update: media } }
              });
            } else {
              return prisma.gallery.create({
                data: {
                  ...rest,
                  destination: { connect: { id: destinationId }, destinationId: id },
                  media: {
                    create: media,
                  },
                },
              });
            }
          }),
          // prisma.thingsToDo.deleteMany({
          //   where: {
          //     id: {
          //       in: deleteSeasonIds,
          //     },
          //   },
          // }),
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
      } else {
        const response = await prisma.gallery.update({
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
      const response = await prisma.gallery.delete({
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
          message: "gallery id is required",
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
