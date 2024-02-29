import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { verifyCaptchaAction } from "lib/recaptcha";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const { gReCaptchaToken, becomePartnerFormQuestionAndAnswer, ...rest } =
    await req.json();
  const verify = await verifyCaptchaAction(gReCaptchaToken);

  if (!verify) {
    return new NextResponse(
      JSON.stringify({
        message: "recaptcha token is not verify",
        status: "error",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const form = await prisma.becomePartner.create({
      data: {
        ...rest,
        gReCaptchaToken,
        becomePartnerFormQuestionAndAnswer: {
          createMany: {
            data: [...becomePartnerFormQuestionAndAnswer],
          },
        },
      },
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

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);

  try {
    const bespokeQuestions = await prisma.bespokeQuestion.findMany({
      where: { formType: "becomePartner" },
      include: {
        bespokeQuestionOptions: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: bespokeQuestions,
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
