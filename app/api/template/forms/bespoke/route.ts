import nodemailer from "nodemailer";
import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { verifyCaptchaAction } from "lib/recaptcha";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { contactTemplate } from "template/contact";
import { bespokeTemplate } from "template/bespoke";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);

  try {
    const bespokeQuestions = await prisma.bespokeQuestion.findMany({
      where: { formType: "bespoke" },
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
export async function POST(req: NextRequest) {
  const { gReCaptchaToken, bespokeFormQuestionAndAnswer, ...rest } =
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
    const form = await prisma.bespokeForm.create({
      data: {
        ...rest,
        gReCaptchaToken,
        bespokeFormQuestionAndAnswer: {
          createMany: {
            data: [...bespokeFormQuestionAndAnswer],
          },
        },
      },
      include: {
        bespokeFormQuestionAndAnswer: {
          include: {
            BespokeQuestion: {
              include: {
                bespokeQuestionOptions: true,
              },
            },
          },
        },
      },
    });

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "no-reply@luxafar.com",
        pass: process.env.NEXT_PUBLIC_MAIL_SERVER_PASS,
      },
    });
    const {
      name,
      email,
      countryCode,
      phoneNumber,
      preferredCountry,
      tripDays,
    } = rest;
    let mailOptions = {
      to: "no-reply@luxafar.com",
      from: email,
      cc: "bespoke.holidays@luxafar.com",
      replyTo: email,
      subject: "Client Bespoke Query ",
      html: bespokeTemplate(
        name,
        email,
        countryCode,
        phoneNumber,
        preferredCountry,
        tripDays,
        form
      ),
    };
    let mailOptionsToSender = {
      from: "no-reply@luxafar.com",
      to: email,
      subject: "Thank You for Contacting Luxafar - Where Journeys are Unique!",
      html: contactTemplate(name),
    };
    await transporter.sendMail(mailOptionsToSender);
    await transporter.sendMail(mailOptions);
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
