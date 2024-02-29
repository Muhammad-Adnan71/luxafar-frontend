import React, { useContext } from "react";
import Header from "../components-ui/header";
import SidebarContext, { SidebarProvider } from "@context/SidebarContext";
import Sidebar from "../components-ui/sidebar";
import Main from "./main";
import { ThemeProvider } from "../theme-provider";
interface ILayout {
  children: React.ReactNode;
}

function Layout({ children }: ILayout) {
  const { isSidebarOpen } = useContext(SidebarContext);
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <div className="h-screen overflow-hidden">
          <Header />
          <div
            className={`flex h-[calc(100vh-81px)] bg-cms-tertiary-color bg-blend-multiply bg-fixed  dark:bg-gray-900 ${
              isSidebarOpen && "overflow-hidden"
            }`}
          >
            <Sidebar />
            <div className="flex flex-col flex-1 w-full">
              <Main>{children}</Main>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default Layout;
