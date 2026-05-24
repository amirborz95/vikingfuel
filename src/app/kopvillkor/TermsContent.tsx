'use client';

import React from 'react';

const sections = [
  {
    heading: 'Allmänna villkor',
    paragraphs: [
      'Genom att besöka och handla på vikingfuel.se godkänner du dessa villkor. Vi förbehåller oss rätten att ändra villkoren när som helst.',
      'Vi rekommenderar att du läser denna sida regelbundet för att vara uppdaterad på eventuella ändringar. Betydande ändringar meddelas via e-post eller på webbplatsen.',
      'Vi är ett svenskregistrerat företag (Viking Fuel AB) och följer svenska och EU:s konsumentskyddslagar.',
    ],
  },
  {
    heading: 'Beställningar och orderbekräftelse',
    paragraphs: [
      'En beställning görs genom att fylla i formuläret på vår webbplats och bekräfta köpet. Din order är bindande när du klickat "Bekräfta köpet".',
      'Du kommer att motta en orderbekräftelse via e-post innehållande dina orderdetaljer, totalpris och leveransadress.',
      'Vi gör vårt bästa för att hålla lagersaldot uppdaterat på webbplatsen. Vid sällsynta tillfällen kan det förekomma att en vara är slut trots att den visar som tillgänglig.',
      'I sådana fall kommer vi att kontakta dig omedelbar för att diskutera alternativ, såsom avvaktan på nytt lager, byte av produkt eller full återbetalning.',
    ],
  },
  {
    heading: 'Priser och betalning',
    paragraphs: [
      'Alla priser på vår webbplats är angivna i svenska kronor (SEK) och inkluderar svenska moms (25%) enligt lag.',
      'Vi accepterar betalning via säkra betalningsmetoder: Visa, Mastercard, Klarna och Google Pay. Alla betalningar hanteras av välkända och säkra betalningsleverantörer.',
      'Betalningen är säker genom SSL-kryptering och vi sparar aldrig dina kortuppgifter. Vid utdelning av betalningsproblem kan vi ta kontakt för att klara upp situationen.',
      'Du kan se den exakta fraktkostnaden i kassan innan du bekräftar din beställning. Fraktavgiften beräknas automatiskt baserat på leveransadress.',
    ],
  },
  {
    heading: 'Leverans och risker',
    paragraphs: [
      'Vi skickar dina varor inom 1–2 arbetsdagar efter orderbekräftelse (helgfri). Leveranstiden i Sverige är normalt 2–4 dagar efter att paketet har lämnats till transportöret.',
      'Risken för varorna övergår till dig när de levererats till den leveransadress du angett. Vi rekommenderar att du kontrollerar paketet vid mottagningen.',
      'Om paketet anlander skadat eller inkomplettekontakta oss omedelbar med bilder på skadan. Vi löser sådan ärenden snabbt.',
      'Vi erbjuder spårningslänk så att du kan följa ditt paket från lager till din dörr. Spårningsinformation skickas via e-post när din beställning skickas.',
    ],
  },
  {
    heading: 'Ångerrätt och returer',
    paragraphs: [
      'Som konsument har du rätt att returnera oanvändta varor inom 14 dagar efter mottagandet (ångerrätten enligt distansköpsdirektivet).',
      'För att initiiera en retur, kontakta oss på info@vikingfuel.se med ditt ordernummer. Vi skickar dig returinstruktioner och returadress.',
      'Produkten måste returneras i originalförpackning, i samma skick som mottagningen. Vi kan inte acceptera returer av öppnade eller använda produkter (hälsoskäl).',
      'Returfrakten bekostas av dig. Undantag kan göras vid fel på produkten eller felaktig leverans – då betalar vi returfrakten.',
      'Se även vår separata returpolicy för mer information om returprocessen och återbetalning.',
    ],
  },
  {
    heading: 'Produktansvar och begränsningar',
    paragraphs: [
      'Viking Fuel erbjuder högkvalitativa kosttillskott och drycker tillverkade i Europa.',
      'Vi kan inte garantera att produkterna passar för alla individer. Konsultera en läkare eller dietist före användning, särskilt om du tar medicin eller har hälsoproblem.',
      'Vi är inte ansvariga för indirekta eller följdskador som uppstår från använding av våra produkter.',
      'Vi ansvarar för direkta skador (t.ex. felaktig vara) upp till högsta två gånger ordervärdet.',
      'Vi strävar efter att all information på vår webbplats är korrekt och uppdaterad, men kan inte garantera fullständig exakthet. Använd informationen på egen risk.',
    ],
  },
  {
    heading: 'Immaterialrätter',
    paragraphs: [
      'Allt innehål på vår webbplats – inklusive texter, bilder, logotyper och design – är skyddat av upphovsrätt och tillhör Viking Fuel AB.',
      'Du får inte kopiera, distribuera eller använda innehållet för kommersiella ändamål utan skriftlig tillstånd från oss.',
      'Du får skriva ut eller ladda ner information för personligt bruk, men inte för vidare distribution.',
    ],
  },
  {
    heading: 'Tvister och tillämplig lag',
    paragraphs: [
      'Dessa villkor och alla köp styrs av svensk lag.',
      'Eventuella tvister löses initialt genom förhandling mellan parterna. Om tvisten inte kan lösas kan den hänvisas till Allmän domstol i Sverige.',
      'För konsumentklagomål kan du även kontakta Allmänna Reklamationsnämnden (ARN) eller Konsumentverket.',
    ],
  },
  {
    heading: 'Kontakt och kundtjänst',
    paragraphs: [
      'Vi strävar efter bästa möjliga kundservice. Vid frågor eller problem, kontakta oss:',
      'E-post: info@vikingfuel.se\nSvartid: Vi svarar normalt inom 1–2 arbetsdagar\n\nOm du är missnöjd med vår lösning kan du även kontakta Konsumentklagomäldstillfället eller Datainspektionen (IMY) för dataskyddsfrågor.',
    ],
  },
];

export default function TermsContent() {

  return (
    <main className="py-20">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Köpvillkor</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Läs våra kompletta köpvillkor för beställningar, betalning, leverans och returer.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-10">
          {sections.map((section) => (
            <section key={section.heading} className="border-l-4 border-primary pl-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">{section.heading}</h2>
              {section.paragraphs.map((paragraph, idx) => (
                <p key={idx} className="text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-16 bg-amber-50 border border-amber-200 rounded-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-foreground mb-4">⚖️ Konsumenträttighetar</h3>
          <p className="text-muted-foreground mb-2">
            Som konsument skyddas du av svensk konsumentskyddslag. Du har rätt till:
          </p>
          <ul className="text-muted-foreground space-y-1 ml-4">
            <li>• Rätt att återkalla köpet inom 14 dagar</li>
            <li>• Två års garantirätt på felaktig vara</li>
            <li>• Rätt att få felanmäld vara reparerad eller ersatt</li>
            <li>• Rätt att begära prisnedsättning eller återbetalning vid väsentlig mangel</li>
          </ul>
        </div>
      </div>
    </main>
  );
}