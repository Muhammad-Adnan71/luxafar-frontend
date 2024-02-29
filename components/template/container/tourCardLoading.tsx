import FormSkeleton from "components/CMS/components-ui/form/skeleton";
import { Skeleton } from "components/CMS/components-ui/shadcn/ui/skeleton";
import React from "react";

function TourCardLoading() {
  return (
    <div className="flex  gap-5">
      <div className="h-[286px] w-1/2  mb-10">
        <div className={"w-full h-full glass-effect "}>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="h-full w-1/2  flex  justify-between flex-1">
        <div className="h-full w-full  flex  flex-col ">
          <Skeleton className="w-1/4 h-[25px]  bg-cms-fourth-color " />
          <Skeleton className="w-1/3 h-[25px]  bg-cms-fourth-color mt-3" />
          <Skeleton className="w-1/2 h-[25px]  bg-cms-fourth-color mt-3" />
          <Skeleton className="w-[80%] h-[25px]  bg-cms-fourth-color  mt-3" />
        </div>
      </div>
    </div>
  );
}

export default TourCardLoading;
