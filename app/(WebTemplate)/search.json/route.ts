import { replaceSpacesWithDash } from "lib/utils";
import { NextResponse } from "next/server";
import { apiGetTemplateInspirations } from "services/inspirations";

export async function GET() {
  const { data } = await apiGetTemplateInspirations();
  let inspirations: any = [];
  data.inspirations.forEach((item) => {
    item.destination.forEach((ele: any) => {
      inspirations.push({
        title: item.title,
        url: `/${replaceSpacesWithDash(ele.name)}/${item.seoMeta.slug}`,
      });
    });
  });

  return NextResponse.json({
    site: {
      description: "Luxafar-Re-Defining Luxury",
      language: "en-US",
      title: "Luxafar-Re-Defining Luxury",
      uri: process.env.METADATA_BASE_URL,
    },
    inspirations,
  });
}
