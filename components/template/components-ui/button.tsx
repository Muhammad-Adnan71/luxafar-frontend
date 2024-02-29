import { cn } from "lib/utils";
import { Loader } from "lucide-react";
import Link from "next/link";
import React, { MouseEventHandler } from "react";

export type ButtonType = {
  text?: string;
  redirect?: string;
  classes?: string;
  isLoading?: boolean;
  onClick?:
    | MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
    | undefined;
  type?: "button" | "link";
  buttonType?: "button" | "submit" | "reset";
};
function Button({
  text,
  isLoading,
  onClick,
  redirect,
  classes,
  type = "link",
  buttonType = "button",
}: ButtonType) {
  return (
    <>
      {type === "link" ? (
        <Link
          href={redirect ?? ""}
          onClick={onClick}
          className={cn([
            "font-body block uppercase cursor-pointer w-fit text-primary-color font-semibold py-[12px] px-6 bg-gradient outline-none text-[11px] 2xl:py-[14px] whitespace-nowrap",
            classes,
          ])}
        >
          {text}
        </Link>
      ) : (
        <button
          type={buttonType}
          onClick={onClick}
          disabled={isLoading}
          className={cn([
            "font-body  uppercase cursor-pointer w-fit text-primary-color font-semibold py-[12px] px-6  inline-flex  bg-gradient outline-none text-[11px] 2xl:py-[14px] whitespace-nowrap  justify-center items-center gap-2 disabled:bg-opacity-90 disabled:cursor-default relative after:absolute after:w-full after:h-full after:top-0 after:left-0 bg-gradients after:z-[1]",
            classes,
          ])}
        >
          <span className="relative z-10 leading-[1]">
            {isLoading && (
              <Loader className="h-4 w-4 absolute -left-[22px] -top-[2px] animate-spin transition-all text-primary-color" />
            )}
            {text}
          </span>
        </button>
      )}
    </>
  );
}

export default Button;
