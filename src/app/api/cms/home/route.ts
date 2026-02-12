import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const homePage = await db.homePage.findUnique({
      where: { id: "global" }
    });

    if (!homePage) {
      // Return default values matching the current hardcoded content
      return NextResponse.json({
        heroTitle: "Wholesome",
        heroTitleAccent: "Natural Foods",
        heroSubtitle: "Baked with Love",
        heroDescription: "Experience the difference of real, unadulterated ingredients. We bring you products that are as close to nature as possible, free from artificial additives.",
        heroPrimaryCtaText: "Explore Collections",
        heroPrimaryCtaLink: "/products",
        heroSecondaryCtaText: "Our Story",
        heroSecondaryCtaLink: "/about",
        heroBackgroundUrl: "",
        heroBackgroundType: "image",
        
        categoriesTitle: "Nature's Bounty",
        categoriesSubtitle: "Discover our artisanal range of healthy delights",
        
        featuredTitle: "Handpicked Specials",
        featuredSubtitle: "The freshest ingredients, crafted into perfection",
        
        ctaTitle: "Join the Family",
        ctaSubtitle: "Sign up for 20% off your first order and receive exclusive healthy tips.",
        
        whyTitle: "Why Mom's Naturals Foods?",
        whyDescription: "We create MOM'S Naturals Foods for people who want both health and taste — no compromises.\n\nOur products are free from chemical additives, coloring, flavoring, and sugar — only pure, natural ingredients.",
        whyLearnMoreText: "Learn More",
        whyLearnMoreLink: "/about",
        whyBackgroundUrl: "",
        whyCards: [],

        features: [
          { icon: "Leaf", title: "100% Natural", description: "No artificial colors or preservatives." },
          { icon: "Heart", title: "Baked with Love", description: "Handcrafted in small batches." },
          { icon: "Sparkles", title: "No Added Sugar", description: "Naturally sweetened goodness." },
          { icon: "Shield", title: "Quality Guaranteed", description: "Only the finest ingredients." }
        ],
        promoCards: [
          { title: "Pure Ingredients", description: "Only the best from nature.", videoUrl: "" },
          { title: "Baked with Love", description: "Small batches, big heart.", videoUrl: "" }
        ],
        promoSectionBgUrl: ""
      });
    }

    return NextResponse.json(homePage);
  } catch (error) {
    console.error("Error fetching home page:", error);
    return NextResponse.json({ error: "Failed to fetch home page content" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { 
      heroTitle,
      heroTitleAccent,
      heroSubtitle,
      heroDescription,
      heroPrimaryCtaText,
      heroPrimaryCtaLink,
      heroSecondaryCtaText,
      heroSecondaryCtaLink,
      heroBackgroundUrl,
      heroBackgroundType,
      categoriesTitle,
      categoriesSubtitle,
      featuredTitle,
      featuredSubtitle,
      ctaTitle,
      ctaSubtitle,
      whyTitle,
      whyDescription,
      whyLearnMoreText,
      whyLearnMoreLink,
      whyBackgroundUrl,
      whyCards,
      features,
      promoCards,
      promoSectionBgUrl
    } = body;

    const homePage = await db.homePage.upsert({
      where: { id: "global" },
      update: {
        heroTitle: heroTitle || "Wholesome",
        heroTitleAccent: heroTitleAccent || "Natural Foods",
        heroSubtitle: heroSubtitle || "",
        heroDescription: heroDescription || "Experience the difference...",
        heroPrimaryCtaText: heroPrimaryCtaText || "Shop Now",
        heroPrimaryCtaLink: heroPrimaryCtaLink || "/products",
        heroSecondaryCtaText: heroSecondaryCtaText || "View Collections",
        heroSecondaryCtaLink: heroSecondaryCtaLink || "/categories",
        heroBackgroundUrl,
        heroBackgroundType: heroBackgroundType || "image",
        categoriesTitle: categoriesTitle || "Shop by Category",
        categoriesSubtitle: categoriesSubtitle || "Explore our diverse range",
        featuredTitle: featuredTitle || "Seasonal Specials",
        featuredSubtitle: featuredSubtitle || "Fresh from the earth to your table",
        ctaTitle: ctaTitle || "Get 20% Off Your First Order",
        ctaSubtitle: ctaSubtitle || "Sign up for our newsletter...",
        whyTitle: whyTitle || "Why Mom's Naturals Foods?",
        whyDescription: whyDescription || "We create MOM'S Naturals Foods for people who want both health and taste — no compromises.\n\nOur products are free from chemical additives, coloring, flavoring, and sugar — only pure, natural ingredients.",
        whyLearnMoreText: whyLearnMoreText || "Learn More",
        whyLearnMoreLink: whyLearnMoreLink || "/about",
        whyBackgroundUrl: whyBackgroundUrl || null,
        whyCards: whyCards || [],
        features: features || [],
        promoCards: promoCards || [],
        promoSectionBgUrl: promoSectionBgUrl || null
      },
      create: {
        id: "global",
        heroTitle: heroTitle || "Wholesome",
        heroTitleAccent: heroTitleAccent || "Natural Foods",
        heroSubtitle: heroSubtitle || "",
        heroDescription: heroDescription || "Experience the difference...",
        heroPrimaryCtaText: heroPrimaryCtaText || "Shop Now",
        heroPrimaryCtaLink: heroPrimaryCtaLink || "/products",
        heroSecondaryCtaText: heroSecondaryCtaText || "View Collections",
        heroSecondaryCtaLink: heroSecondaryCtaLink || "/categories",
        heroBackgroundUrl,
        heroBackgroundType: heroBackgroundType || "image",
        categoriesTitle: categoriesTitle || "Shop by Category",
        categoriesSubtitle: categoriesSubtitle || "Explore our diverse range",
        featuredTitle: featuredTitle || "Seasonal Specials",
        featuredSubtitle: featuredSubtitle || "Fresh from the earth to your table",
        ctaTitle: ctaTitle || "Get 20% Off Your First Order",
        ctaSubtitle: ctaSubtitle || "Sign up for our newsletter...",
        whyTitle: whyTitle || "Why Mom's Naturals Foods?",
        whyDescription: whyDescription || "We create MOM'S Naturals Foods...",
        whyLearnMoreText: whyLearnMoreText || "Learn More",
        whyLearnMoreLink: whyLearnMoreLink || "/about",
        whyBackgroundUrl: whyBackgroundUrl || null,
        whyCards: whyCards || [],
        features: features || [],
        promoCards: promoCards || [],
        promoSectionBgUrl: promoSectionBgUrl || null
      }
    });

    return NextResponse.json(homePage);
  } catch (error: any) {
    console.error("Error updating home page:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update home page content" },
      { status: 500 }
    );
  }
}