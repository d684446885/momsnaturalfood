"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  GripVertical,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  FolderOpen
} from "lucide-react";
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FaqCategory {
  id: string;
  name: string;
  slug: string;
  order: number;
  _count?: {
    faqs: number;
  };
}

interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
  categoryId: string;
  category: FaqCategory;
}

interface FaqsClientProps {
  initialCategories: FaqCategory[];
  initialFaqs: Faq[];
}

export function FaqsClient({ initialCategories, initialFaqs }: FaqsClientProps) {
  const [categories, setCategories] = useState<FaqCategory[]>(initialCategories);
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [isLoading, setIsLoading] = useState(false);

  // Dialog states for Category
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FaqCategory | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryOrder, setCategoryOrder] = useState(0);

  // Dialog states for FAQ
  const [isFaqDialogOpen, setIsFaqDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqCategoryId, setFaqCategoryId] = useState("");
  const [faqOrder, setFaqOrder] = useState(0);

  // --- Category Actions ---
  const handleCategorySubmit = async () => {
    if (!categoryName) return toast.error("Name is required");
    
    setIsLoading(true);
    try {
      const url = editingCategory 
        ? `/api/faqs/categories/${editingCategory.id}` 
        : "/api/faqs/categories";
      
      const response = await fetch(url, {
        method: editingCategory ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName, order: Number(categoryOrder) })
      });

      if (!response.ok) throw new Error("Failed to save category");

      const savedCategory = await response.json();
      
      if (editingCategory) {
        setCategories(categories.map(c => c.id === savedCategory.id ? savedCategory : c));
        toast.success("Category updated");
      } else {
        setCategories([...categories, savedCategory]);
        toast.success("Category created");
      }
      
      setIsCategoryDialogOpen(false);
      resetCategoryForm();
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This will delete all FAQs under this category.")) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/faqs/categories/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete category");
      
      setCategories(categories.filter(c => c.id !== id));
      setFaqs(faqs.filter(f => f.categoryId !== id));
      toast.success("Category deleted");
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setIsLoading(false);
    }
  };

  const resetCategoryForm = () => {
    const nextOrder = categories.length > 0 
      ? Math.max(...categories.map(c => c.order)) + 1 
      : 0;
    setEditingCategory(null);
    setCategoryName("");
    setCategoryOrder(nextOrder);
  };

  const openEditCategory = (category: FaqCategory) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryOrder(category.order);
    setIsCategoryDialogOpen(true);
  };

  // --- FAQ Actions ---
  const handleFaqSubmit = async () => {
    if (!faqQuestion || !faqAnswer || !faqCategoryId) {
      return toast.error("All fields are required");
    }

    setIsLoading(true);
    try {
      const url = editingFaq ? `/api/faqs/${editingFaq.id}` : "/api/faqs";
      const response = await fetch(url, {
        method: editingFaq ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: faqQuestion, 
          answer: faqAnswer, 
          categoryId: faqCategoryId, 
          order: Number(faqOrder) 
        })
      });

      if (!response.ok) throw new Error("Failed to save FAQ");

      const savedFaq = await response.json();
      
      if (editingFaq) {
        // Find the category object for the local state update
        const category = categories.find(c => c.id === savedFaq.categoryId)!;
        const updatedFaq = { ...savedFaq, category };
        setFaqs(faqs.map(f => f.id === updatedFaq.id ? updatedFaq : f));
        toast.success("FAQ updated");
      } else {
        const category = categories.find(c => c.id === savedFaq.categoryId)!;
        setFaqs([...faqs, { ...savedFaq, category }]);
        toast.success("FAQ created");
      }

      setIsFaqDialogOpen(false);
      resetFaqForm();
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFaq = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed");
      
      setFaqs(faqs.filter(f => f.id !== id));
      toast.success("FAQ deleted");
    } catch (error) {
      toast.error("Failed to delete FAQ");
    } finally {
      setIsLoading(false);
    }
  };

  const resetFaqForm = () => {
    const nextOrder = faqs.length > 0 
      ? Math.max(...faqs.map(f => f.order)) + 1 
      : 0;
    setEditingFaq(null);
    setFaqQuestion("");
    setFaqAnswer("");
    setFaqCategoryId("");
    setFaqOrder(nextOrder);
  };

  const openEditFaq = (faq: Faq) => {
    setEditingFaq(faq);
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
    setFaqCategoryId(faq.categoryId);
    setFaqOrder(faq.order);
    setIsFaqDialogOpen(true);
  };

  return (
    <Tabs defaultValue="faqs" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="faqs" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          FAQs
        </TabsTrigger>
        <TabsTrigger value="categories" className="gap-2">
          <FolderOpen className="h-4 w-4" />
          Categories
        </TabsTrigger>
      </TabsList>

      {/* --- FAQs Tab --- */}
      <TabsContent value="faqs" className="space-y-4">
        <div className="flex justify-end">
          <Dialog open={isFaqDialogOpen} onOpenChange={setIsFaqDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetFaqForm} className="gap-2">
                <Plus className="h-4 w-4" />
                Add FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingFaq ? "Edit FAQ" : "Create New FAQ"}</DialogTitle>
                <DialogDescription>
                  Enter the question and answer for your customers.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={faqCategoryId} onValueChange={setFaqCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Question</label>
                  <Input 
                    value={faqQuestion} 
                    onChange={(e) => setFaqQuestion(e.target.value)}
                    placeholder="e.g. Do you deliver nationwide?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Answer</label>
                  <Textarea 
                    value={faqAnswer} 
                    onChange={(e) => setFaqAnswer(e.target.value)}
                    placeholder="Enter the detailed answer..."
                    className="min-h-[150px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Order</label>
                  <Input 
                    type="number"
                    value={faqOrder} 
                    onChange={(e) => setFaqOrder(Number(e.target.value))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsFaqDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleFaqSubmit} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save FAQ"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {categories.sort((a, b) => a.order - b.order).map(category => {
            const categoryFaqs = faqs
              .filter(f => f.categoryId === category.id)
              .sort((a,b) => a.order - b.order);
            
            if (categoryFaqs.length === 0) return null;

            return (
              <Card key={category.id} className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-secondary/5 border-b py-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-secondary" />
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-zinc-100">
                    {categoryFaqs.map(faq => (
                      <div key={faq.id} className="p-4 hover:bg-zinc-50 transition-colors group">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-secondary mb-2">{faq.question}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" onClick={() => openEditFaq(faq)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => deleteFaq(faq.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {faqs.length === 0 && (
            <Card>
              <CardContent className="py-20 text-center space-y-4">
                <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground/30" />
                <p className="text-muted-foreground">No FAQs found. Start by adding one!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      {/* --- Categories Tab --- */}
      <TabsContent value="categories" className="space-y-4">
        <div className="flex justify-end">
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetCategoryForm} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategory ? "Edit Category" : "New Category"}</DialogTitle>
                <DialogDescription>
                  Categories help group your questions (e.g. Shipping, Payments).
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category Name</label>
                  <Input 
                    value={categoryName} 
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g. Shipping & Delivery"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Order</label>
                  <Input 
                    type="number"
                    value={categoryOrder} 
                    onChange={(e) => setCategoryOrder(Number(e.target.value))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCategorySubmit} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Category"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.sort((a, b) => a.order - b.order).map((category) => (
            <Card key={category.id} className="relative group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>
                    {faqs.filter(f => f.categoryId === category.id).length} FAQs
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" onClick={() => openEditCategory(category)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteCategory(category.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
          
          {categories.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="py-20 text-center">
                <p className="text-muted-foreground">No categories yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
