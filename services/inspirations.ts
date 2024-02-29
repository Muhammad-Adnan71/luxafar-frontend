import { InspirationResponse, TourResponse } from "../lib/types";
import { handleResponse } from "lib/api-helpers";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetAllInspirations(params?: {
  active?: "true";
  pageNum?: string;
  pageSize?: string;
  searchParams?: string;
  groupBy?: string;
  isHomePageSort?: string;
}): Promise<{
  status: string;
  data: InspirationResponse[];
  count: number;
}> {
  var url = new URL(`${SERVER_ENDPOINT}/api/admin/inspirations`);
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
    count: number;
    data: InspirationResponse[];
  }>(response);
}

export async function apiGetInspirationById(id: number): Promise<{
  status: string;
  data: InspirationResponse;
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/inspirations/${id}`,
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
    data: InspirationResponse;
  }>(response);
}

export async function apiPostInspiration(
  inspiration: InspirationResponse
): Promise<{ status: string; data: InspirationResponse }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/inspirations`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inspiration),
  });

  return handleResponse<{ status: string; data: InspirationResponse }>(
    response
  );
}

export async function apiPutInspiration(
  id: number,
  holidayTypes: InspirationResponse
): Promise<{ status: string; data: InspirationResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/inspirations/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(holidayTypes),
    }
  );

  return handleResponse<{ status: string; data: InspirationResponse }>(
    response
  );
}

export async function apiDeleteInspiration(
  id: number
): Promise<{ status: string; data: InspirationResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/inspirations/${id}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse<{ status: string; data: InspirationResponse }>(
    response
  );
}

export async function apiUpdateInspirationStatus(
  id: number,
  inspirationStatus: {
    isHomePageSort?: boolean;
    isActive?: boolean;
    isFeatured?: boolean;
    destinationId?: string;
  }
): Promise<{ status: string; data: InspirationResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/inspirations/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inspirationStatus),
    }
  );

  return handleResponse<{ status: string; data: InspirationResponse }>(
    response
  );
}

export async function apiGetTemplateInspirationByName(name: string): Promise<{
  status: string;
  data: { inspiration: InspirationResponse; tours: TourResponse[] };
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/template/inspirations/${name}`,
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
    data: { inspiration: InspirationResponse; tours: TourResponse[] };
  }>(response);
}

export async function apiGetInspirationMeta(name: string): Promise<{
  status: string;
  data: { inspiration: InspirationResponse; tours: TourResponse[] };
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/template/inspirations/${name}`,
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
    data: { inspiration: InspirationResponse; tours: TourResponse[] };
  }>(response);
}
export async function apiGetTemplateInspirations(params?: {
  destinationId?: string;
  holidayTypeId?: string;
  pageNum?: string;
  pageSize?: string;
}): Promise<{
  status: string;
  data: {
    inspirations: InspirationResponse[];
    featuredInspirations: InspirationResponse[];
  };
  count: number;
}> {
  let url = new URL(`${SERVER_ENDPOINT}/api/template/inspirations`);
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-cache",

    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
    },
  });

  return handleResponse<{
    status: string;
    data: {
      inspirations: InspirationResponse[];
      featuredInspirations: InspirationResponse[];
    };
    count: number;
  }>(response);
}
export async function apiGetTemplateInspirationByDestinationName(params?: {
  destinationName?: string;
  holidayTypeId?: string;
  pageNum?: string;
  pageSize?: string;
}): Promise<{
  status: string;
  data: {
    inspirations: InspirationResponse[];
    featuredInspiration: InspirationResponse;
  };
  count: number;
}> {
  let url = new URL(
    `${SERVER_ENDPOINT}/api/template/inspirations/${params?.destinationName}`
  );
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-cache",

    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
    },
  });

  return handleResponse<{
    status: string;
    data: {
      inspirations: InspirationResponse[];
      featuredInspiration: InspirationResponse;
    };
    count: number;
  }>(response);
}
export async function apiGenerateRssFeed(
  inspirations: InspirationResponse[]
): Promise<any> {
  let url = new URL(`${SERVER_ENDPOINT}/api/template/feed.xml`);

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
    },
    body: JSON.stringify(inspirations),
  });

  return handleResponse<any>(response);
}

export async function apiChangeSortInspirationsService({
  homePageSort,
  sourceId,
  sortPosition,
  destinationIdSortId,
  destinationId,
  inspirationPageSort,
}: {
  homePageSort?: boolean;
  inspirationPageSort?: boolean;
  sourceId: number;
  sortPosition: number;
  destinationIdSortId: number;
  destinationId?: number;
}): Promise<{ status: string; data: TourResponse[] }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/inspirations`, {
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
      homePageSort,
      inspirationPageSort,
    }),
  });

  return handleResponse<{ status: string; data: TourResponse[] }>(response);
}
