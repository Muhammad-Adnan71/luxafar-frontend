import React, { MouseEventHandler } from "react";
import { Button } from "./shadcn/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { cn } from "lib/utils";

function AddButton({
  text = "Add",
  onClick,
  classes,
}: {
  text?: string;
  classes?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Button
      variant="outline"
      className={cn([
        " text-sm bg-cms-fourth-color mt-3 px-4 flex gap-1",
        classes,
      ])}
      type="button"
      onClick={onClick}
    >
      {text}
      <PlusIcon className="w-3 h-3" aria-hidden="true" />
    </Button>
  );
}

export default AddButton;
