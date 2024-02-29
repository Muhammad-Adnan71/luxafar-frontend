"use client";
import React, { useEffect, useState } from "react";
import PageTitle from "components/CMS/components-ui/PageTitle";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "components/CMS/components-ui/shadcn/ui/button";
import CustomTable from "components/CMS/components-ui/table";
import { Switch } from "components/CMS/components-ui/shadcn/ui/switch";
import CreateDestinationFeature from "components/CMS/side-drawers/createDestinationFeature";
import { DestinationFeaturesResponse } from "lib/types";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import {
  apiDeleteDestinationFeature,
  apiGetAllDestinationFeatures,
  apiUpdateDestinationFeatureStatus,
} from "services/destinationFeatures";

function DestinationFeatures() {
  const [featureData, setFeaturesData] = useState<
    DestinationFeaturesResponse[]
  >([]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState({
    isOpen: false,
    isEdit: false,
  });

  const [selectedRow, setSelectedRow] = useState();
  useEffect(() => {
    getDestinationFeatures();
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
          onCheckedChange={(value: any) => handleActiveFeature(value, row)}
        />
      ),
    },
  ];
  const getDestinationFeatures = async () => {
    setIsLoading(true);
    const response = await apiGetAllDestinationFeatures();
    if (response.status === "success") {
      setFeaturesData(response.data);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const response = await apiDeleteDestinationFeature(id);
    if (response.status === "success") {
      setFeaturesData((prev) =>
        prev.filter((item) => item.id !== response.data.id)
      );
      toast({
        title: "Destination Feature Delete Successfully",
        variant: "success",
      });
    }
  };

  const handleActiveFeature = async (value: boolean, row: any) => {
    const id = Number(row.id);
    setFeaturesData((prev: any) => {
      return prev.map((item: any) =>
        row.id === item.id ? { ...item, isActive: value } : item
      );
    });
    const response = await apiUpdateDestinationFeatureStatus(id, {
      status: value,
    });
    if (response.status === "success") {
      toast({
        title: `Destination Feature ${
          value ? "Active" : "In-Active"
        } Successfully`,
        variant: "success",
      });
    }
  };

  const resetModalState = () => {
    setModalState((prev) => ({
      isEdit: false,
      isOpen: false,
    }));
  };

  const handleOnCreate = (feature: any) => {
    resetModalState();
    setFeaturesData((prev) => [feature, ...prev]);
  };

  const handleOnEdit = (editFeature: any) => {
    resetModalState();
    setFeaturesData((prev) =>
      prev.map((feature: any) => {
        if (feature.id === editFeature.id) return editFeature;
        else return feature;
      })
    );
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle classes="mb-1">Destination Features</PageTitle>
        <Button
          className="flex items-center gap-1"
          onClick={() =>
            setModalState((prev) => ({
              isOpen: true,
              isEdit: false,
            }))
          }
        >
          <PlusIcon className="w-4 h-4" aria-hidden="true" />
          Create Feature
        </Button>
      </div>
      <CustomTable
        isLoading={isLoading}
        tableContent={featureData}
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
      <CreateDestinationFeature
        isOpen={modalState.isOpen}
        setIsOpen={resetModalState}
        isEdit={modalState.isEdit}
        selectedRow={selectedRow}
        onCreate={(planService: any) => handleOnCreate(planService)}
        onEdit={(planService: any) => handleOnEdit(planService)}
      />
    </>
  );
}
export default DestinationFeatures;
