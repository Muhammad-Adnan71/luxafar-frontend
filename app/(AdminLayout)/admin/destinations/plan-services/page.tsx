"use client";
import React, { useEffect, useState } from "react";
import PageTitle from "components/CMS/components-ui/PageTitle";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "components/CMS/components-ui/shadcn/ui/button";
import CustomTable from "components/CMS/components-ui/table";
import CreatePlanService from "components/CMS/side-drawers/createPlanServices";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";

import {
  apiDeletePlanService,
  apiGetAllPlanServices,
  apiPutPlanService,
  apiUpdatePlanServiceStatus,
} from "services/planServices";
import { PlanServicesResponse } from "lib/types";
import { Switch } from "components/CMS/components-ui/shadcn/ui/switch";

function PlanServices() {
  const [planServicesData, setPlanServicesData] = useState<
    PlanServicesResponse[]
  >([]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState({
    isOpen: false,
    isEdit: false,
  });

  const [selectedRow, setSelectedRow] = useState();
  useEffect(() => {
    getPlanServices();
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
          onCheckedChange={(value: any) => handleActivePlan(value, row)}
        />
      ),
    },
  ];
  const getPlanServices = async () => {
    setIsLoading(true);
    const response = await apiGetAllPlanServices();
    if (response.status === "success") {
      setPlanServicesData(response.data);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const response = await apiDeletePlanService(id);
    if (response.status === "success") {
      setPlanServicesData((prev) =>
        prev.filter((item) => item.id !== response.data.id)
      );
      toast({
        title: "Plan Service Delete Successfully",
        variant: "success",
      });
    }
  };

  const handleActivePlan = async (value: boolean, row: any) => {
    const id = Number(row.id);
    setPlanServicesData((prev: any) => {
      return prev.map((item: any) =>
        row.id === item.id ? { ...item, isActive: value } : item
      );
    });
    const response = await apiUpdatePlanServiceStatus(id, {
      status: value,
    });
    if (response.status === "success") {
      toast({
        title: `Plan Service ${value ? "Active" : "In-Active"} Successfully`,
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

  const handleOnCreate = (planService: any) => {
    resetModalState();
    setPlanServicesData((prev) => [planService, ...prev]);
  };

  const handleOnEdit = (planService: any) => {
    resetModalState();
    setPlanServicesData((prev) =>
      prev.map((plan: any) => {
        if (plan.id === planService.id) return planService;
        else return plan;
      })
    );
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle classes="mb-1">Plan Services</PageTitle>
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
          Create Service
        </Button>
      </div>
      <CustomTable
        isLoading={isLoading}
        tableContent={planServicesData}
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
      <CreatePlanService
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
export default PlanServices;
