'use client';

import React from 'react';

export default function ShippingContent() {

  return (
    <main className="py-20">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Frakt och leverans</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Här kan du läsa om hur vi levererar dina produkter och vilka fraktalternativ som finns.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Snabb leverans</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Vi skickar din order inom 1–2 arbetsdagar så snart den behandlats.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Leveranstiden i Sverige är normalt 2–4 dagar efter att din beställning har bekräftats.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Fraktkostnader</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Fraktkostnaden beräknas automatiskt i kassan.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Vi erbjuder förmånliga fraktpriser för stora delar av Sverige.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Spårning</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              När din order skickas får du en spårningslänk via e-post.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Du kan följa paketet hela vägen fram till leverans.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Hantera beställningar</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Du kan ändra eller avboka ordern innan den har skickats.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Kontakta kundservice om du behöver hjälp med ändringar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Internationell frakt</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Vi fokuserar på leveranser inom Sverige.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              För internationella beställningar, kontakta kundservice för mer information.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}