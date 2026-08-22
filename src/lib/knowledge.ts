// Knowledge base — SEO Q&A pages targeting what people actually search for around
// energy, fatigue, testosterone, adaptogens and supplements. Each page is genuine,
// useful content (not a thin doorway page) with an honest CTA toward Viking Fuel.
// Health language is deliberately measured and compliant (EU health claims only).

import type { Block } from './blog';

export interface KnowledgeArticle {
  slug: string;
  category: string; // CATEGORIES key
  title: string; // H1 / display question
  metaTitle?: string; // optional SEO title override
  metaDescription: string;
  keywords: string[];
  readingMinutes: number;
  body: Block[];
  faq?: { q: string; a: string }[];
  related?: string[]; // slugs
}

export interface KnowledgeCategory {
  key: string;
  label: string;
  description: string;
}

export const CATEGORIES: KnowledgeCategory[] = [
  { key: 'energi', label: 'Energi & trötthet', description: 'Varför du blir trött och hur du får naturlig, uthållig energi.' },
  { key: 'testosteron', label: 'Testosteron & hormoner', description: 'Vad testosteron är och hur du stöttar en normal nivå naturligt.' },
  { key: 'ingredienser', label: 'Ingredienser & adaptogener', description: 'Maca, ashwagandha, ginseng och zink — vad de är och gör.' },
  { key: 'prestation', label: 'Fokus & prestation', description: 'Mental skärpa, träning och uthållighet i vardagen.' },
  { key: 'kosttillskott', label: 'Kosttillskott', description: 'Hur du väljer tillskott som faktiskt fungerar och är säkra.' },
  { key: 'vikingfuel', label: 'Om Viking Fuel', description: 'Vad Viking Fuel är, innehåller och hur du använder det.' },
];

const CTA_HANDLA = 'Viking Fuel kombinerar beprövade adaptogener med zink som bidrar till en normal testosteronhalt — utan onödiga tillsatser, tillverkat i EU.';

