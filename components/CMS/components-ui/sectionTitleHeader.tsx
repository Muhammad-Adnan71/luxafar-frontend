import Button from "@template-components/button";
import SectionHeading from "@template-components/sectionHeading";
import { cn } from "lib/utils";
import React, { ReactNode } from "react";

function SectionTitleHeader({
  title,
  buttonText,
  buttonURL,
  classes,
  mainHeadingClasses,
  isHeadingAnimated,
  buttonClick,
}: {
  buttonClick?: any;
  classes?: string;
  title: string | ReactNode;
  buttonText?: string;
  buttonURL?: string;
  mainHeadingClasses?: string;
  isHeadingAnimated?: boolean;
}) {
  return (
    <div className={cn(["flex justify-between items-end", classes])}>
      <SectionHeading
        isHeadingAnimated={isHeadingAnimated}
        classes={cn([
          "w-[60%] max-xl:w-[70%] max-md:w-full ",
          mainHeadingClasses,
        ])}
      >
        {title}
      </SectionHeading>
      {buttonText && (
        <Button
          onClick={buttonClick}
          text={buttonText}
          redirect={buttonURL}
          classes="max-md:hidden"
        ></Button>
      )}
    </div>
  );
}

export default SectionTitleHeader;
