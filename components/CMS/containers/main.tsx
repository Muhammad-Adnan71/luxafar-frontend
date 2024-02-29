import React from "react";

interface IMain {
  children: React.ReactNode;
}

function Main({ children }: IMain) {
  return (
    <main className="h-[calc(100vh-81px)] overflow-y-auto">
      <div className=" grid px-6 mx-auto">{children}</div>
    </main>
  );
}

export default Main;
