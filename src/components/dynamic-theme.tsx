"use client";

import { useEffect } from "react";

interface Settings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  accentColor: string;
}

export function DynamicTheme({ settings }: { settings: Settings }) {
  useEffect(() => {
    if (settings) {
      const root = document.documentElement;
      if (settings.primaryColor) root.style.setProperty('--primary-color', settings.primaryColor);
      if (settings.secondaryColor) root.style.setProperty('--secondary-color', settings.secondaryColor);
      if (settings.backgroundColor) root.style.setProperty('--background-color', settings.backgroundColor);
      if (settings.accentColor) root.style.setProperty('--accent-color', settings.accentColor);
    }
  }, [settings]);

  return null;
}
