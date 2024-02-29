import React, { useEffect, useState } from "react";
import facebook from "../../../public/template/facebook.png";
import instagram from "../../../public/template/instagram.png";
import luxafarLogo from "../../../public/template/luxafarlogo.png";
import * as Accordion from "@radix-ui/react-accordion";

import MenuButton from "./menuButton";
import Link from "next/link";
import NameHeading from "./nameHeading";
import Image from "next/image";
import { IHeaderNav, headerNavigation } from "routes/navigation";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { ConfigurationResponse, DestinationsResponse } from "lib/types";
import Paragraph from "./paragraph";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { replaceSpacesWithDash } from "lib/utils";
function MobileNavigation({
  isOpen,
  sheetStatus,
  destinations,
  configurations,
}: {
  configurations?: ConfigurationResponse;
  isOpen: boolean;
  sheetStatus: any;
  destinations: DestinationsResponse[];
}) {
  const [isOpenSubMenu, setIsOpenSubMenu] = useState<any>([]);
  const sortedDestinations = destinations.sort((a, b) => {
    let fa = a.name.toLowerCase(),
      fb = b.name.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });
  function groupByFirstChar(sortedDestinations: any) {
    const grouped: any = [];

    sortedDestinations.forEach((obj: any) => {
      const firstChar: any = obj.name.charAt(0).toUpperCase();
      if (
        !grouped.find((group: any) => group.label === firstChar.toUpperCase())
      ) {
        grouped.push({
          placeCount: obj.placeToVisit?.length,
          name: obj.name,
          url: "/destination/" + replaceSpacesWithDash(obj.name),
        });
      } else {
        const index = grouped.findIndex(
          (group: any) => group.label === firstChar.toUpperCase()
        );
        grouped[index].push({
          placeCount: obj.placeToVisit?.length,
          name: obj.name,
          url: "/destination/" + replaceSpacesWithDash(obj.name),
        });
      }
    });

    return grouped;
  }

  const destinationsArr = groupByFirstChar(sortedDestinations);

  useEffect(() => {
    if (!isOpen) setIsOpenSubMenu([]);
  }, [isOpen]);

  return (
    <div className="min-[1125px]:hidden ">
      <div>
        <MenuButton
          onClick={sheetStatus}
          isOpen={isOpen}
          classes={`hidden max-xl:flex  z-[52]  relative`}
        />
        <div
          className={`w-full fixed  ${
            !isOpen ? "right-[-100%]" : "right-[0%]"
          } top-0 h-screen z-[40] transition-all duration-300 bg-quaternary-color`}
        >
          <div className="">
            <div className="w-[85%] mx-auto mt-[120px] pb-[190px]   overflow-scroll h-screen  ">
              <div className="w-full text-center mb-5 ">
                {headerNavigation.map((nav: IHeaderNav, index: number) => {
                  if (!nav.hasChildren) {
                    return (
                      <div
                        className=" border-b-[1px] py-[5px] border-b-secondary-color last:border-none "
                        key={index}
                      >
                        <Link
                          prefetch={false}
                          onClick={() => sheetStatus(false)}
                          href={nav.path}
                        >
                          <NameHeading className="uppercase !mb-0 py-4 font-[500] ">
                            {nav.label}
                          </NameHeading>
                        </Link>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        className=" border-b-[1px] border-b-secondary-color py-[5px]"
                        key={index}
                      >
                        <Accordion.Root type="multiple" value={isOpenSubMenu}>
                          <Accordion.Item value={"1"} className="border-none">
                            <Accordion.AccordionTrigger
                              className="py-0 justify-center relative "
                              onClick={() =>
                                setIsOpenSubMenu((prev: any) =>
                                  prev.length ? [] : ["1"]
                                )
                              }
                            >
                              <NameHeading className="uppercase !mb-0 py-4 font-[500] mr-full  flex-1">
                                {nav.label}
                              </NameHeading>
                              <ChevronDownIcon
                                className={`AccordionChevron text-secondary-color absolute top-1/2  -translate-y-1/2 -right-16 w-5 h-5 transition-all ${
                                  isOpenSubMenu.length ? "rotate-180" : ""
                                }`}
                                aria-hidden
                              />
                            </Accordion.AccordionTrigger>
                            {destinationsArr.map(
                              (items: any, index: number) => {
                                return (
                                  <Accordion.AccordionContent
                                    className="my-2  border-secondary-color"
                                    key={index}
                                  >
                                    {items?.placeCount ? (
                                      <Link
                                        prefetch={false}
                                        className="font-body text-[14px] text-secondary-color capitalize"
                                        href={items.url}
                                        onClick={sheetStatus}
                                      >
                                        {items.name}
                                      </Link>
                                    ) : (
                                      // <HoverCard>
                                      //   <HoverCardTrigger>
                                      //     <Paragraph classes="text-secondary-color mb-0 opacity-100 capitalize text-[11px]">
                                      //       {items.name}
                                      //     </Paragraph>
                                      //   </HoverCardTrigger>
                                      //   <HoverCardContent
                                      //     align="center"
                                      //     className="px-3 py-2 text-[8px]  w-fit bg-cms-primary-color border-cms-fourth-color text-white font-body dark:bg-gray-800 dark:border-gray-900"
                                      //   >
                                      //     Coming soon
                                      //   </HoverCardContent>
                                      // </HoverCard>
                                      <Popover>
                                        <PopoverTrigger>
                                          <Paragraph classes="text-secondary-color mb-0 opacity-100 capitalize text-[11px]">
                                            {items.name}
                                          </Paragraph>
                                        </PopoverTrigger>
                                        <PopoverContent className="relative z-50 px-3 py-2 text-[8px]  w-fit bg-cms-primary-color border-cms-fourth-color text-white font-body dark:bg-gray-800 dark:border-gray-900">
                                          Coming soon
                                        </PopoverContent>
                                      </Popover>
                                    )}
                                  </Accordion.AccordionContent>
                                );
                              }
                            )}
                          </Accordion.Item>
                        </Accordion.Root>
                      </div>
                    );
                  }
                })}
              </div>
              <div className="flex w-3/5 mx-auto justify-between max-sm:mx-auto mb-8">
                <div className="group  relative ">
                  <Link
                    href={
                      configurations?.facebookUrl
                        ? configurations?.facebookUrl
                        : ""
                    }
                  >
                    <Image
                      src={facebook}
                      alt="Luxafar Facebook "
                      className="group-hover:translate-y-[-10px] transition-all max-sm:w-[9px]"
                    />
                    <span className="text-body absolute text-white text-sm opacity-0 group-hover:opacity-60 left-0 -translate-x-[35%] transition-all">
                      Facebook
                    </span>
                  </Link>
                </div>
                <div className="group  relative ">
                  <Link
                    href={
                      configurations?.twitterUrl
                        ? configurations?.twitterUrl
                        : ""
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 512 512"
                      className="text-[18px] fill-secondary-color"
                    >
                      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                    </svg>
                    <span className="text-body absolute text-white text-sm opacity-0 group-hover:opacity-60 left-0 -translate-x-[35%] transition-all">
                      Twitter
                    </span>
                  </Link>
                </div>
                <div className="group  relative ">
                  <Link
                    href={
                      configurations?.instagramUrl
                        ? configurations?.instagramUrl
                        : ""
                    }
                  >
                    <Image
                      src={instagram}
                      alt="Luxafar instagram "
                      className="group-hover:translate-y-[-10px] transition-all max-sm:w-[16px]"
                    />
                    <span className="text-body absolute text-white text-sm opacity-0 group-hover:opacity-60 left-0 -translate-x-[35%] transition-all">
                      Instagram
                    </span>
                  </Link>
                </div>
              </div>
              <div className="text-center">
                <Image
                  className="w-[90px] mx-auto"
                  src={luxafarLogo}
                  alt="LuxafarLogo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileNavigation;
