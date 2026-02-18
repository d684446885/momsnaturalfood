"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@/i18n/routing";
import { signOut, useSession } from "next-auth/react";
import { 
  User, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  ShoppingBag,
  Heart
} from "lucide-react";

export function UserNav() {
  const { data: session } = useSession();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="group">
        <User className="h-5 w-5 group-hover:text-primary transition-colors" />
      </Button>
    );
  }

  if (!session?.user) {
    return (
      <Link href="/login">
        <Button variant="ghost" size="icon" className="group">
          <User className="h-5 w-5 group-hover:text-primary transition-colors" />
        </Button>
      </Link>
    );
  }

  const initials = session.user.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("")
    : session.user.email?.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-primary/20">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
            <AvatarFallback className="bg-primary/5 text-primary font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal font-sans">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold font-serif text-secondary leading-none">
              {session.user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {session.user.role === "ADMIN" ? (
            <Link href="/dashboard">
              <DropdownMenuItem className="cursor-pointer gap-2 focus:bg-primary/5">
                <LayoutDashboard className="h-4 w-4 text-primary" />
                <span>Dashboard</span>
              </DropdownMenuItem>
            </Link>
          ) : (
            <Link href="/account">
              <DropdownMenuItem className="cursor-pointer gap-2 focus:bg-primary/5">
                <LayoutDashboard className="h-4 w-4 text-primary" />
                <span>Account</span>
              </DropdownMenuItem>
            </Link>
          )}
          <Link href="/account/orders">
            <DropdownMenuItem className="cursor-pointer gap-2 focus:bg-primary/5">
              <ShoppingBag className="h-4 w-4 text-secondary" />
              <span>My Orders</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/wishlist">
            <DropdownMenuItem className="cursor-pointer gap-2 focus:bg-primary/5">
              <Heart className="h-4 w-4 text-secondary" />
              <span>Wishlist</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/account/settings">
            <DropdownMenuItem className="cursor-pointer gap-2 focus:bg-primary/5">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer gap-2 text-rose-600 focus:bg-rose-50"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
