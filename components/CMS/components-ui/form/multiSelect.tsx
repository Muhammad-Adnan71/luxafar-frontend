"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Badge } from "../shadcn/ui/badge";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/ui/popover";
import { cn } from "lib/utils";
import FormLabel from "./formLabel";

type Framework = Record<"value" | "label", string>;

export function MultiSelect({
  placeholder,
  label,
  options,
  handleSelection,
  setSelected,
  selected,
}: {
  placeholder: string;
  label?: string;
  options: Framework[];
  handleSelection?: Function;
  setSelected: Function;
  selected: any;
}) {
  const handleUnselect = (options: Framework) => {
    setSelected((prev: any) =>
      prev.filter((s: any) => s.value !== options.value)
    );
  };
  const [selectAbles, setSelectAbles] = useState(options);

  useEffect(() => {
    if (selected.length > 0 || options.length > 0) {
      const selectedIds = selected?.map((fin: any) => Number(fin.value));
      const isSelectAbles: any = options?.filter(
        (item) => !selectedIds.includes(Number(item.value))
      );
      setSelectAbles(isSelectAbles);
    }
  }, [selected, options]);

  return (
    <div className="w-full">
      <FormLabel>{label}</FormLabel>
      <Popover>
        <PopoverTrigger
          className={cn(
            "flex h-auto w-full relative items-center  justify-between rounded-md border border-slate-200 border-cms-tertiary-color bg-cms-fourth-color px-3 py-2 text-sm shadow-sm  placeholder:text-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:border-slate-800 max-sm:focus-visible:outline-none dark:placeholder:text-slate-400 dark:bg-gray-700 dark:border-gray-900 [&[data-state=open]_svg]:rotate-180 w"
          )}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length == 0 && (
              <span className="text-white opacity-75">{placeholder}</span>
            )}
            {selected.length > 0 &&
              selected.map((item: any) => {
                return (
                  <Badge
                    key={item.value}
                    variant="secondary"
                    className="border-secondary-color"
                  >
                    <span className="text-white font-thin py-[3px] capitalize">
                      {item.label}
                    </span>
                    <span
                      className="ml-1 ring-offset-primary-color rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUnselect(item);
                        handleSelection && handleSelection("remove", item);
                      }}
                    >
                      <X className="h-3 w-3 text-secondary-color hover:text-foreground" />
                    </span>
                  </Badge>
                );
              })}
          </div>
          <div className="absolute arrowIcon right-[5px] top-1/2 -translate-y-1/2">
            <ChevronDownIcon
              className={`transition-all text-secondary-color ease-in-out duration-300 w-5 h-5`}
            />
          </div>
        </PopoverTrigger>

        <PopoverContent
          className={cn(
            "relative z-50 min-w-[20rem] max-h-[200px] overflow-y-scroll w-full rounded-md border border-cms-tertiary-color bg-cms-fourth-color text-slate-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 text-white dark:bg-gray-700 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
          )}
          align="start"
        >
          {selectAbles.map((item) => {
            return (
              <div
                key={item.value}
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50 hover:bg-cms-tertiary-color capitalize dark:hover:bg-gray-800"
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => {
                  setSelected((prev: any) => [...prev, item]);
                  handleSelection && handleSelection("add", item);
                }}
              >
                {item.label}
              </div>
            );
          })}
        </PopoverContent>
      </Popover>
    </div>
  );
}
