import { cn } from "lib/utils";
import React from "react";

function MainHeadingContent({
  content,
  strongClasses,
}: {
  content?: string;
  strongClasses?: string;
}) {
  const words = content?.split(" ");

  return (
    <div className="block">
      {words?.map((word: any, index: number) => {
        if (word.endsWith(`|`)) {
          if (word.startsWith(`"`)) {
            return (
              <strong
                dangerouslySetInnerHTML={{
                  __html:
                    `${word.replaceAll(`"`, "").replaceAll(`|`, "")} <br/> ` ??
                    "",
                }}
                key={index}
                className={cn(
                  " mt-2 text-secondary-color !font-heading",
                  strongClasses
                )}
              ></strong>
            );
          } else
            return (
              <span
                key={index}
                dangerouslySetInnerHTML={{
                  __html: `${word.replaceAll(`|`, "")} <br/> ` ?? "",
                }}
              ></span>
            );
        } else {
          if (word.startsWith(`"`)) {
            return (
              <strong
                key={index}
                className={cn(
                  " mt-2 text-secondary-color !font-heading",
                  strongClasses
                )}
              >
                {word.replaceAll(`"`, "") + " "}
              </strong>
            );
          } else
            return <React.Fragment key={index}>{`${word} `}</React.Fragment>;
        }
      })}
    </div>
  );
}

export default MainHeadingContent;
