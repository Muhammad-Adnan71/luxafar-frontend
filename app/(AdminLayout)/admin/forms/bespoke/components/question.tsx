import CardBody from "components/CMS/components-ui/cardBody";
import DeleteButton from "components/CMS/components-ui/deleteButton";
import FormInput from "components/CMS/components-ui/form/formInput";
import CustomSelect from "components/CMS/components-ui/form/select";
import { Label } from "components/CMS/components-ui/shadcn/ui/label";
import React, { useEffect, useState } from "react";
import Option from "./option";
import {
  RadioGroup,
  RadioGroupItem,
} from "components/CMS/components-ui/shadcn/ui/radio-group";
import Card from "components/CMS/components-ui/card";

function Question({
  control,
  register,
  getValues,
  remove,
  update,
  questionIndex,
}: any) {
  const [type, setType] = useState();
  const [textField, setTextField] = useState("yes");

  const handleType = (value: any) => {
    const prevValue = getValues(`question[${questionIndex}]`);
    update(questionIndex, { ...prevValue, type: value });
    setType(value);
  };
  const handleTextField = (value: any) => {
    const prevValue = getValues(`question[${questionIndex}]`);
    update(questionIndex, {
      ...prevValue,
      addOtherOption: value === "yes" ? true : false,
    });

    setTextField(value);
  };

  const questionOptions = [
    {
      value: "1",
      label: "Single Choice",
    },
    {
      value: "2",
      label: "Multiple Choice",
    },
    {
      value: "3",
      label: "Text",
    },
  ];
  const options = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];
  useEffect(() => {
    if (getValues(`question[${questionIndex}].type`) !== "")
      setType(getValues(`question[${questionIndex}].type`));
    if (getValues(`question[${questionIndex}].addOtherOption`) !== undefined)
      setTextField(
        getValues(`question[${questionIndex}].addOtherOption`) === true
          ? "yes"
          : "no"
      );
  }, []);
  return (
    <>
      <Card
        className="mb-5 bg-primary-color dark:bg-gray-800"
        key={questionIndex}
      >
        <CardBody>
          <div className=" flex justify-between">
            <p className="text-[#fff]">Question {questionIndex + 1}</p>
            <DeleteButton
              classes="ml-auto block"
              onClick={() => remove(questionIndex)}
            />
          </div>

          <div className="flex gap-5 w-full">
            <div className="flex flex-col w-full relative">
              <Label className="pt-3 pb-[6px] block capitalize whitespace-nowrap">
                Type
              </Label>
              <CustomSelect
                value={type}
                onChange={handleType}
                options={questionOptions}
                name="type"
                placeholder="Enter Question Type"
              />
            </div>
            <FormInput
              classes=""
              label="Question"
              name={`question.${questionIndex}.question`}
              placeholder="Enter Question"
            />
          </div>

          {(type === "1" || type === "2") && (
            <>
              <Option nestIndex={questionIndex} {...{ control, register }} />

              <div className="relative">
                <Label className="pt-3 pb-[6px] block capitalize whitespace-nowrap">
                  Add other option text field
                </Label>
                <RadioGroup
                  defaultValue={"yes"}
                  value={textField}
                  className="flex mt-2 gap-5"
                  onValueChange={(value) => {
                    handleTextField(value);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    {options.map((option) => (
                      <React.Fragment key={option.value}>
                        <RadioGroupItem value={option.value} id="r2" />
                        <Label htmlFor="r2">{option.label}</Label>
                      </React.Fragment>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </>
          )}
          {(textField === "yes" || type === "3") && (
            <>
              <FormInput
                label="Placeholder Text"
                name={`question.${questionIndex}.textPlaceholder`}
                placeholder="Enter PlaceHolder text"
              />
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
}

export default Question;
