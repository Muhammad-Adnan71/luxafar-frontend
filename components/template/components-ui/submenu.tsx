import React from "react";
import NameHeading from "./nameHeading";
import Paragraph from "./paragraph";
import Link from "next/link";
import { DestinationsResponse } from "lib/types";
import { HoverCard } from "@radix-ui/react-hover-card";
import {
  HoverCardContent,
  HoverCardTrigger,
} from "components/CMS/components-ui/shadcn/ui/hover-card";
import { replaceSpacesWithDash } from "lib/utils";

const SubMenu = ({
  onLinkClick,
  destinations,
}: {
  destinations: DestinationsResponse[];
  onLinkClick: any;
}) => {
  const sortedDestinations = destinations.sort((a, b) => {
    let fa = a?.name.toLowerCase(),
      fb = b?.name.toLowerCase();

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
          label: obj.name.charAt(0).toUpperCase(),
          children: [
            {
              placeCount: obj?.placeToVisit?.length,
              name: obj.name,
              url: "/destination/" + replaceSpacesWithDash(obj.name),
            },
          ],
        });
      } else {
        const index = grouped.findIndex(
          (group: any) => group.label === firstChar.toUpperCase()
        );
        grouped[index].children.push({
          name: obj.name,
          url: "/destination/" + replaceSpacesWithDash(obj.name),
          placeCount: obj?.placeToVisit?.length,
        });
      }
    });

    return grouped;
  }
  const destinationsArr = groupByFirstChar(sortedDestinations);

  return (
    <ul className="flex gap-x-5 max-xl:gap-x-1 flex-wrap ">
      {destinationsArr.map((item: any, index: number) => {
        return (
          <li className="max-xl:w-[8%] xl:w-[6.75%] 2xl:w-[7.05%]" key={index}>
            <NameHeading className="text-[12px] font-[600]">
              {item.label}
            </NameHeading>
            <ul className="mb-3">
              {item.children.map((destinations: any, index: number) => {
                return (
                  <li
                    className="min-w-[70px] hover:opacity-100 max-xl:min-w-[65px] max-w-[71px] max-xl:max-w-[70px]"
                    key={index}
                  >
                    {destinations?.placeCount ? (
                      <Link
                        onClick={onLinkClick}
                        href={destinations.url}
                        prefetch={false}
                      >
                        <Paragraph classes="opacity-60 hover:opacity-100 mb-[1px] transition-all capitalize !text-[10px] xl:text-[10px] max-xl:leading-3 !leading-3 ">
                          {destinations.name}
                        </Paragraph>
                      </Link>
                    ) : (
                      <HoverCard openDelay={100}>
                        <HoverCardTrigger>
                          <Paragraph classes="opacity-60 mb-[1px] hover:opacity-100 transition-all cursor-pointer capitalize !text-[10px] xl:text-[10px] max-xl:leading-3 !leading-3 ">
                            {destinations.name}
                          </Paragraph>
                        </HoverCardTrigger>
                        <HoverCardContent
                          align="end"
                          className="px-3 py-2 text-[8px]  w-fit bg-cms-primary-color border-cms-fourth-color text-white font-body dark:bg-gray-800 dark:border-gray-900"
                        >
                          Coming soon
                        </HoverCardContent>
                      </HoverCard>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
};

export default SubMenu;
