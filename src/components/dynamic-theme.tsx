"use client";

import { useEffect } from "react";

interface Settings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  accentColor: string;
  navbarColor: string;
  footerColor: string;
  sidebarColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonHoverColor: string;
  buttonHoverTextColor: string;
}

export function DynamicTheme({ settings }: { settings: Settings }) {
  useEffect(() => {
    if (settings) {
      const root = document.documentElement;
      if (settings.primaryColor) root.style.setProperty('--primary-color', settings.primaryColor);
      if (settings.secondaryColor) root.style.setProperty('--secondary-color', settings.secondaryColor);
      if (settings.backgroundColor) root.style.setProperty('--background-color', settings.backgroundColor);
      if (settings.accentColor) root.style.setProperty('--accent-color', settings.accentColor);
      if (settings.navbarColor) root.style.setProperty('--navbar-color', settings.navbarColor);
      if (settings.footerColor) root.style.setProperty('--footer-color', settings.footerColor);
      if (settings.sidebarColor) root.style.setProperty('--sidebar-color', settings.sidebarColor);
      if (settings.textColor) root.style.setProperty('--text-color', settings.textColor);
      if (settings.buttonColor) root.style.setProperty('--button-color', settings.buttonColor);
      if (settings.buttonTextColor) root.style.setProperty('--button-text-color', settings.buttonTextColor);
      if (settings.buttonHoverColor) root.style.setProperty('--button-hover-color', settings.buttonHoverColor);
      if (settings.buttonHoverTextColor) root.style.setProperty('--button-hover-text-color', settings.buttonHoverTextColor);
    }
  }, [settings]);

  return null;
}
