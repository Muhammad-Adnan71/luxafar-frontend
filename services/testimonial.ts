import { handleResponse } from "lib/api-helpers";
import { TestimonialResponse } from "lib/types";
const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetAllTestimonials(): Promise<{
  status: string;
  data: TestimonialResponse[];
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/testimonial`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{
    status: string;
    data: TestimonialResponse[];
  }>(response);
}
export async function apiDeleteTestimonial(id: number): Promise<{
  status: string;
  data: TestimonialResponse;
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/testimonial/${id}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse<{
    status: string;
    data: TestimonialResponse;
  }>(response);
}

export async function apiPostTestimonialService(
  testimonial: TestimonialResponse
): Promise<{ status: string; data: TestimonialResponse }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/testimonial`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(testimonial),
  });

  return handleResponse<{ status: string; data: TestimonialResponse }>(
    response
  );
}

export async function apiUpdateTestimonial(
  id: number,
  testimonial: TestimonialResponse
): Promise<{ status: string; data: TestimonialResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/testimonial/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testimonial),
    }
  );

  return handleResponse<{ status: string; data: TestimonialResponse }>(
    response
  );
}

export async function apiChangeSortTestimonialService({
  sourceId,
  sortPosition,
  destinationIdSortId,
}: {
  sourceId: number;
  sortPosition: number;
  destinationIdSortId: number;
}): Promise<{ status: string; data: TestimonialResponse[] }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/testimonial`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sourceId, sortPosition, destinationIdSortId }),
  });

  return handleResponse<{ status: string; data: TestimonialResponse[] }>(
    response
  );
}
