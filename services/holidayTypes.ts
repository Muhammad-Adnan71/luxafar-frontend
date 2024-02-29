import {
  HolidayTypesResponse,
  InspirationResponse,
  TourResponse,
} from "../lib/types";
import { handleResponse } from "lib/api-helpers";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetHolidayTypes(params?: {
  active?: "true";
}): Promise<{
  status: string;
  data: HolidayTypesResponse[];
}> {
  var url = new URL(`${SERVER_ENDPOINT}/api/admin/holidayTypes`);
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
    data: HolidayTypesResponse[];
  }>(response);
}
export async function apiGetHolidayTypesById(id: number): Promise<{
  status: string;
  data: HolidayTypesResponse;
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/holidayTypes/${id}`,
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
    data: HolidayTypesResponse;
  }>(response);
}

export async function apiPostHolidayTypes(
  holidayType: HolidayTypesResponse
): Promise<{ status: string; data: HolidayTypesResponse }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/holidayTypes`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(holidayType),
  });

  return handleResponse<{ status: string; data: HolidayTypesResponse }>(
    response
  );
}

export async function apiPutHolidayType(
  id: number,
  holidayTypes: HolidayTypesResponse
): Promise<{ status: string; data: HolidayTypesResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/holidayTypes/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(holidayTypes),
    }
  );

  return handleResponse<{ status: string; data: HolidayTypesResponse }>(
    response
  );
}
export async function apiUpdateHolidayStatus(
  id: number,
  holidayStatus: { isActive: boolean }
): Promise<{ status: string; data: HolidayTypesResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/holidayTypes/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(holidayStatus),
    }
  );

  return handleResponse<{ status: string; data: HolidayTypesResponse }>(
    response
  );
}

export async function apiDeleteHolidayTypes(
  id: number
): Promise<{ status: string; data: HolidayTypesResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/holidayTypes/${id}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse<{ status: string; data: HolidayTypesResponse }>(
    response
  );
}

export async function apiTemplateGetAllHolidayTypes(): Promise<{
  status: string;
  data: {
    holidayTypes: HolidayTypesResponse[];
    inspirations: InspirationResponse[];
  };
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/template/holidayTypes`, {
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
      holidayTypes: HolidayTypesResponse[];
      inspirations: InspirationResponse[];
    };
  }>(response);
}
export async function apiTemplateByNameHolidayType(name: string): Promise<{
  status: string;
  data: {
    holidayType: HolidayTypesResponse;
    inspirations: InspirationResponse[];
    tours: TourResponse[];
  };
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/template/holidayTypes/${name}`,
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
      inspirations: InspirationResponse[];
      tours: TourResponse[];
    };
  }>(response);
}
