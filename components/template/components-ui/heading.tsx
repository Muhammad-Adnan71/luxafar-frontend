import { cn } from "lib/utils";
import React, { ReactNode } from "react";

function MainHeading({
  children,
  classes,
  isHeadingH1 = false,
}: {
  isHeadingH1?: boolean;
  children: ReactNode;
  classes?: String;
}) {
  return isHeadingH1 ? (
    <h1
      className={cn([
        "font-heading text-[86px] tracking-tight max-[1535px]:text-[80px] max-xl:text-[60px] max-lg:text-[52px] max-md:text-[44px] text-white capitalize max-[380px]:text-[38px] ",
        classes,
      ])}
    >
      {children}
    </h1>
  ) : (
    <h2
      className={cn([
        "font-heading text-[86px] tracking-tight max-[1535px]:text-[80px] max-xl:text-[60px] max-lg:text-[52px] max-md:text-[44px] text-white capitalize max-[380px]:text-[38px] ",
        classes,
      ])}
    >
      {children}
    </h2>
  );
}

export default MainHeading;
