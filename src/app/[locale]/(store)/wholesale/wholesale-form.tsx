"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Plus,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Hash,
  FileText,
  Send,
  Loader2,
  ShoppingBag,
  Search,
  ChevronDown,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const wholesaleSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  contact: z.string().min(5, "Contact number is required"),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  address: z.string().min(5, "Please enter your full address"),
  description: z.string().optional(),
  products: z
    .array(
      z.object({
        productId: z.string().min(1, "Please select a product"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "Please add at least one product"),
});

type WholesaleFormData = z.infer<typeof wholesaleSchema>;

interface Product {
  id: string;
  name: string;
  price: number;
}

// ─── Searchable Product Dropdown ─────────────────────────────────────────────
function ProductSearchDropdown({
  products,
  value,
  onChange,
  loading,
  error,
}: {
  products: Product[];
  value: string;
  onChange: (id: string) => void;
  loading: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = products.find((p) => p.id === value);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        className={cn(
          "w-full h-14 pl-4 pr-10 rounded-2xl bg-white border text-sm font-medium text-left flex items-center justify-between transition-all focus:outline-none focus:ring-2 focus:ring-secondary/30",
          error ? "border-red-300" : "border-zinc-200 hover:border-secondary/50",
          open && "border-secondary/50 ring-2 ring-secondary/20",
          loading && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className={cn(selected ? "text-zinc-800" : "text-zinc-400")}>
          {loading
            ? "Loading products..."
            : selected
            ? selected.name
            : "Select a product"}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-zinc-400 transition-transform shrink-0",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden"
          >
            {/* Search bar */}
            <div className="p-2 border-b border-zinc-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full h-9 pl-8 pr-8 text-sm bg-zinc-50 rounded-xl border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary/40 transition-all"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Options list */}
            <div className="max-h-56 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="py-6 text-center text-zinc-400 text-sm italic">
                  {search ? `No products matching "${search}"` : "No products available"}
                </div>
              ) : (
                filtered.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => {
                      onChange(product.id);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "w-full px-4 py-2.5 text-left flex items-center justify-between gap-3 hover:bg-secondary/5 transition-colors text-sm",
                      value === product.id && "bg-secondary/5"
                    )}
                  >
                    <span
                      className={cn(
                        "font-medium",
                        value === product.id
                          ? "text-secondary"
                          : "text-zinc-700"
                      )}
                    >
                      {product.name}
                    </span>
                    {value === product.id && (
                      <Check className="h-4 w-4 text-secondary shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────
export default function WholesaleForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<WholesaleFormData>({
    resolver: zodResolver(wholesaleSchema),
    defaultValues: {
      fullName: "",
      contact: "",
      email: "",
      address: "",
      description: "",
      products: [{ productId: "", quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const watchedProducts = watch("products");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // The /api/products route returns a plain array, not { products: [] }
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        // Handle both plain array and { products: [] } shapes
        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(list);
      } catch {
        toast.error("Failed to load products. Please refresh the page.");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const onSubmit = async (data: WholesaleFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          email: data.email || undefined,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setSubmitted(true);
        reset();
      } else {
        toast.error(result.error || "Failed to submit inquiry");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-zinc-100 text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto rounded-full bg-emerald-100 flex items-center justify-center"
        >
          <Send className="h-10 w-10 text-emerald-600" />
        </motion.div>
        <div className="space-y-3">
          <h2 className="text-3xl font-serif font-bold italic text-secondary">
            Inquiry Submitted!
          </h2>
          <p className="text-zinc-500 font-light max-w-md mx-auto">
            Thank you for your interest. Our wholesale team will review your
            inquiry and get back to you within 1–2 business days.
          </p>
        </div>
        <Button
          onClick={() => setSubmitted(false)}
          className="h-14 px-10 rounded-full bg-secondary text-white hover:bg-accent hover:text-secondary font-bold transition-all"
        >
          Submit Another Inquiry
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      {/* Personal Information */}
      <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-zinc-100 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-secondary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-secondary" />
          </div>
          <h2 className="text-xl font-bold text-secondary">
            Personal Information
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("fullName")}
              placeholder="e.g. Sarah Johnson"
              className="h-14 rounded-2xl bg-zinc-50 border-zinc-200 focus-visible:ring-secondary/30 focus-visible:border-secondary transition-all"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              Contact / WhatsApp <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("contact")}
              placeholder="+1 (234) 567-890"
              className="h-14 rounded-2xl bg-zinc-50 border-zinc-200 focus-visible:ring-secondary/30 focus-visible:border-secondary transition-all"
            />
            {errors.contact && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.contact.message}
              </p>
            )}
          </div>
        </div>

        {/* Email (Optional) */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            Email Address{" "}
            <span className="text-zinc-400 font-normal normal-case tracking-normal text-xs">
              (optional)
            </span>
          </label>
          <Input
            {...register("email")}
            type="email"
            placeholder="john@example.com"
            className="h-14 rounded-2xl bg-zinc-50 border-zinc-200 focus-visible:ring-secondary/30 focus-visible:border-secondary transition-all"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-zinc-100 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-accent/20 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary">
                Products of Interest
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {loadingProducts
                  ? "Loading products..."
                  : `${products.length} products available · Search & select below`}
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => append({ productId: "", quantity: 1 })}
            variant="outline"
            className="gap-2 rounded-full border-secondary text-secondary hover:bg-secondary hover:text-white transition-all font-bold"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Products are loading skeleton */}
        {loadingProducts && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-16 rounded-2xl bg-zinc-100 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loadingProducts && (
          <>
            <AnimatePresence mode="popLayout">
              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="p-5 bg-zinc-50/80 rounded-2xl border border-zinc-100 space-y-4"
                >
                  <div className="grid md:grid-cols-[1fr_180px_auto] gap-4 items-start">
                    {/* Product Searchable Dropdown */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Package className="h-3 w-3" />
                        Product <span className="text-red-500">*</span>
                      </label>
                      <ProductSearchDropdown
                        products={products}
                        value={watchedProducts[index]?.productId || ""}
                        onChange={(id) =>
                          setValue(`products.${index}.productId`, id, {
                            shouldValidate: true,
                          })
                        }
                        loading={false}
                        error={
                          errors.products?.[index]?.productId?.message
                        }
                      />
                      {errors.products?.[index]?.productId && (
                        <p className="text-red-500 text-xs font-medium">
                          {errors.products[index]?.productId?.message}
                        </p>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Hash className="h-3 w-3" />
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <Input
                        {...register(`products.${index}.quantity`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        min="1"
                        placeholder="1"
                        className="h-14 rounded-2xl bg-white border-zinc-200 focus-visible:ring-secondary/30 focus-visible:border-secondary transition-all"
                      />
                      {errors.products?.[index]?.quantity && (
                        <p className="text-red-500 text-xs font-medium">
                          {errors.products[index]?.quantity?.message}
                        </p>
                      )}
                    </div>

                    {/* Remove */}
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="h-14 w-14 rounded-2xl text-zinc-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {errors.products &&
              typeof errors.products.message === "string" && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.products.message}
                </p>
              )}

            {/* Add More CTA */}
            <button
              type="button"
              onClick={() => append({ productId: "", quantity: 1 })}
              className="w-full h-12 rounded-2xl border-2 border-dashed border-zinc-200 text-zinc-400 hover:border-secondary hover:text-secondary transition-all flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" />
              Add another product
            </button>
          </>
        )}
      </div>

      {/* Address & Description */}
      <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-zinc-100 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-secondary">
            Delivery & Details
          </h2>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Address <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("address")}
            placeholder="123 Business Ave, City, Country"
            className="h-14 rounded-2xl bg-zinc-50 border-zinc-200 focus-visible:ring-secondary/30 focus-visible:border-secondary transition-all"
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Additional Information{" "}
            <span className="text-zinc-400 font-normal normal-case tracking-normal text-xs">
              (optional)
            </span>
          </label>
          <Textarea
            {...register("description")}
            rows={5}
            placeholder="Tell us about your business, estimated order frequency, or any specific requirements..."
            className="rounded-3xl bg-zinc-50 border-zinc-200 focus-visible:ring-secondary/30 focus-visible:border-secondary transition-all p-5 resize-none"
          />
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={submitting}
        className="w-full h-16 rounded-[2rem] bg-secondary hover:bg-accent text-white hover:text-secondary font-bold text-lg shadow-2xl shadow-secondary/20 transition-all gap-3 group"
      >
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Submitting Inquiry...
          </>
        ) : (
          <>
            Submit Wholesale Inquiry
            <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>

      <p className="text-center text-xs text-zinc-400">
        Our wholesale team typically responds within 1–2 business days. We look
        forward to working with you!
      </p>
    </motion.form>
  );
}
