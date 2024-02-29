"use client";
import { redirect } from "next/navigation";
import React from "react";

const Feed = () => {
  redirect("/rss.xml");
};

export default Feed;
