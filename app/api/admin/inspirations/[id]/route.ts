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
    const inspiration = await prisma.inspirations.findFirst({
      where: {
        isDeleted: false,
        id: id,
      },
      include: {
        seoMeta: true,
        media: true,
        destination: true,
        holidayType: true,
        inspirationDetail: {
          orderBy: [
            {
              sortId: "asc",
            },
            { id: "desc" },
          ],
          include: {
            media: true,
          },
        },
      },
    });

    const { desktopMediaUrl, mobileMediaUrl } =
      inspiration?.media as MediaResponse;
    const mediaUrls = await getUploadsUrl({ desktopMediaUrl, mobileMediaUrl });

    let inspirationResponse;
    if (inspiration?.inspirationDetail.length) {
      inspirationResponse = await Promise.all(
        inspiration.inspirationDetail.map(async (inspiration: any) => {
          const { desktopMediaUrl, mobileMediaUrl } =
            inspiration.media as MediaResponse;
          const mediaUrls = await getUploadsUrl({
            desktopMediaUrl,
            mobileMediaUrl,
          });
          return {
            ...inspiration,
            media: {
              ...inspiration?.media,
              desktopMediaUrl: mediaUrls?.data[0].desktopMediaUrl,
              mobileMediaUrl: mediaUrls?.data[1].mobileMediaUrl,
            },
          };
        })
      );
    }

    return new NextResponse(
      JSON.stringify({
        data: {
          ...inspiration,
          inspirationDetail: inspirationResponse,
          media: {
            ...inspiration?.media,
            desktopMediaUrl: mediaUrls?.data[0].desktopMediaUrl,
            mobileMediaUrl: mediaUrls?.data[1].mobileMediaUrl,
          },
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
      if (body.inspirationDetail?.length) {
        const {
          inspirationDetail,
          id,
          imageId,
          media,
          destination,
          holidayType,
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
        const inspirationDetailDB = await prisma.inspirationDetail.findMany({
          where: { inspirationId: id },
          select: {
            id: true,
          },
        });

        const inspirationDetailIds = inspirationDetail.map(
          (item: any) => item.id
        );

        const deleteInspirationDetailIds = inspirationDetailDB
          .filter((item: any) => !inspirationDetailIds.includes(item.id))
          .map((item) => item.id);

        await prisma.inspirations.update({
          where: {
            id: id,
          },
          data: {
            ...rest,
            destination: {
              set: [],
            },
            holidayType: {
              set: [],
            },
          },
        });

        const response = await prisma.$transaction([
          prisma.inspirations.update({
            where: {
              id: id,
            },
            data: {
              ...rest,
              destination: {
                connect: destination,
              },
              holidayType: {
                connect: holidayType,
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
              media: {
                update: {
                  data: media,
                },
              },
            },
            include: {
              inspirationDetail: {
                include: {
                  media: true,
                },
              },
              media: true,
            },
          }),
          ...inspirationDetail.map((element: any) => {
            if (element.id) {
              const { title, description, media, rest } = element;

              return prisma.inspirationDetail.update({
                where: {
                  id: element.id,
                },
                data: {
                  ...rest,
                  title,
                  description,
                  media: {
                    update: media,
                  },
                },
              });
            } else {
              const { title, description, media, ...rest } = element;
              return prisma.inspirationDetail.create({
                data: {
                  ...rest,
                  title,
                  description,
                  inspirations: {
                    connect: {
                      id: id,
                    },
                  },
                  media: {
                    create: media,
                  },
                },
              });
            }
          }),

          prisma.inspirationDetail.deleteMany({
            where: {
              id: {
                in: deleteInspirationDetailIds,
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
        if (body?.isFeatured !== undefined) {
          const featuredInspiration = await prisma.inspirations.findFirst({
            where: {
              isFeatured: true,
              destinationId: body.destinationId,
            },
          });
          if (featuredInspiration?.id)
            await prisma.inspirations.update({
              where: {
                id: featuredInspiration?.id,
                destinationId: body.destinationId,
              },
              data: {
                isFeatured: false,
              },
            });
          const inspiration = await prisma.inspirations.update({
            where: {
              id,
              destinationId: body.destinationId,
            },
            data: {
              isFeatured: body?.isFeatured,
            },
          });

          return new NextResponse(
            JSON.stringify({
              status: "success",
              data: inspiration,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } else if (body?.isHomePageSort !== undefined) {
          if (body?.isHomePageSort == false) {
            const inspiration = await prisma.inspirations.update({
              where: {
                id,
              },
              data: {
                isHomePageSort: false,
              },
              include: {
                destination: true,
              },
            });

            return new NextResponse(
              JSON.stringify({
                status: "success",
                data: inspiration,
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json" },
              }
            );
          } else {
            const highestSortIdInspiration =
              await prisma.inspirations.findFirst({
                orderBy: {
                  homePageSortId: "desc",
                },
              });

            const inspiration = await prisma.inspirations.update({
              where: {
                id,
              },
              data: {
                isHomePageSort: body?.isHomePageSort,
                homePageSortId: highestSortIdInspiration?.homePageSortId
                  ? highestSortIdInspiration?.homePageSortId + 1
                  : 1,
              },
              include: {
                destination: true,
              },
            });

            return new NextResponse(
              JSON.stringify({
                status: "success",
                data: inspiration,
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json" },
              }
            );
          }
        } else {
          const inspiration = await prisma.inspirations.update({
            where: {
              id,
            },
            data: { ...body },
          });
          return new NextResponse(
            JSON.stringify({
              status: "success",
              data: inspiration,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      }
    } else {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "inspiration id is required",
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
      const inspiration = await prisma.inspirations.update({
        where: {
          id: id,
        },
        data: {
          isDeleted: true,
        },

        include: {
          inspirationDetail: true,
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
    } else {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Inspiration id is required",
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
