import { TrashIcon } from "@radix-ui/react-icons";
import React, { MouseEventHandler } from "react";
import { Button } from "./shadcn/ui/button";

function DeleteButton({
  onClick,
  classes,
}: {
  classes?: string;
  onClick: MouseEventHandler<HTMLSpanElement>;
}) {
  return (
    <Button
      type="button"
      variant={"outline"}
      className={"border-cms-tertiary-color bg-cms-fourth-color " + classes}
      onClick={onClick}
    >
      <TrashIcon className="w-5 h-5" aria-hidden="true" />
    </Button>
  );
}

export default DeleteButton;
