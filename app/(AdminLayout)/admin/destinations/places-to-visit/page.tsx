"use client";
import React, { useEffect, useState } from "react";
import PageTitle from "components/CMS/components-ui/PageTitle";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Button } from "components/CMS/components-ui/shadcn/ui/button";
import CustomTable from "components/CMS/components-ui/table";
import { Switch } from "components/CMS/components-ui/shadcn/ui/switch";
import { removeTags, tablePageSizeOptions, truncateText } from "lib/utils";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import {
  apiDeletePlace,
  apiGetAllPlaces,
  apiUpdatePlaceStatus,
} from "services/places";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/CMS/components-ui/shadcn/ui/table";
import TableLoading from "components/CMS/components-ui/table/tableLoading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/CMS/components-ui/shadcn/ui/tableAccordian";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { handleApiError } from "lib/api-helpers";
import { Menu } from "lucide-react";
import ActionButtons from "components/CMS/components-ui/table/actionButtons";
import Pagination from "components/CMS/components-ui/pagination";
import DeleteAlertDialog from "components/CMS/components-ui/deleteAlertDialog";
import useDebounce from "lib/useDebounce";
import { Input } from "components/CMS/components-ui/shadcn/ui/input";
import CustomSelect from "components/CMS/components-ui/form/select";
import { apiChangeSortPlacesService } from "services/planServices";

function PlacesToVisit() {
  const router = useRouter();
  const { toast } = useToast();
  const [placesData, setPlacesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [deleteRow, setDeleteRow] = useState<any>();
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(value, 500);
  const tableHeaderDestination = [
    {
      key: "name",
      name: "destination Name",
    },
  ];
  const tableHeader = [
    {
      key: "id",
      name: "id",
    },

    {
      key: "title",
      name: "Name",
      render: (value: string, row: any) => (
        <Link
          href={`/admin/destinations/places-to-visit/${row.id}`}
          className="underline underline-offset-[3px]"
        >
          {value}
        </Link>
      ),
    },

    {
      key: "description",
      name: "Description",
      render: (value: any, row: any) => truncateText(removeTags(value)),
    },

    {
      name: "Active",
      key: "isActive",
      render: (value: boolean, row: any, parentRow: any) => (
        <Switch
          checked={value}
          onCheckedChange={(value: any) => handleActive(value, row, parentRow)}
        />
      ),
    },
  ];
  useEffect(() => {
    handleSearch(value);
  }, [debouncedValue]);

  useEffect(() => {
    getAllPlaces();
  }, [pageSize, currentPage, searchValue]);

  const handleActive = async (value: boolean, row: any, parentRow: any) => {
    const id = Number(row.id);

    setPlacesData((prev: any) => {
      return prev.map((ele: any) => {
        if (parentRow.id === ele.id) {
          return {
            ...ele,
            placeToVisit: ele.placeToVisit.map((item: any) =>
              item.id === row.id ? { ...item, isActive: value } : item
            ),
          };
        } else return ele;
      });
    });
    const response = await apiUpdatePlaceStatus(id, { isActive: value });
    if (response.status === "success") {
      toast({
        title: `Place ${value ? "Active" : "In-Active"} Successfully`,
        variant: "success",
      });
    }
  };

  const getAllPlaces = async () => {
    setIsLoading(true);
    const response: any = await apiGetAllPlaces({
      pageSize: pageSize.toString(),
      pageNum: currentPage.toString(),
      searchParams: searchValue,
    });
    if (response?.status === "success") {
      setPlacesData(response.data);
      setCount(response.count);
      setIsLoading(false);
    }
  };

  const handleDelete = async (row: any, parentRow: any) => {
    const id = Number(row.id);
    const response = await apiDeletePlace(id);
    if (response.status === "success") {
      setPlacesData((prev: any) => {
        return prev.map((ele: any) => {
          if (parentRow.id === ele.id) {
            return {
              ...ele,
              placeToVisit: ele.placeToVisit.filter(
                (item: any) => item.id !== row.id
              ),
            };
          } else return ele;
        });
      });
      toast({
        title: "Place Deleted Successfully",
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

  const handleDragEnd = async (result: any, parentRow: any) => {
    if (!result.destination) {
      return;
    }
    const sortPosition = result.source.index - result.destination.index;

    const destinationItem: any = placesData.find(
      (ele: any) => ele.id === parentRow.id
    ).placeToVisit[result.destination.index];

    const newResult = Array.from([...placesData]).map((item: any) => {
      if (item.id === destinationItem.destinationId) {
        const draggedItem = item.placeToVisit.find(
          (ele: any) => ele.id === Number(result.draggableId)
        );

        const destinationPlaces = item.placeToVisit
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
          placeToVisit: destinationPlaces,
        };
      } else {
        return item;
      }
    });

    if (sortPosition) {
      try {
        setPlacesData(newResult);
        await apiChangeSortPlacesService({
          sourceId: Number(result.draggableId),
          sortPosition,
          destinationIdSortId: destinationItem.sortId,
          destinationId: destinationItem.destinationId,
        });

        toast({ title: "Place Sort Saved", variant: "success" });
      } catch (error: any) {
        handleApiError(error);
      }
    }
  };
  const actionHandles = {
    onDelete: handleDelete,
    onEdit: (row: any) => {
      router.push(`/admin/destinations/places-to-visit/${row.id}`);
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
  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle>Places To Visit</PageTitle>
        <Button
          className="flex items-center gap-1"
          onClick={() =>
            router.push("/admin/destinations/places-to-visit/create")
          }
        >
          <PlusIcon className="w-4 h-4" aria-hidden="true" />
          Create Place
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
              {placesData.map((row: any, i: number) => {
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
                                      {row?.placeToVisit?.map(
                                        (place: any, i: number) => {
                                          return (
                                            <Draggable
                                              key={place.id}
                                              draggableId={place.id.toString()}
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
                                                            place[heading.key],
                                                            place,
                                                            row
                                                          )}
                                                        </TableCell>
                                                      ) : (
                                                        <TableCell
                                                          key={j}
                                                          className={` text-white `}
                                                        >
                                                          {place[heading.key]}
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
                                                    row={place}
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
export default PlacesToVisit;
