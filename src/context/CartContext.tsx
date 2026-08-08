'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string | undefined;
  slug: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCart = localStorage.getItem('sfurti_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('sfurti_cart', JSON.stringify(items));
      } catch {
        // Ignore localStorage write errors
      }
    }
  }, [items, isMounted]);

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qtyToAdd = item.quantity || 1;
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.productId === item.productId);
      const updated = [...prevItems];
      const existingItem = updated[existingIndex];
      if (existingIndex > -1 && existingItem) {
        existingItem.quantity += qtyToAdd;
        return updated;
      }
      return [...prevItems, { ...item, quantity: qtyToAdd }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
