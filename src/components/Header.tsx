'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import CartDrawer from '@/components/CartDrawer';

const megaCategories = [
  { sv: 'Energi', en: 'Energy', href: '#', disabled: true },
  { sv: 'Testo-support', en: 'Testo-support', href: '/products', disabled: false },
  { sv: 'Vitalitet', en: 'Vitality', href: '#', disabled: true },
  { sv: 'Tillbehör', en: 'Accessories', href: '#', disabled: true },
];

export default function Header() {
  const { totalItems, openCart } = useCart();
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navItems = [
    { label: t?.nav?.home, href: '/' },
    { label: t?.nav?.products, href: '/products', hasMega: true },
    { label: t?.nav?.about, href: '/about' },
    { label: t?.nav?.reviews, href: '/reviews' },
    { label: t?.nav?.faq, href: '/faq' },
    { label: t?.nav?.contact, href: '/contact' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-200 ${
          scrolled ? 'shadow-md' : 'border-b border-border'
        }`}
      >
        <div className="container-wide">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <AppLogo size={56} />
              <span className="font-extrabold text-xl tracking-tight text-foreground hidden sm:block">
                Viking Fuel
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems?.map((item) => (
                <div
                  key={item?.label}
                  className="relative"
                  onMouseEnter={() => item?.hasMega && setMegaOpen(true)}
                  onMouseLeave={() => item?.hasMega && setMegaOpen(false)}
                >
                  <Link
                    href={item?.href}
                    className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors rounded-lg hover:bg-muted whitespace-nowrap"
                  >
                    {item?.label}
                    {item?.hasMega && (
                      <Icon name="ChevronDownIcon" size={14} className="inline ml-1 opacity-60" />
                    )}
                  </Link>

                  {/* Mega Menu */}
                  {item?.hasMega && megaOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] bg-white rounded-2xl shadow-2xl border border-border p-6 grid grid-cols-2 gap-3 animate-fade-in">
                      {megaCategories?.map((cat) => (
                        cat.disabled ? (
                          <div
                            key={cat?.sv}
                            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 cursor-not-allowed"
                          >
                            <span className="w-8 h-8 rounded-lg bg-accent/50 flex items-center justify-center flex-shrink-0">
                              <Icon name="SparklesIcon" size={16} className="text-muted-foreground" />
                            </span>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">
                                {lang === 'sv' ? cat?.sv : cat?.en}
                              </span>
                              <span className="text-xs text-muted-foreground block">Kommer snart</span>
                            </div>
                          </div>
                        ) : cat.href && cat.href !== '#' ? (
                          <Link
                            key={cat?.sv}
                            href={cat.href}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                          >
                            <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                              <Icon name="SparklesIcon" size={16} className="text-primary" />
                            </span>
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {lang === 'sv' ? cat?.sv : cat?.en}
                            </span>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3 p-3 rounded-xl">
                            <span className="w-8 h-8 rounded-lg bg-accent/50 flex items-center justify-center flex-shrink-0">
                              <Icon name="SparklesIcon" size={16} className="text-muted-foreground" />
                            </span>
                            <span className="text-sm font-medium text-muted-foreground">
                              {lang === 'sv' ? cat?.sv : cat?.en}
                            </span>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Language Toggle */}
              <button
                onClick={() => setLang(lang === 'sv' ? 'en' : 'sv')}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-border hover:bg-muted transition-colors text-foreground/70 hover:text-foreground"
              >
                {lang?.toUpperCase()}
                <Icon name="ChevronDownIcon" size={12} />
              </button>

              <button
                className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground/70 hover:text-foreground"
                aria-label="Sök"
              >
                <Icon name="MagnifyingGlassIcon" size={20} />
              </button>

              {user ? (
                <>
                  <Link
                    href="/account"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium text-foreground/70 hover:text-foreground"
                    aria-label="Mitt konto"
                  >
                    <Icon name="UserIcon" size={20} />
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground/70 hover:text-foreground"
                    aria-label="Logga ut"
                  >
                    <Icon name="ArrowRightOnRectangleIcon" size={20} />
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium text-foreground/70 hover:text-foreground"
                  aria-label="Konto"
                >
                  <Icon name="UserIcon" size={20} />
                  <span>Logga in</span>
                </Link>
              )}

              <button
                onClick={openCart}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors text-foreground/70 hover:text-foreground"
                aria-label="Varukorg"
              >
                <Icon name="ShoppingCartIcon" size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors ml-1"
                onClick={() => setMobileOpen(true)}
                aria-label="Öppna meny"
              >
                <Icon name="Bars3Icon" size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 left-0 right-0 bg-white rounded-b-3xl shadow-2xl p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <AppLogo size={32} />
                <span className="font-extrabold text-lg">Viking Fuel</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-muted"
                aria-label="Stäng meny"
              >
                <Icon name="XMarkIcon" size={22} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {navItems?.map((item) => (
                <Link
                  key={item?.label}
                  href={item?.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-xl transition-colors"
                >
                  {item?.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 space-y-3">
              {user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-xl transition-colors"
                  >
                    {user.name}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-xl transition-colors text-left"
                  >
                    Logga ut
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-xl transition-colors"
                  >
                    Logga in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-xl transition-colors"
                  >
                    Skapa konto
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  setLang(lang === 'sv' ? 'en' : 'sv');
                  setMobileOpen(false);
                }}
                className="w-full px-4 py-2 text-sm font-bold rounded-lg border border-border hover:bg-muted"
              >
                {lang === 'sv' ? 'Switch to EN' : 'Byt till SV'}
              </button>
            </div>
          </div>
        </div>
      )}
      <CartDrawer />
    </>
  );
}
