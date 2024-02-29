import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "lib/utils";
import { BannerSchema } from "lib/validations/banner.schema";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { media, ...rest } = BannerSchema.parse(body);
    const banner = await prisma.banner.create({
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

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        media: true,
      },
    });
    const bannerMediaResponse = await convertMediaIdsResponseIntoMediaUrl(
      banners
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
