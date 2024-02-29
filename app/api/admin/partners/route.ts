import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "lib/utils";
import { PartnersInput, PartnersSchema } from "lib/validations/partners.schema";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PartnersInput;
    const { media, ...rest } = PartnersSchema.parse(body);
    const partner = await prisma.partners.create({
      data: {
        ...rest,
        media: {
          create: media,
        },
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

export async function GET() {
  try {
    const partners = await prisma.partners.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        sortId: "desc",
      },
      include: { media: true },
    });

    const responseMediaPartners = await convertMediaIdsResponseIntoMediaUrl(
      partners
    );
    return new NextResponse(
      JSON.stringify({
        data: responseMediaPartners,
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

export async function PUT(req: NextRequest) {
  try {
    const { sourceId, sortPosition, destinationIdSortId } = await req.json();

    if (!sourceId || !sortPosition || destinationIdSortId === undefined) {
      return getErrorResponse(400, "failed validations");
    }

    await prisma.$transaction(async (tx) => {
      const draggedPartner = await prisma.partners.findUnique({
        where: {
          id: sourceId,
        },
      });
      await tx.partners.update({
        where: {
          id: sourceId,
        },
        data: {
          sortId: destinationIdSortId,
        },
      });

      await tx.partners.updateMany({
        where: {
          AND: {
            NOT: {
              id: sourceId,
            },
            sortId: {
              gte: Math.min(
                draggedPartner?.sortId as number,
                destinationIdSortId
              ),
              lte: Math.max(
                draggedPartner?.sortId as number,
                destinationIdSortId
              ),
            },
          },
        },
        data: {
          ...(sortPosition > 0
            ? { sortId: { decrement: 1 } }
            : { sortId: { increment: 1 } }),
        },
      });
    });

    return new NextResponse(
      JSON.stringify({
        status: "success",
        message: "Successfully updated",
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
