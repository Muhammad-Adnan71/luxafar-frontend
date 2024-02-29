import React from "react";
import { Button } from "../shadcn/ui/button";
import { EyeOpenIcon as EyeIcon } from "@radix-ui/react-icons";

function TableViewButton({
  row,
  actionHandles,
  parentRow,
}: {
  parentRow?: any;
  row: any;
  actionHandles?: any;
}) {
  return (
    <Button
      onClick={() =>
        actionHandles?.onView && actionHandles.onView(row, parentRow)
      }
      aria-label="Delete"
      className=" bg-transparent dark:bg-transparent !p-0 hover:!bg-transparent ring-0 focus:ring-0 active:ring-0 [&>svg]:fill-white dark:[&>svg]:fill-gray-400"
    >
      <EyeIcon className="w-5 h-5" />
    </Button>
  );
}

export default TableViewButton;
