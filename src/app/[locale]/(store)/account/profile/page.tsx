"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { User, Mail, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const t = useTranslations("Account");
  const { data: session } = useSession();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif font-bold text-secondary">{t('profile')}</h1>
        <p className="text-muted-foreground">Manage your personal information and how it appears.</p>
      </div>

      <div className="flex flex-col items-center sm:flex-row gap-6 p-6 rounded-2xl bg-muted/30 border border-border/50">
        <div className="relative group">
          <Avatar className="h-24 w-24 border-4 border-white dark:border-zinc-800 shadow-xl">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
              {session?.user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <h3 className="text-xl font-bold text-secondary">{session?.user?.name}</h3>
          <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
            <Mail className="h-4 w-4" /> {session?.user?.email}
          </p>
        </div>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" defaultValue={session?.user?.name || ""} placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" defaultValue={session?.user?.email || ""} placeholder="john@example.com" disabled />
          <p className="text-[10px] text-muted-foreground">Email cannot be changed directly.</p>
        </div>
        <div className="md:col-span-2">
          <Button className="rounded-full px-8">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
