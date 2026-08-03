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
import { useLanguage } from '@/context/LanguageContext';
import { subPlanForUnits } from '@/lib/subscriptions';

export default function ProductDetailView() {
  const { lang } = useLanguage();
  const en = lang === 'en';
  const [selectedBundle, setSelectedBundle] = useState(0);
  const [activeTab, setActiveTab] = useState('desc');
  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);
  const [purchaseMode, setPurchaseMode] = useState<'subscribe' | 'once'>('subscribe');
  const [subLoading, setSubLoading] = useState(false);
  const { addItem, totalUnits } = useCart();
  const inventory = useInventory();

  const cap = en ? 'capsules' : 'capsler';
  const bundles = [
    { id: 'bundle-1', label: 'Testo-support', sublabel: en ? '60 capsules' : '60 kapslar', price: 349, oldPrice: 0, image: 'https://i.postimg.cc/5t5mBGsQ/neuralpony.png', priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_1 || '', imageAlt: 'Single Viking Fuel supplement bottle on white background', tag: null as string | null, units: 1 },
    { id: 'bundle-2', label: 'Testo-support 3-pack', sublabel: en ? '180 capsules' : '180 kapslar', price: 942, oldPrice: 1047, image: 'https://i.postimg.cc/pdQBf7sR/neuralpony3.png', priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_3 || '', imageAlt: 'Three Viking Fuel supplement bottles on white background', tag: en ? '10% discount' : '10% rabatt', units: 3 },
    { id: 'bundle-3', label: 'Testo-support 6-pack', sublabel: en ? '360 capsules' : '360 kapslar', price: 1674, oldPrice: 2094, image: 'https://i.postimg.cc/zfwkCMxg/neuralpony6.png', priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_6 || '', imageAlt: 'Six Viking Fuel supplement bottles on white background', tag: en ? '20% discount' : '20% rabatt', units: 6 },
  ];

  const tabs = [
    { key: 'desc', label: en ? 'Description' : 'Beskrivning' },
    { key: 'ingredients', label: en ? 'Ingredients' : 'Ingredienser' },
    { key: 'usage', label: en ? 'Usage' : 'Användning' },
    { key: 'shipping', label: en ? 'Shipping & returns' : 'Frakt & retur' },
  ];

  const ingredientRows = en
    ? [
        { name: 'Maca extract 4:1', per: '120 mg', daily: '240 mg' },
        { name: 'Ashwagandha extract (5% withanolides)', per: '160 mg', daily: '320 mg' },
        { name: 'Fenugreek extract (10:1)', per: '80 mg', daily: '160 mg' },
        { name: 'Tribulus terrestris extract (90% saponins)', per: '80 mg', daily: '160 mg' },
        { name: 'Panax ginseng extract (20%)', per: '50 mg', daily: '100 mg' },
        { name: 'Pine bark extract (Pinus pinaster)', per: '40 mg', daily: '80 mg' },
        { name: 'Royal jelly extract (3:1)', per: '20 mg', daily: '40 mg' },
        { name: 'Ginger extract (5%)', per: '25 mg', daily: '50 mg' },
        { name: 'Piperine (95%)', per: '3 mg', daily: '6 mg' },
        { name: 'Zinc (bisglycinate)', per: '8 mg', daily: '16 mg' },
        { name: 'Selenium', per: '18 µg', daily: '36 µg' },
        { name: 'Boron', per: '2 mg', daily: '4 mg' },
      ]
    : [
        { name: 'Macaextrakt 4:1', per: '120 mg', daily: '240 mg' },
        { name: 'Ashwagandhaextrakt (5% withanolider)', per: '160 mg', daily: '320 mg' },
        { name: 'Bockhornsklöverextrakt (10:1)', per: '80 mg', daily: '160 mg' },
        { name: 'Tribulus terrestris-extrakt (90% saponiner)', per: '80 mg', daily: '160 mg' },
        { name: 'Panax ginseng-extrakt (20%)', per: '50 mg', daily: '100 mg' },
        { name: 'Tallbarksextrakt (Pinus pinaster)', per: '40 mg', daily: '80 mg' },
        { name: 'Gelé royale-extrakt (3:1)', per: '20 mg', daily: '40 mg' },
        { name: 'Ingefärsextrakt (5%)', per: '25 mg', daily: '50 mg' },
        { name: 'Piperin (95%)', per: '3 mg', daily: '6 mg' },
        { name: 'Zink (bisglycinat)', per: '8 mg', daily: '16 mg' },
        { name: 'Selen', per: '18 µg', daily: '36 µg' },
        { name: 'Bor', per: '2 mg', daily: '4 mg' },
      ];

  const tabContent: Record<string, React.ReactNode> = {
    desc: (
      <div className="prose prose-sm max-w-none text-muted-foreground">
        {(en
          ? [
              'Viking Energy is a premium energy supplement developed for those who want to perform at their best every day. The formula combines proven adaptogens with essential minerals to support natural energy, mental sharpness and physical endurance.',
              'Each capsule is carefully dosed for maximum effect without unnecessary additives. Made in the EU to GMP standard with fully transparent ingredient lists.',
            ]
          : [
              'Viking Energy är ett premium energitillskott utvecklat för dig som vill prestera på topp varje dag. Formulan kombinerar beprövade adaptogener med viktiga mineraler för att stödja naturlig energi, mental skärpa och fysisk uthållighet.',
              'Varje kapsel är noggrant doserad för maximal effekt utan onödiga tillsatser. Tillverkat i EU enligt GMP-standard med fullständigt transparenta ingredienslistor.',
            ]
        ).map((p) => (
          <p key={p} className="mb-4">{p}</p>
        ))}
      </div>
    ),
    ingredients: (
      <div className="space-y-6">
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            {en
              ? 'Each capsule contains the following high-quality extracts and minerals. The recommended daily dose is 2 capsules — then the amount of each ingredient is doubled for maximum effect.'
              : 'Per kapsel innehåller formulan följande högkvalitativa extrakt och mineraler. Rekommenderad daglig dos är 2 kapslar – då blir mängden av varje ingrediens dubblerad för maximal effekt.'}
          </p>
          <p className="font-semibold text-foreground">
            {en ? 'Recommended daily dose: 2 capsules' : 'Rekommenderad daglig dos: 2 kapslar'}
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-white p-5 space-y-3">
          {ingredientRows.map((ing) => (
            <div key={ing.name} className="grid grid-cols-1 sm:grid-cols-[1.7fr_1fr_1fr] gap-3 items-center py-3 border-b border-border last:border-0">
              <span className="text-sm font-medium text-foreground">{ing.name}</span>
              <span className="text-sm text-muted-foreground">{en ? 'Per capsule' : 'Per kapsel'}: {ing.per}</span>
              <span className="text-sm font-bold text-primary">{en ? '2 capsules' : '2 kapslar'}: {ing.daily}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    usage: (
      <div className="space-y-4 text-sm text-muted-foreground">
        {(en
          ? [
              'Recommended dosage: 2 capsules daily with water, preferably in the morning with a meal.',
              'Duration: Best results are achieved with continuous use for at least 4–6 weeks.',
              'Note: Food supplements do not replace a varied and balanced diet. Keep out of reach of children.',
            ]
          : [
              'Rekommenderad dosering: 2 kapslar dagligen med vatten, helst på morgonen i samband med måltid.',
              'Varaktighet: Bästa resultat uppnås vid kontinuerlig användning i minst 4–6 veckor.',
              'Observera: Kosttillskott ersätter inte en varierad och balanserad kost. Förvaras oåtkomligt för barn.',
            ]
        ).map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    ),
    shipping: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <p className="font-semibold text-foreground mb-1">{en ? 'Delivery time' : 'Leveranstid'}</p>
          <p>{en ? '2–4 business days in Sweden. Delivery via PostNord.' : '2–4 arbetsdagar i Sverige. Leverans via PostNord.'}</p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-1">{en ? 'Free shipping' : 'Fri frakt'}</p>
          <p>{en ? 'Standard shipping is 49 kr within Sweden. Free shipping over 700 kr.' : 'Normalt frakt kostar 49 kr inom hela Sverige. Fri frakt över 700 kr.'}</p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-1">{en ? 'Returns' : 'Returer'}</p>
          <p>{en ? '14-day right of withdrawal from the delivery date. The product must be unopened and in original packaging.' : '14 dagars ångerrätt från mottagningsdatum. Produkten ska vara oöppnad och i originalförpackning.'}</p>
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
  const stockPercentage = Math.max(0, Math.min(100, Math.round((remainingUnits / MAX_STOCK) * 100)));
  const canAddToCart = enoughStockForSelection && enoughCartCapacity;

  const subPlan = subPlanForUnits(bundle.units ?? 1);

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

  const handleSubscribe = async () => {
    if (!subPlan) return;
    setSubLoading(true);
    try {
      const res = await fetch('/api/create-subscription-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: subPlan.priceId, quantity }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || (en ? 'Could not start subscription.' : 'Kunde inte starta prenumerationen.'));
    } catch {
      alert(en ? 'Something went wrong.' : 'Något gick fel.');
    } finally {
      setSubLoading(false);
    }
  };

  const trustBadges = en
    ? [
        { label: 'Made in the EU', description: 'Guaranteed quality and standard.' },
        { label: 'GMP-certified', description: 'Produced to strict manufacturing standards.' },
        { label: 'Free shipping >700 kr', description: 'Free delivery over 700 kr.' },
      ]
    : [
        { label: 'Tillverkat i EU', description: 'Garanterad kvalitet och standard.' },
        { label: 'GMP-certifierat', description: 'Producerat enligt strikt tillverkningsstandard.' },
        { label: 'Fri frakt >700 kr', description: 'Fri leverans över 700 kr.' },
      ];

  const benefits = en
    ? [
        { title: 'Fast delivery', subtitle: '2-4 business days' },
        { title: 'Free shipping', subtitle: 'Over 700 kr' },
        { title: '14-day returns', subtitle: 'Full refund' },
        { title: 'Secure payment', subtitle: 'SSL-encrypted' },
      ]
    : [
        { title: 'Snabb leverans', subtitle: '2-4 arbetsdagar' },
        { title: 'Fri frakt', subtitle: 'Över 700 kr' },
        { title: '14 dagar ångerrätt', subtitle: 'Full återbetalning' },
        { title: 'Säker betalning', subtitle: 'SSL-krypterad' },
      ];

  return (
    <>
      <div className="border-b border-border py-4 bg-muted/20">
        <div className="container-wide">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">{en ? 'Home' : 'Hem'}</Link>
            <Icon name="ChevronRightIcon" size={12} />
            <Link href="/products" className="hover:text-primary transition-colors">{en ? 'Products' : 'Produkter'}</Link>
            <Icon name="ChevronRightIcon" size={12} />
            <span className="text-foreground font-medium">{bundle.label}</span>
          </nav>
        </div>
      </div>

      <section className="py-12 lg:py-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div key={selectedBundle} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="aspect-square bg-gradient-to-br from-muted to-white rounded-3xl border border-border overflow-hidden flex items-center justify-center p-10">
                  <AppImage src={bundle.image} alt={bundle.imageAlt} width={480} height={480} priority className="w-full h-full object-contain drop-shadow-xl" />
                </motion.div>
              </AnimatePresence>
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">-{discount}%</div>
              )}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {trustBadges.map((b) => (
                  <div key={b.label} className="flex flex-col items-center gap-1.5 p-3 bg-muted rounded-xl text-center">
                    <Icon name="SparklesIcon" size={18} className="text-primary" />
                    <span className="text-[10px] font-semibold text-foreground leading-tight">{b.label}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">{b.description}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent rounded-full text-xs font-bold text-primary mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {en ? 'New' : 'Ny'}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-3 leading-tight">{bundle.label}</h1>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (<Icon key={i} name="StarIcon" size={16} variant="solid" />))}
                </div>
                <span className="text-sm font-bold text-foreground">4.9</span>
                <span className="text-sm text-muted-foreground">(45 {en ? 'reviews' : 'recensioner'})</span>
              </div>
              <div className="mb-6">
                <p className="text-4xl font-extrabold text-foreground mb-2">{bundle.price} SEK</p>
                {bundle.oldPrice > 0 && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">{bundle.oldPrice} SEK</span>
                    <span className="text-sm font-bold text-primary bg-accent px-2.5 py-1 rounded-full ml-2">{en ? 'Save' : 'Spara'} {bundle.oldPrice - bundle.price} SEK</span>
                  </>
                )}
              </div>
              <div className="mb-8">
                <p className="text-sm font-bold text-foreground mb-3">{en ? 'Choose pack' : 'Välj paket'}</p>
                <div className="space-y-3">
                  {bundles.map((b, i) => (
                    <button key={b.id} onClick={() => setSelectedBundle(i)} className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 text-left ${selectedBundle === i ? 'border-primary bg-accent' : 'border-border bg-white hover:border-primary/40'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedBundle === i ? 'border-primary bg-primary' : 'border-border'}`}>
                          {selectedBundle === i && (<Icon name="CheckIcon" size={11} className="text-white" />)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{b.label}</p>
                          <p className="text-xs text-muted-foreground">{b.sublabel}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {b.tag && (<span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">{b.tag}</span>)}
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">{b.price} SEK</p>
                          {b.oldPrice > 0 && (<p className="text-[10px] text-muted-foreground line-through">{b.oldPrice} SEK</p>)}
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
                        ? `${en ? 'Only' : 'Endast'} ${remainingUnits} ${en ? 'cans left of' : 'burkar kvar av'} ${MAX_STOCK}`
                        : en ? 'Out of stock' : 'Slut i lager'
                      : en ? 'Fetching stock status...' : 'Hämtar lagerstatus...'}
                  </span>
                  <span>{bundleUnits} {en ? 'cans/pack' : 'burkar/paket'}</span>
                </div>
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <div className={`h-full rounded-full ${remainingUnits > 0 ? 'bg-primary' : 'bg-red-400'}`} style={{ width: `${stockPercentage}%` }} />
                </div>
              </div>

              {/* Purchase mode: subscribe (default) vs one-time */}
              {subPlan && (
                <div className="mb-4 space-y-3">
                  <button
                    type="button"
                    onClick={() => setPurchaseMode('subscribe')}
                    className={`relative w-full text-left rounded-2xl border-2 p-4 transition-all ${purchaseMode === 'subscribe' ? 'border-primary bg-accent' : 'border-border bg-white hover:border-primary/40'}`}
                  >
                    <span className="absolute -top-2.5 right-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-white">{en ? 'Save 20%' : 'Spara 20%'}</span>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${purchaseMode === 'subscribe' ? 'border-primary bg-primary' : 'border-border'}`}>
                          {purchaseMode === 'subscribe' && <Icon name="CheckIcon" size={11} className="text-white" />}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-foreground">{en ? 'Subscribe & save' : 'Prenumerera & spara'}</p>
                          <p className="text-xs text-muted-foreground">{en ? 'Delivered monthly · cancel anytime' : 'Levereras varje månad · avsluta när du vill'}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-primary">{subPlan.monthly} SEK<span className="text-xs font-medium text-muted-foreground">/{en ? 'mo' : 'mån'}</span></p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPurchaseMode('once')}
                    className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${purchaseMode === 'once' ? 'border-primary bg-accent' : 'border-border bg-white hover:border-primary/40'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${purchaseMode === 'once' ? 'border-primary bg-primary' : 'border-border'}`}>
                          {purchaseMode === 'once' && <Icon name="CheckIcon" size={11} className="text-white" />}
                        </span>
                        <p className="text-sm font-bold text-foreground">{en ? 'One-time purchase' : 'Köp en gång'}</p>
                      </div>
                      <p className="text-sm font-bold text-foreground">{bundle.price} SEK</p>
                    </div>
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 border border-border rounded-xl p-1">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 rounded-lg hover:bg-muted transition-colors flex items-center justify-center" aria-label={en ? 'Decrease quantity' : 'Minska antal'}>
                    <Icon name="MinusIcon" size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-9 h-9 rounded-lg hover:bg-muted transition-colors flex items-center justify-center" aria-label={en ? 'Increase quantity' : 'Öka antal'}>
                    <Icon name="PlusIcon" size={14} />
                  </button>
                </div>
                {subPlan && purchaseMode === 'subscribe' ? (
                  <button onClick={handleSubscribe} disabled={!canAddToCart || subLoading} className={`flex-1 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${canAddToCart && !subLoading ? 'bg-primary text-white hover:bg-green-700' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}>
                    <Icon name="ArrowPathIcon" size={16} />
                    {subLoading ? (en ? 'Loading…' : 'Laddar…') : canAddToCart ? (en ? `Subscribe – ${subPlan.monthly} SEK/mo` : `Prenumerera – ${subPlan.monthly} SEK/mån`) : (en ? 'Out of stock' : 'Slut i lager')}
                  </button>
                ) : (
                  <button onClick={handleAddToCart} disabled={!canAddToCart} className={`flex-1 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${canAddToCart ? 'bg-primary text-white hover:bg-green-700' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}>
                    <Icon name="ShoppingCartIcon" size={16} />
                    {addedMsg ? (en ? 'Added to cart' : 'Tillagd i varukorg') : canAddToCart ? (en ? 'Add to cart' : 'Lägg till i varukorg') : (en ? 'Out of stock' : 'Slut i lager')}
                  </button>
                )}
              </div>

              <p className="text-xs text-muted-foreground mb-4">{en ? '6% VAT included in the price.' : '6% moms ingår i priset.'}</p>

              <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-3">
                {benefits.map((b) => (
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

      <section className="py-12 border-t border-border">
        <div className="container-wide">
          <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-150 -mb-px ${activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="max-w-2xl">
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container-wide">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-8">{en ? 'Related products' : 'Relaterade produkter'}</h2>
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
