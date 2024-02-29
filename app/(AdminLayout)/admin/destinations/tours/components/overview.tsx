"use client";
import React from "react";
import Card from "components/CMS/components-ui/card";
import CardBody from "components/CMS/components-ui/cardBody";
import { Label } from "components/CMS/components-ui/shadcn/ui/label";
import ImageUploader from "components/CMS/components-ui/imageUploader";
import FormTextEditor from "components/CMS/components-ui/form/formTextEditor";
import SubHeading from "components/CMS/components-ui/subHeading";
import AddButton from "components/CMS/components-ui/addButton";
import DeleteButton from "components/CMS/components-ui/deleteButton";
import { useFormContext, useFieldArray } from "react-hook-form";

export default function TourOverview() {
  const {
    register,
    formState: { errors, touchedFields },
    control,
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "highlights",
    control,
  });
  return (
    <div className="pt-5">
      <Card className="mb-5 bg-primary-color dark:bg-gray-800">
        <CardBody>
          <FormTextEditor label="Description" name="overviewDescription" />
        </CardBody>
      </Card>
      <SubHeading>Highlights</SubHeading>

      {fields.map((highlight, index) => (
        <Card
          className="mb-5 bg-primary-color dark:bg-gray-800"
          key={Math.random() + index}
        >
          <CardBody>
            <div className=" flex justify-between">
              <SubHeading>Slide {index + 1}</SubHeading>
              <DeleteButton
                onClick={() => {
                  remove(index);
                }}
              />
            </div>
            <Label>
              <Label className="py-4 mt-3 mb-3">Highlight Image:</Label>
              <div className="mt-3">
                <ImageUploader name={`highlights.${index}.media`} />
              </div>
            </Label>
            <FormTextEditor
              label="Description"
              name={`highlights.${index}.description`}
            />
          </CardBody>
        </Card>
      ))}
      <div>
        <AddButton
          onClick={() => {
            append({
              description: "",
            });
          }}
          classes="ml-auto"
        />
      </div>
    </div>
  );
}
