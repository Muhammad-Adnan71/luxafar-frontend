import { handleResponse } from "lib/api-helpers";
import { InspirationResponse } from "lib/types";
const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetTemplateUsefulInformation(params?: {
  pageNum?: string;
  pageSize?: string;
}): Promise<{
  status: string;
  data: InspirationResponse[];
  count: number;
}> {
  let url = new URL(`${SERVER_ENDPOINT}/api/template/useful-information`);
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url, {
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
    data: InspirationResponse[];
    count: number;
  }>(response);
}
