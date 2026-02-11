"use client";

import React from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import { X, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  return (
    <div className="space-y-4 w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatePresence>
          {value.map((url) => (
            <motion.div
              key={url}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary/10 shadow-sm group"
            >
              <img
                src={url}
                alt="Product"
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="absolute top-2 right-2 p-1 bg-destructive/90 text-destructive-foreground rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="border-2 border-dashed border-primary/20 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors p-2">
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            const urls = res.map((f) => f.url);
            onChange([...value, ...urls]);
            toast.success("Images uploaded successfully");
          }}
          onUploadError={(error: Error) => {
            toast.error(`Upload failed: ${error.message}`);
          }}
          appearance={{
            button: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm",
            label: "text-secondary font-serif text-lg",
            allowedContent: "text-muted-foreground text-xs",
            container: "cursor-pointer"
          }}
          content={{
            label: "Drag & drop natural product photos",
            allowedContent: "Images up to 4MB"
          }}
        />
      </div>
    </div>
  );
}
