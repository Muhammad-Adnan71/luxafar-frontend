"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "components/CMS/components-ui/shadcn/ui/switch";
import PageTitle from "components/CMS/components-ui/PageTitle";
import { Button } from "components/CMS/components-ui/shadcn/ui/button";
import { PlusIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { removeTags, tablePageSizeOptions, truncateText } from "lib/utils";
import {
  apiChangeSortInspirationsService,
  apiDeleteInspiration,
  apiGenerateRssFeed,
  apiGetAllInspirations,
  apiUpdateInspirationStatus,
} from "services/inspirations";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import { apiGetNewInspiration } from "services/sitemap";
import { handleApiError } from "lib/api-helpers";
import useDebounce from "lib/useDebounce";
import CustomTable from "components/CMS/components-ui/table";
import { InspirationResponse } from "lib/types";

function Inspirations() {
  const router = useRouter();
  const { toast } = useToast();

  const [inspirations, setInspirationsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(value, 500);

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
      render: (value: boolean, row: any) => (
        <Switch
          checked={value}
          onCheckedChange={(value: any) => handleActive(value, row)}
        />
      ),
    },
    {
      name: "Featured ",
      key: "isFeatured",
      render: (value: boolean, row: any) => (
        <Switch
          checked={value}
          onCheckedChange={(value: any) => handleFeatured(value, row)}
        />
      ),
    },
  ];

  useEffect(() => {
    handleSearch(value);
  }, [debouncedValue]);

  useEffect(() => {
    getAllInspiration();
  }, [pageSize, currentPage, searchValue]);

  const getAllInspiration = async () => {
    setIsLoading(true);
    const response = await apiGetAllInspirations({
      pageSize: pageSize.toString(),
      pageNum: currentPage.toString(),
      searchParams: searchValue,
    });
    if (response?.status === "success") {
      setInspirationsData(response.data);
      setCount(response.count);
      setIsLoading(false);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      const response = await apiDeleteInspiration(id);
      setInspirationsData((prev) =>
        prev.filter((item) => item.id !== response.data.id)
      );
      toast({
        title: "Inspiration Deleted Successfully",
        variant: "success",
      });
    } catch (error: any) {
      handleApiError(error);
    }
  };
  const handleActive = async (value: boolean, row: any) => {
    try {
      const id = Number(row.id);
      setInspirationsData((prev: any) => {
        return prev.map((item: any) =>
          row.id === item.id ? { ...item, isActive: value } : item
        );
      });
      const { media, ...rest } = row;
      await apiUpdateInspirationStatus(id, { ...rest, isActive: value });
      toast({
        title: `Inspiration ${value ? "Active" : "In-Active"} Successfully`,
        variant: "success",
      });
    } catch (error: any) {
      handleApiError(error);
    }
  };
  const handleFeatured = async (value: boolean, row: any) => {
    try {
      const id = Number(row.id);
      setInspirationsData((prev: any) => {
        return prev.map((item: any) =>
          row.id === item.id ? { ...item, isFeatured: value } : item
        );
      });
      const { media, ...rest } = row;
      await apiUpdateInspirationStatus(id, { ...rest, isFeatured: value });
      toast({
        title: `Inspiration ${value ? "Featured" : "unFeatured"} Successfully`,
        variant: "success",
      });
    } catch (error: any) {
      handleApiError(error);
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
  const handleDragEnd = async (result: any) => {
    if (!result.destination) {
      return;
    }
    const sortPosition = result.source.index - result.destination.index;
    const destinationItem: InspirationResponse =
      inspirations[result.destination.index];

    const draggedItem: InspirationResponse = inspirations.find(
      (ele) => ele.id === Number(result.draggableId)
    )!;

    const inspiration = inspirations
      .map((ele: any) => {
        if (ele.id === Number(result.draggableId)) {
          return {
            ...ele,
            inspirationSortId: Number(destinationItem.inspirationSortId),
          };
        } else if (
          sortPosition < 0 &&
          draggedItem?.inspirationSortId >= ele?.inspirationSortId &&
          destinationItem?.inspirationSortId <= ele?.inspirationSortId
        ) {
          return {
            ...ele,
            inspirationSortId: ele.inspirationSortId + 1,
          };
        } else if (
          sortPosition > 0 &&
          destinationItem?.inspirationSortId >= ele?.inspirationSortId &&
          draggedItem?.inspirationSortId <= ele?.inspirationSortId
        ) {
          return {
            ...ele,
            inspirationSortId: ele.inspirationSortId - 1,
          };
        } else return ele;
      })
      .sort((a, b) => b.inspirationSortId - a.inspirationSortId);

    const destinationIdSortId = Number(destinationItem.inspirationSortId);
    if (sortPosition) {
      try {
        setInspirationsData(inspiration as InspirationResponse[]);
        await apiChangeSortInspirationsService({
          inspirationPageSort: true,
          sourceId: Number(result.draggableId),
          sortPosition,
          destinationIdSortId,
        });

        toast({ title: "Inspiration Sort Saved", variant: "success" });
      } catch (error: any) {
        handleApiError(error);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle classes="mb-1">Inspirations</PageTitle>
        <div className="flex items-center gap-5">
          <Button
            className="flex items-center gap-1"
            onClick={() => {
              router.push("/admin/inspirations/create");
            }}
          >
            <PlusIcon className="w-4 h-4" aria-hidden="true" />
            Create Inspiration
          </Button>
          <Button
            className="flex items-center gap-1"
            onClick={() => {
              router.push("/admin/inspirations/destinations");
            }}
          >
            <HamburgerMenuIcon className="w-4 h-4" aria-hidden="true" />
            Sort By Destination
          </Button>
        </div>
      </div>
      <CustomTable
        isDraggable
        onDragEnd={handleDragEnd}
        onSearch={handleSearch}
        onPagination={handlePagination}
        currentPage={currentPage}
        count={count}
        onPageSize={handlePageSize}
        pageSize={pageSize}
        isLoading={isLoading}
        tableContent={inspirations}
        tableHeadings={tableHeader}
        isActionButtons={true}
        actionHandles={{
          onEdit: (row: any) => {
            router.push("/admin/inspirations/" + row.id);
          },
          onDelete: (row: any) => handleDelete(row.id),
        }}
      />
    </>
  );
}
export default Inspirations;
