import React from 'react';

/* ── Icons: 1.5px stroke, one visual language across the whole page ───────── */

const S = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
    {...props}
  />
);

export const Icons = {
  bolt: () => (
    <S>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </S>
  ),
  hormone: () => (
    <S>
      <circle cx="10" cy="14" r="6" />
      <path d="M14.5 9.5 21 3M16 3h5v5" />
    </S>
  ),
  target: () => (
    <S>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
    </S>
  ),
  moon: () => (
    <S>
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z" />
    </S>
  ),
  shield: () => (
    <S>
      <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" />
    </S>
  ),
  leaf: () => (
    <S>
      <path d="M20 4C10 4 4 9 4 17v3M20 4c0 9-5 13-12 13" />
    </S>
  ),
  drop: () => (
    <S>
      <path d="M12 3s6 6.4 6 10a6 6 0 0 1-12 0c0-3.6 6-10 6-10z" />
    </S>
  ),
  sun: () => (
    <S>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </S>
  ),
  mountain: () => (
    <S>
      <path d="m3 19 6-9 4 5.5 2.5-3.5L21 19H3z" />
    </S>
  ),
  seed: () => (
    <S>
      <path d="M12 3c4 3 6 6 6 9a6 6 0 0 1-12 0c0-3 2-6 6-9z" />
      <path d="M12 21V9" />
    </S>
  ),
  truck: () => (
    <S>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </S>
  ),
  lab: () => (
    <S>
      <path d="M9 3v6l-5 9a2 2 0 0 0 1.8 3h12.4A2 2 0 0 0 20 18l-5-9V3M8 3h8" />
    </S>
  ),
};

/* ── Ingredients (orbit + table) ──────────────────────────────────────────
   Doses are placeholders until the approved label copy lands — see the note in
   the handover. x/y are the orbit coordinates in vw/vh from centre.          */

export interface Ingredient {
  name: string;
  note: string;
  dose: string;
  rv: string;
  role: string;
  x: number;
  y: number;
  /** Round macro photo; the icon shows until the photo exists. */
  image: string;
  Icon: () => React.ReactElement;
}

export const INGREDIENTS: Ingredient[] = [
  { name: 'Zink', note: '16 mg · normal testosteronhalt', dose: '16 mg', rv: '160 %', role: 'Bidrar till en normal testosteronhalt i blodet och till normal fertilitet.', x: -30, y: -14, image: '/assets/v2/ing-zink.jpg', Icon: Icons.shield },
  { name: 'Magnesium', note: '150 mg · mindre trötthet', dose: '150 mg', rv: '40 %', role: 'Bidrar till minskad trötthet och utmattning samt normal muskelfunktion.', x: 30, y: -14, image: '/assets/v2/ing-magnesium.jpg', Icon: Icons.mountain },
  { name: 'Vitamin D3', note: '25 µg · muskelfunktion', dose: '25 µg', rv: '500 %', role: 'Bidrar till normal muskelfunktion och ett normalt immunförsvar.', x: 34, y: 12, image: '/assets/v2/ing-vitamin-d3.jpg', Icon: Icons.sun },
  { name: 'Bor', note: '4 mg · spårämne', dose: '4 mg', rv: '—', role: 'Spårämne som ingår i formeln tillsammans med zink och magnesium.', x: 19, y: 27, image: '/assets/v2/ing-bor.jpg', Icon: Icons.drop },
  { name: 'Ashwagandha', note: '320 mg · adaptogen', dose: '320 mg', rv: '—', role: 'Traditionell adaptogen, standardiserat rotextrakt.', x: -19, y: 27, image: '/assets/v2/ing-ashwagandha.jpg', Icon: Icons.leaf },
  { name: 'Bockhornsklöver', note: '160 mg · örtextrakt', dose: '160 mg', rv: '—', role: 'Örtextrakt som länge använts i nordisk och ayurvedisk tradition.', x: -34, y: 12, image: '/assets/v2/ing-bockhornsklover.jpg', Icon: Icons.seed },
];

/* ── Benefits (Act 5) ─────────────────────────────────────────────────────── */

