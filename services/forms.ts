import { handleResponse } from "lib/api-helpers";
import { BeSpokeFormResponse, BecomePartnerFormResponse, BespokeQuestionResponse, FormResponse } from "lib/types";
const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiPostForms(
  form: FormResponse
): Promise<{ status: string; data: FormResponse }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/template/forms`, {
    method: "POST",
    credentials: "include",
    cache: "no-cache",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  return handleResponse<{ status: string; data: FormResponse }>(response);
}

export async function apiGetAllFormsService(params: {
  type?: string;
  active?: "true";
  pageNum?: string;
  pageSize?: string;
  searchParams?: string;
}): Promise<{
  status: string;
  data: FormResponse[];
  count: number;
}> {
  var url = new URL(`${SERVER_ENDPOINT}/api/admin/forms`);
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
    data: FormResponse[];
    count: number;
  }>(response);
}

export async function apiReadForm(
  id: number
): Promise<{ status: string; data: FormResponse }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/forms/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "read" }),
  });

  return handleResponse<{ status: string; data: FormResponse }>(response);
}

export async function apiPostBecomePartnerForms(
  form: any
): Promise<{ status: string; data: any }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/template/becomePartner`, {
    method: "POST",
    credentials: "include",
    cache: "no-cache",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  return handleResponse<{ status: string; data: any }>(response);
}

export async function apiGetAllBecomePartnerFormsService(params: {
  pageNum?: string;
  pageSize?: string;
  searchParams?: string;
}): Promise<{
  status: string;
  data: BecomePartnerFormResponse[];
  count: number;
}> {
  var url = new URL(`${SERVER_ENDPOINT}/api/admin/forms/becomePartner/submitForm`);
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
    data: BecomePartnerFormResponse[];
    count: number;
  }>(response);
}


export async function apiReadBecomePartnerForm(
  id: number
): Promise<{ status: string; data: BecomePartnerFormResponse }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/forms/becomePartner/submitForm/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "read" }),
  });

  return handleResponse<{ status: string; data: BecomePartnerFormResponse }>(response);
}

export async function apiGetAllBeSpokeFormsService(params: {
  pageNum?: string;
  pageSize?: string;
  searchParams?: string;
}): Promise<{
  status: string;
  data: BeSpokeFormResponse[];
  count: number;
}> {
  var url = new URL(`${SERVER_ENDPOINT}/api/admin/forms/bespoke/submitForm`);
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
    data: BeSpokeFormResponse[];
    count: number;
  }>(response);
}

export async function apiReadBeSpokeForm(
  id: number
): Promise<{ status: string; data: any }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/forms/bespoke/submitForm/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "read" }),
  });

  return handleResponse<{ status: string; data: BeSpokeFormResponse }>(response);
}