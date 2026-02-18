"use client";

import React, { useState, useRef } from "react";
import { ImagePlus, Video, X, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SingleMediaUploadProps {
  value: string;
  type: "image" | "video";
  onChange: (url: string) => void;
  onTypeChange: (type: "image" | "video") => void;
  className?: string;
  label?: string;
}

export function SingleMediaUpload({ value, type, onChange, onTypeChange, className, label }: SingleMediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Auto-detect type if possible and update parent
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (isVideo && type !== "video") {
      onTypeChange("video");
    } else if (isImage && type !== "image") {
      onTypeChange("image");
    }

    // Still validate for the current (possibly updated) type
    if (type === "image" && !isImage && !isVideo) {
      toast.error("Please upload an image file");
      return;
    }
    if (type === "video" && !isVideo && !isImage) {
      toast.error("Please upload a video file");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload file");
      }

      const { url } = await response.json();
      onChange(url);
      toast.success("File uploaded successfully");
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(error.message);
      toast.error(error.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      
      <div className="flex items-center gap-4 mb-2">
        <Button
          type="button"
          variant={type === "image" ? "default" : "outline"}
          size="sm"
          onClick={() => onTypeChange("image")}
          className="gap-2"
        >
          <ImagePlus className="h-4 w-4" />
          Image
        </Button>
        <Button
          type="button"
          variant={type === "video" ? "default" : "outline"}
          size="sm"
          onClick={() => onTypeChange("video")}
          className="gap-2"
        >
          <Video className="h-4 w-4" />
          Video
        </Button>
      </div>

      <div className="relative aspect-video w-full max-w-xl rounded-lg overflow-hidden border bg-muted group">
        {value ? (
          <>
            {type === "image" ? (
              <Image
                src={value}
                alt="Uploaded content"
                fill
                className="object-cover"
              />
            ) : (
              <video 
                src={value} 
                className="w-full h-full object-cover" 
                controls
              />
            )}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
              className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <label
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center cursor-pointer transition-colors",
              isUploading 
                ? "bg-primary/5 cursor-wait" 
                : "hover:bg-primary/5"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={type === "image" ? "image/*" : "video/*"}
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
                {type === "image" ? (
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <Video className="h-8 w-8 text-muted-foreground" />
                )}
                <span className="text-xs text-muted-foreground mt-2">
                  Click to upload {type}
                </span>
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
    </div>
  );
}
