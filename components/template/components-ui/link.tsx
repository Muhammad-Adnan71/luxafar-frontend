import React from "react";
import { ButtonType } from "./button";
import Link from "next/link";

function CustomLink({ text, onClick, redirect, classes }: ButtonType) {
  return (
    <Link
      href={redirect ?? ""}
      onClick={onClick}
      className={
        "text-secondary-color uppercase underline underline-offset-2 font-body text-xs 2xl:text-sm " +
        classes
      }
    >
      {text}
    </Link>
  );
}

export default CustomLink;
