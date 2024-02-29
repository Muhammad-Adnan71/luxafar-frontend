import { cn } from "lib/utils";
import React, { ReactNode } from "react";

function Subheading({
  children,
  classes,
}: {
  children: ReactNode;
  classes?: String;
}) {
  return (
    <h3
      className={cn([
        "font-heading text-[28px] text-secondary-color capitalize mb-5 ",
        classes,
      ])}
    >
      {children}
    </h3>
  );
}

export default Subheading;
