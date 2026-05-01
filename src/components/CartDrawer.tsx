'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCart();
  const { t } = useLanguage();

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
              <h2 className="text-lg font-bold text-foreground">{t?.cart?.title}</h2>
              <button
                onClick={closeCart}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Stäng varukorg"
              >
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                  <Icon name="ShoppingCartIcon" size={48} className="opacity-20" />
                  <p className="text-sm">{t?.cart?.empty}</p>
                  <button onClick={closeCart} className="btn-primary text-sm">
                    {t?.buttons?.shopNow}
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
                          aria-label="Minska antal"
                        >
                          <Icon name="MinusIcon" size={12} />
                        </button>
                        <span className="text-sm font-semibold w-5 text-center">
                          {item?.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item?.id, item?.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-white transition-colors"
                          aria-label="Öka antal"
                        >
                          <Icon name="PlusIcon" size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(item?.id)}
                          className="ml-auto p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors text-muted-foreground"
                          aria-label={t?.cart?.remove}
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
                  <span className="text-sm text-muted-foreground">{t?.cart?.total}</span>
                  <span className="text-xl font-bold text-foreground">{totalPrice} kr</span>
                </div>
                {totalPrice < 500 && (
                  <p className="text-xs text-muted-foreground bg-accent rounded-lg px-3 py-2">
                    Lägg till {500 - totalPrice} kr för fri frakt
                  </p>
                )}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full justify-center text-base py-4"
                >
                  Gå till kassa
                  <Icon name="ArrowRightIcon" size={18} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
