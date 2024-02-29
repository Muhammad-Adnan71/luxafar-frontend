import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { isNumeric } from "lib/utils";
import { FaqSchema } from "lib/validations/faqs.schema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id))
      return getErrorResponse(400, "Id is not required");

    const id = Number(params.id);
    const faqs = await prisma.faqs.findFirst({
      where: {
        id: id,
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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id))
      return getErrorResponse(400, "Id is not required");

    const id = Number(params.id);

    const body = await req.json();
    const data = FaqSchema.parse(body);

    const faqs = await prisma.faqs.update({
      where: {
        id: id,
      },
      data,
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
    if (error instanceof ZodError) {
      return getErrorResponse(400, "failed validations", error);
    }
    return getErrorResponse(500, error.message);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id))
      return getErrorResponse(400, "Id is not required");

    const id = Number(params.id);

    const faqs = await prisma.faqs.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
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
