import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getUploadsUrl } from "services/uploads";
import { MediaResponse } from "lib/types";


export async function POST(req: NextRequest) {
  try {
    // const body = await req.json(); 
    const { media, ...rest } = await req.json();
    const feature = await prisma.destinationFeatures.create({
      data: {
        ...rest,
        media: {
          create: media,
        },
      },
      include: {
        media: true,
      },
    });
    if (feature?.media) {
      const mediaUrls = await getUploadsUrl({
        desktopMediaUrl: feature?.media?.desktopMediaUrl as string,
      });

      return new NextResponse(
        JSON.stringify({
          data: {
            ...feature,
            media: {
              ...feature?.media,
              desktopMediaUrl: mediaUrls?.data[0].desktopMediaUrl,
            },
          },
          status: "success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        data: feature,
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
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const isActive = url.searchParams.get("active");

  try {
    if (isActive) {
      const destinationFeatures = await prisma.destinationFeatures.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          id: "desc",
        },
        include: { media: true },
      });
      const featureResponse = await Promise.all(
        destinationFeatures.map(async (feature: any) => {
          const { desktopMediaUrl } = feature.media as MediaResponse;
          const mediaUrls = await getUploadsUrl({
            desktopMediaUrl,
          });
          return {
            ...feature,
            media: {
              ...feature?.media,
              desktopMediaUrl: mediaUrls?.data[0].desktopMediaUrl,
            },
          };
        })
      );
      return new NextResponse(
        JSON.stringify({
          data: featureResponse,
          status: "success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      const destinationFeatures = await prisma.destinationFeatures.findMany({
        include: { media: true }
      });
      const featureResponse = await Promise.all(
        destinationFeatures.map(async (feature: any) => {
          const { desktopMediaUrl } = feature.media as MediaResponse;
          const mediaUrls = await getUploadsUrl({
            desktopMediaUrl,
          });
          return {
            ...feature,
            media: {
              ...feature?.media,
              desktopMediaUrl: mediaUrls?.data[0].desktopMediaUrl,
            },
          };
        })
      );
      return new NextResponse(
        JSON.stringify({
          data: featureResponse,
          status: "success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      return getErrorResponse(400, "failed validations", error);
    }

    return getErrorResponse(500, error.message);
  }
}
