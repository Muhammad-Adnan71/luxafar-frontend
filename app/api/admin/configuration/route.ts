import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { convertMediaIdsResponseIntoMediaUrl } from "lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { media, ...rest } = await req.json();
    const configuration = await prisma.configuration.update({
      where: { id: 1 },
      data: {
        ...rest,
        media: {
          update: media,
        },
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: configuration,
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
  try {
    const configuration = await prisma.configuration.findFirst({
      include: {
        media: true,
      },
    });
    const mediaUrls = await convertMediaIdsResponseIntoMediaUrl(configuration);

    return new NextResponse(
      JSON.stringify({
        data: mediaUrls,
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
