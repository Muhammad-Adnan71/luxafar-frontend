import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { useSearchParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const bespokeQuestions = await prisma.bespokeQuestion.findMany({
      where: { formType: "becomePartner" },
      select: {
        id: true,
      },
    });
    const bespokeQuestionIds = body.question.map((item: any) => item?.id);
    const deleteBespokeQuestionIds = bespokeQuestions
      .filter((item: any) => !bespokeQuestionIds.includes(item.id))
      .map((item) => item.id);
    await prisma.bespokeQuestion.deleteMany({
      where: {
        id: {
          in: deleteBespokeQuestionIds,
        },
      },
    });
    for (const item of body.question) {
      const { bespokeQuestionOptions, ...rest } = item;
      if (item.id) {
        const updatedBespokeQuestion = await prisma.bespokeQuestion.update({
          where: { id: item.id },
          data: rest,
          include: {
            bespokeQuestionOptions: true,
          },
        });
        const bespokeQuestionOptionsIds = bespokeQuestionOptions.map(
          (item: any) => item.id
        );

        const deleteBespokeQuestionOptionsIds =
          updatedBespokeQuestion.bespokeQuestionOptions
            .filter((item: any) => !bespokeQuestionOptionsIds.includes(item.id))
            .map((item) => item.id);

        await prisma.bespokeQuestionOptions.deleteMany({
          where: {
            id: {
              in: deleteBespokeQuestionOptionsIds,
            },
          },
        });

        for (const option of bespokeQuestionOptions) {
          if (!option.id) {
            await prisma.bespokeQuestionOptions.create({
              data: {
                bespokeQuestionId: item.id,
                label: option.label,
              },
            });
          } else {
            await prisma.bespokeQuestionOptions.update({
              where: { id: option.id },
              data: {
                label: option.label,
              },
            });
          }
        }
      } else {
        await prisma.bespokeQuestion.create({
          data: {
            ...item,
            bespokeQuestionOptions: {
              create: item.bespokeQuestionOptions,
            },
          },
          include: {
            bespokeQuestionOptions: true,
          },
        });
      }
    }

    return new NextResponse(
      JSON.stringify({
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

export async function GET() {
  try {
    const response = await prisma.bespokeQuestion.findMany({
      where: { formType: "becomePartner" },
      include: {
        bespokeQuestionOptions: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: response,
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


