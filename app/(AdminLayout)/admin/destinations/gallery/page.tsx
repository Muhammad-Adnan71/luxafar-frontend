"use client";
import React, { useEffect, useState } from "react";
import PageTitle from "components/CMS/components-ui/PageTitle";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Button } from "components/CMS/components-ui/shadcn/ui/button";
import CustomTable from "components/CMS/components-ui/table";
import { apiGetGallery } from "services/gallery";

function Gallery() {
  const router = useRouter();
  const [destinationWithGalleryData, setDestinationWithGallery] = useState<any>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const tableHeader = [
    {
      key: "id",
      name: "id",
    },

    {
      key: "name",
      name: "destination",
      render: (value: string, row: any) => (
        <Link
          href={`/admin/destinations/gallery/${row.id}`}
          className="underline underline-offset-[3px]"
        >
          {value}
        </Link>
      ),
    },

    {
      key: "noOfImages",
      name: "no of Images",
    },
  ];
  useEffect(() => {
    getAllDestinationWithGallery();
  }, [pageSize, currentPage, searchValue]);

  const getAllDestinationWithGallery = async () => {
    setIsLoading(true);
    const response = await apiGetGallery({
      pageSize: pageSize.toString(),
      pageNum: currentPage.toString(),
      searchParams: searchValue,
    });
    if (response?.status === "success") {
      setDestinationWithGallery(response.data);
      setCount(response.count);
      setIsLoading(false);
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
  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle>Gallery</PageTitle>
        <Button
          className="flex items-center gap-1"
          onClick={() => router.push("/admin/destinations/gallery/create")}
        >
          <PlusIcon className="w-4 h-4" aria-hidden="true" />
          Create Gallery
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
        tableContent={destinationWithGalleryData}
        tableHeadings={tableHeader}
        isActionButtons={true}
        actionHandles={{
          onEdit: (row: any) => {
            router.push("/admin/destinations/gallery/" + row.id);
          },
        }}
      />
    </>
  );
}
export default Gallery;
