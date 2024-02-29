"use client";
import React from "react";
import Card from "components/CMS/components-ui/card";
import CardBody from "components/CMS/components-ui/cardBody";
import FormTextEditor from "components/CMS/components-ui/form/formTextEditor";
import SubHeading from "components/CMS/components-ui/subHeading";

export default function TourWhatToExpect() {
  return (
    <div className="pt-5 ">
      <SubHeading>Physical Activity</SubHeading>
      <Card className="mb-5 bg-primary-color dark:bg-gray-800">
        <CardBody>
          <FormTextEditor
            label="Description"
            name="physicalActivityDescription"
          />
        </CardBody>
      </Card>
      <SubHeading>Traveling To & From</SubHeading>
      <Card className="mb-5 bg-primary-color dark:bg-gray-800">
        <CardBody>
          <FormTextEditor label="Description" name="travelingFromDescription" />
        </CardBody>
      </Card>
      <SubHeading>Weather</SubHeading>
      <Card className="mb-5 bg-primary-color dark:bg-gray-800">
        <CardBody>
          <FormTextEditor label="Description" name="weatherDescription" />
        </CardBody>
      </Card>
      <SubHeading>When To Go</SubHeading>
      <Card className="mb-5 bg-primary-color dark:bg-gray-800">
        <CardBody>
          <FormTextEditor label="Description" name="whenToGoDescription" />
        </CardBody>
      </Card>
      <SubHeading>Cuisine</SubHeading>
      <Card className="mb-5 bg-primary-color dark:bg-gray-800">
        <CardBody>
          <FormTextEditor label="Description" name="cuisineDescription" />
        </CardBody>
      </Card>
    </div>
  );
}
