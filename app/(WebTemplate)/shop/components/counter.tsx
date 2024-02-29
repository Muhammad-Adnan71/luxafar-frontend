import NameHeading from "@template-components/nameHeading";
import React, { useState } from "react";

const Counter = ({ isInnerPage }: { isInnerPage?: boolean }) => {
  const quantity = 1;
  const [productQuantity, setProductQuantity] = useState(quantity);

  return (
    <div
      className={`flex justify-between items-center bg-quaternary-color ${
        isInnerPage ? "mb-0 max-[410px]:w-[70px] w-[90px]" : "mb-8 w-[110px]"
      }`}
    >
      <button
        onClick={() => {
          if (productQuantity > 1) setProductQuantity(productQuantity - 1);
        }}
        className={`text-white  bg-secondary-color p-[2px] px-[8px] rounded-[5px] ${
          isInnerPage ? "text-[16px] min-[410px]:text-[18px]" : "text-[24px]"
        }`}
      >
        -
      </button>
      <input
        onChange={(e: any) => {
          if (+e.target.value > 0 && +e.target.value < 100) {
            setProductQuantity(+e.target.value);
          } else if (+e.target.value === 0) {
            setProductQuantity(1);
          }
        }}
        className={`border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none inline bg-[transparent] w-[20px] text-center text-secondary-color ${
          isInnerPage ? "text-[13px]" : "text-[16px]"
        }`}
        type="number"
        value={productQuantity}
        min={1}
        max={99}
      />
      <button
        onClick={() => {
          if (productQuantity < 99) setProductQuantity(productQuantity + 1);
        }}
        className={`text-white bg-secondary-color p-[2px] px-[5px] rounded-[5px] ${
          isInnerPage ? "text-[16px] min-[410px]:text-[18px]" : "text-[24px]"
        }`}
      >
        +
      </button>
    </div>
  );
};

export default Counter;
