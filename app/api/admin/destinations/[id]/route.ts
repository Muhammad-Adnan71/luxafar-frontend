import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { convertMediaIdsResponseIntoMediaUrl, isNumeric } from "lib/utils";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id))
      return getErrorResponse(400, "Id is not required");

    const id = Number(params.id);
    const destination = await prisma.destinations.findFirst({
      where: {
        id: id,
      },
      include: {
        seoMeta: true,
        content: {
          orderBy: {
            sortId: "asc",
          },
          include: {
            media: true,
          },
        },
        destinationFeatureOffered: {
          include: {
            destinationFeatures: true,
          },
        },
      },
    });

    const content = await convertMediaIdsResponseIntoMediaUrl(
      destination?.content
    );
    return new NextResponse(
      JSON.stringify({
        data: { ...destination, content },
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id))
      return getErrorResponse(400, "Id is not required");
    const id = Number(params.id);
    const destination = await prisma.destinations.delete({
      where: {
        id: id,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: { ...destination },
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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id))
      return getErrorResponse(400, "Id is not required");
    const id = Number(params.id);
    const body = await request.json();
    if (id) {
      if (!body.content?.length) {
        const destination = await prisma.destinations.update({
          data: {
            isActive: body.isActive,
          },
          where: { id },
        });

        return new NextResponse(
          JSON.stringify({
            data: destination,
            status: "success",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        const {
          content,
          destinationFeatureOffered,
          id,
          seoMeta,
          seoMetaId,
          ...rest
        } = body;
        let newSeoMeta;
        if (!seoMetaId) {
          newSeoMeta = await prisma.seoMeta.create({
            data: seoMeta,
          });
        }
        try {
          const response = await prisma.$transaction([
            prisma.destinations.update({
              where: {
                id: id,
              },
              data: {
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
                ...rest,
              },
              include: {
                content: {
                  include: {
                    media: true,
                  },
                },
              },
            }),
            ...content.map((element: any) => {
              const {
                media: elementMedia,
                id: elementId,
                imageId: elementImageId,
                placeId,
                pageId,
                referenceId,
                ...restElement
              } = element;

              if (elementId) {
                return prisma.content.update({
                  where: {
                    id: elementId,
                  },
                  data: {
                    ...restElement,
                    media: { update: { data: elementMedia } },
                  },
                });
              } else {
                return prisma.content.create({
                  data: {
                    ...restElement,
                    destinations: {
                      connect: {
                        id: id,
                      },
                    },
                    media: {
                      create: {
                        ...elementMedia,
                      },
                    },
                  },
                });
              }
            }),
            prisma.destinationFeatureOffered.deleteMany({
              where: { destinationId: id },
            }),
            ...destinationFeatureOffered?.map((element: any) => {
              const { destinationFeatureId, ...rest } = element;
              if (destinationFeatureId) {
                return prisma.destinationFeatureOffered.create({
                  data: {
                    ...rest,
                    destinationId: id,
                    destinationFeatureId,
                  },
                });
              }
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
        } catch (e) {
          console.log(e, "error");
        }
      }
    }
  } catch (error: any) {
    if (error) {
      return getErrorResponse(400, "Error", error);
    }

    return getErrorResponse(500, error.message);
  }
}
