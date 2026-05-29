'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import { useCart } from '@/context/CartContext';
import { MAX_STOCK } from '@/lib/inventory';
import { useInventory } from '@/hooks/useInventory';
import Icon from '@/components/ui/AppIcon';

export interface Product {
  id: string;
  name: string;
  info: string;
  price: number;
  oldPrice: number;
  reviews: number;
  badge?: string;
  badgeColor?: string;
  image: string;
  priceId: string;
  buttonLabel?: string;
  isBundle?: boolean;
  units?: number;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const inventory = useInventory();
  const [added, setAdded] = useState(false);

  const remainingUnits = inventory?.remainingUnits ?? MAX_STOCK;
  const productUnits = product.units ?? 1;
  const itemAvailable = remainingUnits >= productUnits;
  const remainingPercent = Math.max(0, Math.min(100, Math.round((remainingUnits / MAX_STOCK) * 100)));

  const discount = product.oldPrice > 0 ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  const handleAdd = () => {
    if (!itemAvailable) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.info,
      priceId: product.priceId,
      units: product.units ?? 1,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="product-card group flex flex-col bg-white"
    >
      {/* Image */}
      <div className="relative aspect-square bg-muted overflow-hidden rounded-t-2xl">
        {product.badge && (
          <span
            className={`absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full ${
              product.badgeColor || 'bg-primary text-white'
            }`}
          >
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 z-10 px-2.5 py-1 text-[10px] font-bold bg-red-500 text-white rounded-full">
            -{discount}%
          </span>
        )}
        <Link href="/product-detail">
          <AppImage
            src={product.image}
            alt={`${product.name} supplement bottle on white clean background`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            style={{ objectFit: 'contain' }}
            className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5">
        <Link href="/product-detail" className="block mb-1">
          <h3 className="font-bold text-foreground text-base hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-3">{product.info}</p>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Icon key={i} name="StarIcon" size={13} variant="solid" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews} recensioner)</span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] font-semibold text-muted-foreground mb-2">
            <span>{remainingUnits > 0 ? `${remainingUnits} burkar kvar` : 'Slut i lager'}</span>
            <span>{productUnits} burkar/paket</span>
          </div>
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div
              className={`h-full rounded-full ${remainingUnits > 0 ? 'bg-primary' : 'bg-red-400'}`}
              style={{ width: `${remainingPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-4 mt-auto">
          <span className="text-xl font-extrabold text-foreground">{product.price} kr</span>
          {product.oldPrice > 0 && (
            <span className="text-sm text-muted-foreground line-through">{product.oldPrice} kr</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-3">6% moms ingår i priset.</p>

        {/* Button */}
        <button
          onClick={handleAdd}
          disabled={!itemAvailable}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
            added
              ? 'bg-green-100 text-primary border border-primary/30'
              : itemAvailable
              ? 'bg-foreground text-white hover:bg-primary'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {added ? (
            <>
              <Icon name="CheckIcon" size={16} />
              Tillagd
            </>
          ) : (
            <>
              <Icon name="ShoppingCartIcon" size={16} />
              Lägg till i varukorg
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
