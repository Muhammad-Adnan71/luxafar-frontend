"use client";
import React, { useEffect, useState } from "react";
import PageTitle from "components/CMS/components-ui/PageTitle";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "components/CMS/components-ui/shadcn/ui/button";
import CustomTable from "components/CMS/components-ui/table";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";

import {
  apiChangeSortPartnersService,
  apiDeletePartners,
  apiGetAllPartners,
  apiPutPartners,
} from "services/partners";
import { PartnersResponse } from "lib/types";
import { Switch } from "components/CMS/components-ui/shadcn/ui/switch";
import CreatePartners from "components/CMS/side-drawers/createPartners";
import { reorder } from "lib/utils";
import { handleApiError } from "lib/api-helpers";

function Partners() {
  const [partnersData, setPartnersData] = useState<PartnersResponse[]>([]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [modalState, setModalState] = useState({
    isOpen: false,
    isEdit: false,
  });

  const [selectedRow, setSelectedRow] = useState();
  useEffect(() => {
    getPartnersData();
  }, []);

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
      name: "Active ",
      key: "isActive",
      render: (value: boolean, row: any) => (
        <Switch
          checked={value}
          onCheckedChange={(value: any) => handleActivePartners(value, row)}
        />
      ),
    },
  ];
  const getPartnersData = async () => {
    setIsLoading(true);
    const response = await apiGetAllPartners();
    setPartnersData(response.data);
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await apiDeletePartners(id);
      setPartnersData((prev) =>
        prev.filter((item) => item.id !== response.data.id)
      );
      toast({
        title: "Partners Delete Successfully",
        variant: "success",
      });
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const handleActivePartners = async (value: boolean, row: any) => {
    try {
      const id = Number(row.id);
      setPartnersData((prev: any) => {
        return prev.map((item: any) =>
          row.id === item.id ? { ...item, isActive: value } : item
        );
      });
      const { media, ...rest } = row;
      await apiPutPartners(id, { ...rest, isActive: value });
      toast({
        title: `Partners ${value ? "Active" : "In-Active"} Successfully`,
        variant: "success",
      });
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const resetModalState = () => {
    setModalState((prev) => ({
      isEdit: false,
      isOpen: false,
    }));
  };

  const handleOnCreate = (partnersData: any) => {
    resetModalState();
    setPartnersData((prev) => [partnersData, ...prev]);
  };

  const handleOnEdit = (partnersData: any) => {
    resetModalState();
    setPartnersData((prev) =>
      prev.map((partner: any) => {
        if (partner.id === partnersData.id) return partnersData;
        else return partner;
      })
    );
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) {
      return;
    }
    const sortPosition = result.source.index - result.destination.index;
    const destinationItem: PartnersResponse =
      partnersData[result.destination.index];

    const draggedItem: PartnersResponse = partnersData.find(
      (ele) => ele.id === Number(result.draggableId)
    )!;

    const partners = partnersData
      .map((ele: any) => {
        if (ele.id === Number(result.draggableId)) {
          return {
            ...ele,
            sortId: Number(destinationItem.sortId),
          };
        } else if (
          sortPosition < 0 &&
          draggedItem?.sortId >= ele?.sortId &&
          destinationItem?.sortId <= ele?.sortId
        ) {
          return {
            ...ele,
            sortId: ele.sortId + 1,
          };
        } else if (
          sortPosition > 0 &&
          destinationItem?.sortId >= ele?.sortId &&
          draggedItem?.sortId <= ele?.sortId
        ) {
          return {
            ...ele,
            sortId: ele.sortId - 1,
          };
        } else return ele;
      })
      .sort((a, b) => b.sortId - a.sortId);

    const destinationIdSortId = Number(destinationItem.sortId);
    if (sortPosition) {
      try {
        setPartnersData(partners as PartnersResponse[]);
        await apiChangeSortPartnersService({
          sourceId: Number(result.draggableId),
          sortPosition,
          destinationIdSortId,
        });

        toast({ title: "Partners Sort Saved", variant: "success" });
      } catch (error: any) {
        handleApiError(error);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle classes="mb-1">Partners</PageTitle>
        <Button
          className="flex items-center  gap-1"
          onClick={() =>
            setModalState((prev) => ({
              isOpen: true,
              isEdit: false,
            }))
          }
        >
          <PlusIcon className="w-4 h-4" aria-hidden="true" />
          Create Partner
        </Button>
      </div>
      <CustomTable
        onDragEnd={handleDragEnd}
        isDraggable
        isLoading={isLoading}
        tableContent={partnersData}
        tableHeadings={tableHeader}
        isActionButtons={true}
        actionHandles={{
          onEdit: (row: any) => {
            setModalState((prev) => ({
              isOpen: true,
              isEdit: true,
            }));
            setSelectedRow(row);
          },
          onDelete: (row: any) => handleDelete(Number(row.id)),
        }}
      />
      <CreatePartners
        partnersLength={partnersData.length}
        isOpen={modalState.isOpen}
        setIsOpen={resetModalState}
        isEdit={modalState.isEdit}
        selectedRow={selectedRow}
        onCreate={(partnersData: any) => handleOnCreate(partnersData)}
        onEdit={(partnersData: any) => handleOnEdit(partnersData)}
      />
    </>
  );
}
export default Partners;
