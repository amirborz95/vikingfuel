// SEO blog content. Original articles targeting what people actually google.

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] };

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  readingMinutes: number;
  keywords: string[];
  body: Block[];
}

export const POSTS: BlogPost[] = [
  {
    slug: 'varfor-trott-pa-eftermiddagen',
    title: 'Varför blir jag trött klockan tre på eftermiddagen?',
    description:
      'Eftermiddagströttheten runt kl. 15 är vanlig — och den går att motverka. Här är orsakerna och vad du kan göra åt den utan att dricka mer kaffe.',
    date: '2026-08-01',
    readingMinutes: 5,
    keywords: ['trött på eftermiddagen', 'eftermiddagströtthet', 'energi klockan tre', 'trött efter lunch'],
    body: [
      { type: 'p', text: 'Känner du igen dig? Runt klockan tre på eftermiddagen sjunker energin, fokuset försvinner och du längtar efter en kopp kaffe till. Du är långt ifrån ensam — eftermiddagsdippen är en av de vanligaste anledningarna till att folk googlar efter energi.' },
      { type: 'h2', text: '1. Din dygnsrytm dippar naturligt' },
      { type: 'p', text: 'Kroppens inre klocka har en naturlig svacka på eftermiddagen, ungefär 6–8 timmar efter att du vaknat. Det är biologiskt normalt — men det förstärks kraftigt av vad du ätit och hur du sovit.' },
      { type: 'h2', text: '2. Lunchen spikar och kraschar ditt blodsocker' },
      { type: 'p', text: 'En lunch full av snabba kolhydrater (vitt bröd, pasta, läsk) ger en blodsockertopp följt av ett fall — och det fallet känns som trötthet. Balansera med protein, fett och fibrer så håller energin jämnare.' },
      { type: 'h2', text: '3. Du är lätt uttorkad' },
      { type: 'p', text: 'Redan mild uttorkning sänker koncentration och energi. Många dricker för lite vatten under förmiddagen och märker det först på eftermiddagen.' },
      { type: 'h2', text: 'Vad du kan göra' },
      { type: 'ul', items: [
        'Ät en balanserad lunch med protein och fibrer, inte bara snabba kolhydrater.',
        'Ta en kort promenad efter lunch — rörelse motverkar dippen bättre än socker.',
        'Drick vatten jämnt över dagen, inte allt på en gång.',
        'Stötta kroppen med naturliga adaptogener som ashwagandha och maca, som traditionellt använts för uthållig energi.',
      ] },
      { type: 'p', text: 'Viking Fuel är utformat just för det här: naturliga ingredienser i rätt dos för jämn energi utan sockerkrasch. Många använder det som ett dagligt komplement för att slippa eftermiddagsdippen.' },
    ],
  },
  {
    slug: 'kosttillskott-energi-utan-koffein',
    title: 'Kosttillskott för energi utan koffein',
    description:
      'Vill du ha mer energi utan att bli pigg-och-krasch av kaffe? Här är naturliga ingredienser som ger uthållig energi utan koffein.',
    date: '2026-08-02',
    readingMinutes: 6,
    keywords: ['kosttillskott energi utan koffein', 'energi utan koffein', 'naturlig energi', 'energitillskott'],
    body: [
      { type: 'p', text: 'Kaffe fungerar — tills det inte gör det. För mycket koffein ger hjärtklappning, orolig sömn och den där kraschen ett par timmar senare. Tur nog finns det naturliga alternativ som stöttar energin på ett jämnare sätt.' },
      { type: 'h2', text: 'Maca' },
      { type: 'p', text: 'En andinsk superrot som traditionellt använts för uthållighet och energi. Till skillnad från koffein ger den ingen skarp topp följt av ett fall.' },
      { type: 'h2', text: 'Ashwagandha' },
      { type: 'p', text: 'En adaptogen ört som hjälper kroppen hantera stress. Mindre stress betyder ofta mer tillgänglig energi och bättre fokus.' },
      { type: 'h2', text: 'Ginseng' },
      { type: 'p', text: 'Klassisk ört för mental klarhet och fokus — populär just för att den stöttar energi utan koffeinets nackdelar.' },
      { type: 'h2', text: 'Zink och selen' },
      { type: 'p', text: 'Essentiella mineraler som spelar roll för normal energiomsättning och för att kroppen ska fungera som den ska.' },
      { type: 'p', text: 'Viking Fuel kombinerar dessa naturliga ingredienser i en och samma kapsel — utan koffein och utan onödiga tillsatser. Ett enkelt sätt att stötta energin varje dag.' },
    ],
  },
  {
    slug: 'naturliga-satt-oka-energi',
    title: 'Naturliga sätt att öka energi och uthållighet',
    description:
      'Mer energi behöver inte betyda mer kaffe. Här är beprövade, naturliga vanor och ingredienser som lyfter din energi och uthållighet.',
    date: '2026-08-03',
    readingMinutes: 5,
    keywords: ['naturliga sätt öka energi', 'öka uthållighet', 'energy boost', 'mer energi naturligt'],
    body: [
      { type: 'p', text: 'Energi handlar inte om en enda quick fix, utan om summan av dina vanor. Här är det som faktiskt gör skillnad — och som du kan börja med idag.' },
      { type: 'h2', text: 'Sömn först' },
      { type: 'p', text: 'Inget tillskott slår bra sömn. Sikta på jämna tider och 7–9 timmar. Det är grunden all annan energi bygger på.' },
      { type: 'h2', text: 'Rör på dig — även lite' },
      { type: 'p', text: 'Paradoxalt nog ger rörelse mer energi. En kort promenad eller några minuters träning ökar blodflödet och lyfter humöret.' },
      { type: 'h2', text: 'Ät för jämn energi' },
      { type: 'p', text: 'Protein, fibrer och nyttiga fetter håller blodsockret stabilt. Undvik att leva på snabba kolhydrater och socker som ger toppar och krascher.' },
      { type: 'h2', text: 'Stötta med naturliga ingredienser' },
      { type: 'ul', items: [
        'Adaptogener (ashwagandha) för stresstålighet',
        'Maca och ginseng för uthållighet och fokus',
        'Zink och selen för normal energiomsättning',
      ] },
      { type: 'p', text: 'Ett dagligt kosttillskott som Viking Fuel gör det enkelt att få i sig dessa i rätt dos — naturligt, tillverkat i EU och utan onödiga tillsatser.' },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
