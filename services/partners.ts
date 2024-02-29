import { PartnersResponse } from "../lib/types";
import { handleResponse } from "lib/api-helpers";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetAllPartners(): Promise<{
  status: string;
  data: PartnersResponse[];
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/partners`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{
    status: string;
    data: PartnersResponse[];
  }>(response);
}
export async function apiPostPartnersService(
  partner: PartnersResponse
): Promise<{ status: string; data: PartnersResponse }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/partners`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(partner),
  });

  return handleResponse<{ status: string; data: PartnersResponse }>(response);
}
export async function apiChangeSortPartnersService({
  sourceId,
  sortPosition,
  destinationIdSortId,
}: {
  sourceId: number;
  sortPosition: number;
  destinationIdSortId: number;
}): Promise<{ status: string; data: PartnersResponse[] }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/partners`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sourceId, sortPosition, destinationIdSortId }),
  });

  return handleResponse<{ status: string; data: PartnersResponse[] }>(response);
}

export async function apiPutPartners(
  id: number,
  partner: PartnersResponse
): Promise<{ status: string; data: PartnersResponse }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/partners/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(partner),
  });

  return handleResponse<{ status: string; data: PartnersResponse }>(response);
}

export async function apiDeletePartners(
  id: number
): Promise<{ status: string; data: PartnersResponse }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/partners/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{ status: string; data: PartnersResponse }>(response);
}
