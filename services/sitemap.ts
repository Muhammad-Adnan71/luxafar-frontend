import { handleResponse } from "lib/api-helpers";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetAllSitemapData(): Promise<{
  status: string;
  data: any;
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/template/sitemap`, {
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
    data: any;
  }>(response);
}

export async function apiGetNewInspiration(): Promise<{
  status: string;
  data: any;
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/inspirations/feed`,
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
