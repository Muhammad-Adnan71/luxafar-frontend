import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { media, pageId, ...rest } = body;

    const content = await prisma.content.create({
      data: {
        ...rest,
        pages: {
          connect: {
            id: pageId,
          },
        },
        media: {
          create: {
            ...media,
          },
        },
      },
      include: {
        media: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: content,
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
