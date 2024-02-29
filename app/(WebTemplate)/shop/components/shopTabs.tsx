import React, { ReactNode, useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { ChevronDownIcon } from "@radix-ui/react-icons";

const ShopTabs = ({
  tabsItem,
  defaultValue,
}: {
  tabsItem: { onClick?: Function; label: string; content: ReactNode }[];
  defaultValue: string;
}) => {
  // const [activeTab, setActiveTab] = useState(defaultValue);
  const [activeTab, setActiveTab] = useState(defaultValue);
  const tabContentLength = tabsItem.length * 48;

  const [selectedTab, setSelectedTab] = useState(false);
  const [selectedTabLabel, setSelectedTabLabel] = useState(tabsItem[0].label);
  const [selectedTabContent, setSelectedTabContent] = useState(
    tabsItem[0].content
  );

  const handleLabelClick = (labelName: any) => {
    setSelectedTabLabel(labelName);
    let filterTab: any = tabsItem.find(
      (content: any) => content.label.toLowerCase() === labelName.toLowerCase()
    );
    setSelectedTabContent(filterTab.content);
  };

  return (
    <>
      <Tabs.Root
        className="w-full max-md:hidden"
        defaultValue="tab1"
        orientation="vertical"
      >
        <Tabs.List className="flex justify-between" aria-label="tabs example">
          {tabsItem.map((item: any, index: number) => {
            return (
              <Tabs.Trigger
                key={index}
                onClick={() => setActiveTab(item.label)}
                className="text-[13px] uppercase  underline-offset-4 underline text-white font-body data-[state='active']:text-secondary-color"
                value={item.label}
              >
                Lorem
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>
        {tabsItem.map((item: any, index: number) => {
          return (
            <Tabs.Content key={index} value={item.label}>
              {item.content}
            </Tabs.Content>
          );
        })}
      </Tabs.Root>
      <div className={`relative md:hidden mb-10 `}>
        <ul
          className={`mx-auto w-full border relative overflow-y-hidden transition-all duration-300 ease-in-out border-[#A69769] ${
            selectedTab ? `h-[${tabContentLength}px]` : "h-[50px]"
          } `}
        >
          <li className="text-secondary-color text-center text-[14px] py-[16px] uppercase opacity-100 w-fit mx-auto">
            {selectedTabLabel}
          </li>
          {tabsItem
            .filter(
              (ele: any) =>
                ele.label.toLowerCase() !== selectedTabLabel.toLowerCase()
            )
            .map((data: any, index: number) => {
              return (
                <li
                  className="text-secondary-color text-center text-[14px] py-[16px] opacity-100 uppercase w-fit mx-auto"
                  key={index}
                  onClick={() => {
                    data.onClick ? data.onClick() : "";
                    handleLabelClick(data.label);
                    setSelectedTab(false);
                  }}
                >
                  {data.label}
                </li>
              );
            })}
          <ChevronDownIcon
            onClick={() => {
              setSelectedTab(!selectedTab);
            }}
            className={` transition-all duration-300 ease-in-out ${
              selectedTab ? "rotate-180" : ""
            } text-secondary-color w-8 h-6 absolute top-[11px] right-[5%]`}
          />
        </ul>
        <div>{selectedTabContent}</div>
      </div>
    </>
  );
};

export default ShopTabs;
