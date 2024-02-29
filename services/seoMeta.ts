import { handleResponse } from "lib/api-helpers";
import {
  DestinationsResponse,
  HolidayTypesResponse,
  InspirationResponse,
  PageResponse,
  TourResponse,
} from "lib/types";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;
export async function apiGetPageSeoMeta(pageName: string): Promise<{
  status: string;
  data: {
    page: any;
  };
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/template/seoMeta/page/${pageName}`,
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
    };
  }>(response);
}
export async function apiGetDestinationSeoMeta(name: string): Promise<{
  status: string;
  data: {
    destination: DestinationsResponse;
  };
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/template/seoMeta/destination/${name}`,
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
      destination: DestinationsResponse;
    };
  }>(response);
}
export async function apiGetTourSeoMeta(
  name: string,
  destinationName: string
): Promise<{
  status: string;
  data: {
    tour: TourResponse;
  };
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/template/seoMeta/tour/${destinationName}/${name}`,
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
    };
  }>(response);
}
export async function apiGetSeoMetaHolidayType(name: string): Promise<{
  status: string;
  data: {
    holidayType: HolidayTypesResponse;
  };
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/template/seoMeta/holidayType/${name}`,
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
      holidayType: HolidayTypesResponse;
    };
  }>(response);
}

export async function apiGetInspirationSeoMeta(name: string): Promise<{
  status: string;
  data: { inspiration: InspirationResponse };
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/template/seoMeta/inspiration/${name}`,
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
    data: { inspiration: InspirationResponse };
  }>(response);
}
