'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import Link from 'next/link';
import Icon from './ui/AppIcon';
import AppImage from './ui/AppImage';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white shadow-2xl z-[80] flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Din varukorg</h2>
              <button
                onClick={closeCart}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                  <Icon name="ShoppingCartIcon" size={48} className="opacity-20" />
                  <p className="text-sm">Din varukorg är tom</p>
                  <button onClick={closeCart} className="btn-primary text-sm">
                    Handla nu
                  </button>
                </div>
              ) : (
                items?.map((item) => (
                  <motion.div
                    key={item?.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    className="flex gap-4 p-4 bg-muted rounded-2xl"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-border">
                      <AppImage
                        src={item?.image}
                        alt={item?.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{item?.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item?.size}</p>
                      <p className="text-sm font-bold text-primary mt-1">
                        {item?.price * item?.quantity} kr
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item?.id, item?.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Icon name="MinusIcon" size={12} />
                        </button>
                        <span className="text-sm font-semibold w-5 text-center">
                          {item?.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item?.id, item?.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Icon name="PlusIcon" size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(item?.id)}
                          className="ml-auto p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors text-muted-foreground"
                        >
                          <Icon name="TrashIcon" size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items?.length > 0 && (
              <div className="px-6 py-5 border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Totalt</span>
                  <span className="text-xl font-bold text-foreground">{totalPrice} kr</span>
                </div>
                {totalPrice < 700 && (
                  <p className="text-xs text-muted-foreground bg-accent rounded-lg px-3 py-2">
                    Lägg till {700 - totalPrice} kr för fri frakt
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  6% moms ingår i totalsumman.
                </p>
                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      clearCart();
                      closeCart();
                    }}
                    className="w-full rounded-2xl border border-border px-4 py-3 text-sm font-bold text-foreground bg-white hover:bg-muted transition-colors"
                  >
                    Töm varukorg
                  </button>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="btn-primary w-full justify-center text-base py-4"
                  >
                    Gå till kassa
                    <Icon name="ArrowRightIcon" size={18} />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
