import { ChevronRightIcon } from "@radix-ui/react-icons";
import { cn } from "lib/utils";
import Link from "next/link";
import React from "react";

type breadcrumb = {
  name?: string;
  url: string;
};

function Breadcrumbs({
  breadcrumbs,
  classes,
  itemClasses,
}: {
  breadcrumbs: breadcrumb[];
  classes?: string;
  itemClasses?: string;
}) {
  return (
    <div data-scroll data-scroll-speed="-.8" data-scroll-direction="horizontal">
      <ul className={cn(["flex gap-8 ", classes])}>
        {breadcrumbs.map(({ name, url }: breadcrumb, index: number) => (
          <li key={index} className="relative font-body ">
            {breadcrumbs.length - 1 !== index && (
              <ChevronRightIcon className="ml-auto h-4 w-4 absolute text-white top-[10px] -translate-y-1/2 -right-6" />
            )}
            <Link
              href={url}
              className={cn([
                "text-white uppercase underline text-[14px] underline-offset-2 ",
                itemClasses,
              ])}
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Breadcrumbs;
