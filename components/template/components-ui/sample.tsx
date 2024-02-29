"use client";
import React, { useRef } from "react";
import useElementVisibility from "./scrollPosition";

const Sample = () => {
  const ref = useRef(null);
  const isVisible = useElementVisibility(ref);
  return (
    <div ref={ref}>
      {isVisible ? "Element is visible" : "Element is not visible"}
    </div>
  );
};

export default Sample;
