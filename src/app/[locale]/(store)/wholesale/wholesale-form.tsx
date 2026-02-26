"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

const wholesaleSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  contact: z.string().min(5, "Contact is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().min(5, "Address is required"),
  description: z.string().optional(),
  products: z.array(
    z.object({
      productId: z.string().min(1, "Product is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    })
  ).min(1, "At least one product is required"),
});

type WholesaleFormData = z.infer<typeof wholesaleSchema>;

interface Product {
  id: string;
  name: string;
}

export default function WholesaleForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<WholesaleFormData>({
    resolver: zodResolver(wholesaleSchema),
    defaultValues: {
      products: [{ productId: "", quantity: 1 }],
    },
  });

  const productFields = watch("products");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = () => {
    setValue("products", [...productFields, { productId: "", quantity: 1 }]);
  };

  const removeProduct = (index: number) => {
    if (productFields.length > 1) {
      setValue(
        "products",
        productFields.filter((_, i) => i !== index)
      );
    }
  };

  const onSubmit = async (data: WholesaleFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Inquiry submitted successfully! We'll contact you soon.");
        reset();
        setValue("products", [{ productId: "", quantity: 1 }]);
      } else {
        toast.error(result.error || "Failed to submit inquiry");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg border">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("fullName")}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="John Doe"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Contact <span className="text-red-500">*</span>
          </label>
          <input
            {...register("contact")}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="+1234567890"
          />
          {errors.contact && (
            <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email (Optional)</label>
        <input
          {...register("email")}
          type="email"
          className="w-full px-3 py-2 border rounded-md"
          placeholder="john@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Products</h3>
          <button
            type="button"
            onClick={addProduct}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        {productFields.map((field, index) => (
          <div key={index} className="grid md:grid-cols-[1fr_auto_auto] gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product <span className="text-red-500">*</span>
              </label>
              <select
                {...register(`products.${index}.productId`)}
                className="w-full px-3 py-2 border rounded-md"
                disabled={loading}
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {errors.products?.[index]?.productId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.products[index]?.productId?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                {...register(`products.${index}.quantity`, { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="1"
              />
              {errors.products?.[index]?.quantity && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.products[index]?.quantity?.message}
                </p>
              )}
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeProduct(index)}
                disabled={productFields.length === 1}
                className="px-3 py-2 border rounded-md hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {errors.products && typeof errors.products.message === "string" && (
          <p className="text-red-500 text-sm mt-1">{errors.products.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Address <span className="text-red-500">*</span>
        </label>
        <input
          {...register("address")}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="123 Main St, City, Country"
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description (Optional)</label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Additional information about your inquiry..."
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Inquiry"}
      </button>
    </form>
  );
}
