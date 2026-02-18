"use client";

import React from "react";
import { useLocale } from "next-intl";
import { routing, usePathname, useRouter } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useParams } from "next/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="group">
        <Languages className="h-5 w-5 group-hover:text-primary transition-colors" />
      </Button>
    );
  }

  const onLocaleChange = (nextLocale: string) => {
    router.replace(
      // @ts-expect-error -- pathname is compatible
      { pathname, params },
      { locale: nextLocale }
    );
  };

  const labels: Record<string, string> = {
    nl: "🇳🇱 Nederlands",
    en: "🇺🇸 English",
    tr: "🇹🇷 Türkçe",
    ar: "🇸🇦 العربية",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="group">
          <Languages className="h-5 w-5 group-hover:text-primary transition-colors" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => onLocaleChange(l)}
            className={locale === l ? "bg-primary/10 font-bold" : ""}
          >
            {labels[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
