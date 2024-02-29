import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { convertMediaIdsResponseIntoMediaUrl, isNumeric } from "lib/utils";
import { PartnersInput, PartnersSchema } from "lib/validations/partners.schema";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id))
      return getErrorResponse(400, "Id is not required");

    const id = Number(params.id);
    const body = (await req.json()) as PartnersInput;
    const { media, ...rest } = PartnersSchema.parse(body);

    const partner = await prisma.partners.update({
      where: { id },
      data: {
        ...rest,
        ...(media && {
          media: {
            update: media,
          },
        }),
      },
      include: {
        media: true,
      },
    });

    const responseMediaPartner = await convertMediaIdsResponseIntoMediaUrl(
      partner
    );

    return new NextResponse(
      JSON.stringify({
        data: responseMediaPartner,
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
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id))
      return getErrorResponse(400, "Id is not required");

    const id = Number(params.id);
    const partner = await prisma.partners.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: partner,
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
