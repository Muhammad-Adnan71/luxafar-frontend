import Footer from "@template-components/footer";
import Header from "@template-components/header";
import Loader from "@template-components/loader";
import RSLProvider from "components/template/container/rslProvider";
import NextTopLoader from "nextjs-toploader";
import { apiGetTemplateConfiguration } from "services/configuration";
import "@styles/glassEffect.css";
import type { Metadata } from "next";
import { WEB_ROUTES } from "lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.METADATA_BASE_URL as string),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  viewport: { width: "device-width", initialScale: 1, maximumScale: 1 },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Travel",
  openGraph: {
    url: "/",
    siteName: "Luxafar",
    images: [
      {
        url: `${WEB_ROUTES.HOME}/template/luxafarlogo.png`,
        width: 400,
        height: 300,
      },
      {
        url: `${WEB_ROUTES.HOME}/template/luxafarlogo.png`,
        width: 1000,
        height: 800,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export const runtime = "edge";

export default async function Layout({ children }: { children: any }) {
  const {
    data: { destinations, configuration, inspirations },
  } = await apiGetTemplateConfiguration();

  return (
    <>
      <RSLProvider>
        <NextTopLoader
          color="#A69769"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
        />
        <Header
          logo={configuration?.media?.desktopMediaUrl as string}
          configuration={configuration}
          destinations={destinations}
        />

        <Loader />
        {children}
        <Footer configuration={configuration} inspirations={inspirations} />
      </RSLProvider>
    </>
  );
}
