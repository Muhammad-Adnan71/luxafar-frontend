import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pages = await prisma.pages.create({
      data: {
        ...body,
        content: {
          create: [...body.content],
        },
      },
      include: {
        content: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: pages,
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

export async function GET() {
  try {
    const pages = await prisma.pages.findMany({
      where: {
        showInPages: true,
      },
      orderBy: {
        sortId: "asc",
      },
      include: {
        content: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: pages,
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
