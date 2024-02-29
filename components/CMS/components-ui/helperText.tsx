import React from "react";

function HelperText({
  children,
  valid,
}: {
  children: React.ReactNode;
  valid: boolean;
}) {
  return <p>{children}</p>;
}

export default HelperText;
