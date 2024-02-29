import { compare, hash } from "bcryptjs";
import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "lib/utils";
import { UpdateUserSchema } from "lib/validations/user.schema";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-USER-ID");

  if (!userId) {
    return getErrorResponse(
      401,
      "You are not logged in, please provide token to gain access"
    );
  }

  const user = await prisma.users.findUnique({
    where: { id: Number(userId) },
    include: {
      media: true,
    },
  });
  const userResponse = await convertMediaIdsResponseIntoMediaUrl(user);
  return NextResponse.json({
    status: "success",
    data: {
      user: {
        ...userResponse,
        password: undefined,
      },
    },
  });
}

export async function PUT(req: NextRequest) {
  try {
    const userId = req.headers.get("X-USER-ID");
    const body = await req.json();

    const { email, oldPassword, newPassword, name, media, imageId } =
      UpdateUserSchema.parse(body);
    const user: any = await prisma.users.findUnique({
      where: { email },
    });

    let hashedPassword;
    if (oldPassword && newPassword) {
      if (!user || !(await compare(oldPassword, user?.password))) {
        return getErrorResponse(401, "Invalid email or password");
      }
      hashedPassword = await hash(newPassword, 12);
    }
    let newMedia;
    if (!imageId) {
      newMedia = await prisma.media.create({
        data: { desktopMediaUrl: media?.desktopMediaUrl },
      });
    }

    const newUser = await prisma.users.update({
      where: {
        id: Number(userId),
      },
      include: {
        media: true,
      },
      data: {
        name,
        email,
        media: {
          update: {
            data: media,
          },
        },
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    const newUserResponse = await convertMediaIdsResponseIntoMediaUrl(newUser);
    return NextResponse.json({
      status: "success",
      data: {
        user: {
          ...newUserResponse,
          password: undefined,
        },
      },
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return getErrorResponse(400, "failed validations", error);
    }

    return getErrorResponse(500, error.message);
  }
}
