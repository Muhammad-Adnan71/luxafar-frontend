"use client";
import React, { useState, useEffect } from "react";
import PageTitle from "components/CMS/components-ui/PageTitle";
import Card from "components/CMS/components-ui/card";
import CardBody from "components/CMS/components-ui/cardBody";
import CustomTable from "components/CMS/components-ui/table";
import { removeTags, truncateText } from "lib/utils";
import { apiDashboardDetail } from "services/dashboard";

function Dashboard() {
  const [detail, setDetail] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    getDashboardDetail();
  }, []);

  const getDashboardDetail = async () => {
    setIsLoading(true);
    const response = await apiDashboardDetail();
    if (response.status === "success") {
      setDetail(response.data);
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
        <div className="h-10 w-10  mx-auto">
          <img
            src={
              row?.content?.[0]?.media?.mobileMediaUrl ??
              row?.content?.[0]?.media?.desktopMediaUrl
            }
            alt=""
            className=" object-cover w-full h-full"
          />
        </div>
      ),
    },
    {
      key: "name",
      name: "Name",
    },
    {
      key: "tour",
      name: "Tours",
      render: (value: any, row: any) => row?.tourDestinations?.length,
    },

    {
      key: "description",
      name: "Description",
      render: (value: any, row: any) => truncateText(removeTags(value)),
    },
  ];

  return (
    <>
      <PageTitle>Dashboard</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardBody className="flex gap-4 items-center !py-4">
            <span className="w-7 h-7 rounded-full bg-[#ff5a1f] block"></span>
            <div>
              <p className="text-white font-medium text-sm mb-2">
                Total Destinations
              </p>
              <span className="text-xl text-white">
                {detail?.count?.destinations}
              </span>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex gap-4 items-center !py-4">
            <span className="w-7 h-7 rounded-full bg-[#ff5a1f] block"></span>
            <div>
              <p className="text-white font-medium text-sm mb-2">Total Tours</p>
              <span className="text-xl text-white">
                {detail?.count?.tours}{" "}
              </span>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex gap-4 items-center !py-4">
            <span className="w-7 h-7 rounded-full bg-[#ff5a1f] block"></span>
            <div>
              <p className="text-white font-medium text-sm mb-2">
                Total Inspirations
              </p>
              <span className="text-xl text-white">
                {detail?.count?.inspirations}
              </span>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex gap-4 items-center !py-4">
            <span className="w-7 h-7 rounded-full bg-[#ff5a1f] block"></span>
            <div>
              <p className="text-white font-medium text-sm mb-2">
                Total Testimonials
              </p>
              <span className="text-xl text-white">
                {detail?.count?.testimonial}{" "}
              </span>
            </div>
          </CardBody>
        </Card>
      </div>
      <PageTitle>New Destinations</PageTitle>

      <CustomTable
        isPageSizeEnable={false}
        isLoading={isLoading}
        tableContent={detail?.destinations}
        tableHeadings={tableHeader}
        isActionButtons={false}
      />
    </>
  );
}

export default Dashboard;
