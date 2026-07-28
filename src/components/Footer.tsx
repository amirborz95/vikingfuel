'use client';

import React from 'react';
import Link from 'next/link';
import AppLogo from './ui/AppLogo';
import Icon from './ui/AppIcon';
import PaymentLogos from './ui/PaymentLogos';
import { useLanguage } from '@/context/LanguageContext';

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
            <PaymentLogos />
          </div>
        </div>
      </div>
    </footer>
  );
}
