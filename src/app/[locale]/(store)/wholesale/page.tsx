import { Metadata } from "next";
import { db } from "@/lib/db";
import WholesaleForm from "./wholesale-form";
import { motion } from "framer-motion";
import {
  Truck,
  BadgePercent,
  HandshakeIcon,
  PackageCheck,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Wholesale | MoM's Natural Foods",
  description:
    "Apply for wholesale pricing on our premium natural food products. Bulk orders with competitive rates for retailers and businesses.",
};

const benefits = [
  {
    icon: BadgePercent,
    title: "Competitive Rates",
    desc: "Get access to exclusive bulk pricing unavailable in the regular store.",
  },
  {
    icon: PackageCheck,
    title: "Consistent Quality",
    desc: "Every batch is made with the same 100% natural ingredients we're known for.",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    desc: "Scheduled, dependable delivery to keep your shelves stocked and customers happy.",
  },
  {
    icon: HandshakeIcon,
    title: "Dedicated Support",
    desc: "A personal wholesale manager to assist you every step of the way.",
  },
];

export default async function WholesalePage() {
  const productCount = await db.product
    .count({ where: { isActive: true } })
    .catch(() => 0);

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-secondary z-0">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-accent/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] opacity-10 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-white to-transparent" />
          {/* Decorative leaves pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-accent text-sm font-bold tracking-widest uppercase">
              <BadgePercent className="h-4 w-4" />
              For Retailers & Businesses
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold italic tracking-tight leading-[1.1]">
              Wholesale
              <br />
              <span className="text-accent">Inquiries</span>
            </h1>
            <p className="text-lg md:text-xl text-white/75 font-light font-serif italic max-w-xl mx-auto">
              Partner with MoM's Natural Foods and bring the finest natural
              products to your customers at competitive wholesale rates.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-accent">
                  {productCount}+
                </span>
                <span className="text-xs text-white/60 uppercase tracking-widest">
                  Products
                </span>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-accent">100%</span>
                <span className="text-xs text-white/60 uppercase tracking-widest">
                  Natural
                </span>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-accent">B2B</span>
                <span className="text-xs text-white/60 uppercase tracking-widest">
                  Pricing
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 80L48 72C96 64 192 48 288 45.3C384 43 480 53 576 58.7C672 64 768 64 864 58.7C960 53 1056 43 1152 40C1248 37 1344 43 1392 45.3L1440 48V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z"
              fill="var(--background, #FAF9F6)"
            />
          </svg>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="py-8 md:py-16 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Form */}
            <div className="lg:col-span-8">
              <div className="mb-8">
                <h2 className="text-3xl font-serif font-bold italic text-secondary">
                  Apply for Wholesale Access
                </h2>
                <p className="text-zinc-500 mt-2 font-light">
                  Fill in the form below and our team will reach out to discuss
                  pricing and terms.
                </p>
              </div>
              <WholesaleForm />
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-4 space-y-6">
              {/* Process Steps */}
              <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-zinc-100">
                <h3 className="text-xl font-bold text-secondary font-serif italic mb-6">
                  How It Works
                </h3>
                <div className="space-y-5">
                  {[
                    {
                      step: "01",
                      title: "Submit Your Inquiry",
                      desc: "Fill in the form with your details and product interests.",
                    },
                    {
                      step: "02",
                      title: "We Review & Respond",
                      desc: "Our team reviews your application within 1–2 business days.",
                    },
                    {
                      step: "03",
                      title: "Receive Your Quote",
                      desc: "Get a custom wholesale pricing sheet tailored to your needs.",
                    },
                    {
                      step: "04",
                      title: "Start Ordering",
                      desc: "Place orders and enjoy regular deliveries at wholesale rates.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <span className="text-2xl font-bold text-accent/40 font-serif leading-none w-10 shrink-0">
                        {item.step}
                      </span>
                      <div>
                        <p className="font-bold text-secondary text-sm">
                          {item.title}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact CTA */}
              <div className="bg-secondary rounded-[2rem] p-8 text-white space-y-4">
                <h3 className="text-xl font-bold font-serif italic">
                  Have Questions?
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Our wholesale team is happy to chat before you submit a formal
                  inquiry.
                </p>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-accent font-bold text-sm hover:text-white transition-colors group"
                >
                  Contact Us
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Trust Badge */}
              <div className="bg-accent/10 rounded-[2rem] p-8 border border-accent/20 space-y-2">
                <p className="text-xs font-bold text-secondary uppercase tracking-widest">
                  Our Commitment
                </p>
                <p className="font-serif font-bold italic text-secondary text-xl">
                  Pure. Natural. Crafted with Love.
                </p>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Every product we offer at wholesale is made with the same
                  premium, natural ingredients as our retail line — no
                  compromises.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits — at the bottom */}
      <section className="py-16 md:py-20 pb-24 bg-white border-t border-zinc-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-accent uppercase tracking-widest mb-2">Why Partner With Us</p>
            <h2 className="text-3xl font-serif font-bold italic text-secondary">The Wholesale Advantage</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={i}
                  className="group p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100 hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="h-12 w-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-secondary transition-all duration-500">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-secondary mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-zinc-500 font-light leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
