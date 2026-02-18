"use client";

import React, { useState, useRef } from "react";
import { ImagePlus, X, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface R2ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function R2ImageUpload({ images, onChange, maxImages = 5, className }: R2ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const newImages: string[] = [];

      for (const file of Array.from(files)) {
        if (images.length + newImages.length >= maxImages) {
          toast.error(`Maximum ${maxImages} images allowed`);
          break;
        }

        // Vercel and some gateways have a 4.5MB - 5MB limit for body size
        const MAX_FILE_SIZE = 4.5 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File ${file.name} is too large. Max size is 4.5MB for stability.`);
          continue;
        }

        // Create FormData for local upload
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });

        const contentType = response.headers.get("content-type");
        
        if (!response.ok) {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to upload file");
          } else {
            // Handle HTML error pages (like 413 Request Entity Too Large)
            const text = await response.text();
            if (response.status === 413) {
              throw new Error("File is too large for the server to process. Please try a smaller image (under 4MB).");
            }
            throw new Error(`Upload failed (${response.status}): ${response.statusText}`);
          }
        }

        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid server response (not JSON)");
        }

        const { url } = await response.json();
        newImages.push(url);
      }

      onChange([...images, ...newImages]);
      toast.success(`${newImages.length} image(s) uploaded successfully`);
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(error.message);
      toast.error(error.message || "Failed to upload images");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-muted group">
            <Image
              src={url}
              alt={`Product image ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label
            className={cn(
              "aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors",
              isUploading 
                ? "border-primary/50 bg-primary/5 cursor-wait" 
                : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="text-xs text-muted-foreground mt-2">Uploading...</span>
              </>
            ) : (
              <>
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-2">Add Image</span>
              </>
            )}
          </label>
        )}
      </div>

      {uploadError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {images.length} of {maxImages} images • Supports all image formats (max 5MB)
      </p>
    </div>
  );
}
