"use client";
import React from "react";
import plane from "@public/template/luxafarlogo.png";
import Image from "next/image";
import usePreloader from "store/usePreloader";

function Loader() {
  const { isLoading } = usePreloader();
  return (
    <div
      className={`${
        !isLoading ? "animate-[0.5s_loaderBg_0.1s_ease-in-out_forwards] " : ""
      } fixed w-full h-screen z-[100] top-0 bg-primary-color max-sm:bg-pattern-mobile sm:bg-body-pattern left-0 h-[100svh] `}
    >
      <div className="relative w-full flex justify-center items-center h-[100svh] h-screen">
        <Image
          src={plane}
          alt="Loading Screen Plane Image"
          className={`max-sm:w-[80px] w-[120px] animate-[80s_loaderSpin_linear_infinite]
            `}
        />
      </div>
    </div>
  );
}

export default Loader;
