import { PlanServicesResponse } from "../lib/types";
import { handleResponse } from "lib/api-helpers";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetAllPlanServices(): Promise<{
  status: string;
  data: PlanServicesResponse[];
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/destinations/planServices`,
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
    data: PlanServicesResponse[];
  }>(response);
}
export async function apiPostPlanService(
  planService: PlanServicesResponse
): Promise<{ status: string; data: PlanServicesResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/destinations/planServices`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planService),
    }
  );

  return handleResponse<{ status: string; data: PlanServicesResponse }>(
    response
  );
}
export async function apiPutPlanService(
  id: number,
  planService: PlanServicesResponse
): Promise<{ status: string; data: PlanServicesResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/destinations/planServices/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planService),
    }
  );

  return handleResponse<{ status: string; data: PlanServicesResponse }>(
    response
  );
}
export async function apiDeletePlanService(
  id: number
): Promise<{ status: string; data: PlanServicesResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/destinations/planServices/${id}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse<{ status: string; data: PlanServicesResponse }>(
    response
  );
}

export async function apiUpdatePlanServiceStatus(
  id: number,
  status: { status: boolean }
): Promise<{ status: string; data: PlanServicesResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/destinations/planServices/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(status),
    }
  );

  return handleResponse<{ status: string; data: PlanServicesResponse }>(
    response
  );
}
export async function apiChangeSortPlacesService({
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
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/places`, {
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
