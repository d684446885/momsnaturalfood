"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, FileText, ExternalLink } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";

interface LegalPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  updatedAt: Date;
  createdAt: Date;
}

interface LegalPagesClientProps {
  initialPages: LegalPage[];
}

export function LegalPagesClient({ initialPages }: LegalPagesClientProps) {
  const [pages, setPages] = useState<LegalPage[]>(initialPages);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<LegalPage | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const resetForm = () => {
    setEditingPage(null);
    setTitle("");
    setContent("");
  };

  const openEdit = (page: LegalPage) => {
    setEditingPage(page);
    setTitle(page.title);
    setContent(page.content);
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    if (!title || !content) return toast.error("Title and content are required");
    
    setIsLoading(true);
    try {
      const url = editingPage ? `/api/legal/${editingPage.id}` : "/api/legal";
      const method = editingPage ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      });

      if (!response.ok) throw new Error("Failed to save");

      const saved = await response.json();
      
      if (editingPage) {
        setPages(pages.map(p => p.id === saved.id ? saved : p));
        toast.success("Page updated");
      } else {
        setPages([saved, ...pages]);
        toast.success("Page created");
      }
      
      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to save page");
    } finally {
      setIsLoading(false);
    }
  };

  const deletePage = async (id: string) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/legal/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed");
      
      setPages(pages.filter(p => p.id !== id));
      toast.success("Page deleted");
    } catch (error) {
      toast.error("Failed to delete page");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={(val) => {
          setIsOpen(val);
          if (!val) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Page
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>{editingPage ? "Edit Page" : "New Legal Page"}</DialogTitle>
              <DialogDescription>
                Create or update legal content for your website.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Page Title</label>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Shipping Information"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content (Text/HTML)</label>
                <Textarea 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your page content here..."
                  className="min-h-[400px] font-mono text-sm"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Page"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {pages.map((page) => (
          <Card key={page.id} className="group">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-secondary/5 rounded-lg group-hover:bg-secondary/10 transition-colors">
                  <FileText className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{page.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    slug: /{page.slug}
                    <Link href={`/legal/${page.slug}`} target="_blank" className="hover:text-primary inline-flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      View live
                    </Link>
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => openEdit(page)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deletePage(page.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}

        {pages.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl">
            <p className="text-muted-foreground">No legal pages found. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