export const ARTICLES: KnowledgeArticle[] = [
  // ── ENERGI ──────────────────────────────────────────────────────────────
  {
    slug: 'vad-ger-energi-naturligt',
    category: 'energi',
    title: 'Vad ger energi naturligt?',
    metaDescription: 'Naturlig energi handlar om sömn, mat, rörelse och rätt näring — inte bara kaffe. Här är vad som faktiskt ger uthållig energi.',
    keywords: ['vad ger energi', 'naturlig energi', 'få mer energi', 'energi naturligt', 'uthållig energi'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'Energi är inte en enda sak — det är resultatet av hur väl du sover, äter, rör dig och återhämtar dig. Vill du ha mer energi som håller hela dagen behöver du jobba med grunderna först, och sedan stötta kroppen med rätt näring.' },
      { type: 'h2', text: 'Sömn är den viktigaste faktorn' },
      { type: 'p', text: 'Ingen mängd kaffe eller kosttillskott ersätter sömn. Sikta på 7–9 timmar med jämna tider. Redan en natts dålig sömn sänker fokus, humör och fysisk energi märkbart.' },
      { type: 'h2', text: 'Ät för jämnt blodsocker' },
      { type: 'p', text: 'Snabba kolhydrater ger en topp följt av en krasch. Bygg måltider kring protein, fibrer och nyttigt fett så håller energin jämnare — särskilt viktigt vid lunch för att slippa eftermiddagsdippen.' },
      { type: 'h2', text: 'Rörelse skapar energi' },
      { type: 'p', text: 'Det låter bakvänt, men fysisk aktivitet ger mer energi än den tar. En kort promenad höjer cirkulationen och vakenheten bättre än en till kaffe.' },
      { type: 'h2', text: 'Näring som stöttar energiomsättningen' },
      { type: 'p', text: 'Vissa mineraler och växtextrakt spelar roll för hur kroppen frigör energi. Adaptogener som maca, ashwagandha och ginseng har traditionellt använts för uthållighet, och mineraler som zink och selen bidrar till en normal ämnesomsättning.' },
    ],
    faq: [
      { q: 'Vad ger snabbast energi?', a: 'Kortsiktigt: vatten, dagsljus och rörelse. Långsiktigt och mest hållbart: sömn, jämnt blodsocker och regelbunden träning.' },
      { q: 'Hjälper kosttillskott mot trötthet?', a: 'Tillskott ersätter inte sömn och kost, men rätt näring kan stötta energiomsättningen. Adaptogener och zink används ofta för uthållig energi.' },
    ],
    related: ['energi-utan-koffein', 'varfor-alltid-trott', 'naturlig-energiboost'],
  },
  {
    slug: 'energi-utan-koffein',
    category: 'energi',
    title: 'Hur får man energi utan koffein?',
    metaDescription: 'Vill du ha energi utan kaffe eller energidryck? Så håller du dig pigg och fokuserad utan koffein — och slipper kraschen.',
    keywords: ['energi utan koffein', 'pigg utan kaffe', 'energi utan kaffe', 'kosttillskott utan koffein', 'alternativ till kaffe'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'Koffein fungerar — men det lånar energi från framtiden. Efter toppen kommer ofta en krasch, och för mycket koffein stör sömnen, vilket gör dig ännu tröttare dagen efter. Tur nog finns det gott om sätt att hålla sig pigg utan.' },
      { type: 'h2', text: 'Ljus och rörelse' },
      { type: 'p', text: 'Dagsljus tidigt på dagen ställer din dygnsrytm rätt. Kombinera med korta pauser där du rör på dig — det höjer vakenheten direkt utan koffeinets baksidor.' },
      { type: 'h2', text: 'Vatten och mat' },
      { type: 'p', text: 'Mild uttorkning känns som trötthet. Drick jämnt över dagen. Ät proteinrikt och undvik stora snabba-kolhydrat-måltider som spikar och kraschar blodsockret.' },
      { type: 'h2', text: 'Adaptogener istället för stimulantia' },
      { type: 'p', text: 'Till skillnad från koffein piskar adaptogener inte upp systemet — de har traditionellt använts för att hjälpa kroppen hantera stress och behålla jämn energi. Maca, ashwagandha och ginseng är de mest kända.' },
    ],
    faq: [
      { q: 'Finns det koffeinfria tillskott för energi?', a: 'Ja. Tillskott baserade på adaptogener (maca, ashwagandha, ginseng) och mineraler som zink innehåller inget koffein men stöttar naturlig energi och uthållighet.' },
      { q: 'Varför kraschar jag efter kaffe?', a: 'Koffein blockerar tröttheten tillfälligt. När effekten avtar kommer den uppdämda tröttheten tillbaka, ofta förstärkt av blodsockersvängningar.' },
    ],
    related: ['vad-ger-energi-naturligt', 'naturlig-energiboost', 'vad-ar-adaptogener'],
  },
  {
    slug: 'varfor-alltid-trott',
    category: 'energi',
    title: 'Varför är jag alltid trött?',
    metaDescription: 'Ständigt trött trots att du sover? Här är de vanligaste orsakerna till kronisk trötthet och vad du kan göra åt dem.',
    keywords: ['alltid trött', 'ständigt trött', 'orkeslös', 'trött hela tiden', 'kronisk trötthet'],
    readingMinutes: 5,
    body: [
      { type: 'p', text: 'Att känna sig trött ibland är normalt. Att vara trött hela tiden är en signal att något i vardagen behöver justeras. Här är de vanligaste orsakerna — de flesta går att påverka själv.' },
      { type: 'h2', text: 'Sömn av dålig kvalitet' },
      { type: 'p', text: 'Du kanske ligger 8 timmar men sover ytligt. Skärmar sent, oregelbundna tider och stress försämrar den djupa sömnen som ger återhämtning.' },
      { type: 'h2', text: 'Stress och för lite återhämtning' },
      { type: 'p', text: 'Långvarig stress håller kroppen i högvarv och tömmer energin. Utan riktiga pauser bränner du ut batteriet snabbare än det laddas.' },
      { type: 'h2', text: 'Näringsbrister' },
      { type: 'p', text: 'Brist på järn, D-vitamin, B12 eller zink är en vanlig och ofta förbisedd orsak till trötthet. En allsidig kost och vid behov rätt tillskott gör skillnad.' },
      { type: 'h2', text: 'När ska du söka vård?' },
      { type: 'p', text: 'Om tröttheten är kraftig, plötslig eller inte förbättras trots bra sömn och kost — prata med en läkare för att utesluta bakomliggande orsaker.' },
    ],
    faq: [
      { q: 'Kan brist på vitaminer göra mig trött?', a: 'Ja, brist på bland annat järn, B12, D-vitamin och zink är vanliga orsaker till trötthet. Testa med läkare vid ihållande besvär.' },
      { q: 'Hjälper adaptogener mot trötthet?', a: 'Adaptogener som ashwagandha har traditionellt använts för att hjälpa kroppen hantera stress och behålla uthållig energi, men de ersätter inte sömn och kost.' },
    ],
    related: ['vad-ger-energi-naturligt', 'energi-utan-koffein', 'tecken-pa-lagt-testosteron'],
  },
  {
    slug: 'naturlig-energiboost',
    category: 'energi',
    title: 'Naturlig energiboost — vad fungerar?',
    metaDescription: 'Vill du ha en energiboost utan krasch? Här är de naturliga metoderna och ingredienserna som faktiskt ger uthållig energi.',
    keywords: ['energiboost', 'naturlig energiboost', 'boost energi', 'energitillskott', 'high energy'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'En riktig energiboost handlar inte om att piska upp systemet i tio minuter, utan om att höja din basnivå så att du orkar mer hela dagen. Det gör du med en kombination av vanor och rätt näring.' },
      { type: 'h2', text: 'Snabba boostar (här och nu)' },
      { type: 'ul', items: [
        'Dricka ett stort glas vatten.',
        'Gå ut i dagsljus i några minuter.',
        'En kort promenad eller några minuters rörelse.',
        'Djupandas — mer syre, mer vakenhet.',
      ] },
      { type: 'h2', text: 'Uthållig energi (över tid)' },
      { type: 'p', text: 'Regelbunden sömn, träning och jämnt blodsocker bygger en högre basnivå. Här kommer också näringen in: adaptogener och mineraler som stöttar kroppens egen energiomsättning.' },
      { type: 'h2', text: 'Ingredienser att titta efter' },
      { type: 'p', text: 'Maca (traditionellt för uthållighet), ashwagandha (för stresshantering), ginseng (för vakenhet och fokus) samt zink och selen som bidrar till en normal ämnesomsättning.' },
    ],
    faq: [
      { q: 'Vad är en naturlig energiboost?', a: 'Metoder och näring som höjer din energi utan stimulantia och krasch — sömn, rörelse, jämn kost och adaptogena växtextrakt.' },
    ],
    related: ['vad-ger-energi-naturligt', 'energi-utan-koffein', 'vad-innehaller-viking-fuel'],
  },

  // ── TESTOSTERON ─────────────────────────────────────────────────────────
  {
    slug: 'vad-ar-testosteron',
    category: 'testosteron',
    title: 'Vad är testosteron?',
    metaDescription: 'Testosteron är kroppens viktigaste könshormon för män — men vad gör det egentligen? Här är en enkel förklaring av testosteronets roll.',
    keywords: ['vad är testosteron', 'testosteron', 'testosteronets funktion', 'könshormon', 'what is testosterone'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'Testosteron är det viktigaste manliga könshormonet. Det bildas främst i testiklarna (och i mindre mängd hos kvinnor) och påverkar långt mer än man kanske tror — energi, humör, muskler, libido och benhälsa.' },
      { type: 'h2', text: 'Vad gör testosteron i kroppen?' },
      { type: 'ul', items: [
        'Bygger och underhåller muskelmassa och styrka.',
        'Påverkar energi, motivation och humör.',
        'Reglerar libido och sexuell funktion.',
        'Bidrar till benhälsa och röd blodkroppsbildning.',
      ] },
      { type: 'h2', text: 'Hur förändras nivån?' },
      { type: 'p', text: 'Testosteronet är som högst i tidiga vuxenår och sjunker gradvis med åldern, ofta från 30-årsåldern. Sömn, stress, vikt och kost påverkar nivån mer än många tror.' },
      { type: 'h2', text: 'Kan man stötta en normal nivå?' },
      { type: 'p', text: 'Ja — genom livsstil (styrketräning, sömn, hälsosam vikt) och näring. Zink är ett mineral som bidrar till en normal testosteronhalt i blodet, vilket är en av anledningarna att det ofta ingår i tillskott för män.' },
    ],
    faq: [
      { q: 'Vad är testosteron enkelt förklarat?', a: 'Det viktigaste manliga könshormonet, som påverkar muskler, energi, humör och libido.' },
      { q: 'Vilket mineral är viktigt för testosteron?', a: 'Zink bidrar till en normal testosteronhalt i blodet — en godkänd hälsopåstående inom EU.' },
    ],
    related: ['naturligt-oka-testosteron', 'zink-och-testosteron', 'tecken-pa-lagt-testosteron'],
  },
  {
    slug: 'naturligt-oka-testosteron',
    category: 'testosteron',
    title: 'Kan man öka testosteron naturligt?',
    metaDescription: 'Så stöttar du en normal testosteronnivå naturligt — genom sömn, träning, vikt, kost och rätt näring som zink.',
    keywords: ['öka testosteron naturligt', 'höja testosteron', 'naturligt testosteron', 'testo boost', 'testosteron kost'],
    readingMinutes: 5,
    body: [
      { type: 'p', text: 'Du kan inte trolla fram testosteron, men du kan skapa de bästa förutsättningarna för att kroppen ska hålla en normal nivå. Det handlar om fyra saker: sömn, träning, vikt och näring.' },
      { type: 'h2', text: '1. Prioritera sömnen' },
      { type: 'p', text: 'Testosteron bildas till stor del under sömnen. Kort och dålig sömn sänker nivån snabbt — detta är en av de mest underskattade faktorerna.' },
      { type: 'h2', text: '2. Styrketräna' },
      { type: 'p', text: 'Tunga, sammansatta lyft (knäböj, marklyft) och regelbunden styrketräning stöttar en normal hormonbalans bättre än enbart konditionsträning.' },
      { type: 'h2', text: '3. Håll en hälsosam vikt' },
      { type: 'p', text: 'Övervikt, särskilt runt magen, är kopplat till lägre testosteron. Att gå ner i vikt om du bär på extra kilon kan göra stor skillnad.' },
      { type: 'h2', text: '4. Näring: zink och mer' },
      { type: 'p', text: 'Zink bidrar till en normal testosteronhalt i blodet. Adaptogener som ashwagandha och maca har traditionellt använts av män för energi och vitalitet. Ett tillskott kan komplettera kosten men ersätter aldrig grunderna.' },
    ],
    faq: [
      { q: 'Går det verkligen att öka testosteron naturligt?', a: 'Du kan stötta en normal nivå genom sömn, styrketräning, hälsosam vikt och rätt näring som zink. Vid misstänkt låg nivå — testa hos läkare.' },
      { q: 'Vilka örter används för testosteron?', a: 'Ashwagandha, maca och ginseng används traditionellt för manlig vitalitet, ofta i kombination med zink.' },
    ],
    related: ['vad-ar-testosteron', 'zink-och-testosteron', 'vad-ar-ashwagandha'],
  },
  {
    slug: 'zink-och-testosteron',
    category: 'testosteron',
    title: 'Zink och testosteron — vad är kopplingen?',
    metaDescription: 'Zink bidrar till en normal testosteronhalt i blodet. Så fungerar zink, hur mycket du behöver och var du hittar det.',
    keywords: ['zink testosteron', 'zink och testosteron', 'zink för män', 'zinkbrist', 'zink kosttillskott'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'Zink är ett av få näringsämnen med ett EU-godkänt hälsopåstående kopplat till testosteron: zink bidrar till att bibehålla en normal testosteronhalt i blodet. Det gör mineralet särskilt intressant för män.' },
      { type: 'h2', text: 'Vad gör zink mer?' },
      { type: 'ul', items: [
        'Bidrar till normal testosteronhalt i blodet.',
        'Bidrar till normal fertilitet och reproduktion.',
        'Bidrar till immunförsvarets normala funktion.',
        'Bidrar till normal ämnesomsättning av makronäringsämnen.',
      ] },
      { type: 'h2', text: 'Får de flesta i sig tillräckligt?' },
      { type: 'p', text: 'Zink finns i kött, skaldjur, frön och baljväxter. Många får i sig tillräckligt, men idrottare, veganer och personer med ensidig kost kan ligga lågt — då kan ett tillskott vara motiverat.' },
      { type: 'h2', text: 'Hur mycket zink?' },
      { type: 'p', text: 'Rekommenderat dagligt intag ligger runt 10 mg för vuxna. Överdriv inte — mycket höga doser under lång tid kan störa upptaget av andra mineraler.' },
    ],
    faq: [
      { q: 'Höjer zink testosteron?', a: 'Zink bidrar till att bibehålla en normal testosteronhalt. Har du zinkbrist kan det påverka nivån; har du redan tillräckligt ger extra zink ingen ytterligare höjning.' },
    ],
    related: ['vad-ar-testosteron', 'naturligt-oka-testosteron', 'vad-innehaller-viking-fuel'],
  },
  {
    slug: 'tecken-pa-lagt-testosteron',
    category: 'testosteron',
    title: 'Vilka är tecknen på lågt testosteron?',
    metaDescription: 'Trötthet, låg motivation och sämre återhämtning kan vara tecken på lågt testosteron. Här är signalerna att känna till.',
    keywords: ['lågt testosteron', 'tecken lågt testosteron', 'symptom lågt testosteron', 'testosteronbrist', 'trött låg energi'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'Testosteron sjunker naturligt med åldern, men en riktigt låg nivå kan ge tydliga symptom. Notera att många av dessa också kan bero på annat — som stress eller dålig sömn.' },
      { type: 'h2', text: 'Vanliga tecken' },
      { type: 'ul', items: [
        'Ihållande trötthet och låg energi.',
        'Minskad motivation och sämre humör.',
        'Lägre libido.',
        'Svårare att bygga muskler och sämre återhämtning.',
        'Ökad kroppsfett, särskilt runt magen.',
      ] },
      { type: 'h2', text: 'Vad kan du göra?' },
      { type: 'p', text: 'Börja med grunderna: sömn, styrketräning, hälsosam vikt och en näringsrik kost med tillräckligt av zink. Misstänker du kraftigt låg nivå — ta ett blodprov via läkare.' },
      { type: 'h2', text: 'Kan tillskott hjälpa?' },
      { type: 'p', text: 'Tillskott botar inte medicinskt låga nivåer, men zink stöttar en normal testosteronhalt och adaptogener kan bidra till energi och vitalitet som en del av en hälsosam livsstil.' },
    ],
    faq: [
      { q: 'Hur vet jag om jag har lågt testosteron?', a: 'Säkraste sättet är ett blodprov via läkare. Symptom som trötthet, låg libido och sämre återhämtning kan vara tecken, men beror ofta på flera faktorer.' },
    ],
    related: ['vad-ar-testosteron', 'naturligt-oka-testosteron', 'varfor-alltid-trott'],
  },

  // ── INGREDIENSER ────────────────────────────────────────────────────────
  {
    slug: 'vad-ar-ashwagandha',
    category: 'ingredienser',
    title: 'Vad är ashwagandha?',
    metaDescription: 'Ashwagandha är en av världens mest använda adaptogener. Här är vad örten är, hur den använts och vad forskningen tittar på.',
    keywords: ['vad är ashwagandha', 'ashwagandha', 'ashwagandha effekt', 'adaptogen', 'ashwagandha kosttillskott'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'Ashwagandha (Withania somnifera) är en ört som använts i tusentals år inom indisk ayurveda. Den räknas som en adaptogen — en växt som traditionellt sägs hjälpa kroppen att anpassa sig till stress.' },
      { type: 'h2', text: 'Varför är den populär?' },
      { type: 'p', text: 'Ashwagandha har traditionellt använts för att stötta lugn, uthållighet och återhämtning. Den är idag en av de mest studerade adaptogenerna och ingår ofta i tillskott för energi och stresshantering.' },
      { type: 'h2', text: 'Vad tittar forskningen på?' },
      { type: 'p', text: 'Studier har undersökt ashwagandha i samband med upplevd stress, sömn, återhämtning och fysisk prestation. Forskningen pågår, och effekterna kan variera mellan individer.' },
      { type: 'h2', text: 'Hur används den?' },
      { type: 'p', text: 'Vanligen som standardiserat extrakt i kapselform, ofta i kombination med andra adaptogener och mineraler. Följ doseringen på förpackningen.' },
    ],
    faq: [
      { q: 'Vad används ashwagandha för?', a: 'Traditionellt för att stötta stresshantering, lugn, uthållighet och återhämtning. Den är en klassisk adaptogen.' },
    ],
    related: ['vad-ar-adaptogener', 'vad-ar-maca', 'vad-innehaller-viking-fuel'],
  },
  {
    slug: 'vad-ar-maca',
    category: 'ingredienser',
    title: 'Vad är maca?',
    metaDescription: 'Maca är en rotfrukt från Anderna som använts i århundraden för energi och vitalitet. Här är vad maca är och hur den används.',
    keywords: ['vad är maca', 'maca', 'macarot', 'maca effekt', 'maca energi'],
    readingMinutes: 3,
    body: [
      { type: 'p', text: 'Maca (Lepidium meyenii) är en rotfrukt som växer högt uppe i Anderna i Peru. Den har använts av lokalbefolkningen i århundraden som mat och för att stötta energi och uthållighet i det tuffa höghöjdsklimatet.' },
      { type: 'h2', text: 'Varför används maca?' },
      { type: 'p', text: 'Maca är näringsrik och innehåller kolhydrater, protein, fibrer och mineraler. Traditionellt har den använts för energi, uthållighet och vitalitet, och den är populär i tillskott riktade mot både energi och libido.' },
      { type: 'h2', text: 'Hur tas maca?' },
      { type: 'p', text: 'Ofta som torkat pulver eller standardiserat extrakt i kapslar. I tillskott kombineras maca gärna med andra adaptogener som ashwagandha och ginseng.' },
    ],
    faq: [
      { q: 'Vad är maca bra för?', a: 'Maca används traditionellt för energi, uthållighet och vitalitet. Den är näringsrik och räknas som en adaptogen.' },
    ],
    related: ['vad-ar-ashwagandha', 'vad-ar-ginseng', 'naturlig-energiboost'],
  },
  {
    slug: 'vad-ar-ginseng',
    category: 'ingredienser',
    title: 'Vad är ginseng?',
    metaDescription: 'Ginseng är en klassisk ört för vakenhet och fokus. Här är vad ginseng är, skillnaden mellan sorterna och hur den används.',
    keywords: ['vad är ginseng', 'ginseng', 'panax ginseng', 'ginseng effekt', 'ginseng fokus'],
    readingMinutes: 3,
    body: [
      { type: 'p', text: 'Ginseng är en av de mest kända örterna inom traditionell medicin, särskilt i Asien. Den vanligaste sorten i tillskott är Panax ginseng (koreansk/asiatisk ginseng).' },
      { type: 'h2', text: 'Vad används ginseng för?' },
      { type: 'p', text: 'Ginseng har traditionellt använts för att stötta vakenhet, fokus och fysisk uthållighet. Den räknas som en adaptogen och ingår ofta i formler för energi och mental skärpa.' },
      { type: 'h2', text: 'Panax ginseng vs. andra sorter' },
      { type: 'p', text: 'Panax ginseng är den "äkta" ginsengen och den mest studerade. Sibirisk ginseng (eleuthero) är en annan växt med liknande traditionell användning men annorlunda innehåll.' },
    ],
    faq: [
      { q: 'Vad gör ginseng?', a: 'Ginseng används traditionellt för vakenhet, fokus och uthållighet. Panax ginseng är den mest kända och studerade sorten.' },
    ],
    related: ['vad-ar-adaptogener', 'vad-ar-maca', 'mental-skarpa'],
  },
  {
    slug: 'vad-ar-adaptogener',
    category: 'ingredienser',
    title: 'Vad är adaptogener?',
    metaDescription: 'Adaptogener är växter som traditionellt sägs hjälpa kroppen hantera stress. Här är vad de är och vilka som är mest kända.',
    keywords: ['vad är adaptogener', 'adaptogener', 'adaptogen', 'adaptogena örter', 'stress örter'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'Adaptogener är en grupp växter som traditionellt sägs hjälpa kroppen att "adaptera" — att bättre hantera fysisk och mental stress och behålla balans. Begreppet myntades av forskare på 1900-talet.' },
      { type: 'h2', text: 'De mest kända adaptogenerna' },
      { type: 'ul', items: [
        'Ashwagandha — för lugn, återhämtning och uthållighet.',
        'Maca — för energi och vitalitet.',
        'Ginseng — för vakenhet och fokus.',
        'Rhodiola — för mental uthållighet vid stress.',
      ] },
      { type: 'h2', text: 'Hur skiljer de sig från stimulantia?' },
      { type: 'p', text: 'Koffein och andra stimulantia piskar upp systemet och kan ge en krasch. Adaptogener verkar mer stödjande över tid, utan den skarpa toppen och dalen.' },
      { type: 'h2', text: 'Fungerar de?' },
      { type: 'p', text: 'Många upplever nytta, och forskningen på enskilda adaptogener växer. Effekterna varierar mellan individer, och de fungerar bäst som komplement till bra sömn, kost och träning.' },
    ],
    faq: [
      { q: 'Vad betyder adaptogen?', a: 'En växt som traditionellt sägs hjälpa kroppen anpassa sig till och hantera stress, utan att piska upp systemet som stimulantia.' },
    ],
    related: ['vad-ar-ashwagandha', 'vad-ar-maca', 'vad-ar-ginseng'],
  },

  // ── PRESTATION ──────────────────────────────────────────────────────────
  {
    slug: 'battre-fokus-naturligt',
    category: 'prestation',
    title: 'Hur förbättrar man fokus naturligt?',
    metaDescription: 'Bättre fokus utan att bara dricka mer kaffe. Här är beprövade sätt att skärpa koncentrationen naturligt.',
    keywords: ['bättre fokus', 'förbättra fokus', 'koncentration', 'fokus naturligt', 'mental skärpa'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'Fokus är en färskvara — det påverkas av sömn, miljö, näring och hur du strukturerar dagen. Här är de mest effektiva sätten att skärpa koncentrationen utan biverkningar.' },
      { type: 'h2', text: 'Ta bort distraktioner' },
      { type: 'p', text: 'Notifikationer är fokusets största fiende. Jobba i block på 25–50 minuter med telefonen utom räckhåll, och ta korta pauser mellan.' },
      { type: 'h2', text: 'Sömn och rörelse' },
      { type: 'p', text: 'Trötthet gör fokus nästan omöjligt. Sömn är grunden, och en kort promenad mitt på dagen laddar om hjärnan bättre än en kaffe.' },
      { type: 'h2', text: 'Näring för hjärnan' },
      { type: 'p', text: 'Jämnt blodsocker håller fokus stabilt. Ginseng har traditionellt använts för vakenhet och mental skärpa, och ingår ofta i tillskott riktade mot fokus och prestation.' },
    ],
    faq: [
      { q: 'Vad ger bättre fokus utan kaffe?', a: 'Sömn, borttagna distraktioner, rörelse och jämnt blodsocker. Adaptogener som ginseng används traditionellt för vakenhet och skärpa.' },
    ],
    related: ['mental-skarpa', 'energi-utan-koffein', 'vad-ar-ginseng'],
  },
  {
    slug: 'kosttillskott-for-traning',
    category: 'prestation',
    title: 'Vilka kosttillskott är bra för träning?',
    metaDescription: 'Vill du prestera bättre på gymmet? Här är de kosttillskott som har stöd — och de som mest är hype.',
    keywords: ['kosttillskott träning', 'tillskott gym', 'prestation träning', 'uthållighet tillskott', 'återhämtning'],
    readingMinutes: 5,
    body: [
      { type: 'p', text: 'Inget tillskott ersätter bra träning, mat och sömn — men vissa har genuint stöd. Här är en ärlig genomgång av vad som är värt att titta på.' },
      { type: 'h2', text: 'Grunden: protein och kreatin' },
      { type: 'p', text: 'Tillräckligt med protein stöttar muskeluppbyggnad, och kreatin är ett av de mest välstuderade tillskotten för styrka och prestation.' },
      { type: 'h2', text: 'Mineraler som ofta glöms' },
      { type: 'p', text: 'Zink och magnesium är viktiga för muskelfunktion och återhämtning, och zink bidrar dessutom till en normal testosteronhalt — relevant för den som tränar tungt.' },
      { type: 'h2', text: 'Adaptogener för uthållighet' },
      { type: 'p', text: 'Maca, ashwagandha och ginseng har traditionellt använts för energi och uthållighet, och studeras i samband med fysisk prestation och återhämtning.' },
      { type: 'h2', text: 'Vad du kan hoppa över' },
      { type: 'p', text: 'Överdrivet dyra "fettförbrännare" och produkter med långa listor av verkningslösa ingredienser. Enkelt, rent och beprövat vinner.' },
    ],
    faq: [
      { q: 'Behöver jag kosttillskott för att träna?', a: 'Nej — mat, sömn och träning är grunden. Men protein, kreatin och mineraler som zink kan komplettera för den som tränar seriöst.' },
    ],
    related: ['zink-och-testosteron', 'vad-ar-maca', 'battre-fokus-naturligt'],
  },
  {
    slug: 'mental-skarpa',
    category: 'prestation',
    title: 'Hur får man mental skärpa och energi hela dagen?',
    metaDescription: 'Mental skärpa handlar om energi till hjärnan. Så håller du dig fokuserad och alert från morgon till kväll.',
    keywords: ['mental skärpa', 'mental energi', 'skärpa hela dagen', 'hjärnkraft', 'alert och fokuserad'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'Mental skärpa är i grunden energi till hjärnan — och den påverkas av samma saker som kroppslig energi: sömn, blodsocker, hydrering och stresshantering.' },
      { type: 'h2', text: 'Jämn energi = jämn skärpa' },
      { type: 'p', text: 'Blodsockersvängningar ger toppar och dalar i fokus. Ät balanserat, drick vatten och undvik att hoppa över måltider.' },
      { type: 'h2', text: 'Stress dränerar hjärnan' },
      { type: 'p', text: 'Långvarig stress gör det svårare att tänka klart. Adaptogener som ashwagandha och ginseng har traditionellt använts för att stötta lugn, vakenhet och mental uthållighet.' },
      { type: 'h2', text: 'Bygg rutiner' },
      { type: 'p', text: 'Fasta tider för sömn, mat och pauser gör att hjärnan slipper gissa — och kan lägga energin på det som faktiskt kräver skärpa.' },
    ],
    related: ['battre-fokus-naturligt', 'naturlig-energiboost', 'vad-ar-adaptogener'],
  },

  // ── KOSTTILLSKOTT ───────────────────────────────────────────────────────
  {
    slug: 'kosttillskott-som-fungerar',
    category: 'kosttillskott',
    title: 'Vilka kosttillskott fungerar egentligen?',
    metaDescription: 'Marknaden svämmar över av tillskott. Här är hur du skiljer det som fungerar från hype — och hur du väljer klokt.',
    keywords: ['kosttillskott som fungerar', 'bästa kosttillskott', 'fungerar kosttillskott', 'välja kosttillskott', 'tillskott hype'],
    readingMinutes: 5,
    body: [
      { type: 'p', text: 'De flesta behöver inte en hel hylla med burkar. Nyckeln är att välja få, rena produkter med ingredienser som faktiskt har stöd — och att ha realistiska förväntningar.' },
      { type: 'h2', text: 'Tecken på ett bra tillskott' },
      { type: 'ul', items: [
        'Transparent innehållsförteckning med tydliga doser.',
        'Ingredienser med forskningsstöd eller etablerad traditionell användning.',
        'Tillverkat enligt GMP-standard.',
        'Inga onödiga fyllnadsmedel eller överdrivna påståenden.',
      ] },
      { type: 'h2', text: 'Var realistisk' },
      { type: 'p', text: 'Tillskott är just tillskott — de kompletterar en bra livsstil, inte ersätter den. Ett tillskott som lovar mirakel över en natt är en varningssignal.' },
      { type: 'h2', text: 'Färre men bättre' },
      { type: 'p', text: 'En genomtänkt formel med några få beprövade ingredienser (t.ex. adaptogener + zink) är oftast bättre än tio olika burkar.' },
    ],
    faq: [
      { q: 'Hur vet jag om ett kosttillskott är bra?', a: 'Titta efter transparent innehåll, tydliga doser, GMP-tillverkning och ingredienser med stöd. Var skeptisk mot mirakelpåståenden.' },
    ],
    related: ['gmp-certifierat', 'kosttillskott-for-traning', 'varfor-viking-fuel'],
  },
  {
    slug: 'gmp-certifierat',
    category: 'kosttillskott',
    title: 'Vad betyder GMP-certifierat?',
    metaDescription: 'GMP-certifierat är en kvalitetsstämpel för tillverkning. Här är vad det betyder och varför det är viktigt för kosttillskott.',
    keywords: ['gmp certifierat', 'vad betyder gmp', 'gmp kosttillskott', 'kvalitet kosttillskott', 'tillverkning tillskott'],
    readingMinutes: 3,
    body: [
      { type: 'p', text: 'GMP står för Good Manufacturing Practice — god tillverkningssed. Det är ett regelverk som säkerställer att en produkt tillverkas på ett kontrollerat, hygieniskt och spårbart sätt.' },
      { type: 'h2', text: 'Vad garanterar GMP?' },
      { type: 'ul', items: [
        'Kontrollerade och rena tillverkningsprocesser.',
        'Spårbarhet från råvara till färdig produkt.',
        'Att innehållet stämmer med det som står på etiketten.',
        'Dokumentation och kvalitetskontroll i varje steg.',
      ] },
      { type: 'h2', text: 'Varför är det viktigt?' },
      { type: 'p', text: 'För kosttillskott, som du tar in i kroppen dagligen, är tillverkningskvaliteten avgörande. GMP-certifiering ger en trygghet att produkten är det den utger sig för att vara.' },
    ],
    faq: [
      { q: 'Är GMP ett krav?', a: 'GMP är en erkänd standard för god tillverkning. Seriösa tillverkare av kosttillskott följer den för att garantera kvalitet och säkerhet.' },
    ],
    related: ['kosttillskott-som-fungerar', 'varfor-viking-fuel', 'vad-innehaller-viking-fuel'],
  },

  // ── VIKING FUEL ─────────────────────────────────────────────────────────
  {
    slug: 'varfor-viking-fuel',
    category: 'vikingfuel',
    title: 'Varför Viking Fuel?',
    metaDescription: 'Viking Fuel är ett rent, naturligt energitillskott med adaptogener och zink — tillverkat i EU. Här är vad som skiljer det från mängden.',
    keywords: ['varför viking fuel', 'viking fuel', 'why vikingfuel', 'viking fuel recension', 'viking fuel test'],
    readingMinutes: 3,
    body: [
      { type: 'p', text: 'Marknaden är full av energitillskott med långa ingredienslistor och stora löften. Viking Fuel bygger på motsatt filosofi: få, beprövade ingredienser, rena doser och full transparens.' },
      { type: 'h2', text: 'Vad står Viking Fuel för?' },
      { type: 'ul', items: [
        'Naturliga adaptogener (maca, ashwagandha, ginseng) för uthållig energi.',
        'Zink som bidrar till en normal testosteronhalt i blodet.',
        'Inga onödiga tillsatser — bara det som gör nytta.',
        'Tillverkat i EU enligt GMP-standard, med transparent innehåll.',
      ] },
      { type: 'h2', text: 'För vem?' },
      { type: 'p', text: 'För dig som vill ha jämn energi, fokus och vitalitet i vardagen — utan koffeinkrasch och utan att behöva en hel hylla med burkar.' },
    ],
    faq: [
      { q: 'Vad gör Viking Fuel unikt?', a: 'En ren, transparent formel med beprövade adaptogener och zink, tillverkad i EU enligt GMP — utan onödiga tillsatser eller överdrivna löften.' },
    ],
    related: ['vad-innehaller-viking-fuel', 'hur-tar-man-viking-fuel', 'kosttillskott-som-fungerar'],
  },
  {
    slug: 'vad-innehaller-viking-fuel',
    category: 'vikingfuel',
    title: 'Vad innehåller Viking Fuel?',
    metaDescription: 'Viking Fuel kombinerar adaptogener som maca, ashwagandha och ginseng med zink och andra mineraler. Här är innehållet förklarat.',
    keywords: ['viking fuel innehåll', 'vad innehåller viking fuel', 'viking fuel ingredienser', 'testo support innehåll'],
    readingMinutes: 3,
    body: [
      { type: 'p', text: 'Viking Fuel är byggt kring en kombination av adaptogener och mineraler som stöttar naturlig energi, fokus och en normal hormonbalans. Varje kapsel är doserad för effekt utan onödiga tillsatser.' },
      { type: 'h2', text: 'Huvudingredienser' },
      { type: 'ul', items: [
        'Maca-extrakt — traditionellt för energi och vitalitet.',
        'Ashwagandha-extrakt — adaptogen för stresshantering och uthållighet.',
        'Panax ginseng — traditionellt för vakenhet och fokus.',
        'Zink — bidrar till en normal testosteronhalt i blodet.',
        'Ytterligare växtextrakt och mineraler som selen och bor.',
      ] },
      { type: 'h2', text: 'Ren formel' },
      { type: 'p', text: 'Fokus ligger på beprövade ingredienser i tydliga doser. Full innehållsförteckning finns alltid på produktsidan och förpackningen.' },
    ],
    faq: [
      { q: 'Innehåller Viking Fuel koffein?', a: 'Nej. Energin kommer från adaptogener och mineraler, inte koffein — så du slipper krasch och sömnstörningar.' },
    ],
    related: ['varfor-viking-fuel', 'hur-tar-man-viking-fuel', 'zink-och-testosteron'],
  },
  {
    slug: 'hur-tar-man-viking-fuel',
    category: 'vikingfuel',
    title: 'Hur och när tar man Viking Fuel?',
    metaDescription: 'Så använder du Viking Fuel för bäst effekt — dosering, timing och vad du kan förvänta dig.',
    keywords: ['hur tar man viking fuel', 'viking fuel dosering', 'när ta viking fuel', 'viking fuel användning'],
    readingMinutes: 3,
    body: [
      { type: 'p', text: 'Viking Fuel är enkelt att få in i vardagen. För bäst resultat handlar det om regelbundenhet — adaptogener ger ofta mest nytta när de tas kontinuerligt över tid.' },
      { type: 'h2', text: 'Dosering' },
      { type: 'p', text: 'Följ doseringen på förpackningen, vanligen ett par kapslar dagligen. Ta gärna i samband med en måltid.' },
      { type: 'h2', text: 'Timing' },
      { type: 'p', text: 'Många tar Viking Fuel på morgonen eller förmiddagen för energi och fokus under dagen. Eftersom det är koffeinfritt stör det inte sömnen.' },
      { type: 'h2', text: 'Vad kan du förvänta dig?' },
      { type: 'p', text: 'Adaptogener verkar gradvis. Ge det några veckors regelbunden användning, och kombinera med bra sömn, kost och rörelse för bästa resultat.' },
    ],
    faq: [
      { q: 'När på dagen ska jag ta Viking Fuel?', a: 'Vanligen på morgonen eller förmiddagen i samband med en måltid. Det är koffeinfritt och stör inte sömnen.' },
      { q: 'Hur snabbt märker man effekt?', a: 'Adaptogener verkar gradvis — ge det gärna några veckors regelbunden användning tillsammans med bra sömn och kost.' },
    ],
    related: ['varfor-viking-fuel', 'vad-innehaller-viking-fuel', 'naturlig-energiboost'],
  },

  // ── BATCH 2 ───────────────────────────────────────────────────────────────
  // ENERGI
  {
    slug: 'trott-efter-lunch',
    category: 'energi',
    title: 'Varför blir jag trött efter lunch?',
    metaDescription: 'Trött och seg efter lunch? Det beror ofta på blodsockret och vad du äter. Så äter du för att slippa lunchdippen.',
    keywords: ['trött efter lunch', 'lunchdipp', 'trött efter mat', 'blodsocker trötthet', 'seg efter lunch'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'Att bli seg och trött efter lunch är en av de vanligaste energidipparna. Den beror sällan på maten i sig, utan på vilken sorts mat — och på kroppens naturliga dygnsrytm.' },
      { type: 'h2', text: 'Blodsockret spikar och kraschar' },
      { type: 'p', text: 'En lunch full av snabba kolhydrater (vitt bröd, pasta, ris, läsk) ger en snabb blodsockertopp. När kroppen sedan sänker sockret kommer ett fall som känns som trötthet.' },
      { type: 'h2', text: 'Dygnsrytmen dippar ändå' },
      { type: 'p', text: 'Kroppen har en naturlig svacka tidig eftermiddag oavsett vad du ätit. Rätt lunch dämpar den, fel lunch förstärker den.' },
      { type: 'h2', text: 'Så äter du för jämn energi' },
      { type: 'ul', items: [
        'Bygg lunchen kring protein, grönt och fibrer.',
        'Håll igen på snabba kolhydrater och socker.',
        'Ta en kort promenad efteråt — rörelse slår socker.',
        'Drick vatten, inte energidryck.',
      ] },
    ],
    faq: [
      { q: 'Varför blir jag så trött efter att ha ätit?', a: 'Oftast ett blodsockerfall efter en kolhydratrik måltid, förstärkt av kroppens naturliga eftermiddagsdipp. Balansera med protein och fibrer.' },
    ],
    related: ['varfor-alltid-trott', 'vad-ger-energi-naturligt', 'battre-somn-mer-energi'],
  },
  {
    slug: 'energi-nar-man-tranar',
    category: 'energi',
    title: 'Hur får man energi att träna efter jobbet?',
    metaDescription: 'Slut på ork när du kommer hem? Så laddar du för att orka träna efter en lång arbetsdag — utan att vräka i dig kaffe.',
    keywords: ['orka träna efter jobbet', 'energi till träning', 'trött ingen ork träna', 'peppa sig till gym', 'energi kvällsträning'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'Efter en full arbetsdag är det lätt att soffan vinner över gymmet. Men bristen på ork handlar oftast om planering och blodsocker, inte om att du är "lat".' },
      { type: 'h2', text: 'Ät ett smart mellanmål 1–2 h innan' },
      { type: 'p', text: 'Går du raka vägen från jobbet till gymmet på tom mage tar orken slut fort. Ett mellanmål med protein och långsamma kolhydrater ger bränsle.' },
      { type: 'h2', text: 'Sänk tröskeln' },
      { type: 'p', text: 'Packa väskan på morgonen och gå direkt — åker du hem först är risken stor att du fastnar. Bestäm bara att göra uppvärmningen; resten kommer oftast av sig själv.' },
      { type: 'h2', text: 'Stötta uthålligheten' },
      { type: 'p', text: 'Koffeinfria adaptogener som maca och ginseng har traditionellt använts för uthållig energi och kan vara ett alternativ till en till kopp kaffe sent på dagen som stör sömnen.' },
    ],
    related: ['naturlig-energiboost', 'kosttillskott-for-traning', 'vad-ger-energi-naturligt'],
  },
  {
    slug: 'd-vitamin-och-energi',
    category: 'energi',
    title: 'D-vitamin och trötthet — finns det ett samband?',
    metaDescription: 'D-vitaminbrist är vanligt i Norden och kan bidra till trötthet. Så påverkar D-vitamin din energi — särskilt på vintern.',
    keywords: ['d-vitamin trötthet', 'd-vitaminbrist symptom', 'd-vitamin energi', 'trött på vintern', 'd-vitamin vinter'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'D-vitamin bildas i huden när den träffas av solljus. I Norden, där solen är svag stora delar av året, är låga nivåer vanliga — särskilt under vinterhalvåret.' },
      { type: 'h2', text: 'Vad gör D-vitamin?' },
      { type: 'p', text: 'D-vitamin bidrar bland annat till normal muskelfunktion, immunförsvar och upptag av kalcium. Låga nivåer förknippas ofta med trötthet och nedstämdhet, även om orsakssambandet är komplext.' },
      { type: 'h2', text: 'Vem ligger lågt?' },
      { type: 'p', text: 'De som är lite ute i solen, har mörk hud, är äldre eller täcker huden mycket. Många i Norden rekommenderas tillskott under vintern.' },
      { type: 'h2', text: 'Vad kan du göra?' },
      { type: 'p', text: 'Var ute i dagsljus när det går, ät fet fisk och ägg, och överväg tillskott under vintern. Vid uttalad trötthet — testa nivån hos läkare.' },
    ],
    faq: [
      { q: 'Kan D-vitaminbrist göra mig trött?', a: 'Låga D-vitaminnivåer förknippas ofta med trötthet. I Norden är brist vanligt på vintern — tillskott rekommenderas ofta då.' },
    ],
    related: ['varfor-alltid-trott', 'vad-ger-energi-naturligt', 'kosttillskott-for-man'],
  },
  {
    slug: 'battre-somn-mer-energi',
    category: 'energi',
    title: 'Så sover du bättre för mer energi',
    metaDescription: 'Bättre sömn är den mest kraftfulla energiboosten som finns. Här är de vanor som ger djupare, mer återhämtande sömn.',
    keywords: ['sova bättre', 'bättre sömn', 'sömntips', 'djupare sömn', 'sömn energi'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'Inget tillskott och ingen träning kan ersätta sömn. Vill du ha mer energi är sömnen den första och viktigaste hävstången.' },
      { type: 'h2', text: 'Fasta tider' },
      { type: 'p', text: 'Gå och lägg dig och stig upp ungefär samma tid varje dag, även helger. Kroppens klocka älskar regelbundenhet.' },
      { type: 'h2', text: 'Mörkt, svalt och skärmfritt' },
      { type: 'p', text: 'Släck ner i god tid, håll sovrummet svalt och lägg undan telefonen den sista timmen. Blått ljus sent lurar hjärnan att det är dag.' },
      { type: 'h2', text: 'Koffein och alkohol' },
      { type: 'p', text: 'Koffein sitter kvar i kroppen i många timmar — undvik det efter lunch. Alkohol gör att du somnar men försämrar den djupa sömnen.' },
      { type: 'h2', text: 'Varva ner' },
      { type: 'p', text: 'En lugn rutin sista timmen signalerar till kroppen att det är dags att sova. Adaptogener som ashwagandha används traditionellt för att stötta lugn och återhämtning.' },
    ],
    related: ['varfor-alltid-trott', 'somn-och-testosteron', 'vad-ar-ashwagandha'],
  },

  // TESTOSTERON
  {
    slug: 'testosteron-och-alder',
    category: 'testosteron',
    title: 'Testosteron och ålder — vad händer efter 30?',
    metaDescription: 'Testosteron sjunker naturligt med åldern. Här är vad som händer efter 30, hur snabbt det går och vad du kan göra.',
    keywords: ['testosteron ålder', 'testosteron efter 30', 'testosteron sjunker', 'testosteron 40 år', 'lågt testosteron ålder'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'Testosteron är som högst i tidiga vuxenår och börjar sedan sjunka gradvis — hos många runt 30-årsåldern, ofta med ungefär en procent per år. Det är en normal del av åldrandet.' },
      { type: 'h2', text: 'Vad märker man?' },
      { type: 'p', text: 'Nedgången är långsam, så de flesta märker inget dramatiskt. Med tiden kan man dock uppleva lägre energi, sämre återhämtning och minskad muskelmassa.' },
      { type: 'h2', text: 'Livsstil väger tyngre än åldern' },
      { type: 'p', text: 'Sömn, vikt, stress och träning påverkar nivån mer än många tror. En stillasittande livsstil med dålig sömn sänker testosteronet snabbare än åren i sig.' },
      { type: 'h2', text: 'Vad kan du göra?' },
      { type: 'p', text: 'Styrketräna, sov ordentligt, håll en hälsosam vikt och få i dig tillräckligt av zink, som bidrar till en normal testosteronhalt i blodet.' },
    ],
    faq: [
      { q: 'När börjar testosteron sjunka?', a: 'Ofta runt 30-årsåldern, gradvis med cirka en procent per år. Livsstil påverkar takten mer än åldern i sig.' },
    ],
    related: ['vad-ar-testosteron', 'traning-och-testosteron', 'tecken-pa-lagt-testosteron'],
  },
  {
    slug: 'traning-och-testosteron',
    category: 'testosteron',
    title: 'Hur påverkar träning testosteron?',
    metaDescription: 'Rätt träning stöttar en normal testosteronnivå. Så tränar du för hormonbalans — och vad du bör undvika.',
    keywords: ['träning testosteron', 'styrketräning testosteron', 'höja testosteron träning', 'gym testosteron', 'öka testosteron'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'Fysisk aktivitet är ett av de mest effektiva sätten att stötta en normal hormonbalans — men typen av träning och återhämtningen spelar roll.' },
      { type: 'h2', text: 'Styrketräning i topp' },
      { type: 'p', text: 'Tunga, sammansatta övningar som knäböj och marklyft engagerar stora muskelgrupper och stöttar en normal testosteronnivå bäst.' },
      { type: 'h2', text: 'Överträning kan sänka' },
      { type: 'p', text: 'För mycket träning utan återhämtning gör motsatsen — kronisk stress och för lite sömn kan sänka nivån. Vila är en del av träningen.' },
      { type: 'h2', text: 'Kombinera med bra grund' },
      { type: 'p', text: 'Träning ger mest effekt tillsammans med sömn, hälsosam vikt och näring som zink. Det är helheten som räknas.' },
    ],
    related: ['naturligt-oka-testosteron', 'testosteron-och-alder', 'kosttillskott-for-traning'],
  },
  {
    slug: 'somn-och-testosteron',
    category: 'testosteron',
    title: 'Sömn och testosteron — därför är sömnen avgörande',
    metaDescription: 'Testosteron bildas till stor del under sömnen. Så mycket kan dålig sömn sänka nivån — och vad du kan göra åt det.',
    keywords: ['sömn testosteron', 'sova testosteron', 'dålig sömn testosteron', 'testosteron natt', 'sömnbrist hormoner'],
    readingMinutes: 3,
    body: [
      { type: 'p', text: 'Om du bara ska ändra en sak för att stötta ditt testosteron — börja med sömnen. En stor del av dygnets testosteronproduktion sker medan du sover.' },
      { type: 'h2', text: 'Dålig sömn sänker snabbt' },
      { type: 'p', text: 'Studier har visat att redan en vecka med kort sömn (runt 5 timmar) kan sänka testosteronnivån märkbart hos unga män. Effekten kommer alltså snabbt.' },
      { type: 'h2', text: 'Djup sömn är nyckeln' },
      { type: 'p', text: 'Det är inte bara antalet timmar utan kvaliteten. Regelbundna tider, mörkt sovrum och mindre koffein och skärmar sent ger djupare sömn.' },
      { type: 'h2', text: 'Enkelt att börja' },
      { type: 'p', text: 'Fasta läggtider och en lugn kvällsrutin är gratis och ger ofta märkbar skillnad på både energi och hormonbalans.' },
    ],
    related: ['naturligt-oka-testosteron', 'battre-somn-mer-energi', 'testosteron-och-alder'],
  },
  {
    slug: 'kost-som-hojer-testosteron',
    category: 'testosteron',
    title: 'Kost och testosteron — spelar maten roll?',
    metaDescription: 'Vad du äter påverkar hormonbalansen. Här är näringsämnena och matvanorna som stöttar en normal testosteronnivå.',
    keywords: ['kost testosteron', 'mat som höjer testosteron', 'testosteron kost', 'zink mat', 'näring hormoner'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'Ingen enskild "supermat" höjer testosteron dramatiskt, men en näringsfattig kost kan sänka det. Grunden är att äta tillräckligt och tillräckligt näringsrikt.' },
      { type: 'h2', text: 'Ät tillräckligt' },
      { type: 'p', text: 'Extrema kaloriunderskott och långvarig bantning kan sänka testosteronet. Ät nog för att stötta din aktivitetsnivå.' },
      { type: 'h2', text: 'Nyckelnäringsämnen' },
      { type: 'ul', items: [
        'Zink (kött, skaldjur, frön) — bidrar till normal testosteronhalt.',
        'Nyttiga fetter (olivolja, nötter, fet fisk) — byggstenar för hormoner.',
        'Protein — för muskler och återhämtning.',
        'Vitamin D — via sol, fet fisk eller tillskott.',
      ] },
      { type: 'h2', text: 'Helheten avgör' },
      { type: 'p', text: 'En varierad kost med tillräckligt av dessa näringsämnen ger kroppen förutsättningarna. Ett tillskott kan komplettera om kosten är ensidig.' },
    ],
    related: ['zink-och-testosteron', 'naturligt-oka-testosteron', 'd-vitamin-och-energi'],
  },

  // INGREDIENSER
  {
    slug: 'magnesium-fordelar',
    category: 'ingredienser',
    title: 'Magnesium — vad gör det för kroppen?',
    metaDescription: 'Magnesium är inblandat i hundratals processer i kroppen. Här är vad magnesium gör, tecken på brist och var du hittar det.',
    keywords: ['magnesium', 'magnesium fördelar', 'magnesiumbrist', 'magnesium trötthet', 'magnesium muskler'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'Magnesium är ett mineral som deltar i hundratals processer i kroppen — från energiomsättning till muskel- och nervfunktion. Det är lätt att ligga lite lågt.' },
      { type: 'h2', text: 'Vad magnesium bidrar till' },
      { type: 'ul', items: [
        'Normal muskelfunktion.',
        'Normal energiomsättning och minskad trötthet.',
        'Normal funktion hos nervsystemet.',
        'Normal proteinsyntes.',
      ] },
      { type: 'h2', text: 'Tecken på lågt intag' },
      { type: 'p', text: 'Muskelkramp, trötthet och rastlöshet kan förknippas med lågt magnesium, men beror ofta på flera faktorer.' },
      { type: 'h2', text: 'Var finns magnesium?' },
      { type: 'p', text: 'Gröna bladgrönsaker, nötter, frön, fullkorn och baljväxter. Idrottare och de med ensidig kost kan behöva komplettera.' },
    ],
    related: ['zink-och-testosteron', 'selen-fordelar', 'kosttillskott-for-man'],
  },
  {
    slug: 'selen-fordelar',
    category: 'ingredienser',
    title: 'Selen och dess roll i kroppen',
    metaDescription: 'Selen är ett spårämne med viktig roll för immunförsvar och celler. Här är vad selen gör och var du får det.',
    keywords: ['selen', 'selen fördelar', 'selen mineral', 'selenbrist', 'selen immunförsvar'],
    readingMinutes: 3,
    body: [
      { type: 'p', text: 'Selen är ett spårämne som kroppen bara behöver i små mängder — men det är viktigt. Det ingår i flera antioxidativa enzym.' },
      { type: 'h2', text: 'Vad selen bidrar till' },
      { type: 'ul', items: [
        'Immunförsvarets normala funktion.',
        'Skydd av celler mot oxidativ stress.',
        'Normal spermieproduktion.',
        'Normal funktion hos sköldkörteln.',
      ] },
      { type: 'h2', text: 'Var finns selen?' },
      { type: 'p', text: 'Paranötter är extremt rika på selen, men det finns även i fisk, ägg och kött. Nivåerna i mat varierar med jordmånen.' },
    ],
    related: ['magnesium-fordelar', 'zink-och-testosteron', 'vad-innehaller-viking-fuel'],
  },
  {
    slug: 'bockhornsklover-fenugreek',
    category: 'ingredienser',
    title: 'Vad är bockhornsklöver (fenugreek)?',
    metaDescription: 'Bockhornsklöver är en ört som används både i mat och kosttillskott. Här är vad fenugreek är och hur den används.',
    keywords: ['bockhornsklöver', 'fenugreek', 'bockhornsklöver kosttillskott', 'fenugreek effekt', 'bockhornsklöver män'],
    readingMinutes: 3,
    body: [
      { type: 'p', text: 'Bockhornsklöver (fenugreek, Trigonella foenum-graecum) är en ört och krydda som använts i tusentals år i både matlagning och traditionell örtmedicin.' },
      { type: 'h2', text: 'Varför i kosttillskott?' },
      { type: 'p', text: 'Bockhornsklöver har traditionellt använts för vitalitet och är en vanlig ingrediens i tillskott riktade mot män, ofta i standardiserad extraktform.' },
      { type: 'h2', text: 'Vad tittar forskningen på?' },
      { type: 'p', text: 'Örten studeras i olika sammanhang. Som med många växtextrakt varierar effekterna mellan individer och beror på dos och form.' },
    ],
    related: ['tribulus-terrestris', 'vad-ar-maca', 'vad-innehaller-viking-fuel'],
  },
  {
    slug: 'tribulus-terrestris',
    category: 'ingredienser',
    title: 'Vad är Tribulus terrestris?',
    metaDescription: 'Tribulus terrestris är en klassisk ört i tillskott för män. Här är vad den är och hur den traditionellt använts.',
    keywords: ['tribulus terrestris', 'tribulus', 'tribulus effekt', 'tribulus kosttillskott', 'tribulus män'],
    readingMinutes: 3,
    body: [
      { type: 'p', text: 'Tribulus terrestris är en växt som länge använts i traditionell medicin i bland annat Indien och Kina, och som idag är en vanlig ingrediens i tillskott för män.' },
      { type: 'h2', text: 'Traditionell användning' },
      { type: 'p', text: 'Tribulus har traditionellt kopplats till vitalitet och uthållighet. I tillskott används ofta extrakt standardiserat på så kallade saponiner.' },
      { type: 'h2', text: 'Vad säger forskningen?' },
      { type: 'p', text: 'Forskningen är blandad och pågår. Som med de flesta växtextrakt bör den ses som en del av en helhet, inte en mirakelingrediens.' },
    ],
    related: ['bockhornsklover-fenugreek', 'vad-ar-maca', 'naturligt-oka-testosteron'],
  },

  // PRESTATION
  {
    slug: 'motivation-och-energi',
    category: 'prestation',
    title: 'Varför saknar jag motivation och energi?',
    metaDescription: 'Låg motivation hänger ofta ihop med låg energi. Här är de vanliga orsakerna och hur du får tillbaka drivet.',
    keywords: ['ingen motivation', 'låg motivation', 'saknar drivkraft', 'motivation energi', 'orkeslös omotiverad'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'Motivation känns som en känsla, men den vilar på en fysisk grund: sömn, energi, hormoner och stress. När energin är låg blir det svårt att vilja något alls.' },
      { type: 'h2', text: 'Kolla grunderna först' },
      { type: 'p', text: 'Dålig sömn, ostadigt blodsocker och långvarig stress dränerar både energi och motivation. Ofta löser sig "viljan" när energin kommer tillbaka.' },
      { type: 'h2', text: 'Små steg slår stora mål' },
      { type: 'p', text: 'Att sänka tröskeln — börja med fem minuter — kringgår motståndet. Handling skapar ofta motivation, inte tvärtom.' },
      { type: 'h2', text: 'Stötta kroppen' },
      { type: 'p', text: 'Rörelse, dagsljus och näring som stöttar energiomsättningen hjälper. Adaptogener har traditionellt använts för att hantera stress och behålla driv.' },
    ],
    related: ['varfor-alltid-trott', 'hjarndimma-brain-fog', 'naturlig-energiboost'],
  },
  {
    slug: 'hjarndimma-brain-fog',
    category: 'prestation',
    title: 'Vad är hjärndimma och hur blir man av med den?',
    metaDescription: 'Hjärndimma (brain fog) gör det svårt att tänka klart. Här är vanliga orsaker och vad som faktiskt hjälper.',
    keywords: ['hjärndimma', 'brain fog', 'svårt att tänka klart', 'suddig hjärna', 'koncentrationssvårigheter'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'Hjärndimma är känslan av att tankarna går trögt, att fokus glider undan och att det är svårt att hitta ord. Det är inte en diagnos utan ett symptom med många möjliga orsaker.' },
      { type: 'h2', text: 'Vanliga orsaker' },
      { type: 'ul', items: [
        'Sömnbrist och dålig sömnkvalitet.',
        'Stress och mental överbelastning.',
        'Uttorkning och ostadigt blodsocker.',
        'Näringsbrister.',
      ] },
      { type: 'h2', text: 'Vad hjälper?' },
      { type: 'p', text: 'Sömn, vatten, rörelse och jämn kost är grunden. Ta pauser från skärmen, och stötta stresshanteringen — adaptogener används traditionellt för mental uthållighet.' },
      { type: 'h2', text: 'När ska du söka hjälp?' },
      { type: 'p', text: 'Om hjärndimman är uttalad eller ihållande trots bra vanor, prata med vården för att utesluta bakomliggande orsaker.' },
    ],
    related: ['mental-skarpa', 'battre-fokus-naturligt', 'motivation-och-energi'],
  },
  {
    slug: 'prestera-battre-pa-jobbet',
    category: 'prestation',
    title: 'Så presterar du bättre på jobbet — energi och fokus',
    metaDescription: 'Vill du orka mer och fokusera bättre på jobbet? Här är de vanor som ger jämn energi och skärpa genom arbetsdagen.',
    keywords: ['prestera bättre jobbet', 'fokus på jobbet', 'energi arbetsdag', 'produktivitet energi', 'orka jobba'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'Prestation på jobbet handlar mindre om att pressa hårdare och mer om att ha jämn energi och skärpa när det behövs. Här är grunderna.' },
      { type: 'h2', text: 'Jobba i block' },
      { type: 'p', text: 'Fokuserade pass på 25–50 minuter med korta pauser slår att sitta och kämpa i timmar. Hjärnan orkar mer i intervaller.' },
      { type: 'h2', text: 'Skydda energin' },
      { type: 'p', text: 'En bra frukost och lunch (protein och fibrer) håller blodsockret jämnt. Drick vatten och rör på dig mellan mötena.' },
      { type: 'h2', text: 'Undvik koffeinkraschen' },
      { type: 'p', text: 'För mycket kaffe ger en topp och sedan en dipp. Koffeinfria adaptogener kan ge jämnare energi utan kraschen.' },
    ],
    related: ['mental-skarpa', 'battre-fokus-naturligt', 'trott-efter-lunch'],
  },

  // KOSTTILLSKOTT
  {
    slug: 'kosttillskott-for-man',
    category: 'kosttillskott',
    title: 'Kosttillskott för män — vad är värt att ta?',
    metaDescription: 'Vilka kosttillskott är faktiskt värda pengarna för män? Här är en ärlig genomgång av de mest relevanta.',
    keywords: ['kosttillskott för män', 'bästa tillskott män', 'vitaminer män', 'tillskott energi män', 'testo tillskott'],
    readingMinutes: 5,
    body: [
      { type: 'p', text: 'De flesta män behöver inte en hylla full av burkar. Ett fåtal näringsämnen och växtextrakt sticker ut som mest relevanta — resten är ofta onödigt.' },
      { type: 'h2', text: 'Mineraler som gör skillnad' },
      { type: 'p', text: 'Zink bidrar till en normal testosteronhalt, magnesium till muskelfunktion och energiomsättning, och selen till immunförsvar och spermieproduktion.' },
      { type: 'h2', text: 'Vitaminer att hålla koll på' },
      { type: 'p', text: 'D-vitamin är relevant i Norden, särskilt vintertid. B-vitaminer stöttar energiomsättningen.' },
      { type: 'h2', text: 'Adaptogener för energi' },
      { type: 'p', text: 'Maca, ashwagandha och ginseng används för energi, uthållighet och vitalitet — ofta samlade i en formel.' },
      { type: 'h2', text: 'Färre men bättre' },
      { type: 'p', text: 'En genomtänkt produkt med några beprövade ingredienser slår tio olika burkar. Titta efter transparent innehåll och GMP-tillverkning.' },
    ],
    faq: [
      { q: 'Vilka kosttillskott bör män prioritera?', a: 'Zink, magnesium och D-vitamin är ofta mest relevanta, plus adaptogener som maca och ashwagandha för energi. Grunden är ändå kost, sömn och träning.' },
    ],
    related: ['kosttillskott-som-fungerar', 'zink-och-testosteron', 'varfor-viking-fuel'],
  },
  {
    slug: 'ar-kosttillskott-sakra',
    category: 'kosttillskott',
    title: 'Är kosttillskott säkra?',
    metaDescription: 'Kan man lita på kosttillskott? Här är vad som avgör om ett tillskott är säkert och hur du väljer klokt.',
    keywords: ['är kosttillskott säkra', 'kosttillskott säkerhet', 'säkra tillskott', 'biverkningar kosttillskott', 'lita på kosttillskott'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: 'De flesta kosttillskott från seriösa tillverkare är säkra när de används enligt anvisning. Men kvaliteten varierar, så det gäller att välja rätt.' },
      { type: 'h2', text: 'Vad gör ett tillskott säkert?' },
      { type: 'ul', items: [
        'Tillverkat enligt GMP-standard.',
        'Transparent innehåll med tydliga doser.',
        'Doser inom rekommenderade nivåer.',
        'Sålt av en seriös aktör inom EU:s regelverk.',
      ] },
      { type: 'h2', text: 'Vad du bör undvika' },
      { type: 'p', text: 'Produkter med extrema doser, hemliga "proprietary blends" utan mängdangivelser, eller mirakelpåståenden. Mer är inte alltid bättre.' },
      { type: 'h2', text: 'Vid tveksamhet' },
      { type: 'p', text: 'Tar du mediciner eller har en sjukdom — stäm av med läkare eller apotek innan du börjar med ett nytt tillskott.' },
    ],
    faq: [
      { q: 'Kan kosttillskott ge biverkningar?', a: 'De flesta tolereras väl i rekommenderade doser, men mycket höga doser eller interaktioner med mediciner kan ge besvär. Följ doseringen och rådgör vid osäkerhet.' },
    ],
    related: ['kosttillskott-som-fungerar', 'gmp-certifierat', 'viking-fuel-biverkningar'],
  },
  {
    slug: 'naturligt-vs-syntetiskt',
    category: 'kosttillskott',
    title: 'Naturliga vs. syntetiska kosttillskott',
    metaDescription: 'Är naturliga tillskott bättre än syntetiska? Här är skillnaden — och vad som faktiskt spelar roll när du väljer.',
    keywords: ['naturliga kosttillskott', 'syntetiska vitaminer', 'naturligt vs syntetiskt', 'naturliga tillskott', 'växtbaserat tillskott'],
    readingMinutes: 4,
    body: [
      { type: 'p', text: '"Naturligt" låter alltid bättre, men verkligheten är mer nyanserad. Både naturliga och syntetiska källor kan vara bra — det viktiga är kvalitet, dos och upptag.' },
      { type: 'h2', text: 'Vad menas med naturligt?' },
      { type: 'p', text: 'Naturliga tillskott baseras på växter, örter och råvaror (t.ex. maca-rot, ashwagandha). Syntetiska framställs i labb men kan vara kemiskt identiska med de naturliga.' },
      { type: 'h2', text: 'Vad spelar egentligen roll?' },
      { type: 'ul', items: [
        'Rätt dos av rätt ämne.',
        'Bra upptagbarhet (form av t.ex. mineral).',
        'Ren produkt utan onödiga tillsatser.',
        'GMP-tillverkning och transparens.',
      ] },
      { type: 'h2', text: 'Slutsats' },
      { type: 'p', text: 'Välj efter kvalitet och innehåll snarare än bara ordet "naturligt". En ren, växtbaserad formel med tydliga doser är ofta ett bra val.' },
    ],
    related: ['kosttillskott-som-fungerar', 'ar-kosttillskott-sakra', 'vad-innehaller-viking-fuel'],
  },

  // VIKING FUEL
  {
    slug: 'viking-fuel-biverkningar',
    category: 'vikingfuel',
    title: 'Har Viking Fuel några biverkningar?',
    metaDescription: 'Är Viking Fuel säkert att ta? Här är vad du bör veta om ingredienserna, dosering och när du bör vara försiktig.',
    keywords: ['viking fuel biverkningar', 'är viking fuel säkert', 'viking fuel säkerhet', 'biverkningar testo support'],
    readingMinutes: 3,
    body: [
      { type: 'p', text: 'Viking Fuel bygger på beprövade adaptogener och mineraler i rimliga doser, tillverkat i EU enligt GMP-standard. För de flesta friska vuxna tolereras ingredienserna väl.' },
      { type: 'h2', text: 'Följ doseringen' },
      { type: 'p', text: 'Ta produkten enligt anvisningen på förpackningen. Att ta mer än rekommenderat ger ingen extra nytta och bör undvikas.' },
      { type: 'h2', text: 'När bör du vara försiktig?' },
      { type: 'ul', items: [
        'Om du är gravid eller ammar.',
        'Om du tar receptbelagda mediciner.',
        'Om du har en pågående sjukdom.',
      ] },
      { type: 'h2', text: 'Vid tveksamhet' },
      { type: 'p', text: 'Rådgör med läkare eller apotek om något av ovanstående gäller dig, eller om du är osäker. Kosttillskott ersätter inte en varierad kost.' },
    ],
    faq: [
      { q: 'Är Viking Fuel säkert att ta dagligen?', a: 'För friska vuxna som följer doseringen tolereras ingredienserna vanligen väl. Är du gravid, ammar, tar mediciner eller har en sjukdom — rådgör med läkare först.' },
    ],
    related: ['ar-kosttillskott-sakra', 'hur-tar-man-viking-fuel', 'vad-innehaller-viking-fuel'],
  },
  {
    slug: 'prenumerera-viking-fuel',
    category: 'vikingfuel',
    title: 'Prenumerera på Viking Fuel — hur fungerar det?',
    metaDescription: 'Med prenumeration får du Viking Fuel levererat varje månad och sparar 20 %. Så fungerar det — och hur du avslutar när du vill.',
    keywords: ['prenumerera viking fuel', 'viking fuel prenumeration', 'kosttillskott prenumeration', 'spara viking fuel'],
    readingMinutes: 3,
    body: [
      { type: 'p', text: 'Vill du aldrig ta slut och samtidigt spara pengar? Med en prenumeration på Viking Fuel får du produkten levererad automatiskt varje månad — till ett lägre pris.' },
      { type: 'h2', text: 'Så fungerar det' },
      { type: 'ul', items: [
        'Du väljer prenumeration i kassan istället för engångsköp.',
        'Du sparar 20 % jämfört med ordinarie pris.',
        'Leverans sker automatiskt varje månad.',
        'Du kan avsluta när du vill — ingen bindningstid.',
      ] },
      { type: 'h2', text: 'Varför prenumerera?' },
      { type: 'p', text: 'Adaptogener ger ofta mest nytta vid regelbunden användning över tid. En prenumeration gör det enkelt att hålla igång utan att behöva komma ihåg att beställa.' },
    ],
    faq: [
      { q: 'Kan jag avsluta prenumerationen när jag vill?', a: 'Ja. Det finns ingen bindningstid — du kan avsluta eller pausa prenumerationen när som helst från ditt konto.' },
    ],
    related: ['hur-tar-man-viking-fuel', 'varfor-viking-fuel', 'vad-innehaller-viking-fuel'],
  },
];

export function getArticle(slug: string): KnowledgeArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function articlesByCategory(key: string): KnowledgeArticle[] {
  return ARTICLES.filter((a) => a.category === key);
}

export function getRelated(article: KnowledgeArticle, max = 3): KnowledgeArticle[] {
  const bySlug = (article.related || []).map(getArticle).filter(Boolean) as KnowledgeArticle[];
  if (bySlug.length >= max) return bySlug.slice(0, max);
  const extra = ARTICLES.filter((a) => a.category === article.category && a.slug !== article.slug && !bySlug.includes(a));
  return [...bySlug, ...extra].slice(0, max);
}

export const CTA_TEXT = CTA_HANDLA;
