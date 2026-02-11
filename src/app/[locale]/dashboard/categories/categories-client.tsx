"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Loader2,
  FolderOpen
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
}

interface AdminCategoriesClientProps {
  categories: Category[];
}

export function AdminCategoriesClient({ categories }: AdminCategoriesClientProps) {
  const t = useTranslations("AdminCategories");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: ""
  });

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  const handleNameChange = (name: string) => {
      setFormData({ 
          ...formData, 
          name, 
          slug: editingCategory ? formData.slug : generateSlug(name) 
      });
  };

  const onSubmit = async () => {
    try {
      if (!formData.name || !formData.slug) {
        return toast.error(t('required'));
      }

      setIsLoading(true);
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to save category");
      }

      toast.success(editingCategory ? t('successUpdate') : t('successCreate'));
      setIsDialogOpen(false);
      resetForm();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async (category: Category) => {
      if (category._count && category._count.products > 0) {
          return toast.error(t('errorDeleteProducts'));
      }

      if (!confirm(t('deleteConfirm', { name: category.name }))) return;
      
      try {
          setIsLoading(true);
          const response = await fetch(`/api/categories/${category.id}`, { method: "DELETE" });
          if (!response.ok) {
              const data = await response.json();
              throw new Error(data.error || "Failed to delete category");
          }
          toast.success(t('successDelete'));
          router.refresh();
      } catch (error: any) {
          toast.error(error.message || "Error deleting category");
      } finally {
          setIsLoading(false);
      }
  };

  const onEdit = (category: Category) => {
      setEditingCategory(category);
      setFormData({
          name: category.name,
          slug: category.slug
      });
      setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "" });
  };

  const filteredCategories = categories.filter((c) => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
            <Button size="sm" className="gap-2" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                <Plus className="h-4 w-4" />
                {t('addCategory')}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? t('editCategory') : t('newCategory')}</DialogTitle>
                        <DialogDescription>
                            {editingCategory ? t('editDescription') : t('newDescription')}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-bold">{t('name')}</label>
                            <Input 
                                placeholder={t('namePlaceholder')} 
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-bold">{t('slug')}</label>
                            <Input 
                                placeholder={t('slugPlaceholder')} 
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>{t('cancel')}</Button>
                        <Button onClick={onSubmit} disabled={isLoading} className="gap-2">
                           {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                           {editingCategory ? t('save') : t('create')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader className="pb-3 px-6 pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-50/50 border-none focus-visible:ring-1"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border-t">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="pl-6 font-semibold">{t('table.name')}</TableHead>
                  <TableHead className="font-semibold">{t('table.slug')}</TableHead>
                  <TableHead className="font-semibold text-center">{t('table.products')}</TableHead>
                  <TableHead className="w-[100px] text-right pr-6">{t('table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id} className="hover:bg-gray-50/50 transition-colors group">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                                <FolderOpen className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">{category.slug}</code>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-normal">
                          {t('table.productsCount', { count: category._count?.products || 0 })}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuLabel>{t('table.actions')}</DropdownMenuLabel>
                            <DropdownMenuItem className="gap-2 focus:bg-primary/5 cursor-pointer" onClick={() => onEdit(category)}>
                               <Edit className="h-4 w-4 text-blue-500" />
                               Edit
                             </DropdownMenuItem>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem 
                                className="gap-2 text-rose-600 focus:bg-rose-50 cursor-pointer" 
                                onClick={() => onDelete(category)}
                                disabled={category._count && category._count.products > 0}
                             >
                               <Trash className="h-4 w-4" />
                               Delete
                             </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
            {filteredCategories.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h3 className="text-xl font-semibold">{t('noCategories')}</h3>
                <p className="text-muted-foreground mt-2">{t('adjustSearch')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
