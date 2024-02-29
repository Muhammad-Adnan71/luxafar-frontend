"use client";
import React, { useContext, useRef, useState } from "react";
import SidebarContext from "@context/SidebarContext";
import SidebarContent from "./SidebarContent";
import { Button } from "../shadcn/ui/button";
import { DoubleArrowRightIcon } from "@radix-ui/react-icons";

function DesktopSidebar() {
  const sidebarRef = useRef(null);
  const [minimizeMenu, setMinimizeMenu] = useState(false);
  const { saveScroll } = useContext(SidebarContext);

  const linkClickedHandler = () => {
    saveScroll(sidebarRef.current);
  };

  return (
    <aside
      id="desktopSidebar"
      ref={sidebarRef}
      className={`z-30  flex-shrink-0 hidden  relative  bg-cms-primary-color  transition-all dark:bg-gray-800 lg:block group ${
        minimizeMenu ? "w-16" : "w-64"
      }`}
    >
      <Button
        className="absolute -right-5 top-5 p-2 shadow-none transition-all  opacity-0 group-hover:opacity-100 group-hover:-right-7  "
        onClick={() => setMinimizeMenu(!minimizeMenu)}
      >
        <DoubleArrowRightIcon
          className={
            minimizeMenu
              ? `rotate-0 transition-all`
              : `rotate-180 transition-all`
          }
        />
      </Button>
      <SidebarContent
        linkClicked={linkClickedHandler}
        minimizeMenu={minimizeMenu}
      />
    </aside>
  );
}

export default DesktopSidebar;
