import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { name } }: { params: { name: string } }
) {
  try {
    if (!name) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Page Name is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const path = request.nextUrl.searchParams.get("path") || "/";
    revalidatePath(path);
    const page = await prisma.pages.findFirst({
      where: {
        name,
      },
      include: {
        seoMeta: true,
      },
    });
    return new NextResponse(
      JSON.stringify({
        data: {
          page,
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
