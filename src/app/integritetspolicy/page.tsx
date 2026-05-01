import React from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (        <div className="min-h-screen bg-white">
          <AnnouncementBar />
          <Header />
          <main className="py-20">
            <div className="container-wide">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-foreground mb-4">Integritetspolicy</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Vi värnar om din integritet och beskriver här hur vi samlar in och behandlar personuppgifter.
                </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-10">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Personuppgifter vi samlar in</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Vi samlar in uppgifter som namn, e-postadress, adress och telefonnummer när du lägger en order eller kontaktar oss.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Dessa uppgifter används för att hantera din beställning, ge kundservice och skicka viktig information om din leverans.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Ändamål med behandlingen</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Vi använder dina uppgifter för att fullgöra köpeavtal, administrera leverans, svara på förfrågningar och skicka orderbekräftelser.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Information kan även användas för att förbättra vår service och kommunikation, alltid med respekt för din integritet.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Rättslig grund</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Behandlingen baseras på att det är nödvändigt för att fullgöra ett avtal med dig, samt på vårt berättigade intresse av att driva verksamheten.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Vi behandlar endast personuppgifter i den omfattning som krävs för att leverera produkter och hantera kundrelationer.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Lagring och säkerhet</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Vi förvarar dina uppgifter så länge som det behövs för att uppfylla avtal och lagkrav. Uppgifter som inte längre är nödvändiga raderas eller anonymiseras.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Vi har tekniska och organisatoriska åtgärder för att skydda dina uppgifter mot obehörig åtkomst och förlust.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Dina rättigheter</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Du har rätt att begära information om vilka uppgifter vi behandlar om dig, begära rättelse eller radering och invända mot behandling.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Kontakta oss på info@vikingfuel.se för att använda dina rättigheter eller om du har frågor om hur vi hanterar dina uppgifter.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Tredjepartsleverantörer</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Vi samarbetar med betrodda leverantörer som hanterar betalningar, leveransinformation och drift av webbplatsen.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Dessa leverantörer har endast tillgång till uppgifter som behövs för deras uppdrag och får inte använda dem för andra ändamål.
                  </p>
                </section>
              </div>
            </div>
          </main>
          <Footer />
        </div>  );
}
