import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  category: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: {
    id: string;
    name: string;
    price: number | string | { toString: () => string };
    images?: string[];
    category?: { name: string };
  }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product: {
        id: string;
        name: string;
        price: number | string | { toString: () => string };
        images?: string[];
        category?: { name: string };
      }) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
          toast.success(`Increased ${product.name} quantity`);
        } else {
          set({
            items: [
              ...currentItems,
              {
                id: product.id,
                name: product.name,
                price: parseFloat(product.price.toString()),
                image: product.images?.[0],
                category: product.category?.name || "Natural",
                quantity: 1,
              },
            ],
          });
          toast.success(`${product.name} added to basket`);
        }
      },
      removeItem: (id: string) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
        toast.error("Item removed from basket");
      },
      updateQuantity: (id: string, quantity: number) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: "moms-food-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
