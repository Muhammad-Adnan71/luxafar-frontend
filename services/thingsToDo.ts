import { HolidayTypesResponse } from "../lib/types";
import { handleResponse } from "lib/api-helpers";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetThingsToDo(params?: {
  active?: "true";
  pageNum?: string;
  pageSize?: string;
  searchParams?: string;
}): Promise<{
  status: string;
  data: any[];
  count: number;
}> {
  var url = new URL(`${SERVER_ENDPOINT}/api/admin/thingsToDo`);
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
export async function apiGetThingsToDoById(id: number): Promise<{
  status: string;
  data: any;
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/thingsToDo/${id}`,
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
    data: any;
  }>(response);
}

export async function apiPostThingsToDo(
  thingsToDo: any
): Promise<{ status: string; data: any }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/thingsToDo`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(thingsToDo),
  });

  return handleResponse<{ status: string; data: any }>(response);
}

export async function apiPutThingsToDo(
  id: number,
  thingsToDo: any
): Promise<{ status: string; data: any }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/thingsToDo/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(thingsToDo),
    }
  );

  return handleResponse<{ status: string; data: any }>(response);
}
export async function apiUpdateThingsToDoStatus(
  id: number,
  thingsToDoStatus: { isActive: boolean }
): Promise<{ status: string; data: any }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/thingsToDo/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(thingsToDoStatus),
    }
  );

  return handleResponse<{ status: string; data: any }>(response);
}

export async function apiDeleteThingsToDo(
  id: number
): Promise<{ status: string; data: any }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/thingsToDo/${id}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse<{ status: string; data: any }>(response);
}
export async function apiChangeSortThingsService({
  sourceId,
  sortPosition,
  destinationIdSortId,
  destinationId,
}: {
  sourceId: number;
  sortPosition: number;
  destinationIdSortId: number;
  destinationId: number;
}): Promise<{ status: string; data: any[] }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/thingsToDo`, {
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

  return handleResponse<{ status: string; data: any[] }>(response);
}
