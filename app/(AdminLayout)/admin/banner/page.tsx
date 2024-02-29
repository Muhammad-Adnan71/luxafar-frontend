"use client";
import React, { useState, useEffect } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import CustomTable from "components/CMS/components-ui/table";
import PageTitle from "components/CMS/components-ui/PageTitle";
import { Button } from "components/CMS/components-ui/shadcn/ui/button";
import { Switch } from "components/CMS/components-ui/shadcn/ui/switch";
import { pageLinkRemoveExtraSpaces, removeTags, truncateText } from "lib/utils";
import {
  apiDeleteBanner,
  apiGetAllBanner,
  apiPutBanner,
} from "services/banners";
import { BannerResponse } from "lib/types";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import Image from "next/image";
import { handleApiError } from "lib/api-helpers";

function Banners() {
  const [bannerData, setBannerData] = useState<BannerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

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
          <img
            src={row?.media?.desktopMediaUrl ?? row?.media?.mobileMediaUrl}
            alt=""
            className=" object-cover w-full h-full"
          />
        </div>
      ),
    },
    {
      key: "title",
      name: "title",
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
        <>
          <Switch
            checked={value}
            onCheckedChange={(value: any) => handleActive(value, row)}
          />
        </>
      ),
    },
  ];

  const handleActive = async (value: boolean, row: any) => {
    try {
      const id = Number(row.id);
      setBannerData((prev: any) => {
        return prev.map((item: any) =>
          row.id === item.id ? { ...item, isActive: value } : item
        );
      });
      const { media, ...rest } = row;
      await apiPutBanner(id, { ...rest, isActive: value });

      toast({
        title: `Slide  ${value ? "Active" : "In-Active"} Successfully`,
        variant: "success",
      });
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const handleDelete = async (row: any) => {
    try {
      const response = await apiDeleteBanner(row.id);
      setBannerData((prev) =>
        prev.filter((item) => item.id !== response.data.id)
      );
      toast({
        title: "Banner Delete Successfully",
        variant: "success",
      });
    } catch (error: any) {
      handleApiError(error);
    }
  };
  const apiGetAllBanners = async () => {
    setIsLoading(true);
    const response = await apiGetAllBanner();

    if (response?.status === "success") {
      setBannerData(response.data);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    apiGetAllBanners();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle classes="mb-1">Banner Slides</PageTitle>
        <Button
          className="flex items-center gap-1"
          onClick={() => router.push("/admin/banner/create")}
        >
          <PlusIcon className="w-4 h-4" aria-hidden="true" />
          Create Slide
        </Button>
      </div>
      <CustomTable
        isLoading={isLoading}
        tableContent={bannerData}
        tableHeadings={tableHeader}
        isActionButtons={true}
        actionHandles={{
          onEdit: (row: any) => {
            router.push(
              pageLinkRemoveExtraSpaces(row.page_name, row.id, "banner")
            );
          },
          onDelete: (row: any) => handleDelete(row),
        }}
      />
    </>
  );
}
export default Banners;
