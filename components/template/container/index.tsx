import { cn } from "lib/utils";
import React from "react";

function Container({
  children,
  classes,
}: {
  children: JSX.Element | JSX.Element[];
  classes?: string;
}) {
  return (
    <div
      className={cn([
        "w-4/5 max-w-[1400px] grid mx-auto max-sm:w-[90%] max-sm:px-0",
        classes,
      ])}
    >
      {children}
    </div>
  );
}

export default Container;
