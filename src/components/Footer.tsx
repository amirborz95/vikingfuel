'use client';

import React from 'react';
import Link from 'next/link';
import AppLogo from './ui/AppLogo';
import Icon from './ui/AppIcon';
import PaymentMethods from './ui/PaymentMethods';
import { useLanguage } from '@/context/LanguageContext';
// payment methods: Visa, Mastercard, Card, PayPal, Apple Pay, Google Pay

export default function Footer() {
  const { t } = useLanguage();
  type FooterLink = {
    label: string;
    href: string;
  };

  type FooterColumn = {
    title: string;
    links: FooterLink[];
  };

  const footerLinks: Record<string, FooterColumn> = {
    shop: {
      title: t('footer.shopTitle'),
      links: [
        { label: t('common.allProducts'), href: '/products' },
        { label: t('footer.bundles'), href: '/products' },
      ],
    },
    info: {
      title: t('footer.infoTitle'),
      links: [
        { label: t('footer.about'), href: '/about' },
        { label: t('footer.faq'), href: '/faq' },
        { label: t('footer.reviews'), href: '/reviews' },
        { label: t('footer.affiliate'), href: '/affiliate' },
      ],
    },
    service: {
      title: t('footer.serviceTitle'),
      links: [
        { label: t('footer.contact'), href: '/contact' },
        { label: t('footer.shipping'), href: '/frakt-leverans' },
        { label: t('footer.returns'), href: '/returpolicy' },
      ],
    },
    legal: {
      title: t('footer.legalTitle'),
      links: [
        { label: t('footer.terms'), href: '/kopvillkor' },
        { label: t('footer.privacy'), href: '/integritetspolicy' },
      ],
    },
  };

  return (
    <footer className="bg-white border-t border-border pt-16 pb-8">
      <div className="container-wide">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <AppLogo size={36} />
              <span className="font-extrabold text-xl tracking-tight text-foreground">
                Viking Fuel
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
              {t('footer.tagline2')}
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              <a href="mailto:info@vikingfuel.se" className="hover:text-primary transition-colors">
                info@vikingfuel.se
              </a>
            </p>

            {/* Social links */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.instagram.com/vikingfuel.se/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/vikingfuel.se"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.values(footerLinks).map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-foreground mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center justify-center sm:justify-end w-full sm:w-auto">
            <PaymentMethods />
          </div>
        </div>
      </div>
    </footer>
  );
}
