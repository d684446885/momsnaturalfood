"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function PwaInstallButton({ variant = "navbar" }: { variant?: "navbar" | "footer" | "banner" }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode (installed)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const ua = navigator.userAgent;
    const isiOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isiOS);

    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show banner after a delay for better UX
      if (variant === "banner") {
        setTimeout(() => setShowBanner(true), 3000);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowBanner(false);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [variant]);

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // Show tooltip with manual instructions
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000);
    }
  }, [deferredPrompt]);

  // Don't render if already installed
  if (isInstalled) return null;

  // Navbar variant - always visible icon button
  if (variant === "navbar") {
    return (
      <div className="relative">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleInstall}
            className="relative group"
            title="Install App"
            id="pwa-install-navbar"
          >
            <Download className="h-5 w-5" />
            {deferredPrompt && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500/60 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
            )}
          </Button>
        </motion.div>

        {/* Tooltip for manual install instructions */}
        <AnimatePresence>
          {showTooltip && !deferredPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-64 bg-white border border-zinc-200 rounded-xl shadow-xl p-3 z-50"
            >
              <button
                onClick={() => setShowTooltip(false)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-start gap-2.5">
                <div className="shrink-0 p-1.5 bg-primary/10 rounded-lg mt-0.5">
                  {isIOS ? (
                    <Share2 className="h-4 w-4 text-primary" />
                  ) : (
                    <Download className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Install this app</p>
                  {isIOS ? (
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      Tap the <strong>Share</strong> button in Safari, then select <strong>&quot;Add to Home Screen&quot;</strong>
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      Click the <strong>⋮</strong> menu in your browser, then select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home Screen&quot;</strong>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Footer variant - always visible text button
  if (variant === "footer") {
    return (
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleInstall}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          id="pwa-install-footer"
        >
          <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Smartphone className="h-4 w-4 text-primary" />
          </div>
          <span>Install App</span>
          {deferredPrompt && (
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </motion.button>

        {/* Tooltip for manual install instructions */}
        <AnimatePresence>
          {showTooltip && !deferredPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-zinc-200 rounded-xl shadow-xl p-3 z-50"
            >
              <button
                onClick={() => setShowTooltip(false)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-start gap-2.5">
                <div className="shrink-0 p-1.5 bg-primary/10 rounded-lg mt-0.5">
                  {isIOS ? (
                    <Share2 className="h-4 w-4 text-primary" />
                  ) : (
                    <Download className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Install this app</p>
                  {isIOS ? (
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      Tap the <strong>Share</strong> button in Safari, then select <strong>&quot;Add to Home Screen&quot;</strong>
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      Click the <strong>⋮</strong> menu in your browser, then select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home Screen&quot;</strong>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Banner variant - floating install banner
  if (variant === "banner") {
    return (
      <AnimatePresence>
        {showBanner && deferredPrompt && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[380px] z-[60] bg-white/95 backdrop-blur-xl border border-zinc-200 rounded-2xl shadow-2xl p-4"
            id="pwa-install-banner"
          >
            <button
              onClick={() => setShowBanner(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-3">
              <div className="shrink-0 h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-secondary/20">
                M
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-foreground">
                  Install MoM&apos;s NaturalFood
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Get a faster experience with offline access. Add our app to your home screen!
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    onClick={handleInstall}
                    size="sm"
                    className="h-8 px-4 text-xs font-semibold rounded-lg"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Install Now
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBanner(false)}
                    className="h-8 px-3 text-xs text-muted-foreground"
                  >
                    Not now
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return null;
}
