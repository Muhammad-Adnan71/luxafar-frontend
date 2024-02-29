"use client";
import { useContext } from "react";
import SidebarContext from "@context/SidebarContext";
import logo from "@public/template/logo.png";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./themeToggleMode";
import UserProfile from "./userProfile";
import useSession from "lib/useSession";

function Header() {
  const { toggleSidebar } = useContext(SidebarContext);
  const user = useSession();
  return (
    <header className="z-40 py-5 bg-cms-primary-color shadow-bottom dark:bg-gray-800 relative ">
      <div className=" flex items-center justify-between h-full px-14 mx-auto text-secondary-color dark:text-cms-secondary-color">
        <div className="flex items-center ">
          <button
            className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
            onClick={toggleSidebar}
            aria-label="Menu"
          ></button>
          <Link
            href="/admin/dashboard"
            passHref
            className="text-lg font-bold text-gray-800 dark:text-gray-200"
          >
            <div className="-ml-0 py-2">
              <Image src={logo} alt="logo" className="w-[150px]" />
            </div>
          </Link>
        </div>
        <ul className="flex items-center flex-shrink-0 space-x-3 text-">
          <li className="flex">
            <ModeToggle />
          </li>
          <li className="flex gap-2 items-center">
            <p className="capitalize">{user && user?.name}</p>
            <UserProfile />
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
