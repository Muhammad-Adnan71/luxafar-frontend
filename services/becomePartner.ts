
import { handleResponse } from "lib/api-helpers";
import { BespokeQuestionResponse } from "lib/types";
const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;


export async function apiPutBecomePartnerQuestion(
  bespokeQuestionResponse: BespokeQuestionResponse[]
): Promise<{
  status: string;
  data: BespokeQuestionResponse[];
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/forms/becomePartner`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bespokeQuestionResponse),
  });

  return handleResponse<{
    status: string;
    data: BespokeQuestionResponse[];
  }>(response);
}

export async function apiGetAllBecomePartnerQuestionTemplate(): Promise<{
  status: string;
  data: BespokeQuestionResponse[];
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/template/becomePartner`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-cache",
      headers: {
        Authorization: process.env.NEXT_PUBLIC_BEARER as string,
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse<{
    status: string;
    data: BespokeQuestionResponse[];
  }>(response);
}

export async function apiGetAllBecomePartnerQuestion(): Promise<{
  status: string;
  data: BespokeQuestionResponse[];
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/forms/becomePartner`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{
    status: string;
    data: BespokeQuestionResponse[];
  }>(response);
}