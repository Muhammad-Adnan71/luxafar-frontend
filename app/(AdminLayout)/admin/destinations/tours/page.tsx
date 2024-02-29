"use client";
import React, { useEffect, useState } from "react";
import PageTitle from "components/CMS/components-ui/PageTitle";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Button } from "components/CMS/components-ui/shadcn/ui/button";
import { Switch } from "components/CMS/components-ui/shadcn/ui/switch";
import { tablePageSizeOptions, truncateText } from "lib/utils";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import {
  apiChangeSortToursService,
  apiDeleteTour,
  apiGetAllTour,
  apiUpdateTourStatus,
} from "services/tour";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/CMS/components-ui/shadcn/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/CMS/components-ui/shadcn/ui/tableAccordian";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Menu } from "lucide-react";
import Pagination from "components/CMS/components-ui/pagination";
import ActionButtons from "components/CMS/components-ui/table/actionButtons";
import DeleteAlertDialog from "components/CMS/components-ui/deleteAlertDialog";
import { set } from "date-fns";
import { handleApiError } from "lib/api-helpers";
import TableLoading from "components/CMS/components-ui/table/tableLoading";
import CustomSelect from "components/CMS/components-ui/form/select";
import { Input } from "components/CMS/components-ui/shadcn/ui/input";
import useDebounce from "lib/useDebounce";

