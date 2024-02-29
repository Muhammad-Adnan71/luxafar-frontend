"use client";
import React, { useEffect, useState } from "react";
import { Switch } from "components/CMS/components-ui/shadcn/ui/switch";
import PageTitle from "components/CMS/components-ui/PageTitle";
import { Button } from "components/CMS/components-ui/shadcn/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import CustomTable from "components/CMS/components-ui/table";
import CreateFaq from "components/CMS/side-drawers/createFaq";
import { removeTags, truncateText } from "lib/utils";
import { FaqResponse } from "lib/types";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import { apiDeleteFaqs, apiGetAllFaqs, apiPutFaqs } from "services/faqs";
import { handleApiError } from "lib/api-helpers";

function Faqs() {
  const { toast } = useToast();
  const [faqData, setFaqData] = useState<FaqResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState({
    isOpen: false,
    isEdit: false,
  });
  const [selectedRow, setSelectedRow] = useState();
  useEffect(() => {
    getFaqsData();
  }, []);

  const getFaqsData = async () => {
    setIsLoading(true);
    const response = await apiGetAllFaqs();

    setFaqData(response.data);
    setIsLoading(false);
  };
  const handleDelete = async (id: number) => {
    try {
      const response = await apiDeleteFaqs(id);
      setFaqData((prev) => prev.filter((item) => item.id !== response.data.id));
      toast({
        title: "Faq Deleted Successfully",
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
  const handleOnCreate = async (feature: any) => {
    resetModalState();
    setFaqData((prev) => [feature, ...prev]);
  };
  const handleOnEdit = (editFeature: any) => {
    resetModalState();
    setFaqData((prev) =>
      prev.map((feature: any) => {
        if (feature.id === editFeature.id) return editFeature;
        else return feature;
      })
    );
  };
  const handleActiveFeature = async (value: boolean, row: any) => {
    try {
      const id = Number(row.id);
      setFaqData((prev: any) => {
        return prev.map((item: any) =>
          row.id === item.id ? { ...item, isActive: value } : item
        );
      });
      const values = { ...row, isActive: value };
      await apiPutFaqs(id, values);
      toast({
        title: `Faq ${value ? "Active" : "In-Active"} Successfully`,
        variant: "success",
      });
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const tableHeader = [
    {
      key: "id",
      name: "id",
    },
    {
      key: "question",
      name: "Question",
      render: (value: any, row: any) => truncateText(removeTags(value)),
    },
    {
      key: "answer",
      name: "answer",
      render: (value: any, row: any) => truncateText(removeTags(value)),
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

  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle>Faqs</PageTitle>

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
          Create Faq
        </Button>
      </div>
      <CustomTable
        isLoading={isLoading}
        tableContent={faqData}
        tableHeadings={tableHeader}
        isActionButtons={true}
        actionHandles={{
          onEdit: (row: any) => {
            setSelectedRow(row);
            setModalState((prev) => ({
              isOpen: true,
              isEdit: true,
            }));
          },
          onDelete: (row: any) => handleDelete(row.id),
        }}
      />
      <CreateFaq
        isOpen={modalState.isOpen}
        setIsOpen={resetModalState}
        isEdit={modalState.isEdit}
        selectedRow={selectedRow}
        onCreate={(faq: any) => handleOnCreate(faq)}
        onEdit={(faq: any) => handleOnEdit(faq)}
      />
    </>
  );
}
export default Faqs;
