import React from "react";
import { Button } from "../shadcn/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
function TableDeleteButton({
  handleDeleteAlert,
  row,
  parentRow,
}: {
  parentRow?: any;
  handleDeleteAlert: any;
  row: any;
}) {
  return (
    <Button
      type="button"
      onClick={() => handleDeleteAlert(row, parentRow)}
      aria-label="Delete"
      className="!p-0 bg-transparent dark:bg-transparent hover:!bg-transparent ring-0 focus:ring-0 active:ring-0 [&>svg]:fill-white dark:[&>svg]:fill-gray-400"
    >
      <TrashIcon className="w-5 h-5" />
    </Button>
  );
}

export default TableDeleteButton;
