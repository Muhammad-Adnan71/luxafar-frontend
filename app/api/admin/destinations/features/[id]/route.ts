import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUploadsUrl } from "services/uploads";
import { ZodError } from "zod";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    if (body?.status !== undefined) {
      const feature = await prisma.destinationFeatures.update({
        where: { id },
        data: {
          isActive: body.status,
        },
        include: {
          media: true,
        },
      });

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
    } else {
      const { media, id: _id, imageId, ...rest } = body;
      const feature = await prisma.destinationFeatures.update({
        where: { id },
        data: {
          ...rest,
          ...(media && {
            media: {
              update: media,
            },
          }),
        },
        include: {
          media: true,
        },
      });

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
  } catch (error: any) {
    if (error instanceof ZodError) {
      return getErrorResponse(400, "failed validations", error);
    }

    return getErrorResponse(500, error.message);
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);
    const destinationFeature = await prisma.destinationFeatures.delete({
      where: { id },
    });

    return new NextResponse(
      JSON.stringify({
        data: destinationFeature,
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
