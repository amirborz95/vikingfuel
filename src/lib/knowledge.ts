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
