import { cn } from "lib/utils";
import React, { ReactNode } from "react";

function SubHeading({
  children,
  classes,
}: {
  children: ReactNode;
  classes?: string;
}) {
  return (
    <h3
      className={cn([
        "text-white dark:text-gray-400 text-xl pb-3 text-[20px] capitalize font-semibold  ",
        classes,
      ])}
    >
      {children}
    </h3>
  );
}

export default SubHeading;
