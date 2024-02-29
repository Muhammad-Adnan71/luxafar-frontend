"use client";
import React from "react";
import DeleteButton from "components/CMS/components-ui/deleteButton";
import Card from "components/CMS/components-ui/card";
import CardBody from "components/CMS/components-ui/cardBody";
import FormInput from "components/CMS/components-ui/form/formInput";
import FormTextEditor from "components/CMS/components-ui/form/formTextEditor";
import AddButton from "components/CMS/components-ui/addButton";
import SubHeading from "components/CMS/components-ui/subHeading";
import { useFormContext, useFieldArray } from "react-hook-form";

export default function TourDayToDayItinerary() {
  const {
    register,
    formState: { errors, touchedFields },
    control,
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "dayToDayItinerary",
    control,
  });
  return (
    <div className="pt-5 ">
      {fields.map((day, index) => (
        <Card className="mb-5 bg-primary-color dark:bg-gray-800" key={index}>
          <CardBody>
            <div className="flex justify-between">
              <SubHeading>Day {index + 1}</SubHeading>
              <DeleteButton onClick={() => remove(index)} />
            </div>

            <div>
              <div className="flex gap-5">
                <FormInput
                  label="Accommodation"
                  name={`dayToDayItinerary.${index}.accommodation`}
                  placeholder="Enter Accommodation"
                />
                <FormInput
                  label="Destination"
                  name={`dayToDayItinerary.${index}.destination`}
                  placeholder="enter Destination"
                />
              </div>

              <FormTextEditor
                label="Description"
                name={`dayToDayItinerary.${index}.description`}
              />
            </div>
          </CardBody>
        </Card>
      ))}
      <div className="flex justify-end">
        <AddButton
          onClick={() => {
            append({
              accommodation: "",
              destination: "",
              description: "",
            });
          }}
        />
      </div>
    </div>
  );
}
