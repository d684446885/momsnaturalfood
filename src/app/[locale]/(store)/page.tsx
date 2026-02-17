import { db } from "@/lib/db";
import { HomeClient } from "./home-client";
import { unstable_cache } from "next/cache";

const getHomeContent = unstable_cache(
  async () => {
    try {
      const homePage = await db.homePage.findUnique({
        where: { id: "global" }
      });
      return homePage;
    } catch (error) {
      console.error("Error fetching home content:", error);
      return null;
    }
  },
  ["home-content"],
  { revalidate: 3600, tags: ["home-content"] }
);

export default async function Home() {
  const content = await getHomeContent();
  
  // Serialize Date objects and ensure plain object
  const serializedContent = content ? {
    ...content,
    updatedAt: (content.updatedAt as Date).toISOString(),
  } : null;

  return <HomeClient content={serializedContent} />;
}
