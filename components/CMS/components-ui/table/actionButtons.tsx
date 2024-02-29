import React from "react";
import { TableCell } from "../shadcn/ui/table";
import TableEditButton from "./tableEditButton";
import TableViewButton from "./tableViewButton";
import TableDeleteButton from "./tableDeleteButton";

function ActionButtons({
  actionHandles,
  row,
  handleDeleteAlert,
  parentRow,
}: {
  parentRow?: any;
  actionHandles: any;
  row: any;
  handleDeleteAlert?: any;
}) {
  return (
    <TableCell>
      <div className="flex items-center justify-center space-x-4">
        {actionHandles?.onEdit && (
          <TableEditButton
            row={row}
            parentRow={parentRow}
            actionHandles={actionHandles}
          />
        )}
        {actionHandles?.onView && (
          <TableViewButton
            parentRow={parentRow}
            actionHandles={actionHandles}
            row={row}
          />
        )}
        {actionHandles?.onDelete && (
          <TableDeleteButton
            row={row}
            parentRow={parentRow}
            handleDeleteAlert={handleDeleteAlert}
          />
        )}
      </div>
    </TableCell>
  );
}

export default ActionButtons;
