"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/store/use-cart";
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ShoppingBag,
  ChevronRight,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const cart = useCart();
  const router = useRouter();
  const t = useTranslations("Checkout");
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    setMounted(true);
    if (session?.user) {
      const user = session.user;
      setFormData(prev => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
      }));
    }
  }, [session]);

  if (!mounted || status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  // Redirect to login if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <ShieldCheck className="h-16 w-16 text-muted-foreground/20 mb-4" />
        <h1 className="text-2xl font-serif text-secondary mb-2">Login Required</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-sm">
          Please log in to your account to complete your purchase securely.
        </p>
        <Link href={`/login?callbackUrl=/checkout`}>
          <Button size="lg" className="rounded-full px-8">
            Login to Continue
          </Button>
        </Link>
      </div>
    );
  }

  if (cart.items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/20 mb-4" />
        <h1 className="text-2xl font-serif text-secondary mb-2">{t('empty')}</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-sm">
          {t('emptyDesc')}
        </p>
        <Link href="/products">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('continueShopping')}
          </Button>
        </Link>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: (session.user as any).id,
          items: cart.items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          shippingInfo: formData
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to place order");
      }
      
      setIsSuccess(true);
      cart.clearCart();
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background overflow-hidden relative">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="text-center space-y-6 relative z-10"
        >
          <div className="h-24 w-24 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-secondary">{t('success')}</h1>
          <p className="text-muted-foreground max-w-md mx-auto text-lg leading-relaxed">
             {t('successDesc')}
          </p>
          <div className="pt-8">
             <Link href="/">
               <Button size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20">
                  {t('returnHome')}
               </Button>
             </Link>
          </div>
        </motion.div>
        
        {/* Background decorative elements */}
        <div className="absolute top-1/4 left-1/4 h-64 w-64 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 bg-secondary/5 rounded-full blur-[100px]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container px-4 h-20 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold text-primary">
            MoM's NaturalFood
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
             <ShoppingBag className="h-4 w-4" />
             <span>{t('secureCheckout')}</span>
          </div>
        </div>
      </header>

      <main className="container px-4 py-12">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          {t('backToShopping')}
        </button>

        <div className="grid lg:grid-cols-12 gap-12">
           {/* Left Column: Form */}
           <div className="lg:col-span-7 space-y-8">
              <section>
                 <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">1</div>
                    <h2 className="text-2xl font-serif text-secondary font-bold">{t('shippingDetails')}</h2>
                 </div>
                  <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleCheckout}>
                    <div className="space-y-2">
                       <label className="text-sm font-medium">{t('fullName')}</label>
                       <Input 
                        placeholder={t('fullNamePlaceholder')} 
                        required 
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium">{t('email')}</label>
                       <Input 
                        type="email" 
                        placeholder={t('emailPlaceholder')} 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                       />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                       <label className="text-sm font-medium">{t('address')}</label>
                       <Input 
                        placeholder={t('addressPlaceholder')} 
                        required 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium">{t('city')}</label>
                       <Input 
                        placeholder={t('cityPlaceholder')} 
                        required 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium">{t('postalCode')}</label>
                       <Input 
                        placeholder={t('postalCodePlaceholder')} 
                        required 
                        value={formData.postalCode}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                       />
                    </div>
                    
                    <div className="sm:col-span-2 pt-8">
                       <div className="flex items-center gap-3 mb-6">
                          <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">2</div>
                          <h2 className="text-2xl font-serif text-secondary font-bold">{t('paymentMethod')}</h2>
                       </div>
                       <div className="grid gap-4">
                          <div className="border-2 border-primary bg-primary/5 p-4 rounded-xl flex items-center justify-between cursor-pointer group">
                             <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                    <CreditCard className="h-6 w-6 text-primary" />
                                 </div>
                                 <div>
                                    <p className="font-bold">{t('card')}</p>
                                    <p className="text-sm text-muted-foreground">{t('cardDesc')}</p>
                                 </div>
                             </div>
                             <div className="h-4 w-4 rounded-full border-4 border-primary" />
                          </div>
                          
                          <div className="border border-border p-4 rounded-xl flex items-center justify-between opacity-50 cursor-not-allowed grayscale">
                             <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                    <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                                 </div>
                                 <div>
                                    <p className="font-bold">{t('paypal')}</p>
                                    <p className="text-sm text-muted-foreground">{t('paypalDesc')}</p>
                                 </div>
                             </div>
                             <div className="h-4 w-4 rounded-full border border-border" />
                          </div>
                       </div>
                    </div>
                    
                    <div className="sm:col-span-2 pt-8">
                       <Button 
                         type="submit" 
                         className="w-full py-8 text-xl font-bold shadow-2xl shadow-primary/30 rounded-2xl"
                         disabled={isSubmitting}
                       >
                         {isSubmitting ? (
                           <>
                             <Loader2 className="h-6 w-6 animate-spin mr-2" />
                             {t('processing')}
                           </>
                         ) : (
                           `${t('completePurchase')} · €${cart.totalPrice().toFixed(2)}`
                         )}
                       </Button>
                       <div className="flex items-center justify-center gap-6 mt-6 text-muted-foreground">
                          <div className="flex items-center gap-1 text-xs">
                             <ShieldCheck className="h-3 w-3 text-secondary" />
                             {t('securePayments')}
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                             <Truck className="h-3 w-3 text-secondary" />
                             {t('fastDelivery')}
                          </div>
                       </div>
                    </div>
                 </form>
              </section>
           </div>

           {/* Right Column: Order Summary */}
           <div className="lg:col-span-5">
              <Card className="sticky top-28 border-none shadow-xl shadow-secondary/5 rounded-3xl overflow-hidden">
                 <CardHeader className="bg-secondary text-secondary-foreground p-6">
                    <CardTitle className="font-serif text-xl">{t('summary')}</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 space-y-6">
                    <ScrollArea className="max-h-[400px] pr-4">
                       <div className="space-y-4">
                          {cart.items.map((item) => (
                             <div key={item.id} className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-lg bg-muted border overflow-hidden flex-shrink-0">
                                   {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                   <p className="font-serif text-sm font-bold truncate text-secondary">{item.name}</p>
                                   <p className="text-xs text-muted-foreground">{t('qty')}: {item.quantity}</p>
                                </div>
                                <p className="font-serif font-bold text-primary">€{(item.price * item.quantity).toFixed(2)}</p>
                             </div>
                          ))}
                       </div>
                    </ScrollArea>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{t('Summary.subtotal', { defaultValue: 'Subtotal' })}</span>
                          <span className="font-bold">€{cart.totalPrice().toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{t('shipping')}</span>
                          <span className="font-bold text-secondary italic">{t('free')}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{t('tax')}</span>
                          <span className="font-bold">€0.00</span>
                       </div>
                       
                       <div className="pt-4 mt-4 border-t-2 border-dashed border-primary/20 flex justify-between items-center">
                          <span className="text-lg font-serif font-bold text-secondary">{t('total')}</span>
                          <span className="text-3xl font-serif font-bold text-primary">€{cart.totalPrice().toFixed(2)}</span>
                       </div>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-xl space-y-2">
                       <h4 className="text-xs font-bold uppercase tracking-widest text-secondary">{t('guarantee')}</h4>
                       <p className="text-xs text-muted-foreground leading-relaxed">
                          {t('guaranteeDesc')}
                       </p>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
