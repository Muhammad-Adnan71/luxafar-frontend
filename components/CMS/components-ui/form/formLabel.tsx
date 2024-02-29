import React, { ReactNode } from "react";
import { Label } from "../shadcn/ui/label";

function FormLabel({ children }: { children: ReactNode }) {
  return (
    <Label className="pt-3 pb-[6px] block capitalize whitespace-nowrap">
      {children}:
    </Label>
  );
}

export default FormLabel;
