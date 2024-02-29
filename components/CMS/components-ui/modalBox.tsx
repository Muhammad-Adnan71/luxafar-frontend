"use client";
import SearchSelectInput from "@template-components/searchSelect";
import { Button } from "./shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./shadcn/ui/dialogModal";

import { useEffect, useState } from "react";
import { apiTemplateDestinations } from "services/destination";
import { apiGetAllInspirations } from "services/inspirations";
import FormSelect from "./form/formSelect";
import AddButton from "./addButton";
import SaveButton from "./saveButton";

export function DialogBox({
  updateInspirationList,
}: {
  updateInspirationList: any;
}) {
  const [destinations, setDestinations] = useState<
    {
      label: string;
      value: string;
    }[]
  >();
  const [inspiration, setInspiration] = useState<
    {
      label: string;
      value: string;
    }[]
  >();
  const [inspirationResponse, setInspirationResponse] = useState<any[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<any>({});
  const [selectedInspiration, setSelectedInspiration] = useState<any>({});
  const [isMounted, setIsMounted] = useState(false);
  const handleDestination = async (value: string) => {
    setSelectedDestination({
      id: value,
      name: destinations?.find((ele: any) => ele?.value == value)?.label,
    });
  };
  const getDestinations = async () => {
    const response = await apiTemplateDestinations();
    if (response?.status === "success") {
      setDestinations(
        response?.data.map((destination: any) => ({
          label: destination.name,
          value: destination.id.toString(),
        }))
      );
    }
  };
  const getInspirations = async () => {
    try {
      const response = await apiGetAllInspirations({
        ...(selectedDestination?.id && {
          destinationId: selectedDestination.id,
        }),
      });

      if (response?.status === "success") {
        setInspiration(
          response?.data?.map((inspiration: any) => ({
            label: inspiration?.title,
            value: inspiration?.id,
          }))
        );
        setInspirationResponse(response?.data);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    getDestinations();
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      getInspirations();
    }
  }, [selectedDestination.id]);

  const handleAddInspiration = () => {
    const items = {
      destination: selectedDestination,
      inspirations: inspirationResponse?.find(
        (ele: any) => ele?.id == selectedInspiration
      ),
    };

    updateInspirationList(items);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant="outline"
          type="button"
          className="bg-cms-tertiary-color"
        >
          Add Inspiration
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-cms-tertiary-color dark:border-gray-900 bg-cms-primary-color dark:bg-gray-800 gap-y-0">
        <DialogHeader>
          {/* <DialogTitle className="font-[500] ">Edit Sort</DialogTitle> */}
        </DialogHeader>
        <div className="flex flex-col">
          <div>
            {/* <SearchSelectInput
              onChange={handleDestination}
              value={selectedDestination.id as string}
              placeHolder="Destination"
              items={destinations}
            /> */}
            <FormSelect
              name="destinationId"
              label="Destination"
              options={destinations ?? []}
              placeholder="Select Destination"
            />
          </div>
          <div>
            {/* <SearchSelectInput
              items={inspiration}
              onChange={(value: any) => {
                setSelectedInspiration(value);
              }}
              placeHolder="Inspiration"
            /> */}
            <FormSelect
              name="Inspiration"
              label="Inspiration"
              options={inspiration ?? []}
              placeholder="Select Inspiration"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className=" py-5  flex items-center justify-center gap-1 px-10 disabled:bg-opacity-90 disabled:cursor-default bg-cms-tertiary-color"
            type="submit"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
