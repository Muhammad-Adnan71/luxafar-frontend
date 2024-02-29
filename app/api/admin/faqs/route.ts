import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { FaqSchema } from "lib/validations/faqs.schema";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = FaqSchema.parse(body);
    const faq = await prisma.faqs.create({
      data,
    });

    return new NextResponse(
      JSON.stringify({
        data: faq,
        status: "success",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return getErrorResponse(400, "failed validations", error);
    }

    return getErrorResponse(500, error.message);
  }
}
export async function GET() {
  try {
    const faqs = await prisma.faqs.findMany({
      orderBy: {
        id: "desc",
      },
      where: {
        isDeleted: false,
      },
    });
    return new NextResponse(
      JSON.stringify({
        data: faqs,
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
