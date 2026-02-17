"use client";

import React from "react";
import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AddressesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif font-bold text-secondary">Addresses</h1>
          <p className="text-muted-foreground">Manage your shipping and billing addresses.</p>
        </div>
        <Button className="rounded-full gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center gap-4 text-muted-foreground bg-muted/20">
          <MapPin className="h-10 w-10 opacity-20" />
          <p className="text-sm">No addresses saved yet.</p>
        </div>
      </div>
    </div>
  );
}
