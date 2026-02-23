import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import fs from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const uploadsPath = path.join(process.cwd(), "public", "uploads");
    
    // Ensure directory exists
    try {
      await fs.access(uploadsPath);
    } catch {
      await fs.mkdir(uploadsPath, { recursive: true });
      return NextResponse.json({ files: [] });
    }

    const getAllFiles = async (dirPath: string): Promise<any[]> => {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const files = await Promise.all(entries.map(async (entry) => {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.relative(path.join(process.cwd(), "public"), fullPath).replace(/\\/g, '/');
        
        if (entry.isDirectory()) {
          return getAllFiles(fullPath);
        } else {
          const stats = await fs.stat(fullPath);
          return {
            name: entry.name,
            url: `/${relativePath}`,
            size: stats.size,
            mtime: stats.mtime,
          };
        }
      }));
      return files.flat();
    };

    const allMedia = await getAllFiles(uploadsPath);
    
    // Sort by most recent
    allMedia.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

    return NextResponse.json({ files: allMedia });
  } catch (error: any) {
    console.error("Media explorer error:", error);
    return NextResponse.json({ error: error.message || "Failed to list media" }, { status: 500 });
  }
}
