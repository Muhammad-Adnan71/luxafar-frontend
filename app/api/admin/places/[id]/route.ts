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
    const tourById = await prisma.placeToVisit.findFirst({
      where: {
        id: id,
        isDeleted: false,
      },
      include: {
        media: true,
        seoMeta: true,
        reviews: {
          include: {
            media: true,
          },
        },
        attraction: {
          include: { media: true },
        },
      },
    });

    const { desktopMediaUrl, mobileMediaUrl } =
      tourById?.media as MediaResponse;
    const mediaUrls = await getUploadsUrl({ desktopMediaUrl, mobileMediaUrl });

    let reviewsResponse;
    let attractionResponse;
    if (tourById?.reviews.length) {
      reviewsResponse = await Promise.all(
        tourById.reviews.map(async (rev: any) => {
          const { desktopMediaUrl, mobileMediaUrl } =
            rev.media as MediaResponse;
          const mediaUrls = await getUploadsUrl({
            desktopMediaUrl,
            mobileMediaUrl,
          });
          return {
            ...rev,
            media: {
              ...rev?.media,
              desktopMediaUrl: mediaUrls?.data[0].desktopMediaUrl,
              mobileMediaUrl: mediaUrls?.data[1].mobileMediaUrl,
            },
          };
        })
      );
    }

    if (tourById?.attraction.length) {
      attractionResponse = await Promise.all(
        tourById.attraction.map(async (attr: any) => {
          const { desktopMediaUrl, mobileMediaUrl } =
            attr.media as MediaResponse;
          const mediaUrls = await getUploadsUrl({
            desktopMediaUrl,
            mobileMediaUrl,
          });
          return {
            ...attr,
            media: {
              ...attr?.media,
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
          ...tourById,
          reviews: reviewsResponse,
          attraction: attractionResponse,
          media: {
            ...tourById?.media,
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
      if (body.reviews?.length || body.attraction?.length) {
        const {
          reviews,
          attraction,
          media,
          destinationId,
          imageId,
          seoMeta,
          seoMetaId,
          id,
          ...rest
        } = body;
        let newSeoMeta;
        if (!seoMetaId) {
          newSeoMeta = await prisma.seoMeta.create({
            data: seoMeta,
          });
        }
        const reviewsDB = await prisma.reviews.findMany({
          where: { placeId: id },
          select: {
            id: true,
          },
        });

        const reviewsIds = reviews?.map((item: any) => item.id);

        const deleteReviewsIds = reviewsDB
          .filter((item: any) => !reviewsIds.includes(item.id))
          .map((item) => item.id);

        const attractionDB = await prisma.attraction.findMany({
          where: { placeId: id },
          select: {
            id: true,
          },
        });

        const attractionIds = attraction?.map((item: any) => item.id);

        const deleteAttractionIds = attractionDB
          ?.filter((item: any) => !attractionIds?.includes(item.id))
          ?.map((item) => item.id);

        const response = await prisma.$transaction([
          prisma.placeToVisit.update({
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
              destination: { connect: { id: Number(destinationId) } },
            },
            include: {
              reviews: true,
              attraction: true,
            },
          }),
          ...reviews?.map((element: any) => {
            const {
              media: elementMedia,
              id: elementId,
              imageId: elementImageId,
              placeId,
              ...restElement
            } = element;
            if (elementId) {
              return prisma.reviews.update({
                where: {
                  id: elementId,
                },
                data: { ...restElement, media: { update: elementMedia } },
              });
            } else {
              return prisma.reviews.create({
                data: {
                  placeToVisit: {
                    placeId,
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
          ...attraction?.map((element: any) => {
            const {
              media: elementMedia,
              id: elementId,
              imageId: elementImageId,
              placeId,
              ...restElement
            } = element;
            if (elementId) {
              return prisma.attraction.update({
                where: {
                  id: elementId,
                },
                data: { ...restElement, media: { update: elementMedia } },
              });
            } else {
              return prisma.attraction.create({
                data: {
                  placeToVisit: {
                    placeId,
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
          prisma.reviews.deleteMany({
            where: {
              id: {
                in: deleteReviewsIds,
              },
            },
          }),
          prisma.attraction.deleteMany({
            where: {
              id: {
                in: deleteAttractionIds,
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
        const places = await prisma.placeToVisit.update({
          where: {
            id,
          },
          data: { ...body },
        });
        return new NextResponse(
          JSON.stringify({
            status: "success",
            data: places,
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
          message: "Place id is required",
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
      const place = await prisma.placeToVisit.update({
        where: {
          id: id,
        },
        data: {
          isDeleted: true,
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
    } else {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Place id is required",
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
