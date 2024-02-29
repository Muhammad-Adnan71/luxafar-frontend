import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { NextResponse } from "next/server";
import { getUploadsUrl } from "services/uploads";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);
    const page = await prisma.pages.findFirst({
      where: {
        id: id,
      },
      include: {
        seoMeta: true,
        content: {
        
          include: {
            media: true,
          },
          orderBy:{
            sortId:"asc"
          }
        },
      },
    });
    let contentResponse;
    if (page?.content?.length) {
      contentResponse = await Promise.all(
        page.content.map(async (item: any) => {
          const mediaUrls = await getUploadsUrl({
            desktopMediaUrl: item?.media?.desktopMediaUrl,
            mobileMediaUrl: item?.media?.mobileMediaUrl,
          });
          return {
            ...item,
            media: {
              ...item?.media,
              desktopMediaUrl: mediaUrls?.data[0]?.desktopMediaUrl,
              mobileMediaUrl: mediaUrls?.data[1]?.mobileMediaUrl,
            },
          };
        })
      );
    }

    return new NextResponse(
      JSON.stringify({
        data: { ...page, content: contentResponse },
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
  if (!params.id)
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Page id is required",
      }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  try {
    const id = Number(params.id);
    const { content, seoMeta, seoMetaId, ...rest } = await req.json();

    if (content) {
      const contents = await prisma.content.findMany({
        where: { pageId: id },
        select: {
          id: true,
        },
      });

      const contentIds = content.map((item: any) => item.id);
      const deleteContentIds = contents
        .filter((item: any) => !contentIds.includes(item.id))
        .map((item) => item.id);
      let newSeoMeta;
      if (!seoMetaId) {
        newSeoMeta = await prisma.seoMeta.create({
          data: seoMeta,
        });
      }

      const response = await prisma.$transaction([
        prisma.pages.update({
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
          },
          include: {
            content: true,
          },
        }),
        ...content.map((element: any) => {
          const { media, id, referenceId, imageId, pageId, ...contentRest } =
            element;

          if (element.id) {
            return prisma.content.update({
              where: {
                id: element.id,
              },
              data: {
                ...contentRest,
                media: { update: media },
              },
            });
          } else {
            return prisma.content.create({
              data: {
                ...contentRest,
                createByDefault: false,
                pageId: Number(params.id),
              },
            });
          }
        }),

        prisma.content.deleteMany({
          where: {
            id: {
              in: rest.isExpandable ? deleteContentIds : [],
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
      let newSeoMeta;
      if (!seoMetaId) {
        newSeoMeta = await prisma.seoMeta.create({
          data: seoMeta,
        });
      }
      const response = await prisma.$transaction([
        prisma.pages.update({
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
          },
          include: {
            content: true,
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
    }
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}
