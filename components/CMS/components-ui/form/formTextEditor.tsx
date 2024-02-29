import TextEditor from "lib/text-editor";
import FormLabel from "./formLabel";
import { Controller, useFormContext } from "react-hook-form";
import ErrorText from "./errorText";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "components/CMS/components-ui/shadcn/ui/hover-card";
import { InfoIcon } from "lucide-react";
function FormTextEditor({
  label,
  name = "description",
  defaultValue,
  readonly,
  informationText,
}: {
  informationText?: string;
  label: string;
  name?: string;
  defaultValue?: string;
  readonly?: boolean;
}) {
  const {
    control,
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike"],
      [
        {
          color: [
            "red",
            "blue",
            "yellow",
            "white",
            "black",
            "green",
            "#A69769",
            "#0F4150",
            "#092730",
          ],
        },
      ],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "color",
  ];

  return (
    <>
      <div className="relative mb-3">
        <div className="flex items-center gap-[10px]">
          <FormLabel>{label}</FormLabel>
          {informationText && (
            <div className="mt-1">
              <HoverCard openDelay={300}>
                <HoverCardTrigger>
                  {<InfoIcon className="w-[15px] h-[15px] text-white" />}
                </HoverCardTrigger>
                <HoverCardContent className="px-3 py-2 text-xs  w-fit bg-cms-primary-color border-cms-fourth-color max-w-[200px] text-white font-normal dark:bg-gray-800 dark:border-gray-900">
                  {informationText}
                </HoverCardContent>
              </HoverCard>
            </div>
          )}
        </div>
        <Controller
          control={control}
          {...register(name)}
          render={({ field: { onChange, onBlur, value } }) => {
            return (
              <TextEditor
                modules={modules}
                formats={formats}
                readOnly={readonly ? readonly : isSubmitting}
                onChange={(description, delta, source, editor) => {
                  onChange(
                    editor.getText().trim().length === 0 ? "" : description
                  );
                }}
                value={defaultValue ? defaultValue : value || ""}
                placeholder="description"
                className="border text-white border-cms-tertiary-color dark:border-gray-900 rounded placeholder:text-[#fff]"
                theme="snow"
              />
            );
          }}
        />

        {errors[name] && <ErrorText message={errors[name]?.message} />}
      </div>
    </>
  );
}

export default FormTextEditor;
