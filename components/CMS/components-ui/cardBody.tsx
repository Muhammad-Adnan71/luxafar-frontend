import React from "react";

function CardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "bg-cms-primary-color px-5 py-7 dark:bg-gray-800 rounded-lg " +
        className
      }
    >
      {children}
    </div>
  );
}

export default CardBody;
