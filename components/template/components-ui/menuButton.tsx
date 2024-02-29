import React from "react";
type component = {
  classes?: String;
  isOpen?: Boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

function MenuButton({ classes, isOpen, onClick }: component) {
  return (
    <div
      onClick={onClick}
      className={` flex flex-col gap-y-[7px] :hover cursor-pointer ` + classes}
    >
      <span
        className={` w-7 h-[2px] bg-secondary-color transition-all duration-300 inline-block rounded-lg ${
          isOpen ? "rotate-45 translate-x-[5px] translate-y-[5px]" : ""
        } `}
      ></span>
      <span
        className={`w-7 h-[2px] bg-secondary-color transition-all duration-300 inline-block ${
          isOpen ? "opacity-0" : ""
        }`}
      ></span>
      <span
        className={`w-7 h-[2px] bg-secondary-color transition-all duration-300 inline-block ${
          isOpen ? "-rotate-45 translate-x-[5.1px] -translate-y-[12.5px]" : ""
        }`}
      ></span>
    </div>
  );
}

export default MenuButton;
