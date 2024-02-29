import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { MediaResponse } from "lib/types";
import { NextRequest, NextResponse } from "next/server";
import { getUploadsUrl } from "services/uploads";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    // const body = await req.json();
    const { media, ...rest } = await req.json();
    const planService = await prisma.planService.create({
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

    if (planService?.media) {
      const mediaUrls = await getUploadsUrl({
        desktopMediaUrl: planService?.media?.desktopMediaUrl as string,
      });

      return new NextResponse(
        JSON.stringify({
          data: {
            ...planService,
            media: {
              ...planService?.media,
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
        data: { ...planService },
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
  try {
    const planServices = await prisma.planService.findMany({ include: { media: true }, });
    const planServicesResponse = await Promise.all(
      planServices.map(async (plans: any) => {
        const { desktopMediaUrl } = plans.media as MediaResponse;
        const mediaUrls = await getUploadsUrl({
          desktopMediaUrl,
        });
        return {
          ...plans,
          media: {
            ...plans?.media,
            desktopMediaUrl: mediaUrls?.data[0].desktopMediaUrl,
          },
        };
      })
    );
    return new NextResponse(
      JSON.stringify({
        data: planServicesResponse,
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
