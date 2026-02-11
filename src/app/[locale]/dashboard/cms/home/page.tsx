import { db } from "@/lib/db";
import { HomeCMSClient } from "./home-client";

async function getHomeContent() {
  try {
    const homePage = await db.homePage.findUnique({
      where: { id: "global" }
    });
    
    return homePage || {
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
        
        features: []
    };
  } catch (error) {
    console.error("Error fetching home page:", error);
    return {
        // Fallback identical to default
        heroTitle: "Wholesome",
        heroTitleAccent: "Natural Foods",
        heroSubtitle: "",
        heroDescription: "Experience difference...",
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
        ctaSubtitle: "Sign up for our newsletter...",
        whyTitle: "Why Mom's Naturals Foods?",
        whyDescription: "We create MOM'S Naturals Foods...",
        whyLearnMoreText: "Learn More",
        whyLearnMoreLink: "/about",
        whyBackgroundUrl: "",
        whyCards: [],
        features: []
    };
  }
}

export default async function HomeCMSPage() {
  const content = await getHomeContent();
  return <HomeCMSClient initialContent={content as any} />;
}
