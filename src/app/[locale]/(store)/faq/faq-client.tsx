"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { HelpCircle, Search, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FaqCategory {
  id: string;
  name: string;
  faqs: FAQ[];
}

interface FAQClientProps {
  categories: FaqCategory[];
}

export function FAQClient({ categories }: FAQClientProps) {
  const t = useTranslations("Footer");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredCategories = categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="container mx-auto px-6 mb-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/5 text-secondary text-sm font-medium"
            >
              <HelpCircle className="h-4 w-4" />
              Help Center
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-5xl md:text-6xl font-bold text-secondary italic"
            >
              How can we help you?
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-xl mx-auto"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for questions..."
                className="h-14 pl-12 pr-4 rounded-2xl border-zinc-200 bg-white shadow-sm focus:ring-secondary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
          </div>
        </section>

        {/* Categories & FAQs */}
        <section className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {filteredCategories.length > 0 ? (
              <div className="space-y-12">
                {filteredCategories.map((category, catIdx) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: catIdx * 0.1 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-serif font-bold text-secondary flex items-center gap-3">
                      <div className="h-8 w-1 bg-accent rounded-full" />
                      {category.name}
                    </h2>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                      {category.faqs.map((faq) => (
                        <AccordionItem 
                          key={faq.id} 
                          value={faq.id}
                          className="border rounded-2xl bg-white px-6 overflow-hidden shadow-sm hover:shadow-md transition-all"
                        >
                          <AccordionTrigger className="text-left py-6 font-medium text-secondary hover:no-underline hover:text-primary">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed pb-6 whitespace-pre-wrap">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 space-y-4">
                <Search className="h-12 w-12 mx-auto text-muted-foreground/30" />
                <p className="text-xl text-muted-foreground font-serif italic">
                  No questions found for "{searchQuery}"
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="container mx-auto px-6 mt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto p-12 rounded-[3rem] bg-secondary text-white text-center space-y-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10 bg-[url('/grain_texture.png')] bg-repeat" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl font-serif font-bold italic">Still have questions?</h2>
              <p className="text-white/70 max-w-xl mx-auto text-lg font-light leading-relaxed">
                If you can't find what you're looking for, our friendly team is here to help you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/contact">
                  <Button size="lg" className="h-14 px-8 rounded-full bg-accent text-secondary hover:bg-white font-bold text-lg gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Contact Team
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
