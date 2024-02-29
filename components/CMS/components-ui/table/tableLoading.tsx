import React from "react";
import { TableBody, TableCell, TableRow } from "../shadcn/ui/table";
import { Skeleton } from "../shadcn/ui/skeleton";

function TableLoading({
  tableHeadings,
  isActionButtons,
  tableIsDraggle,
}: {
  tableIsDraggle?: Boolean;
  isActionButtons?: Boolean;
  tableHeadings: any;
}) {
  return (
    <TableBody>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
        <TableRow
          key={index}
          className="text-center  border-cms-primary-color dark:border-gray-800"
        >
          {tableHeadings.map((th: any, tIndex: number) => (
            <TableCell key={tIndex}>
              <Skeleton className="w-full h-[35px]  bg-cms-primary-color" />
            </TableCell>
          ))}
          {isActionButtons && (
            <TableCell>
              <Skeleton className="w-full h-[35px]  bg-cms-primary-color" />
            </TableCell>
          )}
          {isActionButtons && tableIsDraggle && (
            <TableCell>
              <Skeleton className="w-full h-[35px]  bg-cms-primary-color" />
            </TableCell>
          )}
        </TableRow>
      ))}
    </TableBody>
  );
}

export default TableLoading;
