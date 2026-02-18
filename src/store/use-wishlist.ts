import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image?: string;
  category: string;
  description: string;
  stock: number;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (product: any) => void;
  removeItem: (id: string) => void;
  toggleItem: (product: any) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product: any) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (!existingItem) {
          set({
            items: [
              ...currentItems,
              {
                id: product.id,
                name: product.name,
                price: parseFloat(product.price.toString()),
                salePrice: product.salePrice ? parseFloat(product.salePrice.toString()) : undefined,
                image: product.images?.[0],
                category: product.category?.name || "Natural",
                description: product.description,
                stock: product.stock || 0,
              },
            ],
          });
          toast.success(`${product.name} added to wishlist`);
        }
      },
      removeItem: (id: string) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
        toast.info("Item removed from wishlist");
      },
      toggleItem: (product: any) => {
        const isInList = get().isInWishlist(product.id);
        if (isInList) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },
      isInWishlist: (id: string) => {
        return get().items.some((item) => item.id === id);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "moms-food-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
