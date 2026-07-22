'use client';

import React from 'react';
import Link from 'next/link';
import AppLogo from './ui/AppLogo';
import Icon from './ui/AppIcon';
import PaymentLogos from './ui/PaymentLogos';

export default function Footer() {
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
      title: 'Butik',
      links: [
        { label: 'Alla produkter', href: '/products' },
        { label: 'Paket', href: '/products' },
      ],
    },
    info: {
      title: 'Information',
      links: [
        { label: 'Om oss', href: '/about' },
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
              Nordiska premiumtillskott för daglig prestation. Tillverkat i EU med naturliga ingredienser.
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              <a href="mailto:info@vikingfuel.se" className="hover:text-primary transition-colors">
                info@vikingfuel.se
              </a>
            </p>
            <div className="flex gap-3 mt-4">
              {(['Instagram', 'Facebook', 'Twitter'] as const).map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all text-muted-foreground"
                >
                  <Icon name="GlobeAltIcon" size={16} />
                </a>
              ))}
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
            © 2026 SmartVal Sverige AB. Alla rättigheter förbehållna.
          </p>
          <div className="flex items-center justify-center sm:justify-end w-full sm:w-auto">
            <PaymentLogos />
          </div>
        </div>
      </div>
    </footer>
  );
}
