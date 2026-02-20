"use client";

import React, { useState } from "react";
import { 
  Search, 
  Mail, 
  Calendar, 
  Trash2,
  Download,
  Users,
  Send
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

interface NewsletterClientProps {
  initialSubscribers: Subscriber[];
}

export function NewsletterClient({ initialSubscribers }: NewsletterClientProps) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;

    setIsDeleting(id);
    try {
      const res = await fetch("/api/newsletter/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete");

      setSubscribers(subscribers.filter(s => s.id !== id));
      toast.success("Subscriber removed successfully");
    } catch (error) {
      toast.error("Failed to delete subscriber");
    } finally {
      setIsDeleting(null);
    }
  };

  const exportEmails = () => {
    const csv = [
      ["Email", "Subscribed At"],
      ...subscribers.map(s => [s.email, s.createdAt])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b">
        <div className="space-y-1">
          <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 mb-2 border-none font-bold uppercase tracking-wider text-[10px]">
             Audience Management
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold italic tracking-tight text-secondary">
             Newsletter
          </h1>
          <p className="text-zinc-500 font-light italic max-w-lg">
             Manage your newsletter audience and export subscriber lists.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <Button 
                variant="outline" 
                className="rounded-full px-6 h-12 border-zinc-200 hover:bg-zinc-50 gap-2"
                onClick={exportEmails}
            >
                <Download className="h-4 w-4" />
                Export CSV
            </Button>
            <Button className="rounded-full px-6 h-12 bg-accent hover:bg-zinc-800 text-secondary hover:text-white transition-all gap-2">
                <Send className="h-4 w-4" />
                Compose Campaign
            </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-none bg-white shadow-sm overflow-hidden group">
              <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                      <div className="space-y-1">
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Subscribers</p>
                          <h4 className="text-3xl font-serif font-bold text-secondary italic">{subscribers.length}</h4>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                          <Users className="h-6 w-6" />
                      </div>
                  </div>
              </CardContent>
          </Card>
      </div>

      <Card className="shadow-2xl border-none bg-white rounded-[2rem] overflow-hidden">
        <CardHeader className="pb-6 px-10 pt-10 border-b bg-zinc-50/50">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <Input
                placeholder="Find a subscriber by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-2xl bg-white border-zinc-100 focus-visible:ring-accent transition-all shadow-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-50/80">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-10 h-16 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Email Address</TableHead>
                  <TableHead className="font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Subscribed On</TableHead>
                  <TableHead className="font-bold text-zinc-500 uppercase tracking-widest text-[10px] text-center">Status</TableHead>
                  <TableHead className="w-[100px] text-right pr-10 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="h-64 text-center">
                           <div className="flex flex-col items-center justify-center opacity-40 grayscale">
                                <Mail className="h-16 w-16 mb-4 text-zinc-300" />
                                <p className="text-xl font-serif italic">The list is quiet...</p>
                            </div>
                        </TableCell>
                    </TableRow>
                ) : filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id} className="hover:bg-zinc-50/80 transition-all duration-300 group">
                    <TableCell className="pl-10">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                             <Mail className="h-5 w-5" />
                          </div>
                          <span className="font-bold text-secondary">{subscriber.email}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-zinc-600">
                        <div className="flex items-center gap-2">
                           <Calendar className="h-4 w-4 text-zinc-300" />
                           {format(new Date(subscriber.createdAt), "MMM dd, yyyy")}
                        </div>
                    </TableCell>
                    <TableCell className="text-center">
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-none font-bold rounded-full px-3">
                           Active
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-10">
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-red-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                            onClick={() => onDelete(subscriber.id)}
                            disabled={isDeleting === subscriber.id}
                        >
                            {isDeleting === subscriber.id ? (
                                <div className="h-4 w-4 border-2 border-red-400/30 border-t-red-400 animate-spin rounded-full" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
