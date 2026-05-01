import React from 'react';
import Link from 'next/link';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (        <div className="min-h-screen bg-white">
          <AnnouncementBar />
          <Header />
          <main className="py-20">
            <div className="container-wide">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-foreground mb-4">Kontakt</h1>
                <p className="text-lg text-muted-foreground">Har du frågor? Kontakta oss så hjälper vi dig.</p>
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
                      <p className="text-muted-foreground">
                        Vår kundtjänst svarar snabbt på frågor om beställningar, produkter och leverans.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">Frakt & leverans</h3>
                      <p className="text-muted-foreground">
                        Läs mer om leveranstider och fraktkostnader på{' '}
                        <Link href="/frakt-leverans" className="hover:text-primary transition-colors">
                          Frakt & leverans
                        </Link>.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">Returpolicy</h3>
                      <p className="text-muted-foreground">
                        Se vår fullständiga returpolicy för information om öppet köp, returer och återbetalningar på{' '}
                        <Link href="/returpolicy" className="hover:text-primary transition-colors">
                          Returpolicy
                        </Link>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>  );
}