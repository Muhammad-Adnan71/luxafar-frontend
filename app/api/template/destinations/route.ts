import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);

  try {
    const destinations = await prisma.destinations.findMany({
      where: { isActive: true },
      orderBy: {
        name: "asc",
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: destinations,
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