function Tours() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [destinationData, setDestinationData] = useState<any>([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [deleteRow, setDeleteRow] = useState<any>();
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(value, 500);

  const tableHeader = [
    {
      key: "id",
      name: "id",
    },

    {
      key: "title",
      name: "Title",
      render: (value: string, row: any) => (
        <Link
          href={`/admin/destinations/tours/${row.id}`}
          className="underline underline-offset-[3px]"
        >
          {value}
        </Link>
      ),
    },

    {
      key: "price",
      name: "Price",
      render: (value: any, row: any) => "$" + truncateText(value),
    },

    {
      key: "planDays",
      name: "No. Of Days",
      render: (value: any, row: any) => truncateText(value),
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
      name: "isFeatured",
      key: "isFeatured",
      render: (value: boolean, row: any, parentRow: any) => (
        <Switch
          checked={value}
          onCheckedChange={(value: any) =>
            handleIsFeatured(value, row, parentRow)
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
  useEffect(() => {
    handleSearch(value);
  }, [debouncedValue]);

  useEffect(() => {
    getAllTours();
  }, [pageSize, currentPage, searchValue]);

  const handleActive = async (value: boolean, row: any, parentRow: any) => {
    const id = Number(row.id);

    setDestinationData((prev: any) => {
      return prev.map((ele: any) => {
        if (parentRow.id === ele.id) {
          return {
            ...ele,
            tourDestinations: ele.tourDestinations.map((item: any) =>
              item.tour.id === row.id
                ? { ...item, tour: { ...item.tour, isActive: value } }
                : item
            ),
          };
        } else return ele;
      });
    });
    const response = await apiUpdateTourStatus(id, {
      isActive: value,
    });
    if (response.status === "success") {
      toast({
        title: `Tour ${value ? "Active" : "In-Active"} Successfully`,
        variant: "success",
      });
    }
  };
  const handleIsFeatured = async (value: boolean, row: any, parentRow: any) => {
    const id = Number(row.id);
    setDestinationData((prev: any) => {
      return prev.map((ele: any) => {
        if (parentRow.id === ele.id) {
          return {
            ...ele,
            tourDestinations: ele.tourDestinations.map((item: any) =>
              item.tour.id === row.id
                ? { ...item, tour: { ...item.tour, isFeatured: value } }
                : {
                    ...item,
                    tour: {
                      ...item.tour,
                      isFeatured: item.isFeatured ? false : item.isFeatured,
                    },
                  }
            ),
          };
        } else return ele;
      });
    });

    const response = await apiUpdateTourStatus(id, {
      isFeatured: value,
      destinationId: [parentRow.id],
    });
    if (response.status === "success") {
      toast({
        title: `Tour Featured ${value ? "Active" : "In-Active"} Successfully`,
        variant: "success",
      });
    }
  };
  const getAllTours = async () => {
    setIsLoading(true);
    const response: any = await apiGetAllTour({
      pageSize: pageSize.toString(),
      pageNum: currentPage.toString(),
      orderBy: "desc",
      searchParams: searchValue,
    });
    if (response?.status === "success") {
      setCount(response.count);
      setIsLoading(false);
      setDestinationData(response.data);
    }
  };
  const handleDelete = async (row: any, parentRow: any) => {
    const id = Number(row.id);
    const response = await apiDeleteTour(id);
    if (response.status === "success") {
      setDestinationData((prev: any) => {
        return prev.map((ele: any) => {
          if (parentRow.id === ele.id) {
            return {
              ...ele,
              tourDestinations: ele.tourDestinations.filter(
                (item: any) => item.tour.id !== row.id
              ),
            };
          } else return ele;
        });
      });
      toast({
        title: "Tour Deleted Successfully",
        variant: "success",
      });
    }
  };
  const handlePageSize = (value: number) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };
  const handlePagination = (value: number) => {
    setCurrentPage(value);
  };
  const handleSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };
  const actionHandles = {
    onDelete: handleDelete,
    onEdit: (row: any) => {
      router.push(`/admin/destinations/tours/${row.id}`);
    },
  };
  const handleContinueDelete = () => {
    actionHandles?.onDelete &&
      actionHandles.onDelete(deleteRow?.row, deleteRow?.parentRow);
  };
  const handleDeleteAlert = (row: any, parentRow: any) => {
    setOpenDeleteAlert(!openDeleteAlert);
    setDeleteRow({ row, parentRow });
  };
  const handleDragEnd = async (result: any, parentRow: any) => {
    if (!result.destination) {
      return;
    }
    const sortPosition = result.source.index - result.destination.index;

    const destinationItem: any = destinationData.find(
      (ele: any) => ele.id === parentRow.id
    ).tourDestinations[result.destination.index];

    const newResult = Array.from([...destinationData]).map((item: any) => {
      if (item.id === destinationItem.destinationId) {
        const draggedItem = item.tourDestinations.find(
          (ele: any) => ele.tourId === Number(result.draggableId)
        );

        const tourDestinations = item.tourDestinations
          .map((ele: any) => {
            if (ele.tourId === Number(result.draggableId)) {
              return {
                ...ele,
                tour: {
                  ...ele.tour,
                  sortId: Number(destinationItem?.tour?.sortId),
                },
              };
            } else if (
              sortPosition < 0 &&
              destinationItem?.tour?.sortId >= ele?.tour?.sortId &&
              draggedItem?.tour?.sortId <= ele?.tour?.sortId
            ) {
              return {
                ...ele,
                tour: {
                  ...ele.tour,
                  sortId: ele.tour?.sortId - 1,
                },
              };
            } else if (
              sortPosition > 0 &&
              draggedItem?.tour?.sortId >= ele?.tour?.sortId &&
              destinationItem?.tour?.sortId <= ele?.tour?.sortId
            ) {
              return {
                ...ele,
                tour: {
                  ...ele.tour,
                  sortId: ele.tour?.sortId + 1,
                },
              };
            } else return ele;
          })
          .sort((a: any, b: any) => a?.tour.sortId - b?.tour?.sortId);

        return {
          ...item,
          tourDestinations: tourDestinations,
        };
      } else {
        return item;
      }
    });

    if (sortPosition) {
      try {
        setDestinationData(newResult);
        await apiChangeSortToursService({
          sourceId: Number(result.draggableId),
          sortPosition,
          destinationIdSortId: destinationItem.tour.sortId,
          destinationId: destinationItem.destinationId,
        });

        toast({ title: "Tour Sort Saved", variant: "success" });
      } catch (error: any) {
        handleApiError(error);
      }
    }
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle>Tours</PageTitle>
        <Button
          className="flex items-center gap-1"
          onClick={() => router.push("/admin/destinations/tours/create")}
        >
          <PlusIcon className="w-4 h-4" aria-hidden="true" />
          Create Tour
        </Button>
      </div>
      <div className="flex justify-between ">
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
              {destinationData.map((row: any, i: number) => {
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
                                      {row.tourDestinations?.map(
                                        ({ tour }: any, i: number) => {
                                          return (
                                            <Draggable
                                              key={tour.id}
                                              draggableId={tour.id.toString()}
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
                                                            tour[heading.key],
                                                            tour,
                                                            row
                                                          )}
                                                        </TableCell>
                                                      ) : (
                                                        <TableCell
                                                          key={j}
                                                          className={` text-white `}
                                                        >
                                                          {tour[heading.key]}
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
                                                    row={tour}
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
}
export default Tours;
