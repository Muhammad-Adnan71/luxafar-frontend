import AddButton from "components/CMS/components-ui/addButton";
import DeleteButton from "components/CMS/components-ui/deleteButton";
import FormInput from "components/CMS/components-ui/form/formInput";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";

function Option({ nestIndex, control }: any) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `question.${nestIndex}.bespokeQuestionOptions`,
  });
  return (
    <div>
      {fields.map((item, k) => {
        return (
          <div key={k} className=" flex  items-end gap-2">
            <FormInput
              label={"option " + (k + 1)}
              name={`question[${nestIndex}].bespokeQuestionOptions[${k}].label`}
              placeholder="Enter Option"
            />
            <DeleteButton onClick={() => remove(k)} classes="mb-3" />
          </div>
        );
      })}
      <AddButton
        text="Add Option"
        classes="text-[12px] mt-0"
        onClick={() =>
          append({
            label: "",
          })
        }
      />
    </div>
  );
}

export default Option;
