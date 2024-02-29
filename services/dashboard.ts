import { FormResponse } from "./../lib/types";
import { handleResponse } from "lib/api-helpers";
import { PageResponse } from "lib/types";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiDashboard(): Promise<{
  status: string;
  data: { pages: PageResponse[]; forms: FormResponse[]; becomePartner: number; bespokeCount: number };
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/dashboard`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{
    status: string;
    data: { pages: PageResponse[]; forms: FormResponse[]; becomePartner: number; bespokeCount: number };
  }>(response);
}
export async function apiDashboardDetail(): Promise<{
  status: string;
  data: any;
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/dashboard/detail`,
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
