import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { destinationName: string; inspirationName: string } }
) {
  try {
    if (!params?.destinationName && !params?.inspirationName) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Destination Name and Inspiration Name is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const path = request.nextUrl.searchParams.get("path") || "/";
    revalidatePath(path);
    const destinationName = params?.destinationName?.replaceAll("-", " ");
    const inspirationTitle = params?.inspirationName;
    const inspiration = await prisma.inspirations.findFirstOrThrow({
      where: {
        isActive: true,
        isDeleted: false,
        AND: [
          {
            seoMeta: {
              slug: {
                contains: inspirationTitle,
              },
            },
          },
          {
            destination: { some: { name: destinationName } },
          },
        ],
      },
      include: {
        seoMeta: true,
        media: true,
        destination: true,
        inspirationDetail: {
          orderBy: [
            {
              sortId: "asc",
            },
            { id: "desc" },
          ],
          include: {
            media: true,
          },
        },
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: {
          inspiration,
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
