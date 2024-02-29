import { apiGetTemplateInspirations } from "services/inspirations";
import InspirationsComponent from "./components/inspirationsComponent";
import { Metadata } from "next";
import { apiGetTemplateConfiguration } from "services/configuration";
import { removeParaTagsFromString } from "lib/utils";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const {
    data: { configuration },
  } = await apiGetTemplateConfiguration();
  const metaDescription = removeParaTagsFromString(
    configuration?.siteDescription as string
  );
  return {
    title: "Inspirations - " + "Luxafar",
    description: metaDescription,

    openGraph: {
      title: "Inspirations - " + "Luxafar",
      description: metaDescription,
    },
  };
}
async function Inspirations() {
  const inspirations = await apiGetTemplateInspirations({
    pageSize: "9",
    pageNum: "1",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://luxafar.com/inspirations",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Inspirations",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    url: "https://luxafar.com/inspirations",
    image: "https://luxafar.com/template/logo.png",
    description: "metaDescription",
    sameAs: [
      "https://www.facebook.com/luxafarofficial",
      "https://www.instagram.com/luxafar",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InspirationsComponent
        featuredInspirations={inspirations?.data?.featuredInspirations}
        inspirations={inspirations.data.inspirations}
        rowCount={inspirations.count}
      />
    </>
  );
}

export default Inspirations;
