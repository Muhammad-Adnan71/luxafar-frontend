"use client";
import React, { useEffect, useState } from "react";
import PageTitle from "components/CMS/components-ui/PageTitle";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Button } from "components/CMS/components-ui/shadcn/ui/button";
import CustomTable from "components/CMS/components-ui/table";
import { Switch } from "components/CMS/components-ui/shadcn/ui/switch";

import { removeTags, truncateText } from "lib/utils";
import {
  apiDestinationsDelete,
  apiGetAllDestinationService,
  apiUpdateDestinationStatus,
} from "services/destination";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";

function Destinations() {
  const { toast } = useToast();

  const router = useRouter();
  const [destinationData, setDestinationData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    apiGetAllDestination();
  }, [pageSize, currentPage, searchValue]);

  const apiGetAllDestination = async () => {
    setIsLoading(true);
    const response = await apiGetAllDestinationService({
      pageSize: pageSize.toString(),
      pageNum: currentPage.toString(),
      searchParams: searchValue,
    });
    if (response?.status === "success") {
      setDestinationData(response.data);
      setCount(response.count);
      setIsLoading(false);
    }
  };
  const tableHeader = [
    {
      key: "id",
      name: "id",
    },

    {
      key: "image",
      name: "Image",
      render: (value: string, row: any) => (
        <div className="h-16 w-16  mx-auto">
          <img src={value} alt="" className=" object-cover w-full h-full" />
        </div>
      ),
    },
    {
      key: "name",
      name: "Name",
    },

    {
      key: "description",
      name: "Description",
      render: (value: any, row: any) => truncateText(removeTags(value)),
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
  ];
  const handlePageSize = (value: number) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };
  const handlePagination = (value: number) => {
    setCurrentPage(value);
  };

  const handleDelete = async (row: any) => {
    const id = Number(row.id);
    const response = await apiDestinationsDelete(id);
    if (response.status === "success") {
      setDestinationData((prev) =>
        prev.filter((item: any) => item.id !== response.data.id)
      );
      toast({
        title: "Destination Deleted Successfully",
        variant: "success",
      });
    }
  };
  const handleActive = async (value: boolean, row: any) => {
    const id = Number(row.id);
    setDestinationData((prev: any) => {
      return prev.map((item: any) =>
        row.id === item.id ? { ...item, isActive: value } : item
      );
    });

    const response = await apiUpdateDestinationStatus(id, { isActive: value });
    if (response.status === "success") {
      toast({
        title: `Destination ${value ? "Active" : "In-Active"} Successfully`,
        variant: "success",
      });
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle>Destinations</PageTitle>
        <Button
          className="flex items-center gap-1"
          onClick={() => router.push("/admin/destinations/create")}
        >
          <PlusIcon className="w-4 h-4" aria-hidden="true" />
          Create Destination
        </Button>
      </div>
      <CustomTable
        onSearch={handleSearch}
        onPagination={handlePagination}
        currentPage={currentPage}
        count={count}
        onPageSize={handlePageSize}
        pageSize={pageSize}
        isLoading={isLoading}
        tableContent={destinationData}
        tableHeadings={tableHeader}
        isActionButtons={true}
        actionHandles={{
          onEdit: (row: any) => {
            router.push("/admin/destinations/" + row.id);
          },
          onDelete: (row: any) => handleDelete(row),
        }}
      />
    </>
  );
}
export default Destinations;
