"use client";
import { redirect } from "next/navigation";
import React from "react";

const Error = () => {
  redirect("/not-found");
};

export default Error;