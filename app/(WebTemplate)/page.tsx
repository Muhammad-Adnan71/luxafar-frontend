import About from "@template-components/about";
import Collection from "@template-components/collection";
import Contact from "@template-components/contact";
import Faqs from "@template-components/faqs";
import Inspirations from "@template-components/inspirations";
import Partners from "@template-components/partners";
import Testimonials from "@template-components/testimonials";
import type { NextPage } from "next";
import Banner from "@template-components/banner";
import { apiGetPageByIdTemplateService } from "services/pages";
import { capitalizeFirstLetter, removeParaTagsFromString } from "lib/utils";
import { Metadata } from "next";
export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const {
    data: { page },
  } = await apiGetPageByIdTemplateService("home");

  const metaDescription = removeParaTagsFromString(
    page?.seoMeta?.description as string
  );

  return {
    title: `${capitalizeFirstLetter(page?.seoMeta?.title)} - Luxafar`,
    description: metaDescription,
    keywords: page?.seoMeta?.keywords,

    openGraph: {
      title: `${capitalizeFirstLetter(page?.seoMeta?.title)} - Luxafar`,
      description: metaDescription,
    },
  };
}

const Home: NextPage = async () => {
  const {
    data: { banners, partners, page, faqs, testimonials, inspirations },
  } = await apiGetPageByIdTemplateService("home");
  const about = page.content?.find(
    (content: any) => content.name === "about us"
  );
  const partnersData = page.content?.find(
    (content: any) => content.name === "partners"
  );
  const ourStory = page.content?.filter(
    (content: any) => content.name === "our story"
  );
  const inspirationData = page.content?.find(
    (content: any) => content.name === "journey"
  );
  const faqsData = page.content?.find(
    (content: any) => content.name === "faqs"
  );
  const contactData = page.content?.find(
    (content: any) => content.name === "contact"
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Luxafar Re-defining Luxury",
    image: "https://luxafar.com/template/logo.png",
    "@id": "https://luxafar.com",
    url: "https://luxafar.com",
    telephone: "+442034682356",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    email: "contact@luxafar.com",
    description: "",
    geo: {
      "@type": "GeoCoordinates",
      latitude: 25.2085919,
      longitude: 55.2765573,
    },
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
      <Banner slides={banners} />
      <About data={about} />
      <Collection data={ourStory} />
      <Partners partners={partners} data={partnersData} />
      <Inspirations data={inspirationData} inspirations={inspirations} />
      <Testimonials testimonials={testimonials} />
      <Faqs faqs={faqs} data={faqsData} />
      <Contact data={contactData} />
    </>
  );
};

export default Home;
