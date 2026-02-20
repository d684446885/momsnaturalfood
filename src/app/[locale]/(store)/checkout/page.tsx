"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/store/use-cart";
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ShoppingBag,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const cart = useCart();
  const router = useRouter();
  const t = useTranslations("Checkout");
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [shippingSettings, setShippingSettings] = useState({ fee: 0, threshold: 0, codEnabled: true });

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    contactNumber: "",
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
    
    // Fetch shipping settings
    fetch("/api/public/settings")
      .then(res => res.json())
      .then(data => {
        if (data) {
          setShippingSettings({
            fee: Number(data.shippingFee) || 0,
            threshold: Number(data.freeShippingThreshold) || 0,
            codEnabled: data.cashOnDeliveryEnabled !== false // default to true if not specified
          });
        }
      })
      .catch(err => console.error("Error fetching shipping settings:", err));
  }, [session]);

  const subtotal = cart.totalPrice();
  const shippingFee = (shippingSettings.threshold > 0 && subtotal >= shippingSettings.threshold) ? 0 : shippingSettings.fee;
  const total = subtotal + shippingFee;

  if (!mounted || status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

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
    const emailToUse = session?.user?.email || formData.email;
    if (!emailToUse) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id || null,
          items: cart.items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          shippingInfo: formData,
          shippingFee,
          total,
          paymentMethod: paymentMethod.toUpperCase()
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


      <main className="container px-4 py-12">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-400 hover:text-primary transition-all mb-10 group bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-100 shadow-sm w-fit"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">{t('backToShopping')}</span>
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
                     <div className="sm:col-span-2 space-y-2">
                        <label className="text-sm font-medium">{t('contactNumber')}</label>
                        <Input 
                         type="tel"
                         placeholder={t('contactNumberPlaceholder')} 
                         required 
                         value={formData.contactNumber}
                         onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                        />
                     </div>
                    
                    <div className="sm:col-span-2 pt-8">
                       <div className="flex items-center gap-3 mb-6">
                          <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">2</div>
                          <h2 className="text-2xl font-serif text-secondary font-bold">{t('paymentMethod')}</h2>
                       </div>
                         <div className="grid sm:grid-cols-2 gap-4">
                           <div 
                             onClick={() => setPaymentMethod('card')}
                             className={cn(
                               "p-5 rounded-2xl flex items-center justify-between cursor-pointer group hover:bg-primary/10 transition-all shadow-lg shadow-primary/5",
                               paymentMethod === 'card' ? "border-2 border-primary bg-primary/5" : "border border-border bg-white"
                             )}
                           >
                               <div className="flex items-center gap-4">
                                   <div className={cn(
                                     "h-12 w-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform",
                                     paymentMethod === 'card' ? "bg-white" : "bg-zinc-100"
                                   )}>
                                      <CreditCard className={cn("h-6 w-6", paymentMethod === 'card' ? "text-primary" : "text-zinc-400")} />
                                   </div>
                                   <div>
                                      <p className={cn("font-bold", paymentMethod === 'card' ? "text-secondary" : "text-zinc-500")}>{t('card')}</p>
                                      <p className="text-[10px] uppercase tracking-wider font-bold text-primary/60">{t('cardDesc')}</p>
                                   </div>
                               </div>
                               <div className={cn(
                                 "h-5 w-5 rounded-full border-2",
                                 paymentMethod === 'card' ? "border-primary border-[6px]" : "border-border"
                               )} />
                           </div>
                           
                           {shippingSettings.codEnabled && (
                            <div 
                              onClick={() => setPaymentMethod('cod')}
                              className={cn(
                                "p-5 rounded-2xl flex items-center justify-between cursor-pointer group hover:bg-primary/10 transition-all shadow-lg shadow-primary/5",
                                paymentMethod === 'cod' ? "border-2 border-primary bg-primary/5" : "border border-border bg-white"
                              )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                      "h-12 w-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform",
                                      paymentMethod === 'cod' ? "bg-white" : "bg-zinc-100"
                                    )}>
                                       <Truck className={cn("h-6 w-6", paymentMethod === 'cod' ? "text-primary" : "text-zinc-400")} />
                                    </div>
                                    <div>
                                       <p className={cn("font-bold", paymentMethod === 'cod' ? "text-secondary" : "text-zinc-500")}>{t('cod')}</p>
                                       <p className="text-[10px] uppercase tracking-wider font-bold text-primary/60">{t('codDesc')}</p>
                                    </div>
                                </div>
                                <div className={cn(
                                  "h-5 w-5 rounded-full border-2",
                                  paymentMethod === 'cod' ? "border-primary border-[6px]" : "border-border"
                                )} />
                            </div>
                           )}

                           {!shippingSettings.codEnabled && (
                            <div className="border border-border p-5 rounded-2xl flex items-center justify-between opacity-40 cursor-not-allowed grayscale bg-zinc-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                       <ShoppingBag className="h-6 w-6 text-zinc-400" />
                                    </div>
                                    <div>
                                       <p className="font-bold text-zinc-500">{t('paypal')}</p>
                                       <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">{t('paypalDesc')}</p>
                                    </div>
                                </div>
                                <div className="h-5 w-5 rounded-full border-2 border-border" />
                            </div>
                           )}
                         </div>
                    </div>
                    
                    <div className="sm:col-span-2 pt-8">
                        <Button 
                          type="submit" 
                          className="w-full py-6 text-lg font-bold shadow-xl shadow-primary/20 rounded-2xl bg-gradient-to-r from-primary to-primary/90 hover:scale-[1.01] transition-transform group"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin mr-2" />
                              {t('processing')}
                            </>
                          ) : (
                            <div className="flex items-center gap-4">
                               <span>{t('completePurchase')}</span>
                               <Separator orientation="vertical" className="h-5 bg-white/20" />
                               <span className="text-xl font-serif">€{total.toFixed(2)}</span>
                            </div>
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
            <div className="lg:col-span-5 h-fit lg:h-[calc(100vh-140px)] sticky top-28">
               <div className="flex flex-col h-full space-y-6">
                  <Card className="flex-1 flex flex-col border-none shadow-2xl shadow-secondary/10 rounded-[2.5rem] overflow-hidden bg-white/70 backdrop-blur-xl border border-white/20 min-h-0">
                     <CardHeader className="bg-gradient-to-br from-secondary to-secondary/90 text-secondary-foreground p-6 shrink-0">
                        <div className="flex items-center justify-between">
                           <CardTitle className="font-serif text-xl italic">{t('summary')}</CardTitle>
                           <Badge variant="outline" className="bg-white/10 border-white/20 text-white font-normal">
                              {cart.items.reduce((acc, item) => acc + item.quantity, 0)} {t('items')}
                           </Badge>
                        </div>
                     </CardHeader>
                     
                     <CardContent className="p-0 flex flex-col flex-1 min-h-0">
                        <ScrollArea className="flex-1 px-6 min-h-0">
                           <div className="divide-y divide-zinc-100">
                              {cart.items.map((item) => (
                                 <div key={item.id} className="py-4 flex gap-4 transition-all group">
                                    <div className="h-16 w-16 rounded-2xl bg-zinc-50 border border-zinc-100 overflow-hidden flex-shrink-0 relative group-hover:scale-105 transition-transform duration-500 shadow-sm">
                                       {item.image ? (
                                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                       ) : (
                                          <div className="h-full w-full flex items-center justify-center bg-muted">
                                             <ShoppingBag className="h-6 w-6 text-muted-foreground/30" />
                                          </div>
                                       )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                       <p className="font-bold text-sm text-secondary line-clamp-1 group-hover:text-primary transition-colors">{item.name}</p>
                                       <div className="flex items-center justify-between mt-1">
                                          <p className="text-xs text-muted-foreground font-medium">
                                             <span className="text-secondary/60">Qty:</span> {item.quantity} × €{item.price.toFixed(2)}
                                          </p>
                                          <p className="font-bold text-sm text-secondary">€{(item.price * item.quantity).toFixed(2)}</p>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </ScrollArea>
                        
                        <div className="p-8 bg-zinc-50/80 space-y-4 border-t border-zinc-100 shrink-0">
                           <div className="space-y-3">
                              <div className="flex justify-between items-center text-sm">
                                 <span className="text-zinc-500 font-medium">{t('Summary.subtotal', { defaultValue: 'Subtotal' })}</span>
                                 <span className="font-bold text-secondary">€{cart.totalPrice().toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                 <span className="text-zinc-500 font-medium">{t('shipping')}</span>
                                 <div className="flex items-center gap-1.5">
                                    <Truck className="h-3.5 w-3.5 text-secondary/40" />
                                    {shippingFee === 0 ? (
                                      <span className="font-bold text-secondary text-[10px] uppercase tracking-wider bg-secondary/10 px-2 py-0.5 rounded-full">{t('free')}</span>
                                    ) : (
                                      <span className="font-bold text-secondary">€{shippingFee.toFixed(2)}</span>
                                    )}
                                 </div>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                 <span className="text-zinc-500 font-medium">{t('tax')}</span>
                                 <span className="font-bold text-secondary">€0.00</span>
                              </div>
                           </div>
                           
                           <div className="pt-6 border-t border-secondary/10">
                              <div className="flex justify-between items-end">
                                 <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">{t('total')}</span>
                                    <span className="text-4xl font-serif font-bold text-secondary leading-none italic">
                                       €{total.toFixed(2)}
                                    </span>
                                 </div>
                                 <CreditCard className="h-8 w-8 text-secondary/10" />
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  <Card className="border-none shadow-xl shadow-secondary/5 rounded-3xl bg-white/50 border border-white/20 overflow-hidden group shrink-0">
                     <CardContent className="p-5 flex gap-4 items-start">
                        <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                           <ShieldCheck className="h-6 w-6 text-secondary" />
                        </div>
                        <div className="space-y-1">
                           <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary">{t('guarantee')}</h4>
                           <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {t('guaranteeDesc')}
                           </p>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </div>
        </div>
      </main>
    </div>
  );
}
