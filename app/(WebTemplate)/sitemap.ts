import {
  WEB_ROUTES,
  dateFormat,
  friendlyUrl,
  replaceSpacesWithDash,
} from "lib/utils";
import { MetadataRoute } from "next";
import { apiGetAllSitemapData } from "services/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const response = await apiGetAllSitemapData();

  const HolidayType = response?.data?.allActiveHolidayTypeWithTitle.map(
    (item: any) => ({
      url: `${process.env.METADATA_BASE_URL}${WEB_ROUTES.HOLIDAY_TYPES}/${item?.seoMeta.slug}`,
      lastModified: `${dateFormat(item?.updatedAt).toString()}`,
      changeFrequency: "hourly",
      priority: 0.5,
    })
  );
  let inspirations: any = [];
  response?.data?.allActiveInspirationWithTitle.forEach((item: any) => {
    item.destination.forEach((ele: any) => {
      inspirations.push({
        url: `${process.env.METADATA_BASE_URL}${
          WEB_ROUTES.INSPIRATIONS
        }/${friendlyUrl(ele?.name)}/${friendlyUrl(item?.seoMeta?.slug)}`,
        lastModified: `${dateFormat(item?.updatedAt).toString()}`,
        changeFrequency: "hourly",
        priority: 0.5,
      });
    });
  });

  const places = response?.data?.allActivePlacesWithTitle.map((item: any) => ({
    url: `${process.env.METADATA_BASE_URL}${
      WEB_ROUTES.DESTINATION
    }/${friendlyUrl(item?.destination?.name)}/place/${friendlyUrl(
      item?.seoMeta?.slug
    )}`,
    lastModified: `${dateFormat(item?.updatedAt).toString()}`,
    changeFrequency: "hourly",
    priority: 0.5,
  }));

  const destinations = response?.data?.allActiveDestinationWithTitle
    .filter((fil: any) => fil.tourDestinations.length > 0)
    .map((item: any) => ({
      url: `${process.env.METADATA_BASE_URL}/destination/${friendlyUrl(
        item?.name
      )}`,
      lastModified: `${dateFormat(item?.updatedAt).toString()}`,
      changeFrequency: "hourly",
      priority: 0.5,
    }));

  const tours = response?.data?.allActiveToursWithTitle.map((item: any) => ({
    url: `${process.env.METADATA_BASE_URL}/destination/${friendlyUrl(
      item?.tourDestinations[0]?.destination?.name
    )}/tours/${friendlyUrl(item?.seoMeta?.slug)}`,
    lastModified: `${dateFormat(item?.updatedAt).toString()}`,
    changeFrequency: "hourly",
    priority: 0.5,
  }));

  const mainPages = [
    {
      url: `${process.env.METADATA_BASE_URL as string}`,
      lastModified: `${dateFormat(new Date().toISOString())}`,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${process.env.METADATA_BASE_URL as string}/contact`,
      lastModified: `${dateFormat(new Date().toISOString())}`,
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: (process.env.METADATA_BASE_URL as string) + "/about",
      lastModified: `${dateFormat(new Date().toISOString())}`,
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: (process.env.METADATA_BASE_URL as string) + "/become-a-partner",
      lastModified: `${dateFormat(new Date().toISOString())}`,
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: (process.env.METADATA_BASE_URL as string) + "/bespoke-holiday",
      lastModified: `${dateFormat(new Date().toISOString())}`,
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: (process.env.METADATA_BASE_URL as string) + "/cookies-policy",
      lastModified: `${dateFormat(new Date().toISOString())}`,
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: (process.env.METADATA_BASE_URL as string) + "/privacy-policy",
      lastModified: `${dateFormat(new Date().toISOString())}`,
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: (process.env.METADATA_BASE_URL as string) + "/terms-and-conditions",
      lastModified: `${dateFormat(new Date().toISOString())}`,
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: (process.env.METADATA_BASE_URL as string) + "/inspirations",
      lastModified: `${dateFormat(new Date().toISOString())}`,
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: (process.env.METADATA_BASE_URL as string) + "/holiday-types",
      lastModified: `${dateFormat(new Date().toISOString())}`,
      changeFrequency: "hourly",
      priority: 0.8,
    },
  ];

  return [
    ...mainPages,
    ...HolidayType,
    ...inspirations,
    ...places,
    ...destinations,
    ...tours,
  ];
}
