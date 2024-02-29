import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "lib/utils";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { name } }: { params: { name: string } }
) {
  try {
    if (!name) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Page Name is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const path = request.nextUrl.searchParams.get("path") || "/";
    revalidatePath(path);

    if (name.toLowerCase() === "home") {
      const [partners, banners, faqs, testimonials, inspirations, pages] =
        await prisma.$transaction([
          prisma.partners.findMany({
            where: {
              isDeleted: false,
              isActive: true,
            },
            orderBy: {
              sortId: "asc",
            },
            include: {
              media: true,
            },
          }),
          prisma.banner.findMany({
            where: { isActive: true, isDeleted: false },
            include: {
              media: true,
            },
          }),
          prisma.faqs.findMany({
            where: { isActive: true, isDeleted: false },
          }),
          prisma.testimonial.findMany({
            where: { isActive: true, isDeleted: false },
            orderBy: { sortId: "asc" },
            include: {
              clientImageMedia: true,
              destinationImageMedia: true,
            },
          }),
          prisma.inspirations.findMany({
            where: {
              isActive: true,
              isDeleted: false,
              isHomePageSort: true,
            },
            orderBy: {
              homePageSortId: "asc",
            },

            select: {
              id: true,
              title: true,
              description: true,
              media: {
                select: {
                  desktopMediaUrl: true,
                  mobileMediaUrl: true,
                },
              },
              seoMeta: {
                select: {
                  slug: true,
                  title: true,
                  description: true,
                  keywords: true,
                },
              },
              destination: {
                select: {
                  name: true,
                },
              },
            },
          }),
          prisma.pages.findFirst({
            where: {
              name,
            },
            select: {
              description: true,
              title: true,
              seoMeta: {
                select: {
                  slug: true,
                  title: true,
                  description: true,
                  keywords: true,
                },
              },
              content: {
                select: {
                  id: true,
                  name: true,
                  title: true,
                  description: true,
                  subTitle: true,
                  buttonText: true,
                  buttonUrl: true,

                  media: {
                    select: {
                      desktopMediaUrl: true,
                      mobileMediaUrl: true,
                    },
                  },
                },
              },
            },
          }),
        ]);

      const [
        partnerResponse,
        bannerResponse,
        inspirationsResponse,
        contentResponse,
        testimonialsResponse,
      ] = await Promise.all([
        convertMediaIdsResponseIntoMediaUrl(partners),
        convertMediaIdsResponseIntoMediaUrl(banners),
        convertMediaIdsResponseIntoMediaUrl(inspirations),
        convertMediaIdsResponseIntoMediaUrl(pages?.content),
        convertMediaIdsResponseIntoMediaUrl(testimonials, [
          "clientImageMedia",
          "destinationImageMedia",
        ]),
      ]);

      return new NextResponse(
        JSON.stringify({
          data: {
            page: { ...pages, content: contentResponse },
            banners: bannerResponse,
            partners: partnerResponse,
            testimonials: testimonialsResponse,
            faqs: faqs,
            inspirations: inspirationsResponse,
          },
          status: "success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      const page = await prisma.pages.findFirst({
        where: {
          name,
        },
        select: {
          description: true,
          title: true,
          seoMeta: {
            select: {
              slug: true,
              title: true,
              description: true,
              keywords: true,
            },
          },
          content: {
            orderBy:{
              sortId:"asc"
            },
            select: {
              id: true,
              name: true,
              title: true,
              description: true,
              subTitle: true,
              buttonText: true,
              buttonUrl: true,
              sortId:true,
              media: {
                select: {
                  desktopMediaUrl: true,
                  mobileMediaUrl: true,
                },
              },
            },
          },
        },
      });
      const contentResponse = await convertMediaIdsResponseIntoMediaUrl(
        page?.content
      );
      return new NextResponse(
        JSON.stringify({
          data: {
            page: { ...page, content: contentResponse },
          },
          status: "success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}
