import React from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppLogo from '@/components/ui/AppLogo';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const stats = [
  { value: '200+', label: 'Nöjda kunder' },
  { value: '8', label: 'Aktiva ingredienser' },
  { value: 'EU', label: 'Tillverkning' },
  { value: '2024', label: 'Grundat' },
];

const values = [
  {
    icon: 'ShieldCheckIcon',
    title: 'Kvalitet först',
    description: 'Vi väljer endast de bästa naturliga ingredienserna och tillverkar enligt högsta standarder.'
  },
  {
    icon: 'GlobeAltIcon',
    title: 'Nordisk identitet',
    description: 'Vårt arv från Norden genomsyrar allt vi gör - från design till våra värderingar.'
  },
  {
    icon: 'BeakerIcon',
    title: 'Vetenskap & natur',
    description: 'Vi kombinerar traditionell kunskap med modern forskning för optimala resultat.'
  },
  {
    icon: 'HeartIcon',
    title: 'Hälsa & prestation',
    description: 'Vi hjälper människor att leva hälsosammare och prestera bättre varje dag.'
  }
];

export default function AboutPage() {
  return (        <div className="min-h-screen bg-white">
          <AnnouncementBar />
          <Header />
          <main>
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="container-wide">
                <div className="text-center mb-16">
                  <div className="flex justify-center mb-8">
                    <AppLogo size={80} />
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-6">
                    Om Viking Fuel
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    Vi är ett nordiskt premiumvarumärke inom kosttillskott som hjälper människor att leva hälsosammare,
                    starkare och mer energiska liv genom naturliga, effektiva produkter.
                  </p>
                </div>
              </div>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-white">
              <div className="container-wide">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                  {/* Left — Image */}
                  <div className="relative">
                    <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-muted">
                      <AppImage
                        src="https://img.rocket.new/generatedImages/rocket_gen_img_1c8cf3b77-1773878735596.png"
                        alt="Athletic man training in well-lit modern gym, bright airy environment, open space"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    {/* Stats overlay card */}
                    <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl border border-border p-6 grid grid-cols-2 gap-4 max-w-[240px]">
                      {stats?.map((stat) => (
                        <div key={stat?.label} className="text-center">
                          <p className="text-xl font-extrabold text-primary">{stat?.value}</p>
                          <p className="text-[10px] text-muted-foreground leading-tight">{stat?.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right — Text */}
                  <div>
                    <span className="section-label block mb-4">Vår historia</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6 leading-tight text-balance">
                      Byggt för daglig prestation
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                      Viking Fuel grundades 2024 med visionen att skapa kosttillskott som verkligen fungerar.
                      Vi såg att marknaden var fylld av produkter med vaga ingredienslistor och överdrivna påståenden.
                      Därför bestämde vi oss för att göra något annorlunda.
                    </p>
                    <p className="text-base text-muted-foreground leading-relaxed mb-6">
                      Vi kombinerar stark nordisk identitet med tydliga, naturliga ingredienser och modern design.
                      Varje produkt är noggrant utvecklad för att ge verkliga resultat - inte bara fina förpackningar.
                    </p>
                    <p className="text-base text-muted-foreground leading-relaxed mb-8">
                      Idag hjälper vi hundratals människor att leva mer energiska, hälsosamma och produktiva liv.
                      Och vi är bara i början av vår resa.
                    </p>

                    <ul className="space-y-3 mb-10">
                      {[
                        'Naturliga ingredienser utan onödiga tillsatser',
                        'Tillverkat i EU enligt GMP-standard',
                        'Transparenta ingredienslistor',
                        'Fri från gluten och laktos',
                      ]?.map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                            <Icon name="CheckIcon" size={12} className="text-primary" />
                          </span>
                          <span className="text-sm font-medium text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-muted/30">
              <div className="container-wide">
                <div className="text-center mb-16">
                  <span className="section-label block mb-4">Våra värderingar</span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
                    Vad vi står för
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Våra värderingar genomsyrar allt vi gör - från produktutveckling till kundservice.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {values.map((value, index) => (
                    <div key={index} className="bg-white rounded-2xl p-8 text-center border border-border hover:shadow-lg transition-all duration-300">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Icon name={value.icon} size={32} className="text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-4">{value.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-white">
              <div className="container-wide">
                <div className="text-center max-w-4xl mx-auto">
                  <span className="section-label block mb-4">Vårt uppdrag</span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-8">
                    Hjälpa människor att leva bättre liv
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                    Vi tror att små förändringar kan göra stora skillnader. Genom att erbjuda högkvalitativa,
                    naturliga kosttillskott hjälper vi människor att:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="BoltIcon" size={32} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">Få mer energi</h3>
                      <p className="text-muted-foreground">Starta dagen stark och bibehålla energin genom hela dagen</p>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="ClockIcon" size={32} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">Öka uthålligheten</h3>
                      <p className="text-muted-foreground">Prestera bättre under längre perioder, oavsett aktivitet</p>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="SparklesIcon" size={32} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">Förbättra välbefinnandet</h3>
                      <p className="text-muted-foreground">Känna sig friskare, starkare och mer balanserad</p>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-3xl p-8 md:p-12">
                    <h3 className="text-2xl font-bold text-foreground mb-4">Vill du vara med på resan?</h3>
                    <p className="text-lg text-muted-foreground mb-6">
                      Vi är stolta över våra produkter och ännu stoltare över våra kunder.
                      Varje dag får vi höra från människor vars liv har förbättrats tack vare våra tillskott.
                    </p>
                    <p className="text-base text-muted-foreground">
                      Och vi är bara i början. Tillsammans bygger vi framtiden för naturliga kosttillskott i Norden.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>  );
}