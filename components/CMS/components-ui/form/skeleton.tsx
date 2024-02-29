import React from "react";
import Card from "../card";
import CardBody from "../cardBody";
import { Skeleton } from "../shadcn/ui/skeleton";

function FormSkeleton() {
  return (
    <>
      <Card className="mb-5 bg-primary-color dark:bg-gray-800">
        <CardBody>
          <div className="flex gap-5">
            <Skeleton className="w-full h-[45px]  bg-cms-fourth-color" />
            <Skeleton className="w-full h-[45px]  bg-cms-fourth-color" />
          </div>
          <Skeleton className="w-full h-[120px] mt-5  bg-cms-fourth-color" />
        </CardBody>
      </Card>
      <Card className="mb-5 bg-primary-color dark:bg-gray-800">
        <CardBody>
          <div className="flex gap-5">
            <Skeleton className="w-full h-[45px]  bg-cms-fourth-color" />
            <Skeleton className="w-full h-[45px]  bg-cms-fourth-color" />
          </div>
          <Skeleton className="w-full h-[120px] mt-5  bg-cms-fourth-color" />
        </CardBody>
      </Card>
      <Card className="mb-5 bg-primary-color dark:bg-gray-800">
        <CardBody>
          <div className="flex gap-5">
            <Skeleton className="w-full h-[45px]  bg-cms-fourth-color" />
            <Skeleton className="w-full h-[45px]  bg-cms-fourth-color" />
          </div>
          <Skeleton className="w-full h-[120px] mt-5  bg-cms-fourth-color" />
        </CardBody>
      </Card>
    </>
  );
}

export default FormSkeleton;
