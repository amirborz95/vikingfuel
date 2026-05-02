import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

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
              {t.footer.brandDescription}
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              <a href={`mailto:${t.footer.email}`} className="hover:text-primary transition-colors">
                {t.footer.email}
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
          {Object.values(t.footer.links).map((col) => (
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
            {t.footer.bottomText}
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {t.footer.paymentMethods.map((pay) => (
              <span
                key={pay}
                className="px-3 py-1 text-[10px] font-bold rounded border border-border text-muted-foreground uppercase tracking-wide"
              >
                {pay}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
