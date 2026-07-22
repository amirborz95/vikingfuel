'use client';

import React from 'react';

export default function ShippingContent() {

  return (
    <main className="py-20">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Frakt & Leverans</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Vi erbjuder snabb och pålitlig leverans av dina Viking Fuel-produkter direkt till din dörr. Läs om våra fraktalternativ och leveransprocessen.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-10">
          <section className="border-l-4 border-primary pl-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">📦 Snabb leverans inom Sverige</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Vi skickar din beställning inom 1–2 arbetsdagar efter orderbekräftelse (helgfritt). Leveranstiden i Sverige är normalt 3–5 arbetsdagar efter att paketet har lämnats till transportören.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Leveranstider:</strong><br/>
              3–5 arbetsdagar
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Leveranstiden räknas från det att paketet lämnas till transportören, inte från orderbekräftelse. Under höga orderperioder kan det ta upp till 2 arbetsdagar innan paketet skickas.
            </p>
          </section>

          <section className="border-l-4 border-primary pl-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">💰 Fraktkostnader</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Fraktkostnaden beräknas automatiskt baserat på din leveransadress och visas i kassan. Vi erbjuder konkurrenskraftiga fraktpriser för hela Sverige, med samma policy i Stripe-kassan.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Fraktkostnadsöversikt:</strong><br/>
              • Normalt frakt kostar 49 kr inom hela Sverige.<br/>
              • Fri frakt: På beställningar över 700 kr
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Stripe-kassan använder samma fraktpolicy: fri frakt över 700 kr, annars standardfrakt 49 kr inom hela Sverige.
            </p>
          </section>

          <section className="border-l-4 border-primary pl-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">📍 Spårning av paket</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              När din beställning är skickad får du en spårningslänk via e-post. Du kan följa ditt paket i realtid från vårt lager till din hemadress.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Spårningslänken innehåller:
              • Status på paketet (under transport, ankommit till paketlåda, etc)<br/>
              • Upskattad leveranstid<br/>
              • Möjlighet att ange önskad leveranstid vid vissa transportörer
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Om du inte mottar spårningslänken, kontakta oss på info@vikingfuel.se. Vi kan då skicka den direkt eller hjälpa till att lösa eventuella problem.
            </p>
          </section>

          <section className="border-l-4 border-primary pl-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">🛠️ Hantering av beställningar</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Ändra eller avboka din beställning:</strong><br/>
              Du kan ändra eller avboka din beställning <strong>innan den har skickats från vårt lager</strong> (normalt inom 24 timmar).
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              För att göra ändringar:
              • E-posta oss på info@vikingfuel.se med ditt ordernummer<br/>
              • Inkludera vilka ändringar du vill göra<br/>
              • Vi svarar normalt inom 1–2 arbetsdagar<br/>
              • Kostnad för ändringar: Ingen om paketet inte är skickat ännu
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Om paketet redan är skickat kan du returnera det enligt vår returpolicy (14 dagars ångerrätt).
            </p>
          </section>

          <section className="border-l-4 border-primary pl-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">🚚 Vad händer om paketet är skadat eller försvinner?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Vi tar ansvar för skadat eller försvunnet paket:
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Skadat paket:</strong><br/>
              1. Kontakta oss omedelbar med foton på skadan och paketet<br/>
              2. Vi ersätter varan eller ger återbetalning<br/>
              3. Vi hanterar ersättning med transportören<br/>
              Lösning: 7–10 arbetsdagar<br/>
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Försvunnet paket:</strong><br/>
              1. Spåra paketet på leverantörens webbplats (länk skickad via e-post)<br/>
              2. Vänta 5 arbetsdagar efter förväntad leveranstid<br/>
              3. Kontakta oss om paketet inte ankommer<br/>
              4. Vi lämnar reklamation till transportörer och ersätter dig<br/>
              Typisk lösning: 7–10 arbetsdagar
            </p>
          </section>

          <section className="border-l-4 border-primary pl-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">🌍 Internationell frakt</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Vi fokuserar på leveranser inom Sverige. För närvarande erbjuder vi inte direktleverans till andra länder.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Om du är intresserad av internationell leverans eller grossistköp, kontakta oss på info@vikingfuel.se för att diskutera möjligheter.
            </p>
          </section>

          <section className="border-l-4 border-primary pl-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">💬 Frågor om din leverans?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Vi är här för att hjälpa! Kontakta vår kundtjänstteam:
            </p>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              E-post: info@vikingfuel.se
              Svarstid: 1–2 arbetsdagar
              Öppettider: Mån–Fre 09:00–17:00 CET
            </p>
          </section>
        </div>

        <div className="mt-16 bg-green-50 border border-green-200 rounded-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-foreground mb-4">✅ Vår leveransgaranti</h3>
          <p className="text-muted-foreground">
            Vi garanterar säker och snabb leverans av dina produkter. Om något går fel, löser vi det omedelbar utan krångel. Din tillfredsställelse är vår prioritet!
          </p>
        </div>
      </div>
    </main>
  );
}