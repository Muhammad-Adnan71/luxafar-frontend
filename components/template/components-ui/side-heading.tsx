import React, { ReactNode } from "react";

function SideHeading({
  children,
  isRotate = true,
  classes,
}: {
  children: ReactNode;
  isRotate?: boolean;
  classes?: String;
}) {
  return (
    <h5
      className={
        `font-body text-[12px] 2xl:text-[14px] text-white tracking-[5px] font-medium  uppercase opacity-50 transform ${
          isRotate ? "-rotate-90" : "-rotate-0"
        } text-center inline-block m-0 max-sm:text-left max-[500px]:text-[11px] max-[500px]:tracking-[2px] ` +
        classes
      }
    >
      {children}
    </h5>
  );
}

export default SideHeading;
