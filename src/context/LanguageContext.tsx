'use client';

import React, { createContext, useContext, useState } from 'react';

type Lang = 'sv' | 'en';

interface LinkItem {
  label: string;
  href: string;
}

interface FooterLinks {
  title: string;
  links: LinkItem[];
}

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
    viewAllProducts: string;
  };
  cart: {
    title: string;
    empty: string;
    total: string;
    checkout: string;
    remove: string;
    quantity: string;
    close: string;
    freeShipping: string;
    goToCheckout: string;
  };
  cta: {
    title: string;
    subtitle: string;
    badge: string;
  };
  announcement: {
    items: string[];
  };
  hero: {
    premiumTag: string;
    headline: string;
    description: string;
  };
  productSection: {
    label: string;
    heading: string;
    subtitle: string;
    viewAll: string;
  };
  trustBenefits: {
    items: { title: string; subtitle: string }[];
  };
  footer: {
    brandDescription: string;
    email: string;
    links: {
      shop: FooterLinks;
      info: FooterLinks;
      service: FooterLinks;
      legal: FooterLinks;
    };
    bottomText: string;
    paymentMethods: string[];
  };
  productCard: {
    reviews: string;
    added: string;
  };
  checkout: {
    title: string;
    payButton: string;
    emptyCart: string;
  };
  auth: {
    loginTitle: string;
    loginDescription: string;
    alreadyLoggedIn: string;
    goToAccount: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    signIn: string;
    noAccount: string;
    registerTitle: string;
    registerDescription: string;
    nameLabel: string;
    namePlaceholder: string;
    haveAccount: string;
    register: string;
  };
  account: {
    unauthenticatedTitle: string;
    unauthenticatedMessage: string;
    signIn: string;
    register: string;
    greeting: string;
    loggedInMessage: string;
    accountInfoTitle: string;
    nameLabel: string;
    emailLabel: string;
    logout: string;
    registeredUsersTitle: string;
    noRegisteredUsers: string;
    authLogsTitle: string;
    noAuthLogs: string;
  };
  shipping: {
    title: string;
    description: string;
    fastDeliveryTitle: string;
    fastDeliveryLead: string;
    fastDeliveryDetail: string;
    freeShippingTitle: string;
    freeShippingLead: string;
    shippingCostDetail: string;
    trackingTitle: string;
    trackingLead: string;
    trackingDetail: string;
    orderHandlingTitle: string;
    orderHandlingLead: string;
    orderHandlingDetail: string;
    internationalTitle: string;
    internationalLead: string;
    internationalDetail: string;
  };
  productDetail: {
    breadcrumbHome: string;
    breadcrumbProducts: string;
    productName: string;
    reviewsLabel: string;
    trustBadges: { label: string; description: string }[];
    sectionTitles: {
      description: string;
      ingredients: string;
      usage: string;
      shippingReturn: string;
    };
    shippingReturnText: string;
  };
  faq: {
    title: string;
    subtitle: string;
    items: { question: string; answer: string }[];
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
      viewAllProducts: 'Se alla produkter',
    },
    cart: {
      title: 'Din varukorg',
      empty: 'Din varukorg är tom',
      total: 'Totalt',
      checkout: 'Till kassan',
      remove: 'Ta bort',
      quantity: 'Antal',
      close: 'Stäng varukorg',
      freeShipping: 'Lägg till {amount} kr för fri frakt',
      goToCheckout: 'Gå till kassa',
      decrementQuantity: 'Minska antal',
      incrementQuantity: 'Öka antal',
    },
    cta: {
      title: 'Redo att ta din energi till nästa nivå?',
      subtitle: 'Utforska Viking Fuel och välj paketet som passar dig bäst.',
      badge: 'Begränsat erbjudande',
    },
    announcement: {
      items: [
        'Fri frakt över 500 kr',
        '10% rabatt på första beställningen',
        'Säker betalning',
        'Snabb leverans',
        'Tillverkat i EU',
        'Premium ingredienser',
        '30 dagars nöjdhetsgaranti',
      ],
    },
    hero: {
      premiumTag: 'Premium Kosttillskott',
      headline: 'Byggd för daglig prestation.',
      description: 'Utforska Viking Fuel – kosttillskott för energi, uthållighet och vitalitet.',
    },
    productSection: {
      label: 'Våra produkter',
      heading: 'Kosttillskott för resultat och välmående',
      subtitle: 'Premiumprodukter med tydliga ingredienser, stark identitet och fokus på daglig prestation.',
      viewAll: 'Se alla produkter',
    },
    trustBenefits: {
      items: [
        { title: 'Fri frakt', subtitle: 'Över 500 kr' },
        { title: 'Säker betalning', subtitle: 'Krypterad checkout' },
        { title: '14 dagars retur', subtitle: 'Enkel returprocess' },
        { title: 'Premium kvalitet', subtitle: 'Tillverkat i EU' },
        { title: 'Snabb leverans', subtitle: '1–3 arbetsdagar' },
      ],
    },
    footer: {
      brandDescription: 'Nordiska premiumtillskott för daglig prestation. Tillverkat i EU med naturliga ingredienser.',
      email: 'info@vikingfuel.se',
      links: {
        shop: {
          title: 'Butik',
          links: [
            { label: 'Alla produkter', href: '/products' },
            { label: 'Viking Energy', href: '/product-detail' },
            { label: 'Paket', href: '/products' },
          ],
        },
        info: {
          title: 'Information',
          links: [
            { label: 'Om oss', href: '/about' },
            { label: 'Ingredienser', href: '/#ingredients' },
            { label: 'Vanliga frågor', href: '/faq' },
            { label: 'Recensioner', href: '/reviews' },
          ],
        },
        service: {
          title: 'Kundservice',
          links: [
            { label: 'Kontakt', href: '/contact' },
            { label: 'Frakt & leverans', href: '/frakt-leverans' },
            { label: 'Returpolicy', href: '/returpolicy' },
          ],
        },
        legal: {
          title: 'Juridik',
          links: [
            { label: 'Köpvillkor', href: '/kopvillkor' },
            { label: 'Integritetspolicy', href: '/integritetspolicy' },
          ],
        },
      },
      bottomText: '© 2026 Viking Fuel AB. Alla rättigheter förbehållna.',
      paymentMethods: ['Visa', 'Mastercard', 'Klarna', 'Swish'],
    },
    productCard: {
      reviews: 'recensioner',
      added: 'Tillagd!',
    },
    checkout: {
      title: 'Kassa',
      payButton: 'Gå till betalning',
      processing: 'Behandlar...',
      emptyCart: 'Din varukorg är tom',
      emptyCartSubtitle: 'Lägg till produkter innan du checkar ut',
      errorMessage: 'Ett fel uppstod vid checkout - försök igen senare',
      personalInfo: 'Personlig information',
      nameLabel: 'Namn *',
      emailLabel: 'E-post *',
      phoneLabel: 'Telefon *',
      shippingAddress: 'Leveransadress',
      addressLabel: 'Adress *',
      addressPlaceholder: 'Gatunamn och husnummer',
      cityLabel: 'Stad *',
      postalCodeLabel: 'Postnummer *',
      countryLabel: 'Land *',
      countryOptionSE: 'Sverige',
      countryOptionNO: 'Norge',
      countryOptionDK: 'Danmark',
      countryOptionFI: 'Finland',
      orderSummary: 'Ordersammanfattning',
      totalLabel: 'Totalt:',
      shippingNote: 'Fri frakt på beställningar över 500 kr. Under 500 kr tillkommer 49 kr fraktkostnad.',
    },
    auth: {
      loginTitle: 'Logga in',
      loginDescription: 'Logga in på ditt konto för att se beställningar, hantera dina uppgifter och fortsätta handla.',
      alreadyLoggedIn: 'Du är redan inloggad som {name}.',
      goToAccount: 'Gå till mitt konto',
      emailLabel: 'E-post',
      emailPlaceholder: 'din@epost.se',
      passwordLabel: 'Lösenord',
      passwordPlaceholder: 'Ange ditt lösenord',
      signIn: 'Logga in',
      noAccount: 'Har du inget konto?',
      registerTitle: 'Skapa konto',
      registerDescription: 'Skapa ett nytt konto för snabbare utcheckning och enklare orderhantering.',
      nameLabel: 'Fullständigt namn',
      namePlaceholder: 'Ditt namn',
      haveAccount: 'Har du redan ett konto?',
      register: 'Skapa konto',
    },
    account: {
      unauthenticatedTitle: 'Logga in eller skapa konto',
      unauthenticatedMessage: 'För att se ditt konto och tidigare beställningar måste du vara inloggad.',
      signIn: 'Logga in',
      register: 'Skapa konto',
      greeting: 'Välkommen, {name}!',
      loggedInMessage: 'Du är inloggad med {email}.',
      accountInfoTitle: 'Kontoinformation',
      nameLabel: 'Namn',
      emailLabel: 'E-post',
      logout: 'Logga ut',
      registeredUsersTitle: 'Registrerade användare',
      noRegisteredUsers: 'Inga registrerade användare ännu.',
      authLogsTitle: 'Autentiseringsloggar',
      noAuthLogs: 'Inga loggar tillgängliga för tillfället.',
    },
    shipping: {
      title: 'Frakt & leverans',
      description: 'Allt du behöver veta om leveranstider, fraktkostnader och hur vi hanterar din beställning.',
      fastDeliveryTitle: 'Snabb leverans från Sverige',
      fastDeliveryLead: 'Vi packar och skickar alla beställningar från vårt lager i Sverige. Normalt tar orderbehandlingen 1–2 arbetsdagar innan paketet lämnar vår terminal.',
      fastDeliveryDetail: 'Leveranstiden inom Sverige är vanligtvis 1–3 arbetsdagar. Vi använder utvalda transportörer för säkra och pålitliga leveranser.',
      freeShippingTitle: 'Fri frakt & fraktkostnad',
      freeShippingLead: 'Vi erbjuder fri frakt på alla beställningar över 500 kr. För beställningar under 500 kr tillkommer en fast fraktavgift som visas i kassan.',
      shippingCostDetail: 'Fraktkostnaden beror på vikt och destination, men vi arbetar alltid för att ge så låga kostnader som möjligt.',
      trackingTitle: 'Spårning och leveransavisering',
      trackingLead: 'När din order skickas får du en leveransbekräftelse med spårningsnummer. Du kan följa paketet tills det levereras till dig.',
      trackingDetail: 'Om leveransen försenas eller om du har frågor om spårningen, kontakta oss så hjälper vi dig.',
      orderHandlingTitle: 'Hantering av din order',
      orderHandlingLead: 'Vi kontrollerar varje produkt innan den skickas för att säkerställa att du får rätt vara och att förpackningen är hel.',
      orderHandlingDetail: 'Beställningar lagts på helgen hanteras på nästa arbetsdag. Under högtider kan leveranstiderna bli något längre, men vi håller dig uppdaterad.',
      internationalTitle: 'Internationella leveranser',
      internationalLead: 'För leverans utanför Sverige gäller andra leveranstider och fraktpriser. Kontakta oss om du vill veta mer om internationell frakt.',
      internationalDetail: 'Vi samarbetar med pålitliga fraktpartners för att din beställning ska nå dig tryggt och snabbt, även vid leverans till Norden.',
    },
    header: {
      search: 'Sök',
      account: 'Mitt konto',
      signIn: 'Logga in',
      logout: 'Logga ut',
      register: 'Skapa konto',
      cart: 'Varukorg',
      openMenu: 'Öppna meny',
      closeMenu: 'Stäng meny',
    },
    productDetail: {
      breadcrumbHome: 'Hem',
      breadcrumbProducts: 'Produkter',
      productName: 'Viking Energy',
      reviewsLabel: 'recensioner',
      trustBadges: [
        { label: 'Tillverkat i EU', description: 'Garanterad kvalitet och standard.' },
        { label: 'GMP-certifierat', description: 'Producerat enligt strikt tillverkningsstandard.' },
        { label: 'Fri frakt >500kr', description: 'Fri leverans över 500 kr.' },
      ],
      sectionTitles: {
        description: 'Beskrivning',
        ingredients: 'Ingredienser',
        usage: 'Användning',
        shippingReturn: 'Frakt & retur',
      },
      shippingReturnText: '14 dagars ångerrätt från mottagningsdatum. Produkten ska vara oöppnad och i originalförpackning.',
    },
    faq: {
      title: 'Vanliga frågor',
      subtitle: 'Här hittar du svar på de vanligaste frågorna om våra produkter.',
      items: [
        {
          question: 'Vad är Viking Fuel?',
          answer: 'Viking Fuel är ett premiumtillskott från Norden som hjälper dig att prestera bättre varje dag med naturliga ingredienser.'
        },
        {
          question: 'Hur tar jag produkten?',
          answer: 'Ta 1 kapsel per dag med vatten, helst på morgonen eller innan träning.'
        },
        {
          question: 'Är produkten säker?',
          answer: 'Ja, alla våra produkter är tillverkade i EU enligt högsta säkerhetsstandarder med naturliga ingredienser.'
        },
        {
          question: 'Kan jag kombinera med andra tillskott?',
          answer: 'Konsultera alltid en läkare innan du kombinerar tillskott. Våra produkter är designade för dagligt bruk.'
        }
      ]
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
      viewAllProducts: 'View all products',
    },
    cart: {
      title: 'Your cart',
      empty: 'Your cart is empty',
      total: 'Total',
      checkout: 'Checkout',
      remove: 'Remove',
      quantity: 'Quantity',
      close: 'Close cart',
      freeShipping: 'Add {amount} SEK for free shipping',
      goToCheckout: 'Go to checkout',
      decrementQuantity: 'Decrease quantity',
      incrementQuantity: 'Increase quantity',
    },
    cta: {
      title: 'Ready to take your energy to the next level?',
      subtitle: 'Explore Viking Fuel and choose the bundle that suits you best.',
      badge: 'Limited offer',
    },
    announcement: {
      items: [
        'Free shipping over 500 SEK',
        '10% off first order',
        'Secure payment',
        'Fast delivery',
        'Made in EU',
        'Premium ingredients',
        '30-day satisfaction guarantee',
      ],
    },
    hero: {
      premiumTag: 'Premium Supplements',
      headline: 'Built for daily performance.',
      description: 'Discover Viking Fuel – supplements for energy, endurance and vitality.',
    },
    productSection: {
      label: 'Our products',
      heading: 'Supplements for performance and well-being',
      subtitle: 'Premium products with clear ingredients, strong identity and a focus on daily performance.',
      viewAll: 'View all products',
    },
    trustBenefits: {
      items: [
        { title: 'Free shipping', subtitle: 'Over 500 SEK' },
        { title: 'Secure payment', subtitle: 'Encrypted checkout' },
        { title: '14-day returns', subtitle: 'Easy process' },
        { title: 'Premium quality', subtitle: 'Made in EU' },
        { title: 'Fast delivery', subtitle: '1–3 business days' },
      ],
    },
    footer: {
      brandDescription: 'Nordic premium supplements for daily performance. Made in EU with natural ingredients.',
      email: 'info@vikingfuel.se',
      links: {
        shop: {
          title: 'Shop',
          links: [
            { label: 'All products', href: '/products' },
            { label: 'Viking Energy', href: '/product-detail' },
            { label: 'Bundles', href: '/products' },
          ],
        },
        info: {
          title: 'Information',
          links: [
            { label: 'About us', href: '/about' },
            { label: 'Ingredients', href: '/#ingredients' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Reviews', href: '/reviews' },
          ],
        },
        service: {
          title: 'Customer service',
          links: [
            { label: 'Contact', href: '/contact' },
            { label: 'Shipping & delivery', href: '/frakt-leverans' },
            { label: 'Return policy', href: '/returpolicy' },
          ],
        },
        legal: {
          title: 'Legal',
          links: [
            { label: 'Terms of service', href: '/kopvillkor' },
            { label: 'Privacy policy', href: '/integritetspolicy' },
          ],
        },
      },
      bottomText: '© 2026 Viking Fuel AB. All rights reserved.',
      paymentMethods: ['Visa', 'Mastercard', 'Klarna', 'Swish'],
    },
    productCard: {
      reviews: 'reviews',
      added: 'Added!',
    },
    checkout: {
      title: 'Checkout',
      payButton: 'Proceed to payment',
      processing: 'Processing...',
      emptyCart: 'Your cart is empty',
      emptyCartSubtitle: 'Add products before checking out',
      errorMessage: 'Checkout error occurred - please try again later',
      personalInfo: 'Personal information',
      nameLabel: 'Name *',
      emailLabel: 'Email *',
      phoneLabel: 'Phone *',
      shippingAddress: 'Shipping address',
      addressLabel: 'Address *',
      addressPlaceholder: 'Street address and house number',
      cityLabel: 'City *',
      postalCodeLabel: 'Postal code *',
      countryLabel: 'Country *',
      countryOptionSE: 'Sweden',
      countryOptionNO: 'Norway',
      countryOptionDK: 'Denmark',
      countryOptionFI: 'Finland',
      orderSummary: 'Order summary',
      totalLabel: 'Total:',
      shippingNote: 'Free shipping on orders over 500 SEK. Orders under 500 SEK incur a 49 SEK shipping fee.',
    },
    auth: {
      loginTitle: 'Sign in',
      loginDescription: 'Sign in to your account to view orders, manage your details, and continue shopping.',
      alreadyLoggedIn: 'You are already signed in as {name}.',
      goToAccount: 'Go to account',
      emailLabel: 'Email',
      emailPlaceholder: 'your@email.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      signIn: 'Sign in',
      noAccount: 'Don’t have an account?',
      registerTitle: 'Create account',
      registerDescription: 'Create a new account for faster checkout and easier order management.',
      nameLabel: 'Full name',
      namePlaceholder: 'Your name',
      haveAccount: 'Already have an account?',
      register: 'Create account',
    },
    account: {
      unauthenticatedTitle: 'Sign in or create an account',
      unauthenticatedMessage: 'To see your account and previous orders you need to be signed in.',
      signIn: 'Sign in',
      register: 'Create account',
      greeting: 'Welcome, {name}!',
      loggedInMessage: 'You are signed in with {email}.',
      accountInfoTitle: 'Account information',
      nameLabel: 'Name',
      emailLabel: 'Email',
      logout: 'Sign out',
      registeredUsersTitle: 'Registered users',
      noRegisteredUsers: 'No registered users yet.',
      authLogsTitle: 'Authentication logs',
      noAuthLogs: 'No logs available at the moment.',
    },
    shipping: {
      title: 'Shipping & delivery',
      description: 'Everything you need to know about delivery times, shipping costs, and order handling.',
      fastDeliveryTitle: 'Fast delivery from Sweden',
      fastDeliveryLead: 'We pack and ship all orders from our warehouse in Sweden. Order handling normally takes 1–2 business days before the package leaves our terminal.',
      fastDeliveryDetail: 'Delivery within Sweden usually takes 1–3 business days. We use selected carriers for secure and reliable delivery.',
      freeShippingTitle: 'Free shipping & shipping fees',
      freeShippingLead: 'We offer free shipping on all orders over 500 SEK. For orders under 500 SEK, a flat shipping fee is added at checkout.',
      shippingCostDetail: 'Shipping costs depend on weight and destination, but we always work to keep costs as low as possible.',
      trackingTitle: 'Tracking and delivery updates',
      trackingLead: 'When your order ships, you receive a confirmation email with a tracking number. You can follow the package until it is delivered to you.',
      trackingDetail: 'If delivery is delayed or you have questions about tracking, contact us and we will help you.',
      orderHandlingTitle: 'Order handling',
      orderHandlingLead: 'We inspect every product before shipment to ensure you receive the correct item and that the packaging is intact.',
      orderHandlingDetail: 'Orders placed over the weekend are processed on the next business day. During holidays, delivery times may be slightly longer, but we keep you informed.',
      internationalTitle: 'International shipping',
      internationalLead: 'Different delivery times and shipping prices apply for delivery outside Sweden. Contact us to learn more about international shipping.',
      internationalDetail: 'We partner with reliable carriers so your order reaches you safely and quickly, even when shipping to the Nordics.',
    },
    header: {
      search: 'Search',
      account: 'My account',
      signIn: 'Sign in',
      logout: 'Log out',
      register: 'Create account',
      cart: 'Shopping cart',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    productDetail: {
      breadcrumbHome: 'Home',
      breadcrumbProducts: 'Products',
      productName: 'Viking Energy',
      reviewsLabel: 'reviews',
      trustBadges: [
        { label: 'Made in EU', description: 'Guaranteed quality and standards.' },
        { label: 'GMP certified', description: 'Produced according to strict manufacturing standards.' },
        { label: 'Free shipping >500 SEK', description: 'Free delivery on orders over 500 SEK.' },
      ],
      sectionTitles: {
        description: 'Description',
        ingredients: 'Ingredients',
        usage: 'Usage',
        shippingReturn: 'Shipping & returns',
      },
      shippingReturnText: '14-day right of withdrawal from receipt date. The product must be unopened and in its original packaging.',
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Here you will find answers to the most common questions about our products.',
      items: [
        {
          question: 'What is Viking Fuel?',
          answer: 'Viking Fuel is a premium supplement from the Nordics that helps you perform better every day with natural ingredients.'
        },
        {
          question: 'How do I take the product?',
          answer: 'Take 1 capsule per day with water, preferably in the morning or before training.'
        },
        {
          question: 'Is the product safe?',
          answer: 'Yes, all our products are manufactured in the EU according to the highest safety standards with natural ingredients.'
        },
        {
          question: 'Can I combine it with other supplements?',
          answer: 'Always consult a doctor before combining supplements. Our products are designed for daily use.'
        }
      ]
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
