'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import ProductCard from '@/app/components/ProductCard';
import { allProducts } from '@/app/components/ProductsSection';

export default function ProductDetailView() {
  const { t } = useLanguage();
  const [selectedBundle, setSelectedBundle] = useState(0);
  const [activeTab, setActiveTab] = useState(t.productDetail.sectionTitles.description);
  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);
  const { addItem } = useCart();

  const bundles = [
    {
      id: 'bundle-1',
      label: 'Buy 1',
      sublabel: '60 capsules',
      price: 349,
      oldPrice: 0,
      image: 'https://cdn.corenexis.com/files/c/2491997720.png',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_1 || '',
      imageAlt: 'Single Viking Fuel Energy supplement bottle on white clean background',
      tag: null,
    },
    {
      id: 'bundle-2',
      label: 'Buy 3',
      sublabel: '180 capsules',
      price: 942,
      oldPrice: 1047,
      image: 'https://cdn.corenexis.com/files/c/1977886720.png',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_3 || '',
      imageAlt: 'Three Viking Fuel Energy supplement bottles arranged together on white background',
      tag: '10% discount',
    },
    {
      id: 'bundle-3',
      label: 'Buy 6',
      sublabel: '360 capsules',
      price: 1675,
      oldPrice: 2094,
      image: 'https://cdn.corenexis.com/files/c/8571187720.png',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_6 || '',
      imageAlt: 'Six Viking Fuel Energy supplement bottles arranged in rows on white background',
      tag: '20% discount',
    },
  ];

  const tabs = [
    t.productDetail.sectionTitles.description,
    t.productDetail.sectionTitles.ingredients,
    t.productDetail.sectionTitles.usage,
    t.productDetail.sectionTitles.shippingReturn,
  ];

  const tabContent: Record<string, React.ReactNode> = {
    [t.productDetail.sectionTitles.description]: (
      <div className="prose prose-sm max-w-none text-muted-foreground">
        <p className="mb-4">
          Viking Energy is a premium energy supplement developed for those who want to perform at their best every day. The formula combines proven adaptogens with essential minerals to support natural energy production, mental sharpness, and physical endurance.
        </p>
        <p>
          Each capsule is carefully dosed for maximum effect without unnecessary additives. Manufactured in the EU according to GMP standards with fully transparent ingredient lists.
        </p>
      </div>
    ),

    [t.productDetail.sectionTitles.ingredients]: (
      <div className="space-y-3">
        {[
          { name: 'Maca extract', amount: '500 mg' },
          { name: 'Ashwagandha (KSM-66)', amount: '300 mg' },
          { name: 'Tribulus Terrestris', amount: '250 mg' },
          { name: 'Panax Ginseng', amount: '200 mg' },
          { name: 'Ginger extract', amount: '100 mg' },
          { name: 'Zinc', amount: '10 mg' },
          { name: 'Selenium', amount: '55 µg' },
          { name: 'Piperine (BioPerine)', amount: '5 mg' },
        ].map((ing) => (
          <div
            key={ing.name}
            className="flex justify-between items-center py-2.5 border-b border-border last:border-0"
          >
            <span className="text-sm font-medium text-foreground">{ing.name}</span>
            <span className="text-sm font-bold text-primary">{ing.amount}</span>
          </div>
        ))}
      </div>
    ),

    [t.productDetail.sectionTitles.usage]: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">Recommended dosage:</strong> 2 capsules daily with
          water, preferably in the morning with or without food.
        </p>
        <p>
          <strong className="text-foreground">Duration:</strong> Best results are achieved with continuous
          use for at least 4–6 weeks.
        </p>
        <p>
          <strong className="text-foreground">Note:</strong> Dietary supplements do not replace a
          varied and balanced diet. Keep out of reach of children.
        </p>
      </div>
    ),

    [t.productDetail.sectionTitles.shippingReturn]: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <p className="font-semibold text-foreground mb-1">Delivery time</p>
          <p>1–3 business days in Sweden. Express shipping via PostNord or DHL.</p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-1">Free shipping</p>
          <p>Free shipping on all orders over 500 SEK. Orders under 500 SEK incur a 49 SEK shipping fee.</p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-1">Returns</p>
          <p>{t.productDetail.shippingReturnText}</p>
        </div>
      </div>
    ),
  };

  const bundle = bundles[selectedBundle];
  const discount = bundle.oldPrice > 0 ? Math.round((1 - bundle.price / bundle.oldPrice) * 100) : 0;

  const handleAddToCart = () => {
    addItem({
      id: bundle.id,
      name: `Viking Energy — ${bundle.label}`,
      price: bundle.price,
      image: bundle.image,
      size: bundle.sublabel,
      priceId: bundle.priceId,
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
              {t.productDetail.breadcrumbHome}
            </Link>
            <Icon name="ChevronRightIcon" size={12} />
            <Link href="/products" className="hover:text-primary transition-colors">
              {t.productDetail.breadcrumbProducts}
            </Link>
            <Icon name="ChevronRightIcon" size={12} />
            <span className="text-foreground font-medium">{t.productDetail.productName}</span>
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
                {t.productDetail.trustBadges.map((b) => (
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
                New
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-3 leading-tight">
                Viking Energy
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} name="StarIcon" size={16} variant="solid" />
                  ))}
                </div>
                <span className="text-sm font-bold text-foreground">4.9</span>
                <span className="text-sm text-muted-foreground">(45 {t.productDetail.reviewsLabel})</span>
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
                      Save {bundle.oldPrice - bundle.price} SEK
                    </span>
                  </>
                )}
              </div>

              {/* Bundle selector */}
              <div className="mb-8">
                <p className="text-sm font-bold text-foreground mb-3">Select bundle:</p>
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

              {/* Quantity + CTA */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 border border-border rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                    aria-label="Minska"
                  >
                    <Icon name="MinusIcon" size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                    aria-label="Öka"
                  >
                    <Icon name="PlusIcon" size={14} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                    addedMsg
                      ? 'bg-green-100 text-primary border border-primary/30'
                      : 'bg-foreground text-white hover:bg-primary'
                  }`}
                >
                  {addedMsg ? (
                    <>
                      <Icon name="CheckIcon" size={16} /> Added to cart!
                    </>
                  ) : (
                    <>
                      <Icon name="ShoppingCartIcon" size={16} /> {t.buttons.addToCart}
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-4 rounded-xl bg-primary text-white font-bold text-sm hover:bg-green-700 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Icon name="BoltIcon" size={16} />
                {t.buttons.buyNow}
              </button>

              {/* Benefits */}
              <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-3">
                {t.trustBenefits.items.map((b) => (
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
            Related products
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
