import { destinations } from "./../../../../prisma/data/index";
import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get("path") || "/";
    revalidatePath(path);

    // const inspiration = await prisma.inspirations.findMany({});
    // inspiration.map(async (ele: any) => {
    //   await prisma.inspirations.update({
    //     where: {
    //       id: ele.id,
    //     },
    //     data: {
    //       inspirationSortId: ele.id,
    //     },
    //   });
    // });
    // const media = await prisma.media.create({
    //   data: {
    //     desktopMediaUrl: "",
    //   },
    // });
    // const firstUser = await prisma.users.findFirst();
    // await prisma.users.update({
    //   where: {
    //     id: firstUser?.id,
    //   },
    //   data: {
    //     imageId: media.id,
    //   },
    // });

    // const content = [
    //   {
    //     name: "banner Section",
    //     title: "title",
    //     description: "description",
    //     buttonText: "get bespoke",
    //     buttonUrl: "/",
    //     sortId: 1,
    //   },
    //   {
    //     name: "banner Video",
    //     sortId: 2,
    //     media: {
    //       desktopMediaUrl: "",
    //       type: "video",
    //     },
    //   },
    //   {
    //     name: "banner Video",
    //     sortId: 3,
    //     media: {
    //       desktopMediaUrl: "",
    //       type: "video",
    //     },
    //   },
    //   {
    //     name: "upcoming tours",
    //     title: "upcoming tours",
    //     description: "description",
    //     sortId: 4,
    //   },
    //   {
    //     name: "bespoke plan ",
    //     sortId: 5,
    //     description: "description",
    //   },
    // ];
    // const page = await prisma.pages.create({
    //   data: {
    //     name: "tours",
    //     sortId: 10,
    //     content: {
    //       create: content.map((item: any) => ({
    //         ...item,
    //         media: { create: item.media },
    //       })),
    //     },
    //   },
    // });

    const [pages, forms, becomePartner, bespokeCount] =
      await prisma.$transaction([
        prisma.pages.findMany({
          where: {
            showInPages: true,
          },
          orderBy: {
            sortId: "asc",
          },
          include: {
            content: true,
          },
        }),
        prisma.forms.findMany(),
        prisma.becomePartner.count({
          where: {
            status: "unread",
          },
        }),
        prisma.bespokeForm.count({
          where: {
            status: "unread",
          },
        }),
      ]);

    return new NextResponse(
      JSON.stringify({
        data: { pages, forms, becomePartner, bespokeCount },
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
