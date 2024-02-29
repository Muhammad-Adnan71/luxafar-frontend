import React from "react";
import { Montserrat } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { Metadata } from "next";
import Layout from "components/template/container/layout";
import "@styles/globals.css";
import "@styles/glassEffect.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});
const playfair = Playfair_Display({
  subsets: ["latin-ext"],
  display: "swap",
  variable: "--font-playfair",
});
export const metadata: Metadata = {
  title: "Luxafar-Re-Defining Luxury",

  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon.ico",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/favicon.ico",
    },
  ],
};
export default function RootLayout({ children }: { children: any }) {
  return (
    <html
      lang="en"
      className={[playfair.variable, montserrat.variable].join(" ")}
    >
      <body className="bg-primary-color bg-repeat bg-fixed sm:bg-body-pattern max-sm:bg-pattern-mobile max-w-full overflow-x-hidden">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
