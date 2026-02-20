"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useRouter } from "@/i18n/routing";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Leaf, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("Auth.login");
  const common = useTranslations("Auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(t('error'));
      } else {
        toast.success(t('success'));
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error(t('genericError'));
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1542223175-7582dd70cb3c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center p-4 relative overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-primary/10 overflow-hidden">
          <div className="p-8 pt-12 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
              <div className="p-2 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors">
                <Leaf className="h-6 w-6 text-secondary" />
              </div>
              <span className="font-serif text-2xl font-bold text-secondary">
                MoM's NaturalFood
              </span>
            </Link>
            
            <h1 className="font-serif text-3xl font-bold text-secondary mb-2">{t('title')}</h1>
            <p className="text-muted-foreground italic">{t('subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-secondary ml-1">{t('email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 rounded-xl border-primary/10 bg-white/50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-semibold text-secondary">{t('password')}</label>
                  <Link href="#" className="text-xs text-primary hover:underline">{t('forgotPassword')}</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-12 rounded-xl border-primary/10 bg-white/50 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20 rounded-2xl group"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {t('signIn')}
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>



            <p className="text-center text-sm text-muted-foreground">
              {t('noAccount')}{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">
                {t('register')}
              </Link>
            </p>
          </form>
          
          <div className="p-4 bg-muted/30 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              {common('motto')}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
