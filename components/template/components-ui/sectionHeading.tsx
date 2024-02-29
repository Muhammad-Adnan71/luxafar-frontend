import { cn } from "lib/utils";
import React, { ReactNode } from "react";

function SectionHeading({
  children,
  classes,
  isHeadingAnimated = true,
}: {
  children: ReactNode;
  classes?: String;
  isHeadingAnimated?: boolean;
}) {
  return (
    <>
      {isHeadingAnimated && (
        <>
          <h1
            className={cn([
              " font-heading text-[80px] tracking-tight max-[1535px]:text-[75px] max-xl:text-[62px] max-lg:text-[52px] max-md:text-[48px] text-white capitalize  max-sm:text-[48px] max-[430px]:text-[42px] max-[380px]:text-[38px] ",
              classes,
            ])}
          >
            <span
              className="inline-block"
              data-scroll
              data-scroll-speed="-.3"
              data-scroll-direction="horizontal"
            >
              {children}
            </span>
          </h1>
        </>
      )}
      {!isHeadingAnimated && (
        <>
          <h1
            className={cn([
              " font-heading text-[80px] tracking-tight max-[1535px]:text-[75px] max-xl:text-[62px] max-lg:text-[52px] max-md:text-[48px] text-white capitalize  max-sm:text-[48px] max-[430px]:text-[42px] max-[380px]:text-[38px] ",
              classes,
            ])}
          >
            <span className="inline-block">{children}</span>
          </h1>
        </>
      )}
    </>
  );
}

export default SectionHeading;
