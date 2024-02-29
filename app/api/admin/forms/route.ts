import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const form = await prisma.forms.create({
      data: body,
    });

    return new NextResponse(
      JSON.stringify({
        data: form,
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

export async function GET(req: any) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const pageSize = url.searchParams.get("pageSize");
  const pageNum = url.searchParams.get("pageNum");
  const searchParams = url.searchParams.get("searchParams");

  try {
    const formCount = await prisma.forms.count({
      where: {
        ...(type && { type: type }),
        ...(searchParams && {
          OR: [
            {
              name: {
                contains: searchParams,
              },
            },
            {
              email: {
                contains: searchParams,
              },
            },
          ],
        }),
      },
    });
    const forms = await prisma.forms.findMany({
      orderBy: {
        id: "desc",
      },
      ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
      ...(pageSize && { take: Number(pageSize) }),
      where: {
        ...(type && { type: type }),
        ...(searchParams && {
          OR: [
            {
              name: {
                contains: searchParams,
              },
            },
            {
              email: {
                contains: searchParams,
              },
            },
          ],
        }),
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: forms,
        count: formCount,
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
