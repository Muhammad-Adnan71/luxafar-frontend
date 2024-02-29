import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { MediaResponse } from "lib/types";
import { convertMediaIdsResponseIntoMediaUrl } from "lib/utils";
import { NextResponse } from "next/server";
import { getUploadsUrl } from "services/uploads";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);
    const holidayType = await prisma.holidayType.findFirst({
      where: {
        id: id,
      },
      include: {
        media: true,
        seoMeta: true,
        highlights: {
          include: {
            media: true,
          },
        },
      },
    });

    const [holidayTypeResponse, holidayTypeHighlights] = await Promise.all([
      convertMediaIdsResponseIntoMediaUrl(holidayType),
      convertMediaIdsResponseIntoMediaUrl(holidayType?.highlights),
    ]);
    return new NextResponse(
      JSON.stringify({
        data: {
          ...holidayTypeResponse,
          highlights: holidayTypeHighlights,
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

export async function PUT(
  req: Request,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);
    const body = await req.json();

    if (id) {
      if (body.highlights?.length) {
        const {
          highlights,
          id,
          imageId,
          media,
          holidayType,
          holidayTypeId,
          seoMeta,
          seoMetaId,
          ...rest
        } = body;

        const highlightsDB = await prisma.highlights.findMany({
          where: { holidayTypeId: id },
          select: {
            id: true,
          },
        });

        const highlightIds = highlights.map((item: any) => item.id);

        const deleteHighlightIds = highlightsDB
          .filter((item: any) => !highlightIds.includes(item.id))
          .map((item) => item.id);
        let newSeoMeta;
        if (!seoMetaId) {
          newSeoMeta = await prisma.seoMeta.create({
            data: seoMeta,
          });
        }
        const response = await prisma.$transaction([
          prisma.holidayType.update({
            where: {
              id: id,
            },
            data: {
              ...rest,
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
              ...(media && {
                media: {
                  update: media,
                },
              }),
            },
            include: {
              highlights: true,
            },
          }),
          ...highlights.map((element: any) => {
            const {
              media: elementMedia,
              id: elementId,
              imageId: elementImageId,
              holidayTypeId,
              tourId,
              ...restElement
            } = element;
            if (elementId) {
              return prisma.highlights.update({
                where: {
                  id: elementId,
                },
                data: { ...restElement, media: { update: elementMedia } },
              });
            } else {
              return prisma.highlights.create({
                data: {
                  holidayType: {
                    holidayTypeId,
                    connect: {
                      id: id,
                    },
                  },
                  ...restElement,
                  media: {
                    create: elementMedia,
                  },
                },
              });
            }
          }),
          prisma.highlights.deleteMany({
            where: {
              id: {
                in: deleteHighlightIds,
              },
            },
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
      } else {
        const holidayType = await prisma.holidayType.update({
          where: {
            id,
          },
          data: { ...body },
        });
        return new NextResponse(
          JSON.stringify({
            status: "success",
            data: holidayType,
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
          message: "holiday id is required",
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
      const holiday = await prisma.holidayType.delete({
        where: {
          id: id,
        },

        include: {
          highlights: true,
        },
      });

      return new NextResponse(
        JSON.stringify({
          data: holiday,
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
          message: "holiday id is required",
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
