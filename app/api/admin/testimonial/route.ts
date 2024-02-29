import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "lib/utils";
import {
  TestimonialInput,
  TestimonialSchema,
} from "lib/validations/testimonial.schema";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TestimonialInput;
    const {
      clientImageMedia,
      destinationImageMedia,
      clientImageId,
      destinationImageId,
      ...rest
    } = TestimonialSchema.parse(body);

    const testimonial = await prisma.testimonial.create({
      data: {
        ...rest,
        clientImageMedia: {
          create: { desktopMediaUrl: clientImageMedia?.desktopMediaUrl },
        },
        destinationImageMedia: {
          create: destinationImageMedia,
        },
      },
      include: {
        clientImageMedia: true,
        destinationImageMedia: true,
      },
    });
    const testimonialMediaResponse = await convertMediaIdsResponseIntoMediaUrl(
      testimonial,
      ["clientImageMedia", "destinationImageMedia"]
    );

    return new NextResponse(
      JSON.stringify({
        data: testimonialMediaResponse,
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
    const testimonials = await prisma.testimonial.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        sortId: "desc",
      },
      include: {
        clientImageMedia: true,
        destinationImageMedia: true,
      },
    });

    const testimonialMediaResponse = await convertMediaIdsResponseIntoMediaUrl(
      testimonials,
      ["clientImageMedia", "destinationImageMedia"]
    );
    return new NextResponse(
      JSON.stringify({
        data: testimonialMediaResponse,
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

    const testimonials = await prisma.$transaction(async (tx) => {
      const draggedPartner = await prisma.testimonial.findUnique({
        where: {
          id: sourceId,
        },
      });
      await tx.testimonial.update({
        where: {
          id: sourceId,
        },
        data: {
          sortId: destinationIdSortId,
        },
      });

      await tx.testimonial.updateMany({
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

      return await tx.testimonial.findMany({
        where: {
          isDeleted: false,
        },
        include: {
          clientImageMedia: true,
          destinationImageMedia: true,
        },
        orderBy: {
          sortId: "desc",
        },
      });
    });
    const testimonialMediaResponse = await convertMediaIdsResponseIntoMediaUrl(
      testimonials,
      ["clientImageMedia", "destinationImageMedia"]
    );

    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: testimonialMediaResponse,
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
