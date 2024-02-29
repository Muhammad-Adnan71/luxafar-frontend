import { HolidayTypesResponse } from "../lib/types";
import { handleResponse } from "lib/api-helpers";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetGallery(params?: {
  active?: "true";
  pageNum?: string;
  pageSize?: string;
  searchParams?: string;
}): Promise<{
  status: string;
  data: any[];
  count: number;
}> {
  var url = new URL(`${SERVER_ENDPOINT}/api/admin/gallery`);
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
    data: any[];
  }>(response);
}
export async function apiGetGalleryByDestinationId(id: number): Promise<{
  status: string;
  data: any;
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/gallery/${id}`, {
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

export async function apiPostGallery(
  data: any
): Promise<{ status: string; data: any }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/gallery`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<{ status: string; data: any }>(response);
}

export async function apiPutGallery(
  id: number,
  data: any
): Promise<{ status: string; data: any }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/gallery/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<{ status: string; data: any }>(response);
}
export async function apiUpdateGalleryStatus(
  id: number,
  seasonStatus: { isActive: boolean }
): Promise<{ status: string; data: any }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/gallery/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(seasonStatus),
  });

  return handleResponse<{ status: string; data: any }>(response);
}

export async function apiDeleteGallery(
  id: number
): Promise<{ status: string; data: any }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/gallery/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{ status: string; data: any }>(response);
}
