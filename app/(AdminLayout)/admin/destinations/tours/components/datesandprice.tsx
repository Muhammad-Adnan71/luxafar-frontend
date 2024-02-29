"use client";
import React from "react";
import Card from "components/CMS/components-ui/card";
import CardBody from "components/CMS/components-ui/cardBody";
import SubHeading from "components/CMS/components-ui/subHeading";
import FormInput from "components/CMS/components-ui/form/formInput";
import FormTextEditor from "components/CMS/components-ui/form/formTextEditor";
import AddButton from "components/CMS/components-ui/addButton";
import DeleteButton from "components/CMS/components-ui/deleteButton";
import { useFormContext, useFieldArray } from "react-hook-form";

export default function TourDatesAndPrice() {
  const { control } = useFormContext();
  const {
    fields: privatePlanFields,
    append: privatePlanAppend,
    remove: privatePlanRemove,
  } = useFieldArray({
    name: "privatePlan",
    control,
  });
  const {
    fields: supplementPolicyFields,
    append: supplementPolicyAppend,
    remove: supplementPolicyRemove,
  } = useFieldArray({
    name: "supplementPolicy",
    control,
  });
  return (
    <div className="pt-5">
      <SubHeading classes="mt-3">Pricing Guarantee</SubHeading>
      <Card className="mb-5 bg-primary-color dark:bg-gray-800">
        <CardBody>
          <FormInput label="Pricing Title" name="pricingTitle" />
          <FormTextEditor
            label="Pricing Description"
            name="pricingDescription"
          />
        </CardBody>
      </Card>
      <SubHeading classes="mt-3">Supplement Policy</SubHeading>
      {supplementPolicyFields.map((item, index) => (
        <Card className="mb-5 bg-primary-color dark:bg-gray-800" key={index}>
          <CardBody>
            <div className="flex justify-between ">
              <SubHeading>Policy {index + 1}</SubHeading>
              <DeleteButton
                onClick={() => {
                  supplementPolicyRemove(index);
                }}
              />
            </div>
            <FormInput
              label="Title"
              placeholder="Enter Title"
              name={`supplementPolicy.${index}.title`}
            />
            <FormInput
              label="Ps. Note"
              placeholder="Enter Ps. Note"
              name={`supplementPolicy.${index}.subTitle`}
            />
            <FormTextEditor
              label="Description"
              name={`supplementPolicy.${index}.description`}
            />
          </CardBody>
        </Card>
      ))}
      <AddButton
        onClick={() => {
          supplementPolicyAppend({
            title: "",
            subTitle: "",
            description: "",
          });
        }}
        classes="ml-auto"
      />

      <SubHeading>Make It Private</SubHeading>
      {privatePlanFields.map((item, index) => (
        <Card className="mb-5 bg-primary-color dark:bg-gray-800" key={index}>
          <CardBody>
            <div className="flex justify-between ">
              <SubHeading>Package {index + 1}</SubHeading>
              <DeleteButton
                onClick={() => {
                  privatePlanRemove(index);
                }}
              />
            </div>

            <div className=" flex gap-5">
              <FormInput
                label="Minimum Persons"
                name={`privatePlan.${index}.minimumPersons`}
                placeholder="Enter Minimum Persons"
              />
              <FormInput
                label="Maximum Persons"
                name={`privatePlan.${index}.maximumPersons`}
                placeholder="Enter Maximum Persons"
              />
              <FormInput
                label="per person Rate"
                name={`privatePlan.${index}.perPersonRate`}
                placeholder="per person Rate"
              />
            </div>
          </CardBody>
        </Card>
      ))}
      <AddButton
        onClick={() => {
          privatePlanAppend({
            minimumPersons: "",
            maximumPersons: "",
            perPersonRate: "",
          });
        }}
        classes="ml-auto"
      />
      <Card className="mt-5">
        <CardBody>
          <FormTextEditor
            label=" Description"
            name="makeItPrivateDescription"
          />
        </CardBody>
      </Card>
    </div>
  );
}
