"use client";
import React, { useEffect, useState } from "react";
import CustomTable from "components/CMS/components-ui/table";
import { useSearchParams } from "next/navigation";
import PageTitle from "components/CMS/components-ui/PageTitle";
import FormDataDrawer from "components/CMS/side-drawers/formDrawers";
import { BecomePartnerFormResponse } from "lib/types";
import {
  apiGetAllBecomePartnerFormsService,
  apiGetAllFormsService,
} from "services/forms";
import { Button } from "components/CMS/components-ui/shadcn/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import BecomePartnerDrawer from "components/CMS/side-drawers/becomePartnerForm";
import { useRouter } from "next/navigation";

const BecomePartner = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type");
  const [selectedRow, setSelectedRow] = useState<BecomePartnerFormResponse>();
  const [formData, setFormData] = useState<BecomePartnerFormResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    isEdit: false,
  });

  const tableHeader = [
    {
      key: "id",
      name: "id",
    },
    {
      key: "name",
      name: "name",
      render: (value: any, row: any) => {
        return (
          <>
            <div className="flex relative gap-3 pl-[25px] justify-center">
              {row.status === "unread" && (
                <div className="text-[8px] absolute left-0 font-[500] text-[rgb(0,255,0)]">
                  NEW
                </div>
              )}
              {value}
            </div>
          </>
        );
      },
    },
    {
      key: "contactingAbout",
      name: "Contact About",
    },
    {
      key: "email",
      name: "User Email",
    },
  ];

  const getForm = async () => {
    setIsLoading(true);
    const response = await apiGetAllBecomePartnerFormsService({
      pageSize: pageSize.toString(),
      pageNum: currentPage.toString(),
      searchParams: searchValue,
    });
    if (response.status === "success") {
      setFormData(response.data);
      setCount(response.count);
      setIsLoading(false);
    }
  };
  const handleSuccess = (form: BecomePartnerFormResponse) => {
    setFormData((prev: any) => {
      return prev.map((value: any) => (form.id === value.id ? form : value));
    });
  };

  useEffect(() => {
    getForm();
  }, [searchParams, pageSize, currentPage, searchValue]);
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
    <div>
      <div className="flex justify-between items-center">
        <PageTitle>Become Partner</PageTitle>

        <Button
          className="flex items-center gap-1"
          onClick={() => router.push("/admin/forms/becomePartner/edit")}
        >
          <PlusIcon className="w-4 h-4" aria-hidden="true" />
          Become Partner Question
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
        tableContent={formData}
        tableHeadings={tableHeader}
        isActionButtons={true}
        actionHandles={{
          onView: (row: any) => {
            setSelectedRow(row);
            setModalState((prev) => ({
              isOpen: true,
              isEdit: true,
            }));
          },
        }}
      />
      <BecomePartnerDrawer
        onSuccess={handleSuccess}
        isOpen={modalState.isOpen}
        setIsOpen={() =>
          setModalState((prev) => ({
            isEdit: false,
            isOpen: false,
          }))
        }
        selectedRow={selectedRow as BecomePartnerFormResponse}
      />
    </div>
  );
};

export default BecomePartner;
