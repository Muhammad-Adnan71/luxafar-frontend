"use client";
import React, { ReactNode } from "react";
import * as RadixTabs from "@radix-ui/react-tabs";

function Tabs({
  tabsContent,
  defaultValue,
}: {
  defaultValue: string;
  tabsContent: { onClick?: Function; label: string; content: ReactNode }[];
}) {
  return (
    <div>
      <RadixTabs.Root className="" defaultValue={defaultValue}>
        <RadixTabs.List className="bg-cms-fourth-color dark:bg-gray-700 flex gap-10 p-2 justify-center z-50 sticky top-0 whitespace-nowrap max-[978px]:gap-3 max-[978px]:text-[14px]">
          {tabsContent.map((tab: any, index: any) => (
            <RadixTabs.Trigger
              value={tab.label}
              key={index}
              className="px-5 text-secondary-color uppercase font-sm border border-[transparent] font-semibold hover:border-secondary-color py-4 transition-all duration-300 ease-in-out data-[state='active']:text-[#fff] relative after:w-[1px] after:h-6 after:top-1/2 after:-translate-y-1/2 after:-right-5 max-[978px]:after:-right-[0.75rem] after:bg-secondary-color after:absolute after:last:w-0"
            >
              {tab.label}
            </RadixTabs.Trigger>
          ))}
        </RadixTabs.List>
        {tabsContent.map((tab: any, index: any) => (
          <RadixTabs.Content key={index} value={tab.label}>
            {tab.content}
          </RadixTabs.Content>
        ))}
      </RadixTabs.Root>
    </div>
  );
}

export default Tabs;
