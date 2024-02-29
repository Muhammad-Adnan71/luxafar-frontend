import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const path = request.nextUrl.searchParams.get("path") || "/";
    revalidatePath(path);

    const nameForSearch = params?.params?.[1];

    const tourById = await prisma.tours.findFirstOrThrow({
      where: {
        isDeleted: false,
        seoMeta: {
          slug: nameForSearch,
        },
      },
      include: {
        seoMeta: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: {
          tour: tourById,
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
