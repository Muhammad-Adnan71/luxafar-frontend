import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TableLoading from "./tableLoading";
import { TableBody, TableCell, TableRow } from "../shadcn/ui/table";
import ActionButtons from "./actionButtons";
import { Menu } from "lucide-react";

function DraggableTable({
  isLoading,
  isActionButtons,
  tableHeadings,
  dataTable,
  actionHandles,
  handleDeleteAlert,
}: {
  isLoading: any;
  isActionButtons: any;
  tableHeadings: any;
  dataTable: any;
  actionHandles: any;
  handleDeleteAlert: any;
}) {
  return (
    <Droppable droppableId="droppable">
      {(provided: any, snapshot: any) => (
        <>
          {isLoading ? (
            <TableLoading
              tableIsDraggle={true}
              isActionButtons={isActionButtons}
              tableHeadings={tableHeadings}
            />
          ) : (
            <TableBody {...provided.droppableProps} ref={provided.innerRef}>
              {dataTable.map((row: any, i: number) => {
                return (
                  <Draggable
                    key={row.id}
                    draggableId={row.id.toString()}
                    index={i}
                  >
                    {(provided) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        key={i}
                        className="text-center  border-cms-primary-color dark:border-gray-800 w-full"
                      >
                        <TableCell className=" text-white w-3">
                          <Menu className="w-4" />
                        </TableCell>
                        {tableHeadings.map((heading: any, j: any) => {
                          return heading.render ? (
                            <TableCell key={j} className={` text-white`}>
                              {heading.render(row[heading.key], row)}
                            </TableCell>
                          ) : (
                            <TableCell key={j} className={` text-white `}>
                              {row[heading.key]}
                            </TableCell>
                          );
                        })}

                        {isActionButtons && (
                          <ActionButtons
                            actionHandles={actionHandles}
                            handleDeleteAlert={handleDeleteAlert}
                            row={row}
                          />
                        )}
                      </TableRow>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </TableBody>
          )}
        </>
      )}
    </Droppable>
  );
}

export default DraggableTable;
