'use client';

import React from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ReturnPolicyPage() {

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <main className="py-20">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-foreground mb-4">Returpolicy</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Du har 14 dagar på dig att returnera produkter enligt distansköpslagar. Läs vår kompletta returpolicy här.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-10">
            <section className="border-l-4 border-primary pl-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">⏰ 14 dagars ångerrätt</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Du har rätt att returnera oanvändta produkter inom 14 dagar efter leverans. Detta är din lagstadgade ångerrätt enligt EU:s distansköpsdirektiv.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Viktiga villkor för retur:</strong><br/>
                • Produkten måste vara oanvänd och i originalskick<br/>
                • Original förpackning och etikett måste finnas kvar<br/>
                • Alla tillbehör och instruktioner måste medföljas<br/>
                • Returrätten gäller inte för öppnade eller konsumerade produkter (hälsoskäl)<br/>
                • Returfrakten bekostas av dig (undantag vid fel eller felaktig leverans)
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Om du returnerar en produkt på grund av att du är missnöjd, tar du returkostnaden. Om vi skickade fel produkt eller den är skadad, betalar vi returfrakten.
              </p>
            </section>

            <section className="border-l-4 border-primary pl-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">📝 Returprocess steg-för-steg</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Steg 1: Kontakta oss</strong><br/>
                Skicka ett e-postmeddelande till info@vikingfuel.se med:
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                • Ditt ordernummer<br/>
                • Anledning till retur<br/>
                • Ditt namn och kontaktinfo
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Steg 2: Få returinstruktioner</strong><br/>
                Vi svarar normalt inom 24 timmar med returinstruktioner och returadress.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Steg 3: Förbereda returpaketet</strong><br/>
                • Packa produkten i originalförpackning<br/>
                • Inkludera alla originaldelar och dokumentation<br/>
                • Använd returadresse och spårningsnummer vi tillhandahåller<br/>
                • Vi rekommenderar att du skriver ut returlabeln och fixerar den på paketet
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Steg 4: Skicka paketet</strong><br/>
                Skicka paketet till den adresse vi angav. Du kan lämna det hos PostNord, DHL eller en butik enligt anvisningarna.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Steg 5: Återbetalning</strong><br/>
                När vi mottar och inspekterar returpaketet bearbetar vi återbetalningen inom 5–10 arbetsdagar.
              </p>
            </section>

            <section className="border-l-4 border-primary pl-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">💳 Återbetalning</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Återbetalningen sker till samma betalningsmetod som du använde vid köpet:
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Kreditkort (Visa, Mastercard):</strong><br/>
                Återbetalningen sker normalt inom 3–5 arbetsdagar efter att vi behandlat returpaketet. Din bank kan ta ytterligare 2–3 dagar att publicera återbetalningen.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Klarna:</strong><br/>
                Återbetalningen hanteras av Klarna normalt inom 5–10 arbetsdagar.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Google Pay:</strong><br/>
                Återbetalningen sker till ditt associerade bankkonto normalt inom 3–5 arbetsdagar.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Viktigt:</strong> Vi återbetalar inte returfraktkostnaden om du returnerar på grund av ångra (omöjligt att uppfylla). Vi återbetalar returfrakten endast om det var vårt fel (fel produkt, skada, etc.).
              </p>
            </section>

            <section className="border-l-4 border-primary pl-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">🚫 Vad kan inte returneras?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Vi kan inte acceptera returer av:
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                • <strong>Delvis använda produkter</strong> – vi kan inte acceptera returer av delvis använda produkter<br/>
                • <strong>Produkter med saknad/skadad förpackning</strong> – om originalförpackning är borta eller allvarligt skadad<br/>
                • <strong>Produkter utan etikett</strong> – etiketten måste finnas kvar för att vi ska kunna verifiera produkten<br/>
                • <strong>Använt tillbehör</strong> – mätskopor, blandare, eller andra tillbehör som visar tecken på användning<br/>
                • <strong>Gåvor utan originalkvitto</strong> – du måste ha ordernummer eller originalbevis av köpet
              </p>
            </section>

            <section className="border-l-4 border-primary pl-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">⚠️ Fel eller skadade produkter</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Om du mottar en felaktig eller skadad produkt kan du returnera den kostnadsfritt:
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Procedur för felaktig/skadad vara:</strong><br/>
                1. Kontakta oss omedelbar med foton på produkten och eventuella skador<br/>
                2. Vi skickar en kostnadsfri returetikett<br/>
                3. Skicka produkten och vi inspekterar den<br/>
                4. Vi ersätter den med korrekt produkt eller ger full återbetalning (inklusive returfrakten)<br/>
                5. Du kan välja leveransen snabare via express om du vill
              </p>
            </section>

            <section className="border-l-4 border-primary pl-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">📅 Tidsgränser för retur</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>14 dagar från leverans:</strong> Du måste initiiera en retur inom 14 dagar från dagen du mottar produkten.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>30 dagar för återbetalning:</strong> Vi bearbetar återbetalningen normalt inom 10 arbetsdagar, men lagkrav tillåter upp till 30 dagar.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Spårning:</strong> Vi rekommenderar att du skickar paketet med spårningsnummer så du kan verifiera mottagningen.
              </p>
            </section>

            <section className="border-l-4 border-primary pl-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">💬 Frågor eller problem med retur?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Vi vill säkerställa att du är nöjd. Kontakta oss för hjälp:
              </p>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                E-post: info@vikingfuel.se
                Svarstid: 1–2 arbetsdagar
                Öppettider: Mån–Fre 09:00–17:00 CET
              </p>
            </section>

            <section className="border-l-4 border-primary pl-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">📞 Tvister eller komplikationer</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Om det uppstår oenighet om en retur eller om vi inte kan lösa problemet, kan du:
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                • <strong>Kontakta Konsumenten:</strong> Konsumentverket kan medla mellan dig och oss<br/>
                • <strong>Allmänna Reklamationsnämnden (ARN):</strong> En oberoende nämnd som löser tvister mellan konsumenter och företag<br/>
                • <strong>Domstol:</strong> Du kan välja att driva tvisten i Allmän domstol
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Vi strävar alltid efter att lösa alla ärenden utan vidare åtgärder. Ditt nöje är vår prioritet!
              </p>
            </section>
          </div>

          <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-foreground mb-4">✅ Garantirätt och konsumenträttigheter</h3>
            <p className="text-muted-foreground mb-2">
              Förutom ångerrätten har du även andra konsumenträttigheter:
            </p>
            <p className="text-muted-foreground">
              • <strong>2 års garantirätt:</strong> Om produkten är felaktig får du rättelse eller ersättning inom 2 år<br/>
              • <strong>Bevisburda:</strong> Vi måste visa att produkten var i gott skick när den levererades<br/>
              • <strong>Kostnadsfri reparation:</strong> Vi fixar eller byter felaktig vara utan kostnad under garantitiden
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
