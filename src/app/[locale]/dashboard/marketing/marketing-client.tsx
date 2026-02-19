"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { 
  Save, Loader2, MessageCircle, Eye, EyeOff, Trash2,
  Mail, Phone, MapPin, Clock, CheckCircle2, Circle,
  Settings2, Megaphone
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ChatMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  location: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  isRead: boolean;
  createdAt: string | Date;
}

interface MarketingSettings {
  whatsappNumber: string | null;
  instagramUrl: string | null;
  messengerUrl: string | null;
  chatWidgetEnabled: boolean;
}

interface MarketingClientProps {
  initialData: {
    settings: MarketingSettings;
    messages: ChatMessage[];
    unreadCount: number;
  };
}

export function MarketingClient({ initialData }: MarketingClientProps) {
  const [activeTab, setActiveTab] = useState<"settings" | "messages">("settings");
  const [settings, setSettings] = useState(initialData.settings);
  const [messages, setMessages] = useState(initialData.messages);
  const [unreadCount, setUnreadCount] = useState(initialData.unreadCount);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const onSaveSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save");
      }

      toast.success("Marketing settings saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string, isRead: boolean) => {
    try {
      const res = await fetch("/api/chat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead }),
      });

      if (!res.ok) throw new Error("Failed to update");

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead } : m))
      );
      setUnreadCount((prev) => (isRead ? prev - 1 : prev + 1));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, isRead });
      }
    } catch {
      toast.error("Failed to update message");
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/chat?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      const msg = messages.find((m) => m.id === id);
      if (msg && !msg.isRead) setUnreadCount((prev) => prev - 1);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const filteredMessages = filter === "unread" ? messages.filter((m) => !m.isRead) : messages;

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Megaphone className="h-7 w-7 text-emerald-500" />
            Marketing
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage chat widget, social channels, and customer messages.
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge className="bg-red-500 text-white px-3 py-1.5 text-sm">
            {unreadCount} unread message{unreadCount > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-muted rounded-xl p-1.5 w-fit">
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "settings"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Settings2 className="h-4 w-4" />
          Widget Settings
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "messages"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          Chat Messages
          {unreadCount > 0 && (
            <span className="ml-1 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <Card className="border-none shadow-sm">
          <CardHeader className="bg-muted/50 pb-6">
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-emerald-500" />
              <div>
                <CardTitle>Chat Widget Settings</CardTitle>
                <CardDescription>
                  Configure your WhatsApp, Instagram, and Messenger links for the floating chat widget.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            {/* Enable/Disable Widget */}
            <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
              <div className="space-y-1">
                <p className="font-semibold text-sm">Enable Chat Widget</p>
                <p className="text-xs text-muted-foreground">
                  Show the floating chat button on your website
                </p>
              </div>
              <Switch
                checked={settings.chatWidgetEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, chatWidgetEnabled: checked })
                }
              />
            </div>

            <Separator />

            {/* WhatsApp */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#25D366" }}>
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <label className="text-sm font-bold">WhatsApp Number</label>
                  <p className="text-xs text-muted-foreground">Include country code (e.g., +923001234567)</p>
                </div>
              </div>
              <Input
                placeholder="+923001234567"
                value={settings.whatsappNumber || ""}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              />
            </div>

            {/* Instagram */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)" }}>
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
                <div>
                  <label className="text-sm font-bold">Instagram URL</label>
                  <p className="text-xs text-muted-foreground">Your Instagram profile link</p>
                </div>
              </div>
              <Input
                placeholder="https://instagram.com/yourbrand"
                value={settings.instagramUrl || ""}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
              />
            </div>

            {/* Messenger */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00B2FF, #006AFF)" }}>
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.2l3.131 3.259L19.752 8.2l-6.561 6.763z" />
                  </svg>
                </div>
                <div>
                  <label className="text-sm font-bold">Messenger URL</label>
                  <p className="text-xs text-muted-foreground">Your Facebook Messenger link</p>
                </div>
              </div>
              <Input
                placeholder="https://m.me/yourpage"
                value={settings.messengerUrl || ""}
                onChange={(e) => setSettings({ ...settings, messengerUrl: e.target.value })}
              />
            </div>

            <Separator />

            {/* Save Button */}
            <div className="flex justify-end">
              <Button className="gap-2 px-8" onClick={onSaveSettings} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Marketing Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages Tab */}
      {activeTab === "messages" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Messages</CardTitle>
                  <div className="flex gap-1 bg-muted rounded-lg p-0.5">
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                        filter === "all" ? "bg-white shadow-sm" : "text-muted-foreground"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter("unread")}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                        filter === "unread" ? "bg-white shadow-sm" : "text-muted-foreground"
                      }`}
                    >
                      Unread ({unreadCount})
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto divide-y">
                  {filteredMessages.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground text-sm">
                      <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p>No messages yet</p>
                    </div>
                  ) : (
                    filteredMessages.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => {
                          setSelectedMessage(msg);
                          if (!msg.isRead) markAsRead(msg.id, true);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
                          selectedMessage?.id === msg.id ? "bg-muted/50" : ""
                        } ${!msg.isRead ? "bg-emerald-50/50" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 shrink-0">
                            {msg.isRead ? (
                              <CheckCircle2 className="h-4 w-4 text-zinc-300" />
                            ) : (
                              <Circle className="h-4 w-4 text-emerald-500 fill-emerald-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-sm truncate ${!msg.isRead ? "font-bold" : "font-medium"}`}>
                                {msg.name}
                              </p>
                              <span className="text-[10px] text-muted-foreground shrink-0">
                                {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {msg.message}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-sm min-h-[400px]">
              {selectedMessage ? (
                <>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{selectedMessage.name}</CardTitle>
                        <CardDescription className="mt-1">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {formatDate(selectedMessage.createdAt)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => markAsRead(selectedMessage.id, !selectedMessage.isRead)}
                          title={selectedMessage.isRead ? "Mark as unread" : "Mark as read"}
                        >
                          {selectedMessage.isRead ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => deleteMessage(selectedMessage.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Contact Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                        <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Email</p>
                          <p className="text-sm truncate">{selectedMessage.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                        <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Phone</p>
                          <p className="text-sm truncate">{selectedMessage.phone || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Location</p>
                          <p className="text-sm truncate">{selectedMessage.location || "Unknown"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Message</p>
                      <div className="p-4 rounded-xl bg-muted/30 border">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-2">
                      {selectedMessage.ipAddress && (
                        <Badge variant="secondary" className="text-[10px]">
                          IP: {selectedMessage.ipAddress}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-[10px]">
                        {selectedMessage.isRead ? "Read" : "Unread"}
                      </Badge>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                  <MessageCircle className="h-16 w-16 opacity-20 mb-4" />
                  <p className="text-sm">Select a message to view details</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
