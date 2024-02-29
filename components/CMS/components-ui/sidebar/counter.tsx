import React from "react";

function Counter({ count }: { count: number }) {
  return (
    <span className=" w-5 h-5 rounded-full flex justify-center items-center bg-quaternary-color font-light text-[12px] hover:text-[#fff]">
      {count}
    </span>
  );
}

export default Counter;
