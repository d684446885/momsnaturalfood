"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Loader2,
  Inbox,
  Mail,
  MailOpen,
  Trash2,
  MapPin,
  Globe,
  Phone,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertCircle,
  User,
} from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  adminReply: string | null;
  repliedAt: string | null;
  ipAddress: string | null;
  location: string | null;
  isRead: boolean;
  createdAt: string;
}

export function MessagesClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  // Reply state
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [page, filter]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/messages?page=${page}&filter=${filter}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setMessages(data.messages);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setUnreadCount(data.unreadCount);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string, isRead: boolean) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead }),
      });
      if (!res.ok) throw new Error("Failed to update");

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead } : m))
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => prev ? { ...prev, isRead } : null);
      }
      setUnreadCount((prev) => prev + (isRead ? -1 : 1));
    } catch {
      toast.error("Failed to update message");
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    setIsReplying(true);
    try {
      const res = await fetch(`/api/admin/messages/${selectedMessage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminReply: replyText }),
      });
      
      if (!res.ok) throw new Error("Failed to send reply");
      
      const updatedMsg = await res.json();
      
      setMessages((prev) =>
        prev.map((m) => (m.id === updatedMsg.id ? updatedMsg : m))
      );
      setSelectedMessage(updatedMsg);
      setReplyText("");
      toast.success("Reply saved successfully");
    } catch {
      toast.error("Failed to save reply");
    } finally {
      setIsReplying(false);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      const msg = messages.find((m) => m.id === id);
      if (msg && !msg.isRead) setUnreadCount((prev) => prev - 1);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      setTotal((prev) => prev - 1);
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const openMessage = (msg: Message) => {
    setSelectedMessage(msg);
    setReplyText(""); // Clear reply text when switching messages
    if (!msg.isRead) {
      markAsRead(msg.id, true);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const filteredMessages = searchQuery
    ? messages.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Inbox className="h-8 w-8" />
            Messages
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-sm px-2.5 py-0.5">
                {unreadCount} new
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground mt-1">
            Contact form submissions from your website visitors.
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className={`cursor-pointer transition-all border-2 ${
            filter === "all" ? "border-primary bg-primary/5" : "border-transparent hover:border-muted"
          }`}
          onClick={() => { setFilter("all"); setPage(1); }}
        >
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Inbox className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{total}</p>
              <p className="text-sm text-muted-foreground">All Messages</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all border-2 ${
            filter === "unread" ? "border-red-500 bg-red-50/50" : "border-transparent hover:border-muted"
          }`}
          onClick={() => { setFilter("unread"); setPage(1); }}
        >
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unreadCount}</p>
              <p className="text-sm text-muted-foreground">Unread</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all border-2 ${
            filter === "read" ? "border-green-500 bg-green-50/50" : "border-transparent hover:border-muted"
          }`}
          onClick={() => { setFilter("read"); setPage(1); }}
        >
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
              <MailOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{total - unreadCount}</p>
              <p className="text-sm text-muted-foreground">Read</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Message List */}
        <div className="lg:col-span-5 space-y-2">
          {filteredMessages.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Inbox className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">No messages</h3>
                <p className="text-sm text-muted-foreground/60">
                  {filter === "unread" ? "All caught up! No unread messages." : "No messages found."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredMessages.map((msg) => (
              <Card
                key={msg.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedMessage?.id === msg.id ? "ring-2 ring-primary border-primary" : ""
                } ${!msg.isRead ? "bg-blue-50/50 border-blue-200" : ""}`}
                onClick={() => openMessage(msg)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!msg.isRead && (
                          <div className="h-2.5 w-2.5 rounded-full bg-blue-500 flex-shrink-0" />
                        )}
                        <p className={`text-sm truncate ${!msg.isRead ? "font-bold" : "font-medium"}`}>
                          {msg.name}
                        </p>
                      </div>
                      <p className={`text-sm truncate ${!msg.isRead ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                        {msg.subject}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {msg.message.substring(0, 80)}...
                      </p>
                    </div>
                    {msg.repliedAt && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                        Replied
                      </Badge>
                    )}
                    <div className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {formatDate(msg.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {msg.email}
                    </span>
                    {msg.location && msg.location !== "Unknown" && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {msg.location}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1 min-w-0">
                    <CardTitle className="text-xl">{selectedMessage.subject}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => markAsRead(selectedMessage.id, !selectedMessage.isRead)}
                      title={selectedMessage.isRead ? "Mark as unread" : "Mark as read"}
                    >
                      {selectedMessage.isRead ? (
                        <Mail className="h-4 w-4" />
                      ) : (
                        <MailOpen className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteMessage(selectedMessage.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Metadata badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="gap-1.5 font-normal">
                    <Clock className="h-3 w-3" />
                    Sent: {new Date(selectedMessage.createdAt).toLocaleString()}
                  </Badge>
                  {selectedMessage.phone && (
                    <Badge variant="outline" className="gap-1.5 font-normal">
                      <Phone className="h-3 w-3" />
                      {selectedMessage.phone}
                    </Badge>
                  )}
                  {selectedMessage.ipAddress && (
                    <Badge variant="outline" className="gap-1.5 font-normal">
                      <Globe className="h-3 w-3" />
                      IP: {selectedMessage.ipAddress}
                    </Badge>
                  )}
                  {selectedMessage.location && selectedMessage.location !== "Unknown" && (
                    <Badge variant="outline" className="gap-1.5 font-normal">
                      <MapPin className="h-3 w-3" />
                      {selectedMessage.location}
                    </Badge>
                  )}
                </div>

                {/* Message body */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">User Message</label>
                  <div className="bg-muted/30 rounded-2xl p-6 border">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Admin Reply History */}
                {selectedMessage.adminReply && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-green-600 tracking-wider flex items-center gap-2">
                      <Badge className="bg-green-600">Your Reply</Badge>
                      <span className="text-muted-foreground font-normal lowercase">
                        Replied on {new Date(selectedMessage.repliedAt!).toLocaleString()}
                      </span>
                    </label>
                    <div className="bg-green-50/50 rounded-2xl p-6 border border-green-100">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-green-900">
                        {selectedMessage.adminReply}
                      </p>
                    </div>
                  </div>
                )}

                {/* Reply Form */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">
                      {selectedMessage.adminReply ? "Send Another Reply" : "Compose Reply"}
                    </label>
                    <textarea
                      className="w-full min-h-[150px] rounded-2xl border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Type your response here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      disabled={isReplying || !replyText.trim()}
                      onClick={handleReply}
                      className="gap-2"
                    >
                      {isReplying ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Inbox className="h-4 w-4" />
                      )}
                      Save & Mark as Replied
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => {
                        window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`);
                      }}
                    >
                      <Mail className="h-4 w-4" /> Open in Email App
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-16 pb-16 text-center">
                <Eye className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">Select a message</h3>
                <p className="text-sm text-muted-foreground/60">
                  Click on a message from the list to view its details.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
