import React from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (        <div className="min-h-screen bg-white">
          <AnnouncementBar />
          <Header />
          <main className="py-20">
            <div className="container-wide">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-foreground mb-4">Köpvillkor</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Här hittar du våra villkor för köp, leverans, retur och ansvar i din beställning hos Viking Fuel.
                </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-10">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Avtal och beställning</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Köpeavtalet gäller från det att vi bekräftar din beställning via e-post. Bekräftelsen innehåller beställningsnummer, produkter och pris.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Vi förbehåller oss rätten att neka eller justera en beställning om produkten inte längre finns i lager eller om informationen i ordern är ofullständig.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Pris och betalning</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Priser anges i SEK inklusive svensk moms, om inte annat anges. Betalning sker i kassan genom de metoder som erbjuds vid varje tidpunkt.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Vi reserverar oss för eventuella prisändringar eller felaktiga prisangivelser, men du informeras alltid innan köpet genomförs.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Leverans och leveranstid</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Leverans sker normalt inom 1–3 arbetsdagar efter att ordern skickats. Fraktpriser och leveranstider visas i kassan.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Vi levererar till angiven leveransadress och ansvarar för varan tills den överlämnas till transportören.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Ångerrätt och retur</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Du har 30 dagars öppet köp från leveransdatum. Retur ska ske i felfritt skick och i originalförpackning om möjligt.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Returkostnad kan tillkomma, och återbetalning sker när vi mottagit och kontrollerat varan.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Ansvar och reklamation</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Vi ansvarar för fel eller skada som beror på oss, men kan inte hållas ansvariga för indirekta förluster som uppstår utanför vårt inflytande.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Vid reklamation kontakta oss så hjälper vi dig att hitta en snabb lösning samt hanterar eventuella ersättningar eller byten.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Tillämplig lag</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Avtalet regleras av svensk lag. Eventuella tvister ska i första hand lösas genom dialog. Om det inte är möjligt kan ärenden avgöras i svensk domstol.
                  </p>
                </section>
              </div>
            </div>
          </main>
          <Footer />
        </div>  );
}
