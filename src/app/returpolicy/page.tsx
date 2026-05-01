import React from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ReturnPolicyPage() {
  return (        <div className="min-h-screen bg-white">
          <AnnouncementBar />
          <Header />
          <main className="py-20">
            <div className="container-wide">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-foreground mb-4">Returpolicy</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Vi vill göra retur och återbetalning så enkelt som möjligt. Läs vår kompletta returpolicy här.
                </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-10">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Öppet köp i 30 dagar</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Vi erbjuder 30 dagars öppet köp från den dag du mottagit din beställning. Om du av någon anledning vill returnera en produkt, ber vi dig kontakta vår kundtjänst för att påbörja returprocessen.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Returavgiften kan bero på vilken leveransmetod du väljer. Återbetalning sker när vi mottagit och kontrollerat varan.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Hur du returnerar</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    För att returnera en order, kontakta oss på info@vikingfuel.se. Ange ditt ordernummer och vilken vara du vill returnera.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Vi skickar instruktioner om returetikett och adress. Var noga med att produkten returneras i oskadat skick och i originalförpackning om möjligt.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Villkor för retur</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    För att godkännas som retur måste produkten vara oanvänd och i samma skick som vid mottagandet. Produkt med tydliga tecken på användning kan nekas retur eller återbetalning.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Dock ersätter vi självklart produkter som är felaktiga, skadade eller levereras felaktigt.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Återbetalningstid</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    När vi mottagit och granskat din retur återbetalar vi summan till samma betalningsmetod som användes vid köpet. Detta sker normalt inom 7–14 dagar.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Eventuella fraktkostnader för returen täcks av dig om det inte rör sig om felaktig eller skadad leverans.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Skadade eller felaktiga varor</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Om du fått en vara som är skadad, felaktig eller inte motsvarar beskrivningen, kontakta oss direkt så löser vi det utan dröjsmål.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Vi ersätter eller byter ut produkten och hjälper dig med returfrakten om det behövs.
                  </p>
                </section>
              </div>
            </div>
          </main>
          <Footer />
        </div>  );
}
