import { MediaResponse } from "lib/types";
import { isFile } from "lib/utils";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiUploadsMediaService(images: {
  desktopMediaUrl?: File;
  mobileMediaUrl?: File;
}): Promise<null | { status: string; data: any }> {
  const keysResponse = await Promise.all(
    Object.entries(images).map(async (image: any) => {
      if (isFile(image[1])) {
        const fileType = encodeURIComponent(image[1]?.type as string);
        const presignedURL = await fetch(
          `${SERVER_ENDPOINT}/api/admin/uploads?fileType=${fileType}`,
          {
            headers: {
              Authorization: process.env.NEXT_PUBLIC_BEARER as string,
            },
          }
        );
        const { url, key } = await presignedURL.json();
        try {
          const upload = await fetch(url, {
            method: "PUT",
            body: image[1],
            headers: { "Content-Type": fileType },
          });

          return { [image[0]]: key };
        } catch (e) {
          new Error("Problem in Uploads");
        }
      } else return { [image[0]]: image[1] };
    })
  );
  return {
    status: "success",
    data: keysResponse,
  };
}

export async function getUploadsUrl(
  media: MediaResponse
): Promise<null | { status: string; data: any }> {
  const res = await fetch(`${SERVER_ENDPOINT}/api/admin/uploads`, {
    method: "POST",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
    },
    body: JSON.stringify({ media }),
  });
  const data = await res.json();
  return {
    status: "success",
    data: data.urls,
  };
}
