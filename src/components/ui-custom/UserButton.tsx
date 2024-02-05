"use client";

import { FaUser } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks";
import { LogoutButton } from "@/components";
import { ExitIcon } from "@radix-ui/react-icons";

export function UserButton() {
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className=" bg-rose-500 ">
            <FaUser className=" text-white " size={20} />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" w-40 " align="end" >
        <LogoutButton>
          <DropdownMenuItem>
            <ExitIcon className=" w-4 h-4 mr-2 " />
            Salir
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

