import React from "react";
import { Button } from "../shadcn/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";

function TableEditButton({
  row,
  parentRow,
  actionHandles,
}: {
  parentRow?: any;
  row: any;
  actionHandles?: any;
}) {
  return (
    <Button
      onClick={() =>
        actionHandles?.onEdit && actionHandles.onEdit(row, parentRow)
      }
      aria-label="Edit"
      className="bg-transparent dark:bg-transparent !p-0 hover:!bg-transparent ring-0 focus:ring-0 active:ring-0 [&>svg]:fill-white dark:[&>svg]:fill-gray-400"
    >
      <Pencil1Icon className="w-5 h-5" />
    </Button>
  );
}

export default TableEditButton;
