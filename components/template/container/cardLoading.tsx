import FormSkeleton from "components/CMS/components-ui/form/skeleton";
import { Skeleton } from "components/CMS/components-ui/shadcn/ui/skeleton";
import React from "react";

function CardLoading() {
  return (
    <div className="h-full flex flex-col">
      <div className="h-[286px] mb-10">
        <div className={"w-full h-full glass-effect "}>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="h-full  flex flex-col justify-between flex-1">
        <div className="h-full flex flex-col justify-between ">
          <Skeleton className="w-full h-[45px]  bg-cms-fourth-color" />
          <Skeleton className="w-full h-[25px]  bg-cms-fourth-color mt-3" />
        </div>
      </div>
    </div>
  );
}

export default CardLoading;
