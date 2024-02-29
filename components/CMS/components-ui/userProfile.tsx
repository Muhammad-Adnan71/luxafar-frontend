import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./shadcn/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./shadcn/ui/avatar";
import { PersonIcon, ExitIcon } from "@radix-ui/react-icons";
import useAuthStore from "store/useAuthUser";
import { useRouter } from "next/navigation";
import { apiLogoutUser } from "services/auth";

function UserProfile() {
  const store = useAuthStore();

  const router = useRouter();
  const handleLogout = async () => {
    store.setRequestLoading(true);
    try {
      await apiLogoutUser();
    } catch (error) {
    } finally {
      store.reset();
      router.push("/admin");
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={
                store?.authUser?.media.desktopMediaUrl
                  ? (store.authUser.media.desktopMediaUrl as string)
                  : "https://i.pravatar.cc/300"
              }
            />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-cms-tertiary-color w-[150px] border-cms-primary-color text-white dark:text-gray-200 dark:bg-gray-800 dark:border-gray-900"
        >
          <DropdownMenuItem
            onClick={() => router.push("/admin/user/profile")}
            className={`flex gap-3 items-center  dark:text-gray-200 cursor-pointer hover:bg-cms-primary-color dark:hover:bg-gray-900`}
          >
            <PersonIcon /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            className={`flex gap-3 dark:text-gray-200 cursor-pointer hover:bg-cms-primary-color dark:hover:bg-gray-900`}
          >
            <ExitIcon />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default UserProfile;
