import { getErrorResponse } from "lib/api-helpers";
import { prisma } from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const allActiveInspirationWithTitle = await prisma.inspirations.findMany({
      select: {
        title: true,
        updatedAt: true,
        seoMeta: true,
        destination: true,
      },
      where: {
        isDeleted: false,
        isActive: true,
      },
    });

    const allActiveHolidayTypeWithTitle = await prisma.holidayType.findMany({
      select: { name: true, updatedAt: true, seoMeta: true },
      where: {
        isActive: true,
      },
    });

    const allActivePlacesWithTitle = await prisma.placeToVisit.findMany({
      select: {
        destination: true,
        title: true,
        updatedAt: true,
        seoMeta: true,
      },
      where: {
        isDeleted: false,
        isActive: true,
      },
    });

    const allActiveToursWithTitle = await prisma.tours.findMany({
      select: {
        title: true,
        updatedAt: true,
        seoMeta: true,
        tourDestinations: {
          select: {
            tour: true,
            destination: true,
          },
        },
      },
      where: {
        isDeleted: false,
        isActive: true,
      },
    });

    const allActiveDestinationWithTitle = await prisma.destinations.findMany({
      select: {
        name: true,
        updatedAt: true,
        tourDestinations: {
          where: {
            tour: {
              isDeleted: false,
              isActive: true,
            },
          },
          include: {
            tour: true,
          },
        },
      },
      where: {
        isActive: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: {
          allActiveInspirationWithTitle,
          allActiveHolidayTypeWithTitle,
          allActivePlacesWithTitle,
          allActiveToursWithTitle,
          allActiveDestinationWithTitle,
        },
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
