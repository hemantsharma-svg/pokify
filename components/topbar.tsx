"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, LogIn, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useApp } from "@/lib/store";

export function Topbar({ onAuthClick }: { onAuthClick: () => void }) {
  const router = useRouter();
  const { user, logout } = useApp();
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex items-center justify-between gap-4 bg-black/60 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.forward()}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSearchSubmit} className="w-full max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to play?"
            className="rounded-full border-none bg-neutral-800 pl-9 text-white placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-white"
          />
        </div>
      </form>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full bg-neutral-800 py-1 pl-1 pr-3 text-sm font-medium text-white">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-green-600 text-xs text-white">
                  {user.displayName.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {user.displayName}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/library">Your Library</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={onAuthClick} className="rounded-full bg-white px-6 font-semibold text-black hover:bg-neutral-200">
          <LogIn className="mr-2 h-4 w-4" /> Log in
        </Button>
      )}
    </div>
  );
}
