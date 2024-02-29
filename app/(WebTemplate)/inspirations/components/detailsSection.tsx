import Paragraph from "@template-components/paragraph";
import Subheading from "@template-components/sub-heading";
import React from "react";

function DetailsSection({
  title,
  image,
  description,
  mobileImage,
}: {
  mobileImage?: string;
  title: string;
  image: any;
  description: string;
}) {
  return (
    <div className="pt-16 max-md:pt-4 pb-4 max-md:pb-0">
      <div
        data-scroll
        data-scroll-speed="-.5"
        data-scroll-direction="horizontal"
      >
        <Subheading classes={"text-[36px] max-sm:text-[23px] mb-12 font-[600]"}>
          {title}
        </Subheading>
      </div>
      {mobileImage && image ? (
        <div className="mb-8 h-[65hv] overflow-hidden max-sm:h-[300px]">
          <picture>
            <source
              className="w-full h-full object-cover"
              srcSet={mobileImage}
              media="(max-width:640px)"
            />
            <source
              className={"w-full  h-full object-cover"}
              srcSet={image}
              media="(min-width:641px)"
            />
            <img
              src={image}
              alt={title ? title + " " + "Luxafar" : ""}
              className="w-full h-full object-cover"
            />
          </picture>
        </div>
      ) : (
        ""
      )}
      <Paragraph htmlText={description}></Paragraph>
    </div>
  );
}

export default DetailsSection;
