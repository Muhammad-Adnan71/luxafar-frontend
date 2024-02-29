import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { verifyCaptchaAction } from "lib/recaptcha";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { contactTemplate } from "template/contact";

export async function POST(request: NextRequest) {
  const { gReCaptchaToken, email, name, ...rest } = await request.json();
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
    const form = await prisma.forms.create({
      data: {
        ...rest,
        email,
        name,
        gReCaptchaToken,
      },
    });
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "no-reply@luxafar.com",
        pass: process.env.NEXT_PUBLIC_MAIL_SERVER_PASS,
      },
    });

    let mailOptionsToSender = {
      from: "no-reply@luxafar.com",
      to: email,
      subject: "Thank You for Contacting Luxafar - Where Journeys are Unique!",
      html: contactTemplate(name),
    };
    await transporter.sendMail(mailOptionsToSender);

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
