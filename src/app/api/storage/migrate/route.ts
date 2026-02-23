import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import fs from "fs/promises";
import path from "path";
import axios from "axios";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = {
      downloaded: 0,
      updated: 0,
      errors: 0,
      files: [] as string[]
    };

    const uploadsPath = path.join(process.cwd(), "public", "uploads");
    try {
      await fs.access(uploadsPath);
    } catch {
      await fs.mkdir(uploadsPath, { recursive: true });
    }

    const downloadAndSave = async (url: string): Promise<string | null> => {
      // Skip if already local or not a valid URL
      if (!url || url.startsWith("/") || !url.startsWith("http")) return null;

      try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);
        
        const fileName = `${Date.now()}-${path.basename(new URL(url).pathname).replace(/[^a-zA-Z0-9.]/g, '_')}`;
        await fs.writeFile(path.join(uploadsPath, fileName), buffer);
        
        stats.downloaded++;
        stats.files.push(fileName);
        return `/uploads/${fileName}`;
      } catch (err) {
        console.error(`Failed to migrate ${url}:`, err);
        stats.errors++;
        return null;
      }
    };

    // 1. Migrate Settings (Logo)
    const settings = await db.settings.findUnique({ where: { id: "global" } });
    if (settings?.logoUrl) {
      const newUrl = await downloadAndSave(settings.logoUrl);
      if (newUrl) {
        await db.settings.update({ where: { id: "global" }, data: { logoUrl: newUrl } });
        stats.updated++;
      }
    }

    // 2. Migrate Products
    const products = await db.product.findMany();
    for (const product of products) {
      const newImages = [];
      let changed = false;
      for (const imgUrl of product.images) {
        const newUrl = await downloadAndSave(imgUrl);
        if (newUrl) {
          newImages.push(newUrl);
          changed = true;
        } else {
          newImages.push(imgUrl);
        }
      }
      if (changed) {
        await db.product.update({ where: { id: product.id }, data: { images: newImages } });
        stats.updated++;
      }
    }

    // 3. Migrate Deals
    const deals = await db.deal.findMany();
    for (const deal of deals) {
      const newImages = [];
      let changed = false;
      for (const imgUrl of deal.images) {
        const newUrl = await downloadAndSave(imgUrl);
        if (newUrl) {
          newImages.push(newUrl);
          changed = true;
        } else {
          newImages.push(imgUrl);
        }
      }
      if (changed) {
        await db.deal.update({ where: { id: deal.id }, data: { images: newImages } });
        stats.updated++;
      }
    }

    // 4. Migrate Certifications
    const certs = await db.certification.findMany();
    for (const cert of certs) {
      const newUrl = await downloadAndSave(cert.imageUrl);
      if (newUrl) {
        await db.certification.update({ where: { id: cert.id }, data: { imageUrl: newUrl } });
        stats.updated++;
      }
    }

    // 5. Migrate Home Page
    const home = await db.homePage.findUnique({ where: { id: "global" } });
    if (home) {
      const data: any = {};
      if (home.heroBackgroundUrl) {
        const url = await downloadAndSave(home.heroBackgroundUrl);
        if (url) data.heroBackgroundUrl = url;
      }
      if (home.ctaMediaUrl) {
        const url = await downloadAndSave(home.ctaMediaUrl);
        if (url) data.ctaMediaUrl = url;
      }
      if (home.whyBackgroundUrl) {
        const url = await downloadAndSave(home.whyBackgroundUrl);
        if (url) data.whyBackgroundUrl = url;
      }
      if (Object.keys(data).length > 0) {
        await db.homePage.update({ where: { id: "global" }, data });
        stats.updated++;
      }
    }

    // 6. Migrate About Page
    const about = await db.aboutPage.findUnique({ where: { id: "global" } });
    if (about) {
      const data: any = {};
      const fields = ['heroBackgroundUrl', 'storyImageUrl', 'missionImageUrl', 'qualityBackgroundUrl'];
      for (const field of fields) {
        if ((about as any)[field]) {
          const url = await downloadAndSave((about as any)[field]);
          if (url) data[field] = url;
        }
      }
      if (Object.keys(data).length > 0) {
        await db.aboutPage.update({ where: { id: "global" }, data });
        stats.updated++;
      }
    }

    return NextResponse.json({ 
        success: true, 
        message: "Migration completed successfully",
        stats 
    });

  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: error.message || "Migration failed" }, { status: 500 });
  }
}
