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
  apiDeleteHolidayTypes,
  apiGetHolidayTypes,
  apiUpdateHolidayStatus,
} from "services/holidayTypes";
import { HolidayTypesResponse } from "lib/types";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";

function HolidayTypes() {
  const router = useRouter();
  const { toast } = useToast();

  const [holidayTypesData, setHolidayTypesData] = useState<
    HolidayTypesResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const tableHeader = [
    {
      key: "id",
      name: "id",
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
      name: "Active",
      key: "isActive",
      render: (value: boolean, row: any) => (
        <Switch
          checked={value}
          onCheckedChange={(value: any) => handleActive(value, row)}
        />
      ),
    },
  ];

  useEffect(() => {
    getAllHolidays();
  }, []);

  const getAllHolidays = async () => {
    setIsLoading(true);
    const response = await apiGetHolidayTypes();
    if (response?.status === "success") {
      setHolidayTypesData(response.data);
      setIsLoading(false);
    }
  };

  const handleActive = async (value: boolean, row: any) => {
    const id = Number(row.id);
    setHolidayTypesData((prev: any) => {
      return prev.map((item: any) =>
        row.id === item.id ? { ...item, isActive: value } : item
      );
    });

    const response = await apiUpdateHolidayStatus(id, { isActive: value });
    if (response.status === "success") {
      toast({
        title: `Holiday Type ${value ? "Active" : "In-Active"} Successfully`,
        variant: "success",
      });
    }
  };

  const handleDelete = async (row: any) => {
    const id = Number(row.id);
    const response = await apiDeleteHolidayTypes(id);
    if (response.status === "success") {
      setHolidayTypesData((prev) =>
        prev.filter((item) => item.id !== response.data.id)
      );
      toast({
        title: "Holiday Type Deleted Successfully",
        variant: "success",
      });
    }
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle classes="mb-1">Holiday Types</PageTitle>
        <Button
          className="flex items-center gap-1"
          onClick={() => router.push("/admin/holiday-types/create")}
        >
          <PlusIcon className="w-4 h-4" aria-hidden="true" />
          Create Holiday Type
        </Button>
      </div>
      <CustomTable
        isLoading={isLoading}
        tableContent={holidayTypesData}
        tableHeadings={tableHeader}
        isActionButtons={true}
        actionHandles={{
          onEdit: (row: any) => {
            router.push("/admin/holiday-types/" + row.id);
          },
          onDelete: (row: any) => handleDelete(row),
        }}
      />
    </>
  );
}
export default HolidayTypes;
