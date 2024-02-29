import React from "react";
import { Button } from "./shadcn/ui/button";

function Pagination({
  totalResults = 0,
  resultsPerPage = 0,
  currentPage,
  onPagination,
}: {
  onPagination?: Function;
  totalResults?: number;
  currentPage?: number;
  resultsPerPage?: number;
}) {
  const pageCount = Math.ceil(totalResults / resultsPerPage);
  const pagesArray = () => {
    let arr = [];
    for (let index = 0; index < pageCount; index++) {
      arr.push(index + 1);
    }
    return arr;
  };
  return (
    <div>
      <ul className="mt-5  text-[#5A5A5A]  flex gap-1 ml-auto justify-end">
        {pageCount &&
          pagesArray().map((item: any, index) => (
            <li className=" " key={item}>
              <Button
                onClick={() => onPagination && onPagination(item)}
                className={`px-3 ${
                  item === currentPage
                    ? "bg-cms-primary-color/50 text-cms-secondary-color"
                    : ""
                }`}
              >
                {item}
              </Button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Pagination;
