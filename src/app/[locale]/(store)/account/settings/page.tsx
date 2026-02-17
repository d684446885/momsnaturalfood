"use client";

import React from "react";
import { Lock, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif font-bold text-secondary">Settings</h1>
        <p className="text-muted-foreground">Manage your account security and notifications.</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-secondary flex items-center gap-2">
            <Lock className="h-5 w-5" /> Security
          </h2>
          <div className="p-6 rounded-2xl border bg-white dark:bg-zinc-900 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-medium">Password</p>
                <p className="text-sm text-muted-foreground">Change your password to keep your account secure.</p>
              </div>
              <Button variant="outline" className="rounded-full">Update</Button>
            </div>
            <div className="border-t pt-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
              </div>
              <Switch />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-secondary flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notifications
          </h2>
          <div className="p-6 rounded-2xl border bg-white dark:bg-zinc-900 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-medium">Order Updates</p>
                <p className="text-sm text-muted-foreground">Receive emails about your order status and shipping.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="border-t pt-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-medium">Newsletter</p>
                <p className="text-sm text-muted-foreground">Stay updated with our latest products and deals.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </section>

        <div className="pt-4 border-t">
          <Button variant="destructive" className="rounded-full px-8">Delete Account</Button>
          <p className="text-xs text-muted-foreground mt-2">This action is permanent and cannot be undone.</p>
        </div>
      </div>
    </div>
  );
}
