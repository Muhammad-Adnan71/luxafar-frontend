"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../shadcn/ui/table";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import Pagination from "../pagination";
import CustomSelect from "../form/select";
import { Input } from "../shadcn/ui/input";
import useDebounce from "lib/useDebounce";
import { Menu } from "lucide-react";
import DeleteAlertDialog from "../deleteAlertDialog";
import { tablePageSizeOptions } from "lib/utils";
import { ISTableContent } from "lib/types";
import TableLoading from "./tableLoading";
import ActionButtons from "./actionButtons";
import DraggableTable from "./draggableTable";

function CustomTable({
  tableHeadings,
  currentPage,
  tableContent,
  isActionButtons,
  actionHandles,
  onDragEnd,
  isLoading,
  isPaginationEnable = true,
  isPageSizeEnable = true,
  isDraggable,
  pageSize,
  onPagination,
  onPageSize,
  count,
  onSearch,
}: ISTableContent) {
  const [pageTable, setPageTable] = useState(1);
  const [dataTable, setDataTable] = useState<any>([]);
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(value, 500);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [deleteRow, setDeleteRow] = useState();

  const resultsPerPage = pageSize;
  const totalResults = count;

  useEffect(() => {
    if (tableContent?.length) setDataTable(tableContent);
    else setDataTable([]);
  }, [pageTable, tableContent, pageSize]);

  useEffect(() => {
    onSearch && onSearch(value);
  }, [debouncedValue]);

  const handleDeleteAlert = (row: any) => {
    setOpenDeleteAlert(!openDeleteAlert);
    setDeleteRow(row);
  };
  const handleContinueDelete = () => {
    actionHandles?.onDelete && actionHandles.onDelete(deleteRow);
  };
  return (
    <div>
      <div className="flex justify-between ">
        {onSearch && (
          <Input
            placeholder="Search"
            className="w-[200px] text-[14px] placeholder:text-[14px]"
            onChange={(e) => setValue(e.target.value)}
          />
        )}
        {isPageSizeEnable && (
          <div className=" flex w-[120px] ml-auto ">
            <CustomSelect
              onChange={onPageSize}
              options={tablePageSizeOptions}
              placeholder="Page Size"
              name=""
              value={pageSize?.toString()}
              classes="py-2 text-[12px] mb-2"
            />
          </div>
        )}
      </div>
      <DragDropContext onDragEnd={(result) => onDragEnd && onDragEnd(result)}>
        <div className="mb-8">
          <Table className="relative">
            <TableHeader className="bg-cms-primary-color dark:bg-gray-800">
              <tr className="text-center  border-cms-primary-color dark:border-gray-800">
                {isDraggable && (
                  <TableCell className="capitalize text-white"></TableCell>
                )}
                {tableHeadings.map((column: any, index: number) => (
                  <TableCell key={index} className="capitalize text-white">
                    {column.name}
                  </TableCell>
                ))}
                {isActionButtons && (
                  <TableCell className="capitalize text-white">
                    Actions
                  </TableCell>
                )}
              </tr>
            </TableHeader>

            {isDraggable ? (
              <DraggableTable
                isLoading={isLoading}
                dataTable={dataTable}
                tableHeadings={tableHeadings}
                isActionButtons={isActionButtons}
                actionHandles={actionHandles}
                handleDeleteAlert={handleDeleteAlert}
              />
            ) : (
              <>
                {isLoading ? (
                  <TableLoading
                    isActionButtons={isActionButtons}
                    tableHeadings={tableHeadings}
                  />
                ) : (
                  <TableBody>
                    {dataTable.map((row: any, i: number) => {
                      return (
                        <TableRow
                          key={i}
                          className="text-center  border-cms-primary-color dark:border-gray-800"
                        >
                          {tableHeadings.map((heading: any, j: any) => {
                            return heading.render ? (
                              <TableCell
                                key={j}
                                className="capitalize text-white"
                              >
                                {heading.render(row[heading.key], row)}
                              </TableCell>
                            ) : (
                              <TableCell
                                key={j}
                                className="capitalize text-white"
                              >
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
                      );
                    })}
                  </TableBody>
                )}
              </>
            )}
          </Table>
          {isPaginationEnable &&
          tableContent &&
          totalResults &&
          pageSize &&
          totalResults > pageSize ? (
            <Pagination
              onPagination={(currentPage: number) =>
                onPagination && onPagination(currentPage)
              }
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              currentPage={currentPage}
            />
          ) : (
            ""
          )}
        </div>
      </DragDropContext>
      <DeleteAlertDialog
        openDeleteAlert={openDeleteAlert}
        handleContinueDelete={handleContinueDelete}
        handleDeleteAlert={() => setOpenDeleteAlert(!openDeleteAlert)}
      />
    </div>
  );
}

export default CustomTable;
