import { DestinationFeaturesResponse } from "../lib/types";
import { handleResponse } from "lib/api-helpers";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetAllDestinationFeatures(params?: {
  isActive?: true;
}): Promise<{
  status: string;
  data: DestinationFeaturesResponse[];
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/destinations/features${params?.isActive ? "/?active=true" : ""
    }`,
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
    data: DestinationFeaturesResponse[];
  }>(response);
}
export async function apiPosDestinationFeature(feature: DestinationFeaturesResponse): Promise<{ status: string; data: DestinationFeaturesResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/destinations/features`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feature),
    }
  );

  return handleResponse<{ status: string; data: DestinationFeaturesResponse }>(
    response
  );
}
export async function apiPutDestinationFeature(
  id: number,
  feature: DestinationFeaturesResponse
): Promise<{ status: string; data: DestinationFeaturesResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/destinations/features/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feature),
    }
  );

  return handleResponse<{ status: string; data: DestinationFeaturesResponse }>(
    response
  );
}
export async function apiDeleteDestinationFeature(
  id: number
): Promise<{ status: string; data: DestinationFeaturesResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/destinations/features/${id}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse<{ status: string; data: DestinationFeaturesResponse }>(
    response
  );
}
export async function apiUpdateDestinationFeatureStatus(
  id: number,
  status: { status: boolean }
): Promise<{ status: string; data: DestinationFeaturesResponse }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/destinations/features/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(status),
  });

  return handleResponse<{ status: string; data: DestinationFeaturesResponse }>(response);
}