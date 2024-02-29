import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { convertMediaIdsResponseIntoMediaUrl, isNumeric } from "lib/utils";
import { TestimonialSchema } from "lib/validations/testimonial.schema";
import { NextResponse } from "next/server";
import { getUploadsUrl } from "services/uploads";
import { ZodError } from "zod";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id))
      return getErrorResponse(400, "Id is not required");

    const id = Number(params.id);
    const body = await req.json();

    const {
      clientImageMedia,
      clientImageId,
      destinationImageId,
      destinationImageMedia,
      ...rest
    } = TestimonialSchema.parse(body);

    const testimonial = await prisma.testimonial.update({
      where: {
        id,
      },
      data: {
        ...rest,
        clientImageMedia: {
          update: {
            where: {
              id: clientImageId,
            },
            data: { desktopMediaUrl: clientImageMedia?.desktopMediaUrl },
          },
        },
        destinationImageMedia: {
          update: {
            where: {
              id: destinationImageId,
            },
            data: {
              desktopMediaUrl: destinationImageMedia?.desktopMediaUrl,
            },
          },
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id))
      return getErrorResponse(400, "Id is not required");
    const id = Number(params.id);

    const testimonial = await prisma.testimonial.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: testimonial,
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
