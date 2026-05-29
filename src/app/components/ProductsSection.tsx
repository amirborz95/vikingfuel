'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProductCard, { Product } from './ProductCard';
import Icon from '@/components/ui/AppIcon';

export const allProducts: Product[] = [
  {
    id: 'viking-energy-1',
    name: 'Vikingfuel - Testo-support',
    info: '60 kapslar',
    price: 10,
    oldPrice: 0,
    reviews: 45,
    badge: 'Premium',
    badgeColor: 'bg-primary text-white',
    image: 'https://cdn.corenexis.com/files/c/2491997720.png',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_1 || '',
    units: 1,
  },
  {
    id: 'viking-energy-3',
    name: 'Vikingfuel - Testo-support 3-pack',
    info: '180 kapslar - 10% rabatt',
    price: 942,
    oldPrice: 1047,
    reviews: 28,
    badge: 'Mest populär',
    badgeColor: 'bg-amber-500 text-white',
    image: 'https://cdn.corenexis.com/files/c/1977886720.png',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_3 || '',
    units: 3,
  },
  {
    id: 'viking-energy-6',
    name: 'Vikingfuel - Testo-support 6-pack',
    info: '360 kapslar - 20% rabatt',
    price: 1675,
    oldPrice: 2094,
    reviews: 15,
    badge: 'Bästa värde',
    badgeColor: 'bg-foreground text-white',
    image: 'https://cdn.corenexis.com/files/c/8571187720.png',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_6 || '',
    units: 6,
  },
];

export default function ProductsSection() {
  return (
    <section id="products" className="py-20 bg-white">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="section-label block mb-3">Våra produkter</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 text-balance">
            Premium kosttillskott för bättre prestation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Välj det paket som passar dina behov. Alla våra produkter är naturliga och vetenskapligt utformade.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-10"
        >
          <Link href="/products" className="btn-outline inline-flex">
            Se alla produkter
            <Icon name="ArrowRightIcon" size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
