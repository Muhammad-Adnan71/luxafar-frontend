import React from "react";
import Button from "./button";

function Pagination({
  onPagination,
  totalResults,
  currentPage,
  resultsPerPage,
}: {
  onPagination: Function;
  totalResults: number;
  currentPage: number;
  resultsPerPage: number;
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
    <>
      <ul className="mt-20  text-[#5A5A5A]  flex justify-center ">
        {pageCount > 1 &&
          pagesArray().map((item: any, index) => (
            <li
              onClick={(e) => onPagination(item, e)}
              key={item}
              className={`hover:text-secondary-color  transition-all text-xs font-semibold font-body cursor-pointer lg:first:pl-0 px-4 max-md:px-4 relative after:absolute after:top-0 after:left-full after:w-[2px] after:h-[20px] after:bg-[#5A5A5A] last:after:hidden  max-lg:mb-[12px] max-[350px]:mb-[8px]  
               ${currentPage === index + 1 ? " text-secondary-color " : ""}
               `}
            >
              {item}
            </li>
          ))}
      </ul>

      {pageCount > 1 && (
        <Button
          buttonType="button"
          text={currentPage === pageCount ? "Previous Page" : "Next Page"}
          onClick={(e) => {
            if (currentPage === pageCount) {
              onPagination(currentPage - 1, e);
            } else {
              onPagination(currentPage + 1, e);
            }
          }}
          classes="mx-auto block my-10 mt-6"
        />
      )}
    </>
  );
}

export default Pagination;
