import { db } from "@/lib/db";
import { HomeClient } from "./home-client";
import { unstable_cache, revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const getHomeContent = unstable_cache(
  async () => {
    try {
      const homePage = await db.homePage.findUnique({
        where: { id: "global" }
      });
      
      if (homePage) return homePage;

      // Same fallbacks as CMS page to ensure guests see content even if DB is empty
      return {
        id: "global",
        heroTitle: "Wholesome",
        heroTitleAccent: "Natural Foods",
        heroSubtitle: "",
        heroDescription: "Experience the difference of real, unadulterated ingredients. We bring you products that are as close to nature as possible, free from artificial additives and preservatives.",
        heroPrimaryCtaText: "Shop Now",
        heroPrimaryCtaLink: "/products",
        heroSecondaryCtaText: "View Collections",
        heroSecondaryCtaLink: "/categories",
        heroBackgroundUrl: "",
        heroBackgroundType: "image",
        categoriesTitle: "Shop by Category",
        categoriesSubtitle: "Explore our diverse range",
        featuredTitle: "Seasonal Specials",
        featuredSubtitle: "Fresh from the earth to your table",
        ctaTitle: "Get 20% Off Your First Order",
        ctaSubtitle: "Sign up for our newsletter and receive exclusive deals, new arrivals, and more!",
        ctaMediaUrl: "",
        ctaMediaType: "image",
        whyTitle: "Why Mom's Naturals Foods?",
        whyDescription: "We create MOM'S Naturals Foods for people who want both health and taste — no compromises.\n\nOur products are free from chemical additives, coloring, flavoring, and sugar — only pure, natural ingredients.",
        whyLearnMoreText: "Learn More",
        whyLearnMoreLink: "/about",
        whyBackgroundUrl: "",
        whyCards: [
          { type: "video", url: "" },
          { type: "video", url: "" },
          { type: "video", url: "" },
          { type: "video", url: "" }
        ],
        promoCards: [
          { title: "Pure Ingredients", description: "Only the best from nature.", videoUrl: "", mediaType: "image" },
          { title: "Baked with Love", description: "Small batches, big heart.", videoUrl: "", mediaType: "image" }
        ],
        promoSectionBgUrl: "",
        features: [],
        updatedAt: new Date()
      };
    } catch (error) {
      console.error("Error fetching home content:", error);
      return null;
    }
  },
  ["home-content"],
  { revalidate: 60, tags: ["home-content"] } // Reduced to 60s for better responsiveness to changes
);

export default async function Home() {
  const content = await getHomeContent();
  
  // Serialize Date objects and ensure plain object
  const serializedContent = content ? {
    ...content,
    updatedAt: content.updatedAt ? new Date(content.updatedAt).toISOString() : new Date().toISOString(),
  } : null;

  return <HomeClient content={serializedContent} />;
}