export const BENEFITS = [
  { title: 'Energi', body: 'Magnesium bidrar till minskad trötthet och utmattning — grunden för allt annat.', Icon: Icons.bolt },
  { title: 'Hormonbalans', body: 'Zink bidrar till en normal testosteronhalt i blodet.', Icon: Icons.hormone },
  { title: 'Prestation', body: 'Vitamin D3 och magnesium bidrar till normal muskelfunktion.', Icon: Icons.target },
  { title: 'Återhämtning', body: 'Byggd för att tas varje dag, som en del av sömn, mat och träning.', Icon: Icons.moon },
];

/* ── Steps, packages, reviews, FAQ ───────────────────────────────────────── */

export const STEPS = [
  { n: '01', title: 'Två kapslar varje morgon', body: 'Ta dem med vatten till frukost. Enkelt att komma ihåg, enkelt att hålla.', Icon: Icons.drop },
  { n: '02', title: 'Ge det 30 dagar', body: 'Kroppen svarar över tid. En burk är en full kur.', Icon: Icons.moon },
  { n: '03', title: 'Håll rutinen', body: 'Bäst tillsammans med sömn, mat och träning som fungerar.', Icon: Icons.target },
];

export const PACKAGES = [
  {
    id: '1',
    name: '1 burk',
    caps: '60 kapslar',
    price: 349,
    old: 0,
    per: '349 kr per burk',
    tag: 'Prova i en månad',
    image: '/assets/images/viking-energy-1e.png',
    href: '/testo-support',
    bullets: ['En månads kur', 'Fri retur i 14 dagar', 'Skickas 1–3 dagar'],
    featured: false,
  },
  {
    id: '3',
    name: '3 burkar',
    caps: '180 kapslar',
    price: 942,
    old: 1047,
    per: '314 kr per burk',
    tag: 'Mest valda',
    image: '/assets/images/viking-energy-3e.png',
    href: '/testo-support-3-pack',
    bullets: ['Tre månaders kur', '10 % rabatt', 'Fri frakt'],
    featured: true,
  },
  {
    id: '6',
    name: '6 burkar',
    caps: '360 kapslar',
    price: 1674,
    old: 2094,
    per: '279 kr per burk',
    tag: 'Bästa pris per burk',
    image: '/assets/images/viking-energy-6e.png',
    href: '/testo-support-6-pack',
    bullets: ['Ett halvårs kur', '20 % rabatt', 'Fri frakt'],
    featured: false,
  },
];

export const FAQ = [
  { q: 'När märker jag effekt?', a: 'De flesta ger det en hel burk — 30 dagar. Zink, magnesium och D-vitamin bygger upp sin effekt över tid, inte på en enskild dos.' },
  { q: 'Hur många kapslar per dag?', a: 'Två kapslar dagligen, gärna på morgonen med vatten och mat. Överskrid inte rekommenderad dos.' },
  { q: 'Kan jag ta det med annan träningskost?', a: 'Ja. Kontrollera bara att du inte får i dig zink eller D-vitamin från flera tillskott samtidigt.' },
  { q: 'Är produkten vegansk?', a: 'Ja — vegansk kapsel, inga animaliska ingredienser.' },
  { q: 'Hur snabbt levererar ni?', a: 'Vi skickar från Sverige med PostNord, normalt 1–3 arbetsdagar. Fri frakt över 649 kr.' },
  { q: 'Vad gäller vid retur?', a: '14 dagars öppet köp på obruten förpackning. Hör av dig till info@vikingfuel.se så löser vi det.' },
];

export const REVIEWS = [
  { name: 'Marcus', text: 'Tredje månaden nu. Jag orkar mer på eftermiddagarna, vilket var hela anledningen till att jag testade.', rot: -1.4 },
  { name: 'Johan', text: 'Bra innehåll och inga konstiga tillsatser. Det var det jag letade efter.', rot: 1.1 },
  { name: 'Erik', text: 'Enkelt att hålla rutinen — två kapslar på morgonen, klart. Levererades på två dagar.', rot: -0.7 },
  { name: 'Anders', text: 'Skeptisk först. Efter en burk märkte jag skillnad i träningen och på sömnen.', rot: 1.5 },
  { name: 'Fredrik', text: 'Beställde 3-pack direkt andra gången. Priset per burk blir rimligt då.', rot: -1.2 },
  { name: 'Oskar', text: 'Uppskattar att doserna står öppet på burken. Slipper gissa vad jag får i mig.', rot: 0.8 },
];
