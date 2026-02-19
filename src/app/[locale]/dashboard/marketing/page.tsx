import { db } from "@/lib/db";
import { MarketingClient } from "./marketing-client";

async function getMarketingData() {
  try {
    const [settings, messages, unreadCount] = await Promise.all([
      db.settings.findUnique({
        where: { id: "global" },
        select: {
          whatsappNumber: true,
          instagramUrl: true,
          messengerUrl: true,
          chatWidgetEnabled: true,
        },
      }),
      db.chatMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      db.chatMessage.count({ where: { isRead: false } }),
    ]);

    return {
      settings: settings || {
        whatsappNumber: null,
        instagramUrl: null,
        messengerUrl: null,
        chatWidgetEnabled: true,
      },
      messages,
      unreadCount,
    };
  } catch (error) {
    console.error("Error fetching marketing data:", error);
    return {
      settings: {
        whatsappNumber: null,
        instagramUrl: null,
        messengerUrl: null,
        chatWidgetEnabled: true,
      },
      messages: [],
      unreadCount: 0,
    };
  }
}

export default async function MarketingPage() {
  const data = await getMarketingData();
  return <MarketingClient initialData={data} />;
}
