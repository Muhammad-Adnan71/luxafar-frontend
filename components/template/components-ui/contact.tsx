"use client";
import React from "react";
import { ContentResponse } from "lib/types";
import dynamic from "next/dynamic";

// import ContactForm from "./contactForm";
const ContactForm = dynamic(() => import("./contactForm"), { ssr: false });
export const Contact = ({ data }: { data: ContentResponse | undefined }) => {
  return <ContactForm data={data} />;
};

export default Contact;
