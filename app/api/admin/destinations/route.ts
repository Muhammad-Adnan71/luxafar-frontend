import { create } from "zustand";
import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getUploadsUrl } from "services/uploads";
import { convertMediaIdsResponseIntoMediaUrl } from "lib/utils";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const isActive = url.searchParams.get("active");
  const pageSize = url.searchParams.get("pageSize");
  const pageNum = url.searchParams.get("pageNum");
  const searchParams = url.searchParams.get("searchParams");
  const destinationId = url.searchParams.get("destinationId");
  const sortBy = url.searchParams.get("sortBy");
  try {
    const destinationCount = await prisma.destinations.count({
      where: {
        ...(isActive && { isActive: true }),
        ...(searchParams && {
          OR: [
            {
              name: {
                contains: searchParams,
              },
            },
          ],
        }),
      },
    });
    const destinations = await prisma.destinations.findMany({
      ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
      ...(pageSize && { take: Number(pageSize) }),

      where: {
        ...(isActive && { isActive: true }),
        ...(searchParams && {
          OR: [
            {
              name: {
                contains: searchParams,
              },
            },
          ],
        }),
      },
      include: {
        content: {
          include: {
            media: true,
          },
        },
      },
      orderBy: {
        ...(sortBy ? { [sortBy]: "asc" } : { id: "desc" }),
      },
    });

    const destinationResponse = await Promise.all(
      destinations.map(async (destination: any) => {
        const mediaUrls = await getUploadsUrl({
          desktopMediaUrl: destination?.content?.[0]?.media?.desktopMediaUrl,
        });
        return {
          ...destination,
          image: mediaUrls?.data?.[0]?.desktopMediaUrl,
        };
      })
    );

    return new NextResponse(
      JSON.stringify({
        data: destinationResponse,
        count: destinationCount,
        status: "success",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return getErrorResponse(400, "failed validations", error);
    }

    return getErrorResponse(500, error.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { content, destinationFeatureOffered, seoMeta, seoMetaId, ...rest } =
      await req.json();

    const destination = await prisma.destinations.create({
      data: {
        ...rest,
        content: {
          create: [
            ...content.map(({ media, ...item }: any) => ({
              ...item,
              media: {
                create: media,
              },
            })),
          ],
        },
        seoMeta: {
          create: seoMeta,
        },
        destinationFeatureOffered: {
          create: [
            ...destinationFeatureOffered.map((item: any) => ({
              ...item,
            })),
          ],
        },
      },
      include: {
        content: {
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
  } catch (error: any) {
    if (error instanceof ZodError) {
      return getErrorResponse(400, "failed validations", error);
    }

    return getErrorResponse(500, error.message);
  }
}
