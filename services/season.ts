import { HolidayTypesResponse } from "../lib/types";
import { handleResponse } from "lib/api-helpers";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetSeasons(params?: {
  active?: "true";
  pageNum?: string;
  pageSize?: string;
  searchParams?: string;
}): Promise<{
  status: string;
  data: any[];
  count: number;
}> {
  var url = new URL(`${SERVER_ENDPOINT}/api/admin/seasons`);
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
export async function apiGetSeasonsByDestinationId(id: number): Promise<{
  status: string;
  data: any;
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/seasons/${id}`, {
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

export async function apiPostSeasons(
  data: any
): Promise<{ status: string; data: any }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/seasons`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<{ status: string; data: any }>(response);
}

export async function apiPutSeasons(
  id: number,
  data: any
): Promise<{ status: string; data: any }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/seasons/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<{ status: string; data: any }>(response);
}
export async function apiUpdateSeasonsStatus(
  id: number,
  seasonStatus: { isActive: boolean }
): Promise<{ status: string; data: any }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/seasons/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(seasonStatus),
  });

  return handleResponse<{ status: string; data: any }>(response);
}

export async function apiDeleteSeasons(
  id: number
): Promise<{ status: string; data: any }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/seasons/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{ status: string; data: any }>(response);
}
