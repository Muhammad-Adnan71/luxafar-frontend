import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { highlights, media, seoMeta, seoMetaId, ...rest } = await req.json();
    let newSeoMeta;
    if (!seoMetaId) {
      newSeoMeta = await prisma.seoMeta.create({
        data: seoMeta,
      });
    }

    const holidayTypes = await prisma.holidayType.create({
      data: {
        ...rest,
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
        highlights: {
          create: highlights.map((ele: any) => ({
            ...ele,
            media: {
              create: ele.media,
            },
          })),
        },
      },
      include: {
        highlights: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: holidayTypes,
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
  const isActive = url.searchParams.get("active");

  try {
    if (isActive) {
      const holidayTypes = await prisma.holidayType.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          name: "desc",
        },
      });
      return new NextResponse(
        JSON.stringify({
          data: holidayTypes,
          status: "success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      const holidayTypes = await prisma.holidayType.findMany({
        orderBy: {
          id: "desc",
        },
      });
      return new NextResponse(
        JSON.stringify({
          data: holidayTypes,
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
