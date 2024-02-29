

import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { useSearchParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: any) {
  const url = new URL(req.url);
  const pageSize = url.searchParams.get("pageSize");
  const pageNum = url.searchParams.get("pageNum");
  const searchParams = url.searchParams.get("searchParams");

  try {
    const formCount = await prisma.bespokeForm.count({
      where: {
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
    const forms = await prisma.bespokeForm.findMany({
      orderBy: {
        id: "desc",
      },
      ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
      ...(pageSize && { take: Number(pageSize) }),
      where: {
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
      include: {
        bespokeFormQuestionAndAnswer: {
          include: {
            BespokeQuestion: {
              where: { formType: "bespoke" }
            }
          }
        }
      }
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
    if (error) {
      return getErrorResponse(400, "Error", error.message);
    }

    return getErrorResponse(500, error.message);
  }
}