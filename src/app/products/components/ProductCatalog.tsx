'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import Icon from '@/components/ui/AppIcon';
import ProductCard from '@/app/components/ProductCard';
import { allProducts } from '@/app/components/ProductsSection';

const categories = [
  { value: 'all', label: 'Alla produkter' },
  { value: 'testo-support', label: 'Testo-support' },
];

const priceRanges = [
  { label: 'Alla priser', range: [0, 2200] },
  { label: 'Under 500 kr', range: [0, 500] },
  { label: '500–1000 kr', range: [500, 1000] },
  { label: 'Över 1000 kr', range: [1000, 2200] },
];

const sortOptions = [
  { value: 'popular', label: 'Rekommenderade' },
  { value: 'price-asc', label: 'Pris stigande' },
  { value: 'price-desc', label: 'Pris fallande' },
];

export default function ProductCatalog() {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.value || '');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2200]);

  const filtered = allProducts
    .filter((p) => {
      if (activeCategory === 'all') return true;
      if (activeCategory === 'testo-support') return p.name.includes('Testo-support');
      return true;
    })
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <>
      {/* Page header */}
      <div className="bg-muted/30 border-b border-border py-12">
        <div className="container-wide">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary transition-colors">
              Hem
            </Link>
            <Icon name="ChevronRightIcon" size={12} />
            <span className="text-foreground font-medium">Produkter</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
            Produkter
          </h1>
          <p className="text-muted-foreground">
            Visar {filtered.length} produkter i vårt sortiment.
          </p>
        </div>
      </div>

      <div className="container-wide py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-border p-6 sticky top-24">
              <h3 className="font-bold text-foreground mb-4">Filtrera</h3>
              <div className="space-y-1 mb-8">
                {categories.map((cat) => (
                  cat.disabled ? (
                    <div
                      key={cat.value}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium bg-muted/50 text-muted-foreground cursor-not-allowed"
                    >
                      {cat.label}
                      {cat.comingSoon && <span className="text-xs block">{cat.comingSoon}</span>}
                    </div>
                  ) : (
                    <button
                      key={cat.value}
                      onClick={() => setActiveCategory(cat.value)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                        activeCategory === cat.value
                          ? 'bg-primary text-white'
                          : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {cat.label}
                    </button>
                  )
                ))}
              </div>

              <h3 className="font-bold text-foreground mb-4">Prisintervall</h3>
              <div className="space-y-3">
                {priceRanges.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setPriceRange(opt.range)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      priceRange[0] === opt.range[0] && priceRange[1] === opt.range[1]
                        ? 'bg-accent text-primary font-bold'
                        : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                {categories.filter(cat => !cat.disabled).map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => setActiveCategory(cat.value)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 lg:hidden ${
                      activeCategory === cat.value
                        ? 'bg-primary text-white'
                        : 'bg-white border border-border text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <label className="text-xs text-muted-foreground hidden sm:block">Sortera efter</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-border rounded-xl px-3 py-2 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Icon name="ArchiveBoxXMarkIcon" size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Inga produkter hittades för de valda filtret.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
