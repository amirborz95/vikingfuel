import React from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ShippingPage() {
  return (        <div className="min-h-screen bg-white">
          <AnnouncementBar />
          <Header />
          <main className="py-20">
            <div className="container-wide">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-foreground mb-4">Frakt & leverans</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Allt du behöver veta om leveranstider, fraktkostnader och hur vi hanterar din beställning.
                </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-10">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Snabb leverans från Sverige</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Vi packar och skickar alla beställningar från vårt lager i Sverige. Normalt tar orderbehandlingen 1–2 arbetsdagar innan paketet lämnar vår terminal.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Leveranstiden inom Sverige är vanligtvis 1–3 arbetsdagar. Vi använder utvalda transportörer för säkra och pålitliga leveranser.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Fri frakt & fraktkostnad</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Vi erbjuder fri frakt på alla beställningar över 500 kr. För beställningar under 500 kr tillkommer en fast fraktavgift som visas i kassan.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Fraktkostnaden beror på vikt och destination, men vi arbetar alltid för att ge så låga kostnader som möjligt.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Spårning och leveransavisering</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    När din order skickas får du en leveransbekräftelse med spårningsnummer. Du kan följa paketet tills det levereras till dig.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Om leveransen försenas eller om du har frågor om spårningen, kontakta oss så hjälper vi dig.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Hantering av din order</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Vi kontrollerar varje produkt innan den skickas för att säkerställa att du får rätt vara och att förpackningen är hel.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Beställningar lagts på helgen hanteras på nästa arbetsdag. Under högtider kan leveranstiderna bli något längre, men vi håller dig uppdaterad.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Internationella leveranser</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    För leverans utanför Sverige gäller andra leveranstider och fraktpriser. Kontakta oss om du vill veta mer om internationell frakt.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Vi samarbetar med pålitliga fraktpartners för att din beställning ska nå dig tryggt och snabbt, även vid leverans till Norden.
                  </p>
                </section>
              </div>
            </div>
          </main>
          <Footer />
        </div>  );
}
