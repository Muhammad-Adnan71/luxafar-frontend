import {
  ConfigurationResponse,
  DestinationsResponse,
  InspirationResponse,
} from "../lib/types";
import { handleResponse } from "lib/api-helpers";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiPostConfiguration(
  configuration: ConfigurationResponse
): Promise<{ status: string; data: ConfigurationResponse }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/configuration`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(configuration),
  });

  return handleResponse<{ status: string; data: ConfigurationResponse }>(
    response
  );
}

export async function apiGetAllConfiguration(): Promise<{
  status: string;
  data: ConfigurationResponse;
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/configuration`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{
    status: string;
    data: ConfigurationResponse;
  }>(response);
}

export async function apiGetTemplateConfiguration(): Promise<{
  status: string;
  data: {
    destinations: DestinationsResponse[];
    configuration: ConfigurationResponse;
    inspirations: InspirationResponse[];
  };
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/template/configuration`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      },
    }
  );

  return handleResponse<{
    status: string;
    data: {
      destinations: DestinationsResponse[];
      configuration: ConfigurationResponse;
      inspirations: InspirationResponse[];
    };
  }>(response);
}
