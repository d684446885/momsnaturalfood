"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, CheckCircle2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface WidgetSettings {
  whatsappNumber: string | null;
  instagramUrl: string | null;
  messengerUrl: string | null;
  chatWidgetEnabled: boolean;
  businessName: string | null;
}

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "channels">("channels");
  const [settings, setSettings] = useState<WidgetSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  useEffect(() => {
    fetch("/api/widget-settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));

    // Listen for custom trigger from mobile nav
    const handleOpenWidget = () => {
      setIsOpen(true);
      setActiveTab("channels");
    };

    window.addEventListener('open-chat-widget', handleOpenWidget);
    return () => window.removeEventListener('open-chat-widget', handleOpenWidget);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in name, email, and message");
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send");
      }

      setIsSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => {
        setIsSent(false);
        setActiveTab("channels");
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading || !settings?.chatWidgetEnabled) return null;

  const hasWhatsApp = !!settings?.whatsappNumber;
  const hasInstagram = !!settings?.instagramUrl;
  const hasMessenger = !!settings?.messengerUrl;
  const hasAnyChannel = hasWhatsApp || hasInstagram || hasMessenger;

  const whatsappUrl = hasWhatsApp
    ? `https://wa.me/${settings.whatsappNumber!.replace(/[^0-9]/g, "")}`
    : "#";

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl hidden md:flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none"
        style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open chat widget"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6 md:h-7 md:w-7 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* WhatsApp SVG Icon */}
              <svg className="h-7 w-7 md:h-8 md:w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Pulse animation ring */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 w-14 h-14 md:w-16 md:h-16 rounded-full animate-ping opacity-20 hidden md:block" style={{ background: "#25D366" }} />
      )}

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-[380px] rounded-3xl shadow-2xl overflow-hidden border border-zinc-200/50"
            style={{ maxHeight: "calc(100vh - 140px)" }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 text-white"
              style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{settings?.businessName || "Chat with us"}</h3>
                    <p className="text-xs text-white/80">We typically reply within minutes</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* Tab Switcher */}
              <div className="flex gap-1 mt-4 bg-white/10 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab("channels")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === "channels"
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  Channels
                </button>
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === "chat"
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  Quick Chat
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="bg-white overflow-y-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
              <AnimatePresence mode="wait">
                {activeTab === "channels" ? (
                  <motion.div
                    key="channels"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 space-y-3"
                  >
                    {/* WhatsApp */}
                    {hasWhatsApp && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "#25D366" }}>
                          <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-zinc-800">WhatsApp</p>
                          <p className="text-xs text-zinc-500">Chat with us on WhatsApp</p>
                        </div>
                        <svg className="h-5 w-5 text-zinc-300 group-hover:text-emerald-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </a>
                    )}

                    {/* Instagram */}
                    {hasInstagram && (
                      <a
                        href={settings.instagramUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-100 hover:border-pink-200 hover:bg-pink-50/50 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)" }}>
                          <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-zinc-800">Instagram</p>
                          <p className="text-xs text-zinc-500">Follow & DM us</p>
                        </div>
                        <svg className="h-5 w-5 text-zinc-300 group-hover:text-pink-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </a>
                    )}

                    {/* Messenger */}
                    {hasMessenger && (
                      <a
                        href={settings.messengerUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #00B2FF, #006AFF)" }}>
                          <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.2l3.131 3.259L19.752 8.2l-6.561 6.763z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-zinc-800">Messenger</p>
                          <p className="text-xs text-zinc-500">Chat on Facebook Messenger</p>
                        </div>
                        <svg className="h-5 w-5 text-zinc-300 group-hover:text-blue-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </a>
                    )}

                    {!hasAnyChannel && (
                      <div className="text-center py-6 text-zinc-400 text-sm">
                        <p>No channels configured yet.</p>
                        <p className="text-xs mt-1">Use Quick Chat to send us a message!</p>
                      </div>
                    )}

                    {/* Quick chat prompt */}
                    <button
                      onClick={() => setActiveTab("chat")}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-zinc-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100 group-hover:bg-emerald-100 flex items-center justify-center shrink-0 transition-colors">
                        <Send className="h-5 w-5 text-zinc-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-bold text-sm text-zinc-800">Quick Chat</p>
                        <p className="text-xs text-zinc-500">Send us a message directly</p>
                      </div>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4"
                  >
                    {isSent ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="py-10 flex flex-col items-center gap-4 text-center"
                      >
                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-bold text-lg text-zinc-800">Message Sent!</p>
                          <p className="text-sm text-zinc-500 mt-1">We&apos;ll get back to you soon.</p>
                        </div>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                          <input
                            type="text"
                            placeholder="Your name *"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all placeholder:text-zinc-400"
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="email"
                            placeholder="Email address *"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all placeholder:text-zinc-400"
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="tel"
                            placeholder="Phone number (optional)"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all placeholder:text-zinc-400"
                          />
                        </div>
                        <div>
                          <textarea
                            placeholder="Your message *"
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all placeholder:text-zinc-400 resize-none"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSending}
                          className="w-full h-12 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
                          style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
                        >
                          {isSending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              Send Message
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="bg-zinc-50 border-t border-zinc-100 px-5 py-2.5 text-center">
              <p className="text-[10px] text-zinc-400">
                Powered by {settings?.businessName || "Mom's Natural Foods"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
