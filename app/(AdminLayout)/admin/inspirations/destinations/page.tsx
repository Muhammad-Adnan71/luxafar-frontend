"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/CMS/components-ui/shadcn/ui/table";
import { Switch } from "components/CMS/components-ui/shadcn/ui/switch";
import CustomTable from "components/CMS/components-ui/table";
import { InspirationResponse } from "lib/types";
import TableLoading from "components/CMS/components-ui/table/tableLoading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/CMS/components-ui/shadcn/ui/tableAccordian";

import { removeTags, tablePageSizeOptions, truncateText } from "lib/utils";
import {
  apiChangeSortInspirationsService,
  apiDeleteInspiration,
  apiGenerateRssFeed,
  apiGetAllInspirations,
  apiUpdateInspirationStatus,
} from "services/inspirations";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Menu } from "lucide-react";
import ActionButtons from "components/CMS/components-ui/table/actionButtons";
import Pagination from "components/CMS/components-ui/pagination";
import DeleteAlertDialog from "components/CMS/components-ui/deleteAlertDialog";
import { Input } from "components/CMS/components-ui/shadcn/ui/input";
import CustomSelect from "components/CMS/components-ui/form/select";
import { apiChangeSortPlacesService } from "services/planServices";
import { handleApiError } from "lib/api-helpers";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import { apiGetNewInspiration } from "services/sitemap";
import { useRouter } from "next/navigation";
import useDebounce from "lib/useDebounce";

