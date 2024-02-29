import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { MediaResponse } from "lib/types";
import { convertMediaIdsResponseIntoMediaUrl, isNumeric } from "lib/utils";
import { BannerSchema } from "lib/validations/banner.schema";
import { NextResponse } from "next/server";
import { getUploadsUrl } from "services/uploads";
import { ZodError } from "zod";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id))
      return getErrorResponse(400, "Id is not required");

    const id = Number(params.id);
    const banner = await prisma.banner.findFirst({
      where: {
        id: id,
      },
      include: {
        media: true,
      },
    });
    const bannerMediaResponse = await convertMediaIdsResponseIntoMediaUrl(
      banner
    );
    return new NextResponse(
      JSON.stringify({
        data: bannerMediaResponse,
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
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id))
      return getErrorResponse(400, "Id is not required");

    const id = Number(params.id);
    const body = await req.json();
    const data = BannerSchema.parse(body);

    const { media, ...rest } = data;
    const banner = await prisma.banner.update({
      where: {
        id: id,
      },
      data: {
        ...rest,
        media: {
          update: media,
        },
      },
    });

    const bannerMediaResponse = await convertMediaIdsResponseIntoMediaUrl(
      banner
    );
    return new NextResponse(
      JSON.stringify({
        data: bannerMediaResponse,
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id))
      return getErrorResponse(400, "Id is not required");

    const id = Number(params.id);

    const banner = await prisma.banner.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: banner,
        status: "success",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    if (error) {
      return getErrorResponse(400, "Error", error.message);
    }

    return getErrorResponse(500, error.message);
  }
}
