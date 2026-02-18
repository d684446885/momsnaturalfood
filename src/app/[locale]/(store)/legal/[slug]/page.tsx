import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Clock, ChevronLeft } from "lucide-react";
import { Link } from "@/i18n/routing";

interface LegalPageProps {
  params: {
    slug: string;
    locale: string;
  };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params;

  const page = await db.legalPage.findUnique({
    where: { slug }
  });

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-24">
      <article className="container mx-auto px-6 max-w-4xl">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-secondary mb-12 transition-colors group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="space-y-8 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/5 text-secondary text-sm font-medium">
            <FileText className="h-4 w-4" />
            Legal Document
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-secondary italic">
            {page.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-muted-foreground border-y border-zinc-200 py-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last updated: {new Date(page.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div 
          className="prose prose-zinc prose-lg max-w-none 
            prose-headings:font-serif prose-headings:text-secondary prose-headings:italic
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-strong:text-secondary prose-strong:font-bold
            prose-li:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: page.content.replace(/\n/g, '<br/>') }} 
        />
      </article>
    </div>
  );
}
