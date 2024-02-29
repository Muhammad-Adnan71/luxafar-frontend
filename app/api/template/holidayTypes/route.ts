import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "lib/utils";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);

  try {
    const [holidayTypes, inspirations] = await prisma.$transaction([
      prisma.holidayType.findMany({
        where: { isActive: true },
        include: {
          media: true,
          seoMeta: true,
        },
      }),
      prisma.inspirations.findMany({
        where: {
          isDeleted: false,
          isActive: true,
        },
        take: 3,
        orderBy: {
          id: "desc",
        },
        include: {
          seoMeta: true,
          destination: true,
          media: true,
        },
      }),
    ]);

    const [holidayResponse, inspirationResponse] = await Promise.all([
      convertMediaIdsResponseIntoMediaUrl(holidayTypes),
      convertMediaIdsResponseIntoMediaUrl(inspirations),
    ]);

    return new NextResponse(
      JSON.stringify({
        data: {
          holidayTypes: holidayResponse,
          inspirations: inspirationResponse,
        },
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
