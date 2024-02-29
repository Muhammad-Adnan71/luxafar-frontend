import { apiGetTemplateInspirationByDestinationName } from "services/inspirations";
import InspirationDestinationComponent from "../components/inspirationDestinationComponent";
import { Metadata } from "next";
import { apiGetTemplateConfiguration } from "services/configuration";
import { capitalizeFirstLetter, removeParaTagsFromString } from "lib/utils";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { destinationName: string };
}): Promise<Metadata> {
  const {
    data: { configuration },
  } = await apiGetTemplateConfiguration();
  const metaDescription = removeParaTagsFromString(
    configuration?.siteDescription as string
  );
  return {
    title: `${capitalizeFirstLetter("Inspiration")} - ${capitalizeFirstLetter(
      params.destinationName
    )} - Luxafar`,
    description: metaDescription,

    openGraph: {
      title: `${capitalizeFirstLetter("Inspiration")} - ${capitalizeFirstLetter(
        params.destinationName
      )} - Luxafar`,
      description: metaDescription,
    },
  };
}
async function InspirationsDestination({
  params,
}: {
  params: { destinationName: string };
}) {
  const inspirations = await apiGetTemplateInspirationByDestinationName({
    pageSize: "9",
    pageNum: "1",
    destinationName: params.destinationName,
  });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://luxafar.com/inspirations/${params.destinationName}`,
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
    url: `https://luxafar.com/inspirations/${params.destinationName}`,
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
      <InspirationDestinationComponent
        featuredInspiration={inspirations?.data?.featuredInspiration}
        inspirations={inspirations.data.inspirations}
        rowCount={inspirations.count}
        destinationName={params.destinationName}
      />
    </>
  );
}

export default InspirationsDestination;
