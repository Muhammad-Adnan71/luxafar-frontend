"use client";
import React, { useEffect, useState } from "react";
import PageTitle from "components/CMS/components-ui/PageTitle";
import Link from "next/link";
import { pageLinkRemoveExtraSpaces, removeTags, truncateText } from "lib/utils";
import { useRouter } from "next/navigation";
import CustomTable from "components/CMS/components-ui/table";
import { apiGetAllPagesService } from "services/pages";

function Pages() {
  const router = useRouter();
  const [pagesData, setPagesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const tableHeader = [
    {
      key: "id",
      name: "id",
    },
    {
      key: "name",
      name: "page Name",
      render: (value: string, row: any) => (
        <Link
          href={pageLinkRemoveExtraSpaces(value, row.id, "pages")}
          className="underline underline-offset-[3px]"
        >
          {value}
        </Link>
      ),
    },

    {
      key: "title",
      name: "page title",
      render: (value: any, row: any) => truncateText(value),
    },

    {
      key: "description",
      name: "page description",
      render: (value: any, row: any) => truncateText(removeTags(value)),
    },
  ];

  useEffect(() => {
    apiGetAllPages();
  }, []);

  const apiGetAllPages = async () => {
    setIsLoading(true);
    const response = await apiGetAllPagesService();
    if (response?.status === "success") {
      setPagesData(response.data);
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageTitle classes="mb-0">Pages</PageTitle>

      <CustomTable
        isLoading={isLoading}
        tableContent={pagesData}
        tableHeadings={tableHeader}
        isActionButtons={true}
        actionHandles={{
          onEdit: (row: any) => {
            router.push(
              pageLinkRemoveExtraSpaces(row.page_name, row.id, "pages")
            );
          },

          onView: (row: any) => {
            window.open(
              row.url === "/" ? window.location.origin : row.url,
              "_blank",
              "noopener,noreferrer"
            );
          },
        }}
      />
    </>
  );
}
export default Pages;
