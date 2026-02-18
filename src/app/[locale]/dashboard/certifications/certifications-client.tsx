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
  Award,
  Image as ImageIcon
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { R2ImageUpload } from "@/components/r2-image-upload";

interface Certification {
  id: string;
  title: string;
  imageUrl: string;
  order: number;
}

interface AdminCertificationsClientProps {
  certifications: Certification[];
}

export function AdminCertificationsClient({ certifications }: AdminCertificationsClientProps) {
  const t = useTranslations("AdminCertifications");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    order: 0
  });

  const onSubmit = async () => {
    try {
      if (!formData.title || !formData.imageUrl) {
        return toast.error(t('required'));
      }

      setIsLoading(true);
      const url = editingCert ? `/api/certifications/${editingCert.id}` : "/api/certifications";
      const method = editingCert ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to save certification");
      }

      toast.success(editingCert ? t('successUpdate') : t('successCreate'));
      setIsDialogOpen(false);
      resetForm();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async (cert: Certification) => {
      if (!confirm(t('deleteConfirm'))) return;
      
      try {
          setIsLoading(true);
          const response = await fetch(`/api/certifications/${cert.id}`, { method: "DELETE" });
          if (!response.ok) {
              const data = await response.json();
              throw new Error(data.error || "Failed to delete certification");
          }
          toast.success(t('successDelete'));
          router.refresh();
      } catch (error: any) {
          toast.error(error.message || "Error deleting certification");
      } finally {
          setIsLoading(false);
      }
  };

  const onEdit = (cert: Certification) => {
      setEditingCert(cert);
      setFormData({
          title: cert.title,
          imageUrl: cert.imageUrl,
          order: cert.order
      });
      setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCert(null);
    setFormData({ title: "", imageUrl: "", order: 0 });
  };

  const filteredCerts = certifications.filter((c) => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
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
                {t('addCertification')}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
            }}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingCert ? t('editCertification') : t('newCertification')}</DialogTitle>
                        <DialogDescription>
                            {editingCert ? t('editDescription') : t('newDescription')}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-bold">{t('image')}</label>
                            <R2ImageUpload 
                                images={formData.imageUrl ? [formData.imageUrl] : []}
                                onChange={(urls) => setFormData({ ...formData, imageUrl: urls[0] || "" })}
                                maxImages={1}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-bold">{t('certTitle')}</label>
                            <Input 
                                placeholder="e.g. ISO 9001" 
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-bold">{t('order')}</label>
                            <Input 
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>{t('cancel')}</Button>
                        <Button onClick={onSubmit} disabled={isLoading} className="gap-2">
                           {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                           {editingCert ? t('save') : t('create')}
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
                placeholder="Search certifications..."
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
                  <TableHead className="pl-6 font-semibold w-[100px]">{t('table.image')}</TableHead>
                  <TableHead className="font-semibold">{t('table.title')}</TableHead>
                  <TableHead className="font-semibold text-center w-[100px]">{t('table.order')}</TableHead>
                  <TableHead className="w-[100px] text-right pr-6">{t('table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredCerts.map((cert) => (
                    <TableRow key={cert.id} className="hover:bg-gray-50/50 transition-colors group">
                      <TableCell className="pl-6">
                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center overflow-hidden border">
                          {cert.imageUrl ? (
                             <img src={cert.imageUrl} alt={cert.title} className="h-full w-full object-contain" />
                          ) : (
                             <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                                <Award className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{cert.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-medium text-muted-foreground">{cert.order}</span>
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
                             <DropdownMenuItem className="gap-2 focus:bg-primary/5 cursor-pointer" onClick={() => onEdit(cert)}>
                                <Edit className="h-4 w-4 text-blue-500" />
                                Edit
                             </DropdownMenuItem>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem className="gap-2 text-rose-600 focus:bg-rose-50 cursor-pointer" onClick={() => onDelete(cert)}>
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
            {filteredCerts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h3 className="text-xl font-semibold">{t('noCertifications')}</h3>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
