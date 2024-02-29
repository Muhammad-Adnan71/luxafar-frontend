"use client";
import React, { ReactNode, useEffect, useState } from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { useSearchParams } from "next/navigation";
import { useLocomotiveScroll } from "react-locomotive-scroll";
import { ChevronDownIcon } from "@radix-ui/react-icons";

function Tabs({
  tabsContent,
  defaultValue,
  detailPage,
}: {
  defaultValue: string;
  tabsContent: { onClick?: Function; label: string; content: ReactNode }[];
  detailPage?: boolean;
}) {
  const searchParams = useSearchParams();
  const { scroll } = useLocomotiveScroll();
  const selectTab: string = searchParams.get("tab") ?? "";
  const [activeTab, setActiveTab] = useState(defaultValue);
  const tabContentLength = tabsContent.length * 48;

  const [selectedTab, setSelectedTab] = useState(false);
  const [selectedTabLabel, setSelectedTabLabel] = useState(
    tabsContent[0].label
  );
  const [selectedTabContent, setSelectedTabContent] = useState(
    tabsContent[0].content
  );

  useEffect(() => {
    setActiveTab(defaultValue);

    setSelectedTabLabel(defaultValue ? defaultValue : selectTab);
    let filterTab: any = tabsContent.find((content: any) =>
      selectTab
        ? content.label.toLowerCase() === selectTab.toLowerCase()
        : content.label.toLowerCase() === defaultValue
    );
    setSelectedTabContent(filterTab?.content);
  }, [searchParams]);

  const handleLabelClick = (labelName: any) => {
    setSelectedTabLabel(labelName);
    let filterTab: any = tabsContent.find(
      (content: any) => content.label.toLowerCase() === labelName.toLowerCase()
    );
    setSelectedTabContent(filterTab.content);
  };

  return (
    <div id={"tabs-container"}>
      <RadixTabs.Root
        defaultValue={activeTab}
        value={activeTab}
        className="max-md:hidden"
      >
        <RadixTabs.List
          data-scroll
          data-scroll-sticky
          data-scroll-target="#tabs-container"
          className="bg-quaternary-color flex gap-10 p-4 justify-center z-50 sticky top-0 whitespace-nowrap max-[978px]:gap-3 max-[978px]:text-[14px]"
        >
          {tabsContent.map((tab: any, index: any) => (
            <RadixTabs.Trigger
              value={tab.label}
              key={index}
              onClick={() => {
                const headerHeight =
                  document.getElementsByTagName("header")[0]?.offsetHeight;
                const innerPageBanner = document.getElementById(
                  "innerPageBanner"
                ) as HTMLElement;
                scroll.scrollTo(innerPageBanner?.offsetHeight + headerHeight, {
                  duration: 500,
                  disableLerp: true,
                });
                setActiveTab(tab.label);
                tab.onClick && tab.onClick();
              }}
              className="px-5 text-secondary-color uppercase font-medium border border-[transparent] hover:border-secondary-color py-4 transition-all duration-300 ease-in-out data-[state='active']:text-[#fff] relative after:w-[1px] after:h-6 after:top-1/2 after:-translate-y-1/2 after:-right-5 max-[978px]:after:-right-[0.75rem] after:bg-secondary-color after:absolute after:last:w-0"
            >
              {tab.label.replaceAll("-", " ")}
            </RadixTabs.Trigger>
          ))}
        </RadixTabs.List>
        {tabsContent.map((tab: any, index: any) => (
          <RadixTabs.Content key={index} value={tab.label}>
            {tab.content}
          </RadixTabs.Content>
        ))}
      </RadixTabs.Root>
      <div
        className={`relative md:hidden mb-10 ${
          detailPage ? "max-sm:mt-0" : ""
        }`}
      >
        <ul
          className={`mx-auto w-4/5 border relative overflow-y-hidden transition-all duration-300 ease-in-out border-[#A69769] ${
            selectedTab ? `h-[${tabContentLength}px]` : "h-[50px]"
          } `}
          onClick={() => {
            setSelectedTab(!selectedTab);
          }}
        >
          <li className="text-secondary-color text-center text-[14px] py-[16px] uppercase opacity-100 w-fit mx-auto">
            {selectedTabLabel.replaceAll("-", " ")}
          </li>
          {tabsContent
            .filter(
              (ele: any) =>
                ele.label.toLowerCase() !== selectedTabLabel.toLowerCase()
            )
            .map((data: any, index: number) => {
              return (
                <li
                  className="text-secondary-color text-center text-[14px] py-[16px] opacity-100 uppercase mx-auto"
                  key={index}
                  onClick={(event) => {
                    event.stopPropagation();
                    data.onClick ? data.onClick() : "";
                    handleLabelClick(data.label);
                    setSelectedTab(false);
                  }}
                >
                  {data.label.replaceAll("-", " ")}
                </li>
              );
            })}
          <ChevronDownIcon
            className={` transition-all duration-300 ease-in-out ${
              selectedTab ? "rotate-180" : ""
            } text-secondary-color w-8 h-6 absolute top-[11px] right-[5%]`}
            onClick={() => {
              setSelectedTab(!selectedTab);
            }}
          />
        </ul>
        <div>{selectedTabContent}</div>
      </div>
    </div>
  );
}

export default Tabs;
