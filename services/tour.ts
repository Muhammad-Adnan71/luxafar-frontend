import {
  HolidayTypesResponse,
  InspirationResponse,
  TestimonialResponse,
  TourResponse,
} from "../lib/types";
import { handleResponse } from "lib/api-helpers";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetAllTour(params?: {
  destinationId?: string;
  active?: "true";
  pageNum?: string;
  pageSize?: string;
  orderBy?: "asc" | "desc";
  searchParams?: string;
}): Promise<{
  status: string;
  data: any[];
  count: number;
}> {
  var url = new URL(`${SERVER_ENDPOINT}/api/admin/tour`);
  url.search = new URLSearchParams(params).toString();
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{
    status: string;
    data: any[];
    count: number;
  }>(response);
}

export async function apiGetTourById(id: number): Promise<{
  status: string;
  data: any;
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/tour/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{
    status: string;
    data: any;
  }>(response);
}

export async function apiPostTour(
  tourDetail: any
): Promise<{ status: string; data: any }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/tour`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tourDetail),
  });

  return handleResponse<{ status: string; data: any }>(response);
}

export async function apiPutTour(
  id: number,
  tourData: any
): Promise<{ status: string; data: any }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/tour/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tourData),
  });

  return handleResponse<{ status: string; data: any }>(response);
}

export async function apiUpdateTourStatus(
  id: number,
  tourStatus: {
    isActive?: boolean;
    isFeatured?: boolean;
    destinationId?: number | any;
  }
): Promise<{ status: string; data: any }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/tour/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tourStatus),
  });

  return handleResponse<{ status: string; data: any }>(response);
}

export async function apiChangeSortToursService({
  sourceId,
  sortPosition,
  destinationIdSortId,
  destinationId,
}: {
  sourceId: number;
  sortPosition: number;
  destinationIdSortId: number;
  destinationId: number;
}): Promise<{ status: string; data: TourResponse[] }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/tour`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sourceId,
      sortPosition,
      destinationIdSortId,
      destinationId,
    }),
  });

  return handleResponse<{ status: string; data: TourResponse[] }>(response);
}

export async function apiDeleteTour(
  id: number
): Promise<{ status: string; data: any }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/tour/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{ status: string; data: any }>(response);
}

export async function apiGetTourByNameTemplate(
  name: string,
  destinationName: string
): Promise<{
  status: string;
  data: {
    tour: TourResponse;
    inspirations: InspirationResponse[];
    relatedTours: TourResponse[];
    testimonials: TestimonialResponse[];
    inspirationCount: number;
  };
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/template/tour/${destinationName}/${name}`,
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
      tour: TourResponse;
      inspirations: InspirationResponse[];
      relatedTours: TourResponse[];
      testimonials: TestimonialResponse[];
      inspirationCount: number;
    };
  }>(response);
}

export async function apiGetTemplateTours(params?: {
  destinationId?: string;
  holidayTypeId?: string;
  pageNum?: string;
  pageSize?: string;
}): Promise<{
  status: string;
  data: {
    tours: TourResponse[];
    count: number;
  };
}> {
  let url = new URL(`${SERVER_ENDPOINT}/api/template/tour`);
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-cache",

    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
    },
  });

  return handleResponse<{
    status: string;
    data: {
      tours: TourResponse[];
      count: number;
    };
  }>(response);
}
