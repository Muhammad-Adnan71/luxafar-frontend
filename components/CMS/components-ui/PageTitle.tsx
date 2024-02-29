import { cn } from "lib/utils";
import React from "react";

interface IPageTitle {
  children: React.ReactNode;
  textAlign?: string;
  classes?: string;
}

function PageTitle({ children, classes }: IPageTitle) {
  return (
    <h1
      className={cn(
        "my-6 text-2xl font-semibold text-white dark:text-gray-200 capitalize",
        classes
      )}
    >
      {children}
    </h1>
  );
}

export default PageTitle;
