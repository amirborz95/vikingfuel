'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MAX_STOCK, totalUnits as calculateUnits, itemUnits } from '@/lib/inventory';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  priceId: string;
  units?: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isReady: boolean;
  totalItems: number;
  totalUnits: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('vikingfuel_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filter out items without priceId to handle migration
        const validItems = parsed.filter((item: any) => item.priceId && item.priceId !== '');
        setItems(validItems);
      }
    } catch {
      localStorage.removeItem('vikingfuel_cart');
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('vikingfuel_cart', JSON.stringify(items));
    } catch {
      // Ignore localStorage errors
    }
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const quantityToAdd = item.quantity && item.quantity > 0 ? item.quantity : 1;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const itemUnitsToAdd = (item.units ?? 1) * quantityToAdd;
      const currentUnits = calculateUnits(prev);
      if (currentUnits + itemUnitsToAdd > MAX_STOCK) {
        return prev;
      }

      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantityToAdd } : i
        );
      }
      return [...prev, { ...item, quantity: quantityToAdd }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      const newQuantity = quantity <= 0 ? 0 : quantity;
      const newUnits = item.units ?? 1;
      const currentUnits = calculateUnits(prev) - itemUnits(item);

      if (newQuantity === 0) {
        return prev.filter((i) => i.id !== id);
      }

      if (currentUnits + newQuantity * newUnits > MAX_STOCK) {
        return prev;
      }

      return prev.map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i));
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalUnits = calculateUnits(items);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        isReady,
        totalItems,
        totalUnits,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
