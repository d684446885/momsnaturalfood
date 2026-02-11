import { db } from "@/lib/db";
import { HomeClient } from "./home-client";

async function getHomeContent() {
  try {
    const homePage = await db.homePage.findUnique({
      where: { id: "global" }
    });
    return homePage;
  } catch (error) {
    console.error("Error fetching home content:", error);
    return null;
  }
}

export default async function Home() {
  const content = await getHomeContent();
  
  // Serialize Date objects and ensure plain object
  const serializedContent = content ? {
    ...content,
    updatedAt: content.updatedAt.toISOString(),
    // features is already Json, which is serializable
  } : null;

  return <HomeClient content={serializedContent} />;
}
