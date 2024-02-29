import {
  BannerResponse,
  DestinationsResponse,
  HolidayTypesResponse,
  PageResponse,
  PartnersResponse,
} from "./../lib/types";
import { handleResponse } from "lib/api-helpers";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetAllDestinationService(params?: {
  active?: "true";
  pageNum?: string;
  pageSize?: string;
  searchParams?: string;
  sortBy?: string;
}): Promise<{
  status: string;
  data: [];
  count: number;
}> {
  var url = new URL(`${SERVER_ENDPOINT}/api/admin/destinations`);
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
    count: number;
    data: [];
  }>(response);
}

export async function apiCreateDestinationService(
  data: DestinationsResponse
): Promise<{
  status: string;
  data: DestinationsResponse;
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/destinations`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<{
    status: string;
    data: DestinationsResponse;
  }>(response);
}
export async function apiGetDestinationByIdService(id: number): Promise<{
  status: string;
  data: DestinationsResponse;
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/destinations/${id}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse<{
    status: string;
    data: DestinationsResponse;
  }>(response);
}
export async function apiTemplateDestinations(): Promise<{
  status: string;
  data: DestinationsResponse[];
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/template/destinations`, {
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
    data: DestinationsResponse[];
  }>(response);
}

export async function apiTemplateDestinationByName(name: string): Promise<{
  status: string;
  data: {
    destination: DestinationsResponse;
    holidayTypes: HolidayTypesResponse[];
  };
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/template/destinations/${name}`,
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
      holidayTypes: HolidayTypesResponse[];
    };
  }>(response);
}
export async function apiDestinationsDelete(id: number): Promise<{
  status: string;
  data: DestinationsResponse;
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/destinations/${id}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse<{
    status: string;
    data: DestinationsResponse;
  }>(response);
}

export async function apiUpdateDestinationStatus(
  id: number,
  holidayStatus: { isActive: boolean }
): Promise<{ status: string; data: DestinationsResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/destinations/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(holidayStatus),
    }
  );

  return handleResponse<{ status: string; data: DestinationsResponse }>(
    response
  );
}

export async function apiUpdateDestinationService(
  id: number,
  data: DestinationsResponse
): Promise<{ status: string; data: DestinationsResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/destinations/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return handleResponse<{ status: string; data: DestinationsResponse }>(
    response
  );
}
