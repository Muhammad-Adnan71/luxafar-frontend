import { cn } from "lib/utils";
import React, { ReactNode } from "react";

function Paragraph({
  children,
  htmlText,
  classes,
}: {
  htmlText?: string;
  children?: ReactNode;
  classes?: string;
}) {
  return children ? (
    <p
      className={cn([
        "font-body 2xl:text-md max-2xl:text-sm text-white opacity-80 mb-5 leading-snug max-xl:text-[14px] ",
        classes,
      ])}
    >
      {children}
    </p>
  ) : (
    <div
      dangerouslySetInnerHTML={{ __html: htmlText ?? "" }}
      className={cn([
        "font-body link-color 2xl:text-md max-2xl:text-sm text-white opacity-80 mb-5 leading-snug max-xl:text-[14px] ",
        classes,
      ])}
    ></div>
  );
}

export default Paragraph;
