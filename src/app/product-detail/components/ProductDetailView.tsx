'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/context/CartContext';
import { MAX_STOCK } from '@/lib/inventory';
import { useInventory } from '@/hooks/useInventory';
import ProductCard from '@/app/components/ProductCard';
import { allProducts } from '@/app/components/ProductsSection';

export default function ProductDetailView() {
  const [selectedBundle, setSelectedBundle] = useState(0);
  const [activeTab, setActiveTab] = useState('Beskrivning');
  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);
  const { addItem, totalUnits } = useCart();
  const inventory = useInventory();

  const bundles = [
    {
      id: 'bundle-1',
      label: 'Vikingfuel - Testo-support',
      sublabel: '60 capsules',
      price: 10,
      oldPrice: 0,
      image: 'https://cdn.corenexis.com/files/c/2491997720.png',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_1 || '',
      imageAlt: 'Single Viking Fuel Energy supplement bottle on white clean background',
      tag: null,
      units: 1,
    },
    {
      id: 'bundle-2',
      label: 'Vikingfuel - Testo-support 3-pack',
      sublabel: '180 capsules',
      price: 942,
      oldPrice: 1047,
      image: 'https://cdn.corenexis.com/files/c/1977886720.png',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_3 || '',
      imageAlt: 'Three Viking Fuel Energy supplement bottles arranged together on white background',
      tag: '10% discount',
      units: 3,
    },
    {
      id: 'bundle-3',
      label: 'Vikingfuel - Testo-support 6-pack',
      sublabel: '360 capsules',
      price: 1675,
      oldPrice: 2094,
      image: 'https://cdn.corenexis.com/files/c/8571187720.png',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_6 || '',
      imageAlt: 'Six Viking Fuel Energy supplement bottles arranged in rows on white background',
      tag: '20% discount',
      units: 6,
    },
  ];

  const tabs = [
    'Beskrivning',
    'Ingredienser',
    'Användning',
    'Frakt & retur',
  ];

  const tabContent: Record<string, React.ReactNode> = {
    'Beskrivning': (
      <div className="prose prose-sm max-w-none text-muted-foreground">
        {[
          'Viking Energy är ett premium energitillskott utvecklat för dig som vill prestera på topp varje dag. Formulan kombinerar beprövade adaptogener med viktiga mineraler för att stödja naturlig energi, mental skärpa och fysisk uthållighet.',
          'Varje kapsel är noggrant doserad för maximal effekt utan onödiga tillsatser. Tillverkat i EU enligt GMP-standard med fullständigt transparenta ingredienslistor.',
        ].map((paragraph) => (
          <p key={paragraph} className="mb-4">{paragraph}</p>
        ))}
      </div>
    ),

    'Ingredienser': (
      <div className="space-y-6">
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Per kapsel innehåller formulan följande högkvalitativa extrakt och mineraler. Rekommenderad daglig dos är
            2 kapslar – då blir mängden av varje ingrediens dubblerad för maximal effekt.
          </p>
          <p className="font-semibold text-foreground">Rekommenderad daglig dos: 2 kapslar</p>
        </div>

        <div className="rounded-3xl border border-border bg-white p-5 space-y-3">
          {[
            { name: 'Macextrakt 4:1', perCapsule: '500 mg', dailyDose: '1000 mg' },
            { name: 'Ashwagandhaextrakt (5% withanolider)', perCapsule: '300 mg', dailyDose: '600 mg' },
            { name: 'Bockhornsklöverextrakt (10:1)', perCapsule: '250 mg', dailyDose: '500 mg' },
            { name: 'Tribulus terrestris-extrakt (90% saponiner)', perCapsule: '200 mg', dailyDose: '400 mg' },
            { name: 'Panax ginseng-extrakt (20%)', perCapsule: '150 mg', dailyDose: '300 mg' },
            { name: 'Tallbarksextrakt (Pinus pinaster)', perCapsule: '100 mg', dailyDose: '200 mg' },
            { name: 'Gelé royale-extrakt (3:1)', perCapsule: '100 mg', dailyDose: '200 mg' },
            { name: 'Ingefärsextrakt (5%)', perCapsule: '80 mg', dailyDose: '160 mg' },
            { name: 'Piperin (95%)', perCapsule: '5 mg', dailyDose: '10 mg' },
            { name: 'Zink (bisglycinat)', perCapsule: '10 mg', dailyDose: '20 mg' },
            { name: 'Selen', perCapsule: '55 µg', dailyDose: '110 µg' },
            { name: 'Bor', perCapsule: '2 mg', dailyDose: '4 mg' },
          ].map((ing) => (
            <div
              key={ing.name}
              className="grid grid-cols-1 sm:grid-cols-[1.7fr_1fr_1fr] gap-3 items-center py-3 border-b border-border last:border-0"
            >
              <span className="text-sm font-medium text-foreground">{ing.name}</span>
              <span className="text-sm text-muted-foreground">Per kapsel: {ing.perCapsule}</span>
              <span className="text-sm font-bold text-primary">2 kapslar: {ing.dailyDose}</span>
            </div>
          ))}
        </div>
      </div>
    ),

    'Användning': (
      <div className="space-y-4 text-sm text-muted-foreground">
        {[
          'Rekommenderad dosering: 2 kapslar dagligen med vatten, helst på morgonen i samband med måltid.',
          'Varaktighet: Bästa resultat uppnås vid kontinuerlig användning i minst 4–6 veckor.',
          'Observera: Kosttillskott ersätter inte en varierad och balanserad kost. Förvaras oåtkomligt för barn.',
        ].map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    ),

    'Frakt & retur': (
      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <p className="font-semibold text-foreground mb-1">Leveranstid</p>
          <p>1–3 arbetsdagar i Sverige. Expressleverans via PostNord eller DHL.</p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-1">Fri frakt</p>
          <p>Normalt frakt kostar 10 kr inom hela Sverige. Fri frakt över 700 kr.</p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-1">Returer</p>
          <p>14 dagars ångerrätt från mottagningsdatum. Produkten ska vara oöppnad och i originalförpackning.</p>
        </div>
      </div>
    ),
  };

  const bundle = bundles[selectedBundle];
  const discount = bundle.oldPrice > 0 ? Math.round((1 - bundle.price / bundle.oldPrice) * 100) : 0;

  const remainingUnits = inventory?.remainingUnits ?? MAX_STOCK;
  const bundleUnits = bundle.units ?? 1;
  const enoughStockForSelection = remainingUnits >= bundleUnits * quantity;
  const enoughCartCapacity = totalUnits + bundleUnits * quantity <= MAX_STOCK;
  const outOfStock = inventory ? remainingUnits === 0 : false;
  const stockPercentage = Math.max(0, Math.min(100, Math.round((remainingUnits / MAX_STOCK) * 100)));
  const canAddToCart = enoughStockForSelection && enoughCartCapacity;

  const handleAddToCart = () => {
    if (!canAddToCart) return;

    addItem({
      id: bundle.id,
      name: `Viking Energy — ${bundle.label}`,
      price: bundle.price,
      image: bundle.image,
      size: bundle.sublabel,
      priceId: bundle.priceId,
      units: bundle.units ?? 1,
      quantity,
    });
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };


  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border py-4 bg-muted/20">
        <div className="container-wide">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Hem
            </Link>
            <Icon name="ChevronRightIcon" size={12} />
            <Link href="/products" className="hover:text-primary transition-colors">
              Produkter
            </Link>
            <Icon name="ChevronRightIcon" size={12} />
            <span className="text-foreground font-medium">{bundle.label}</span>
          </nav>
        </div>
      </div>

      {/* Main product section */}
      <section className="py-12 lg:py-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left — Image */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedBundle}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="aspect-square bg-gradient-to-br from-muted to-white rounded-3xl border border-border overflow-hidden flex items-center justify-center p-10"
                >
                  <AppImage
                    src={bundle.image}
                    alt={bundle.imageAlt}
                    width={480}
                    height={480}
                    priority
                    className="w-full h-full object-contain drop-shadow-xl"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Discount badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  -{discount}%
                </div>
              )}

              {/* Trust badges below image */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: 'Tillverkat i EU', description: 'Garanterad kvalitet och standard.' },
                  { label: 'GMP-certifierat', description: 'Producerat enligt strikt tillverkningsstandard.' },
                  { label: 'Fri frakt >700 kr', description: 'Fri leverans över 700 kr.' },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="flex flex-col items-center gap-1.5 p-3 bg-muted rounded-xl text-center"
                  >
                    <Icon name="SparklesIcon" size={18} className="text-primary" />
                    <span className="text-[10px] font-semibold text-foreground leading-tight">
                      {b.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-tight">
                      {b.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Info */}
            <div>
              {/* Badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent rounded-full text-xs font-bold text-primary mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Ny
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-3 leading-tight">
                {bundle.label}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} name="StarIcon" size={16} variant="solid" />
                  ))}
                </div>
                <span className="text-sm font-bold text-foreground">4.9</span>
                <span className="text-sm text-muted-foreground">(45 recensioner)</span>
              </div>

              {/* Price section */}
              <div className="mb-6">
                <p className="text-4xl font-extrabold text-foreground mb-2">{bundle.price} SEK</p>
                {bundle.oldPrice > 0 && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {bundle.oldPrice} SEK
                    </span>
                    <span className="text-sm font-bold text-primary bg-accent px-2.5 py-1 rounded-full ml-2">
                      Spara {bundle.oldPrice - bundle.price} SEK
                    </span>
                  </>
                )}
              </div>

              {/* Bundle selector */}
              <div className="mb-8">
                <p className="text-sm font-bold text-foreground mb-3">Välj paket</p>
                <div className="space-y-3">
                  {bundles.map((b, i) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBundle(i)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        selectedBundle === i
                          ? 'border-primary bg-accent'
                          : 'border-border bg-white hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            selectedBundle === i ? 'border-primary bg-primary' : 'border-border'
                          }`}
                        >
                          {selectedBundle === i && (
                            <Icon name="CheckIcon" size={11} className="text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{b.label}</p>
                          <p className="text-xs text-muted-foreground">{b.sublabel}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {b.tag && (
                          <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                            {b.tag}
                          </span>
                        )}
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">{b.price} SEK</p>
                          {b.oldPrice > 0 && (
                            <p className="text-[10px] text-muted-foreground line-through">
                              {b.oldPrice} SEK
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>
                    {inventory
                      ? remainingUnits > 0
                        ? `Endast ${remainingUnits} burkar kvar av ${MAX_STOCK}`
                        : 'Slut i lager'
                      : 'Hämtar lagerstatus...'}
                  </span>
                  <span>{bundleUnits} burkar/paket</span>
                </div>
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <div
                    className={`h-full rounded-full ${remainingUnits > 0 ? 'bg-primary' : 'bg-red-400'}`}
                    style={{ width: `${stockPercentage}%` }}
                  />
                </div>
              </div>

              {/* Quantity + CTA */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 border border-border rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                    aria-label="Minska antal"
                  >
                    <Icon name="MinusIcon" size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                    aria-label="Öka antal"
                  >
                    <Icon name="PlusIcon" size={14} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                  className={`flex-1 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                    addedMsg
                      ? 'bg-green-100 text-primary border border-primary/30'
                      : canAddToCart
                      ? 'bg-foreground text-white hover:bg-primary'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {addedMsg ? (
                    <>
                      <Icon name="CheckIcon" size={16} /> Tillagd i varukorg
                    </>
                  ) : (
                    <>
                      <Icon name="ShoppingCartIcon" size={16} /> Lägg till i varukorg
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-muted-foreground mb-4">6% moms ingår i priset.</p>

              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className="w-full py-4 rounded-xl bg-primary text-white font-bold text-sm hover:bg-green-700 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:bg-muted"
              >
                <Icon name="BoltIcon" size={16} />
                Köp nu
              </button>

              {/* Benefits */}
              <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-3">
                {[
                  { title: 'Snabb leverans', subtitle: '1-3 arbetsdagar' },
                  { title: 'Fri frakt', subtitle: 'Över 700 kr' },
                  { title: '14 dagar ångerrätt', subtitle: 'Full återbetalning' },
                  { title: 'Säker betalning', subtitle: 'SSL-krypterad' },
                ].map((b) => (
                  <div key={b.title} className="flex items-center gap-2">
                    <Icon name="TruckIcon" size={15} className="text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-foreground">{b.title}</p>
                      <p className="text-xs text-muted-foreground">{b.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-12 border-t border-border">
        <div className="container-wide">
          {/* Tab bar */}
          <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-150 -mb-px ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="max-w-2xl"
            >
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Related products */}
      <section className="py-16 bg-muted/30">
        <div className="container-wide">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-8">
            Relaterade produkter
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
