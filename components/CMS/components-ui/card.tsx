import React from "react";

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={" overflow-hidden rounded-md " + className}>{children}</div>
  );
}

export default Card;
