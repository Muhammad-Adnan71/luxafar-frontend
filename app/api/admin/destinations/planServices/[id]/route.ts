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
      const planService = await prisma.planService.update({
        where: { id },
        data: {
          isActive: body.status,
        },
        include: {
          media: true,
        },
      });

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
    } else {
      const { media, id: _id, imageId, ...rest } = body;
      const planService = await prisma.planService.update({
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
    // const planService = await prisma.planService.update({
    //   where: { id },
    //   data: {
    //     ...body,
    //   },
    // });

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
    const planService = await prisma.planService.delete({
      where: { id },
    });

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
