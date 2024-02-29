import {
  BannerResponse,
  PageResponse,
  PartnersResponse,
  FaqResponse,
  TestimonialResponse,
  InspirationResponse,
  HolidayTypesResponse,
  TourResponse,
  bespokeQuestionOptionsResponse,
  BespokeQuestionResponse,
} from "./../lib/types";
import { handleResponse } from "lib/api-helpers";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetAllPagesService(): Promise<{
  status: string;
  data: [];
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/pages`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{
    status: string;
    data: [];
  }>(response);
}

export async function apiGetPageByIdService(pageId: number): Promise<{
  status: string;
  data: PageResponse;
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/pages/${pageId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{
    status: string;
    data: PageResponse;
  }>(response);
}

export async function apiGetPageByIdTemplateService(pageName: string): Promise<{
  status: string;
  data: {
    page: any;
    banners: BannerResponse[];
    partners: PartnersResponse[];
    faqs: FaqResponse[];
    testimonials: TestimonialResponse[];
    inspirations: InspirationResponse[];
  };
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/template/pages/${pageName}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-cache",

      headers: {
        Authorization: process.env.NEXT_PUBLIC_BEARER as string,
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse<{
    status: string;
    data: {
      page: PageResponse;
      banners: BannerResponse[];
      partners: PartnersResponse[];
      faqs: FaqResponse[];
      testimonials: TestimonialResponse[];
      inspirations: InspirationResponse[];
    };
  }>(response);
}
export async function apiUpdatePagesService(
  pageId: number,
  data: any
): Promise<{
  status: string;
  data: [];
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/pages/${pageId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<{
    status: string;
    data: [];
  }>(response);
}
export async function apiGetToursPageService(params?: {
  destinationId?: string;
  holidayTypeId?: string;
  pageNum?: string;
  pageSize?: string;
}): Promise<{
  status: string;
  data: {
    count: number;
    page: PageResponse;
    tours: TourResponse[];
    featuredTours: TourResponse[];
    upcomingTours: TourResponse[];
    inspirations: InspirationResponse[];
    bespokeQuestion: BespokeQuestionResponse[];
  };
}> {
  let url = new URL(`${SERVER_ENDPOINT}/api/template/pages/tours`);
  url.search = new URLSearchParams(params).toString();
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-cache",

    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{
    status: string;
    data: {
      count: number;
      page: PageResponse;
      tours: TourResponse[];
      featuredTours: TourResponse[];
      upcomingTours: TourResponse[];
      inspirations: InspirationResponse[];
      bespokeQuestion: BespokeQuestionResponse[];
    };
  }>(response);
}
