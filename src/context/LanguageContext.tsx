'use client';

import React, { createContext, useContext, useState } from 'react';

type Lang = 'sv' | 'en';

interface Translations {
  nav: {
    home: string;
    shop: string;
    products: string;
    bundles: string;
    ingredients: string;
    about: string;
    reviews: string;
    faq: string;
    contact: string;
  };
  buttons: {
    shopNow: string;
    readMore: string;
    addToCart: string;
    buyNow: string;
    selectBundle: string;
    viewBundles: string;
  };
  cart: {
    title: string;
    empty: string;
    total: string;
    checkout: string;
    remove: string;
    quantity: string;
  };
  cta: {
    title: string;
    subtitle: string;
  };
}

const translations: Record<Lang, Translations> = {
  sv: {
    nav: {
      home: 'Hem',
      shop: 'Butik',
      products: 'Produkter',
      bundles: 'Paket',
      ingredients: 'Ingredienser',
      about: 'Om oss',
      reviews: 'Recensioner',
      faq: 'Vanliga frågor',
      contact: 'Kontakt',
    },
    buttons: {
      shopNow: 'Handla nu',
      readMore: 'Läs mer',
      addToCart: 'Lägg i varukorg',
      buyNow: 'Köp nu',
      selectBundle: 'Välj paket',
      viewBundles: 'Se paket',
    },
    cart: {
      title: 'Din varukorg',
      empty: 'Din varukorg är tom',
      total: 'Totalt',
      checkout: 'Till kassan',
      remove: 'Ta bort',
      quantity: 'Antal',
    },
    cta: {
      title: 'Redo att ta din energi till nästa nivå?',
      subtitle: 'Utforska Viking Fuel och välj paketet som passar dig bäst.',
    },
  },
  en: {
    nav: {
      home: 'Home',
      shop: 'Shop',
      products: 'Products',
      bundles: 'Bundles',
      ingredients: 'Ingredients',
      about: 'About us',
      reviews: 'Reviews',
      faq: 'FAQ',
      contact: 'Contact',
    },
    buttons: {
      shopNow: 'Shop now',
      readMore: 'Read more',
      addToCart: 'Add to cart',
      buyNow: 'Buy now',
      selectBundle: 'Select bundle',
      viewBundles: 'View bundles',
    },
    cart: {
      title: 'Your cart',
      empty: 'Your cart is empty',
      total: 'Total',
      checkout: 'Checkout',
      remove: 'Remove',
      quantity: 'Quantity',
    },
    cta: {
      title: 'Ready to take your energy to the next level?',
      subtitle: 'Explore Viking Fuel and choose the bundle that suits you best.',
    },
  },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('sv');
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