const Inspiration = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [value, setValue] = useState<string>("");

  const [inspirations, setInspirationsData] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteRow, setDeleteRow] = useState<any>();
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [count, setCount] = useState(0);
  const debouncedValue = useDebounce<string>(value, 500);

  const handleFeatured = async (value: boolean, row: any, parentRow: any) => {
    const id = Number(row.id);

    setInspirationsData((prev: any) => {
      return prev.map((ele: any) => {
        if (parentRow.id === ele.id) {
          return {
            ...ele,
            inspirations: ele.inspirations.map((item: any) =>
              item.id === row.id
                ? { ...item, isFeatured: value }
                : {
                    ...item,
                    isFeatured: item.isFeatured ? false : item.isFeatured,
                  }
            ),
          };
        } else return ele;
      });
    });
    const response = await apiUpdateInspirationStatus(id, {
      isFeatured: value,
      destinationId: row.destinationId,
    });
    if (response.status === "success") {
      toast({
        title: `Inspiration ${value ? "Featured" : "unFeatured"} Successfully`,
        variant: "success",
      });
    }
  };

  const tableHeader = [
    {
      key: "id",
      name: "id",
    },
    {
      key: "title",
      name: "title",
      render: (value: any, row: any) => truncateText(value),
    },
    {
      key: "description",
      name: "description",
      render: (value: any, row: any) => truncateText(removeTags(value)),
    },

    {
      key: "holidayType",
      name: "HolidayType",
      render: (value: any, row: any) =>
        row?.holidayType?.map((item: any) => item.name).toString(),
    },

    {
      name: "Active ",
      key: "isActive",
      render: (value: boolean, row: any, parentRow: any) => (
        <Switch
          checked={value}
          onCheckedChange={(value: any) => handleActive(value, row, parentRow)}
        />
      ),
    },
    {
      name: "Featured",
      key: "isFeatured",
      render: (value: boolean, row: any, parentRow: any) => (
        <Switch
          checked={value}
          onCheckedChange={(value: any) =>
            handleFeatured(value, row, parentRow)
          }
        />
      ),
    },
  ];
  const tableHeaderDestination = [
    {
      key: "name",
      name: "destination Name",
    },
  ];
  const handlePageSize = (value: number) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };
  const handlePagination = (value: number) => {
    setCurrentPage(value);
  };
  const handleDeleteAlert = (row: any, parentRow: any) => {
    setOpenDeleteAlert(!openDeleteAlert);
    setDeleteRow({ row, parentRow });
  };
  const handleDelete = async (row: any, parentRow: any) => {
    const id = Number(row.id);
    const response = await apiDeleteInspiration(id);
    if (response.status === "success") {
      setInspirationsData((prev: any) => {
        return prev.map((ele: any) => {
          if (parentRow.id === ele.id) {
            return {
              ...ele,
              inspirations: ele.inspirations.filter(
                (item: any) => item.id !== row.id
              ),
            };
          } else return ele;
        });
      });
      const newInspirationResponse = await apiGetNewInspiration();
      await apiGenerateRssFeed(newInspirationResponse.data);
      toast({
        title: "Inspiration Deleted Successfully",
        variant: "success",
      });
    }
  };
  const actionHandles = {
    onDelete: handleDelete,
    onEdit: (row: any) => {
      router.push(`/admin/inspirations/${row.id}`);
    },
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };
  const handleActive = async (value: boolean, row: any, parentRow: any) => {
    const id = Number(row.id);

    setInspirationsData((prev: any) => {
      return prev.map((ele: any) => {
        if (parentRow.id === ele.id) {
          return {
            ...ele,
            inspirations: ele.inspirations.map((item: any) =>
              item.id === row.id ? { ...item, isActive: value } : item
            ),
          };
        } else return ele;
      });
    });
    const response = await apiUpdateInspirationStatus(id, { isActive: value });
    if (response.status === "success") {
      const newInspirationResponse = await apiGetNewInspiration();
      await apiGenerateRssFeed(newInspirationResponse.data);
      toast({
        title: `Inspiration ${value ? "Active" : "In-Active"} Successfully`,
        variant: "success",
      });
    }
  };
  const handleContinueDelete = () => {
    actionHandles?.onDelete &&
      actionHandles.onDelete(deleteRow?.row, deleteRow?.parentRow);
  };

  const handleDragEnd = async (result: any, parentRow: any) => {
    if (!result.destination) {
      return;
    }
    const sortPosition = result.source.index - result.destination.index;

    const destinationItem: any = inspirations.find(
      (ele: any) => ele.id === parentRow.id
    ).inspirations[result.destination.index];

    const newResult = Array.from([...inspirations]).map((item: any) => {
      if (item.id === destinationItem.destinationId) {
        const draggedItem = item.inspirations.find(
          (ele: any) => ele.id === Number(result.draggableId)
        );

        const destinationInspirations = item.inspirations
          .map((ele: any) => {
            if (ele.id === Number(result.draggableId)) {
              return {
                ...ele,
                sortId: Number(destinationItem?.sortId),
              };
            } else if (
              sortPosition < 0 &&
              destinationItem?.sortId >= ele?.sortId &&
              draggedItem?.sortId <= ele?.sortId
            ) {
              return {
                ...ele,
                sortId: ele?.sortId - 1,
              };
            } else if (
              sortPosition > 0 &&
              draggedItem?.sortId >= ele?.sortId &&
              destinationItem?.sortId <= ele?.sortId
            ) {
              return {
                ...ele,
                sortId: ele?.sortId + 1,
              };
            } else return ele;
          })
          .sort((a: any, b: any) => a?.sortId - b?.sortId);

        return {
          ...item,
          inspirations: destinationInspirations,
        };
      } else {
        return item;
      }
    });

    if (sortPosition) {
      try {
        setInspirationsData(newResult);
        await apiChangeSortInspirationsService({
          sourceId: Number(result.draggableId),
          sortPosition,
          destinationIdSortId: destinationItem.sortId,
          destinationId: destinationItem.destinationId,
        });

        toast({ title: "Inspiration Sort Saved", variant: "success" });
      } catch (error: any) {
        handleApiError(error);
      }
    }
  };
  const getAllInspiration = async () => {
    setIsLoading(true);
    const response = await apiGetAllInspirations({
      pageSize: pageSize.toString(),
      pageNum: currentPage.toString(),
      searchParams: searchValue,
      groupBy: "destination",
    });
    if (response?.status === "success") {
      setInspirationsData(response.data);
      setCount(response.count);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(value);
  }, [debouncedValue]);

  useEffect(() => {
    getAllInspiration();
  }, [pageSize, currentPage, searchValue]);
  return (
    <>
      <div className="flex mt-2 justify-between ">
        <Input
          placeholder="Search"
          className="w-[200px] text-[14px] placeholder:text-[14px]"
          onChange={(e) => setValue(e.target.value)}
        />
        <div className=" flex w-[120px] ml-auto ">
          <CustomSelect
            onChange={handlePageSize}
            options={tablePageSizeOptions}
            placeholder="Page Size"
            name=""
            value={pageSize?.toString()}
            classes="py-2 text-[12px] mb-2"
          />
        </div>
      </div>
      <div className="mb-10">
        <Table className="relative ">
          <TableHeader className="bg-cms-primary-color dark:bg-gray-800">
            <tr className="text-center  border-cms-primary-color dark:border-gray-800">
              {tableHeaderDestination.map((column: any, index: number) => (
                <TableCell
                  key={index}
                  className="capitalize text-white text-left px-5"
                >
                  {column.name}
                </TableCell>
              ))}
            </tr>
          </TableHeader>
          {isLoading ? (
            <TableLoading tableHeadings={tableHeaderDestination} />
          ) : (
            <TableBody>
              {inspirations.map((row: any, i: number) => {
                return (
                  <TableRow
                    key={i}
                    className="text-center  border-cms-primary-color dark:border-gray-800 "
                  >
                    <td colSpan={tableHeader.length}>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" className="border-1">
                          <AccordionTrigger className="px-5 text-white capitalize">
                            {row?.name}
                          </AccordionTrigger>
                          <AccordionContent>
                            <DragDropContext
                              onDragEnd={(result) => handleDragEnd(result, row)}
                            >
                              <Table>
                                <TableHeader className="bg-[#03191f] dark:bg-gray-800  w-full">
                                  <tr className="text-center  border-cms-primary-color dark:border-gray-800 ">
                                    <TableCell className="capitalize text-white"></TableCell>

                                    {tableHeader.map(
                                      (column: any, index: number) => (
                                        <>
                                          <TableCell
                                            key={index}
                                            className="capitalize text-white"
                                          >
                                            {column.name}
                                          </TableCell>
                                        </>
                                      )
                                    )}
                                    <TableCell className="capitalize text-white">
                                      Actions
                                    </TableCell>
                                  </tr>
                                </TableHeader>
                                <Droppable droppableId={"droppable" + i}>
                                  {(provided: any, snapshot: any) => (
                                    <TableBody
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                    >
                                      {row?.inspirations?.map(
                                        (inspiration: any, i: number) => {
                                          return (
                                            <Draggable
                                              key={inspiration.id}
                                              draggableId={inspiration.id.toString()}
                                              index={i}
                                            >
                                              {(provided: any) => (
                                                <TableRow
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  key={i}
                                                  className="text-center  border-cms-primary-color dark:border-gray-800 w-full  bg-[#03191f] dark:bg-gray-800"
                                                >
                                                  <TableCell className=" text-white w-3">
                                                    <Menu className="w-4" />
                                                  </TableCell>
                                                  {tableHeader.map(
                                                    (heading: any, j: any) => {
                                                      return heading.render ? (
                                                        <TableCell
                                                          key={j}
                                                          className={` text-white`}
                                                        >
                                                          {heading.render(
                                                            inspiration[
                                                              heading.key
                                                            ],
                                                            inspiration,
                                                            row
                                                          )}
                                                        </TableCell>
                                                      ) : (
                                                        <TableCell
                                                          key={j}
                                                          className={` text-white `}
                                                        >
                                                          {
                                                            inspiration[
                                                              heading.key
                                                            ]
                                                          }
                                                        </TableCell>
                                                      );
                                                    }
                                                  )}
                                                  <ActionButtons
                                                    actionHandles={
                                                      actionHandles
                                                    }
                                                    handleDeleteAlert={
                                                      handleDeleteAlert
                                                    }
                                                    row={inspiration}
                                                    parentRow={row}
                                                  />
                                                </TableRow>
                                              )}
                                            </Draggable>
                                          );
                                        }
                                      )}
                                      {provided.placeholder}
                                    </TableBody>
                                  )}
                                </Droppable>
                              </Table>
                            </DragDropContext>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </td>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
        {count && pageSize && count > pageSize ? (
          <Pagination
            onPagination={(currentPage: number) =>
              handlePagination(currentPage)
            }
            totalResults={count}
            resultsPerPage={pageSize}
            currentPage={currentPage}
          />
        ) : (
          ""
        )}
        <DeleteAlertDialog
          openDeleteAlert={openDeleteAlert}
          handleContinueDelete={handleContinueDelete}
          handleDeleteAlert={() => setOpenDeleteAlert(!openDeleteAlert)}
        />
      </div>
    </>
  );
};

export default Inspiration;
