import React, { ReactNode } from "react";
import Button from "./button";
import Paragraph from "./paragraph";
import { cn } from "lib/utils";

function PlanContactBanner({
  title,
  buttonText,
  buttonURL,
  description,
  classes,
}: {
  title: ReactNode;
  buttonText: string;
  buttonURL: string;
  description: string;
  classes?: string;
}) {
  return (
    <div
      className={cn([
        "bg-quaternary-color py-10 px-32 flex justify-between items-center max-[1400px]:px-20 max-xl:px-10 max-lg:flex-col max-lg:items-start max-md:px-5 ",
        classes,
      ])}
    >
      <div className="">
        <h2
          className={
            "text-[60px] max-md:inline-block font-heading text-white mb-5 flex gap-1 whitespace-nowrap max-xl:text-[50px] max-md:text-[40px] max-sm:text-[33px] max-sm:flex-col max-sm:whitespace-normal max-sm:inline "
          }
        >
          {title}
        </h2>
        <Paragraph classes="opacity-1 w-[55%] m-0 max-lg:w-full max-sm:text-[13px] max-sm:mt-4">
          {description}
        </Paragraph>
      </div>
      <div className="max-lg:mt-5">
        <Button text={buttonText} redirect={buttonURL}></Button>
      </div>
    </div>
  );
}

export default PlanContactBanner;
