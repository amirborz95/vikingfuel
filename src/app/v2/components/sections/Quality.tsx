'use client';

import React from 'react';
import { Container, Label, RevealImage, Section, SplitHeading } from '../ui';
import { Icons } from '../../lib/content';

const PROOF = [
  { title: 'Tillverkat i EU under GMP', body: 'Produktionen sker hos en GMP-certifierad anläggning inom EU.', Icon: Icons.shield },
  { title: 'Tredjepartstestad', body: 'Varje batch analyseras av ett oberoende laboratorium.', Icon: Icons.lab },
  { title: 'Full spårbarhet', body: 'Batchnummer och analys följer varje burk hela vägen ut.', Icon: Icons.truck },
];

export default function Quality() {
  return (
    <Section className="bg-forest" id="kvalitet">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <RevealImage
            src="/assets/v2/quality-lab.jpg"
            alt="Viking Fuel +Testo-Support i labbmiljö"
            className="aspect-[4/3] rounded-[20px] shadow-ambient"
          />

          <div>
            <Label className="!text-birch/60">Kvalitet &amp; labb</Label>
            <SplitHeading
              lines={['Inget påstående', 'utan ett papper.']}
              className="mt-5 font-display text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] text-birch"
            />

            <div className="mt-10">
              {PROOF.map((p, i) => (
                <div key={p.title}>
                  {i > 0 && (
                    <div className="flex items-center gap-4 py-6">
                      <span className="h-px flex-1 bg-birch/15" />
                      <span className="font-display text-[14px] text-gold">ᛉ</span>
                      <span className="h-px flex-1 bg-birch/15" />
                    </div>
                  )}
                  <div className="flex items-start gap-5">
                    <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-birch/20 text-gold">
                      <p.Icon />
                    </span>
                    <div>
                      <h3 className="font-ui text-[17px] font-semibold text-birch">{p.title}</h3>
                      <p className="mt-1.5 max-w-[34ch] font-ui text-[14px] leading-[1.65] text-birch/60">{p.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
