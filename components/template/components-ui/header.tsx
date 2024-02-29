"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Main from "../container";
import NameHeading from "./nameHeading";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import SubMenu from "./submenu";
import HeaderWrapper from "./headerWrapper";
import { IHeaderNav, headerNavigation } from "routes/navigation";
import MobileNavigation from "./mobileNavigation";
import { ConfigurationResponse, DestinationsResponse } from "lib/types";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "components/CMS/components-ui/shadcn/ui/hover-card";

function Header({
  logo,
  destinations,
  configuration,
}: {
  configuration: ConfigurationResponse;
  logo: string;
  destinations: DestinationsResponse[];
}) {
  const [isHover, setIsHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const windowWidth = window.innerWidth;
    if (windowWidth < 1024) {
      const body = document.getElementsByTagName("body")[0] as HTMLElement;
      if (isOpen) body.style.overflowY = "hidden";
      else body.style.overflowY = "scroll";
    }
  }, [isOpen]);

  return (
    <HeaderWrapper>
      <Main>
        <div className={`flex items-center justify-between`}>
          <div
            className={
              "logo opacity-0 animate-[1s_loaderBg_.1s_ease-in-out_forwards_reverse]  z-[53]"
            }
          >
            <Link className="cursor-pointer" href="/">
              <img
                loading="eager"
                src={logo}
                alt="site logo"
                className="lg:min-h-[54px] max-w-[200px]  2xl:max-w-[220px] max-xl:max-w-[200px] max-sm:max-w-[170px]"
              />
            </Link>
          </div>

          <div className="max-[1125px]:hidden">
            <ul className="ml-5 flex items-center">
              {headerNavigation.map((nav: IHeaderNav, index: number) => (
                <li
                  onMouseEnter={() =>
                    nav?.hasChildren ? setIsHover(true) : setIsHover(false)
                  }
                  className={`max-2xl:px-3 2xl:px-5 max-xl:px-2 flex items-center  transition-all duration-500 relative  ${
                    headerNavigation.length - 1 === index ? "" : ""
                  }`}
                  key={index}
                >
                  {nav?.hasChildren ? (
                    <>
                      <NameHeading className="text-[14px] max-xl:text-[12px] whitespace-nowrap font-[600] uppercase font-body !mb-0 py-2 ">
                        {nav.label}
                      </NameHeading>
                      {nav?.hasChildren && (
                        <ChevronDownIcon
                          className={`text-radix-ui/react-icons transition-all duration-300 ease-in-out ${
                            isHover && "rotate-180"
                          }  text-secondary-color w-6 h-4 `}
                        />
                      )}
                    </>
                  ) : (
                    // <div>
                    //   <Link
                    //     href={nav.path}
                    //     className={nav?.hasChildren ? "flex items-center" : ""}
                    //   >
                    //     <NameHeading className="text-[14px] max-xl:text-[12px] whitespace-nowrap font-[600] uppercase font-body !mb-0 ">
                    //       {nav.label}
                    //     </NameHeading>
                    //     {nav?.hasChildren && (
                    //       <ChevronDownIcon
                    //         className={`text-radix-ui/react-icons transition-all duration-300 ease-in-out ${
                    //           isHover && "rotate-180"
                    //         }  text-secondary-color w-6 h-4 `}
                    //       />
                    //     )}
                    //   </Link>
                    // </div>
                    <>
                      {nav.label !== "shop" ? (
                        <Link
                          prefetch={false}
                          href={nav.path}
                          className={
                            nav?.hasChildren ? "flex items-center" : ""
                          }
                        >
                          <NameHeading className="text-[14px] max-xl:text-[12px] whitespace-nowrap font-[600] uppercase font-body !mb-0 py-2  ">
                            {nav.label}
                          </NameHeading>
                          {nav?.hasChildren && (
                            <ChevronDownIcon
                              className={`text-radix-ui/react-icons transition-all duration-300 ease-in-out ${
                                isHover && "rotate-180"
                              }  text-secondary-color w-6 h-4 `}
                            />
                          )}
                        </Link>
                      ) : (
                        <HoverCard openDelay={100}>
                          <HoverCardTrigger>
                            <NameHeading className="text-[14px] max-xl:text-[12px] whitespace-nowrap font-[600] uppercase font-body !mb-0  py-2">
                              {nav.label}
                            </NameHeading>
                          </HoverCardTrigger>
                          <HoverCardContent
                            align="center"
                            className="px-3 py-2 text-[8px]  w-fit bg-cms-primary-color border-cms-fourth-color text-white font-body dark:bg-gray-800 dark:border-gray-900"
                          >
                            Coming soon
                          </HoverCardContent>
                        </HoverCard>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <MobileNavigation
            destinations={destinations}
            isOpen={isOpen}
            sheetStatus={() => setIsOpen(!isOpen)}
            configurations={configuration}
          />
        </div>

        <div
          onMouseLeave={() => setIsHover(false)}
          className={`absolute w-4/5 max-w-[1400px]  left-[50%] translate-x-[-50%] max-lg:hidden top-32 transition-all   duration-300 
            p-10 max-xl:p-5 bg-[#103b49] ${
              isHover
                ? "opacity-95 z-40 visible translate-y-0"
                : "opacity-0 z-0 invisible translate-y-20 "
            } `}
        >
          <SubMenu
            onLinkClick={() => setIsHover(false)}
            destinations={destinations}
          />
        </div>
      </Main>
    </HeaderWrapper>
  );
}

export default Header;
