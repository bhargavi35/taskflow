"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./sidebar";

export function Topbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <>
      <header className="h-16 border-b bg-white flex items-center justify-between px-4 md:px-6">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <div className="flex-1" />

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-50">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-medium text-gray-700">
                {session?.user?.name}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="text-sm text-gray-500" disabled>
              {session?.user?.email}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <a href="/settings" className="flex items-center gap-2 w-full">
                <User className="h-4 w-4" /> Settings
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-red-600 focus:text-red-600"
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}
