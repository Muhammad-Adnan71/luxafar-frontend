"use client";
import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { IRoute, routeIsActive } from "routes/sidebar";
import SidebarContext from "@context/SidebarContext";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../shadcn/ui/hover-card";
interface IIcon {
  icon: string;
  [key: string]: string | undefined;
}

interface ISidebarSubmenu {
  route: IRoute;
  minimizeMenu: boolean;
  linkClicked: () => void;
}

function SidebarSubmenu({ route, linkClicked, minimizeMenu }: ISidebarSubmenu) {
  const pathname = usePathname();
  const { saveScroll } = useContext(SidebarContext);

  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(
    route.routes
      ? route.routes.filter((r: any) => {
          return routeIsActive(pathname, r);
        }).length > 0
      : false
  );

  function handleDropdownMenuClick() {
    setIsDropdownMenuOpen(!isDropdownMenuOpen);
  }

  useEffect(() => {
    setIsDropdownMenuOpen(false);
  }, [minimizeMenu]);

  return (
    <>
      <li
        className={`relative px-6 py-3   dark:hover:text-gray-200 hover:text-cms-secondary-color`}
        key={route.name}
      >
        {routeIsActive(pathname, route) && (
          <span
            className="absolute inset-y-0 left-0 w-1 bg-cms-secondary-color rounded-tr-lg rounded-br-lg"
            aria-hidden="true"
          ></span>
        )}
        <button
          className={`inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 hover:text-cms-secondary-color dark:hover:text-gray-200 ${
            isDropdownMenuOpen
              ? "dark:text-gray-200 text-cms-secondary-color"
              : ""
          }`}
          aria-haspopup="true"
        >
          <Link
            href={route.path || ""}
            className={` ${
              routeIsActive(pathname, route)
                ? " dark:text-gray-200 text-cms-secondary-color"
                : ""
            }`}
          >
            <span className="inline-flex items-center">
              {minimizeMenu && (
                <HoverCard openDelay={300}>
                  <HoverCardTrigger>
                    {route?.icon && route?.icon()}
                  </HoverCardTrigger>
                  <HoverCardContent className="px-3 py-2 text-xs  w-fit bg-cms-primary-color border-cms-fourth-color text-white font-normal dark:bg-gray-800 dark:border-gray-900">
                    {route.name}
                  </HoverCardContent>
                </HoverCard>
              )}
              {!minimizeMenu && route?.icon && route?.icon()}
              <span
                className={`ml-4 ${
                  minimizeMenu ? "translate-x-20 opacity-0" : "-translate-x-0"
                }`}
              >
                {route.name}
              </span>
            </span>
          </Link>
          <div onClick={handleDropdownMenuClick}>
            <ChevronDown
              className={`w-4 h-4 ${
                isDropdownMenuOpen ? `transform rotate-180` : ``
              }`}
              aria-hidden="true"
            />
          </div>
        </button>
      </li>
      <ul
        className={`px-2 mx-5  space-y-2 text-sm font-medium text-white rounded-md shadow-inner bg-cms-tertiary-color dark:text-gray-200 dark:bg-gray-900 transition-all overflow-scroll menu-list ${
          !isDropdownMenuOpen ? "max-h-0 " : "max-h-72  py-2 mb-2 "
        }`}
        aria-label="submenu"
      >
        {route.routes &&
          route.routes.map((r: any) => (
            <li
              className="px-2 capitalize py-1 transition-colors duration-150 hover:text-cms-secondary-color dark:hover:text-gray-200"
              key={r.name}
            >
              <Link
                href={r.path || ""}
                scroll={false}
                className={`w-full inline-block ${
                  routeIsActive(pathname, r)
                    ? "dark:text-gray-200 text-cms-secondary-color"
                    : ""
                }`}
                onClick={linkClicked}
              >
                {r.render ? r.render() : r.name}
              </Link>
            </li>
          ))}
      </ul>
    </>
  );
}

export default SidebarSubmenu;
