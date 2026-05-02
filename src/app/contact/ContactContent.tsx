'use client';

import React from 'react';
import Link from 'next/link';

export default function ContactContent() {

  return (
    <main className="py-20">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Kontakt</h1>
          <p className="text-lg text-muted-foreground">Vår kundservice hjälper dig gärna med frågor om produkter, beställningar och leverans.</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-muted/30 rounded-2xl p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">E-post</h3>
                <p className="text-muted-foreground">
                  <a href="mailto:info@vikingfuel.se" className="hover:text-primary transition-colors">
                    info@vikingfuel.se
                  </a>
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Support</h3>
                <p className="text-muted-foreground">Vi svarar på frågor om leverans, produktval och beställning under våra öppettider.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Frakt</h3>
                <p className="text-muted-foreground">
                  Vi levererar inom Sverige med snabb frakt. Läs mer om fraktvillkor på{' '}
                  <Link href="/frakt-leverans" className="hover:text-primary transition-colors">
                    fraktsidan
                  </Link>.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Retur</h3>
                <p className="text-muted-foreground">
                  Du kan läsa mer om returpolicy och villkor på{' '}
                  <Link href="/returpolicy" className="hover:text-primary transition-colors">
                    returpolicyn
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}