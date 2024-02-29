import { parseISO } from "date-fns";
import { writeFileSync } from "fs";
import { Feed } from "feed";
import { NextRequest, NextResponse } from "next/server";
import { removeParaTagsFromString, replaceSpacesWithDash } from "lib/utils";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const feed = new Feed({
    title: "Luxafar-Re-Defining Luxury",
    description: "Luxafar-Re-Defining Luxury",
    id: "https://luxafar.com",
    link: "https://luxafar.com",
    language: "en",
    favicon: "https://luxafar.com/favicon.ico",
    copyright: "All rights reserved 2023, Luxafar",
    author: {
      name: "Luxafar",
      email: "no-reply@luxafar.com",
      link: "https://luxafar.com",
    },
  });
  body.forEach((post: any) => {
    const url = `https://luxafar.com/inspirations/${replaceSpacesWithDash(
      post.destination.name
    )}/${replaceSpacesWithDash(
      post?.seoMeta?.slug?.length ? post?.seoMeta?.slug : post.title
    )}`;
    feed.addItem({
      id: url,
      link: url,
      title: post.title,
      description: removeParaTagsFromString(post.description as string),
      date: parseISO(post.createdAt),
      author: [
        {
          name: "Luxafar",
          email: "no-reply@luxafar.com",
          link: "https://luxafar.com",
        },
      ],
    });
  });
  writeFileSync("./public/rss.xml", feed.rss2(), { encoding: "utf-8" });

  return new NextResponse(
    JSON.stringify({
      status: "success",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
