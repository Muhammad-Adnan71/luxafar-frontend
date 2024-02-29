import NameHeading from "@template-components/nameHeading";
import React from "react";

const FeaturesCard = ({
  cardImage,
  cardHeading,
}: {
  cardImage: any;
  cardHeading?: string;
}) => {
  return (
    <div className=" text-center max-md:w-full max-md:mx-auto">
      <div className="mb-5 bg-quaternary-color w-[150px] h-[150px] max-md:w-[110px] max-md:h-[110px] max-md:mx-auto flex justify-center items-center rounded-[50%] ">
        <img
          loading="eager"
          className="w-[75px] max-md:w-[60px]"
          src={cardImage}
          alt={
            cardHeading
              ? cardHeading + " " + "Luxafar Tour Plan Services Image"
              : ""
          }
        />
      </div>
      <NameHeading className="text-[13px] font-[500] max-md:text-[11px] max-md:mx-auto md:max-w-[150px]  leading-[1.3] text-center">
        {cardHeading}
      </NameHeading>
    </div>
  );
};

export default FeaturesCard;
