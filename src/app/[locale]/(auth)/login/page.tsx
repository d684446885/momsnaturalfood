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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      toast.error("Failed to sign in with Google");
      setIsGoogleLoading(false);
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
              disabled={isLoading || isGoogleLoading}
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

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground font-bold tracking-widest">{common('or')}</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={isLoading || isGoogleLoading}
              onClick={handleGoogleSignIn}
              className="w-full h-14 text-md font-bold rounded-2xl border-primary/10 hover:bg-zinc-50 transition-all gap-3"
            >
              {isGoogleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                      />
                      <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                      />
                      <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                      />
                      <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                      />
                  </svg>
                  {common('continueWithGoogle')}
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
