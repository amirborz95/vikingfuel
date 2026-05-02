import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppLogo from '@/components/ui/AppLogo';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const stats = [
  { value: '200+', label: 'Happy customers' },
  { value: '8', label: 'Active ingredients' },
  { value: 'EU', label: 'Manufacturing' },
  { value: '2024', label: 'Founded' },
];

const values = [
  {
    icon: 'ShieldCheckIcon',
    title: 'Quality first',
    description: 'We only choose the best natural ingredients and manufacture according to the highest standards.'
  },
  {
    icon: 'GlobeAltIcon',
    title: 'Nordic identity',
    description: 'Our Nordic heritage runs through everything we do - from design to our values.'
  },
  {
    icon: 'BeakerIcon',
    title: 'Science & nature',
    description: 'We combine traditional knowledge with modern research for optimal results.'
  },
  {
    icon: 'HeartIcon',
    title: 'Health & performance',
    description: 'We help people live healthier and perform better every day.'
  }
];

export default function AboutPage() {
  const { t } = useLanguage();

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
                    About Viking Fuel
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    We are a Nordic premium brand in dietary supplements that helps people live healthier,
                    stronger, and more energetic lives through natural, effective products.
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
                    <span className="section-label block mb-4">Our story</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6 leading-tight text-balance">
                      Built for daily performance
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                      Viking Fuel was founded in 2024 with the vision of creating supplements that really work.
                      We saw that the market was filled with products with vague ingredient lists and exaggerated claims.
                      So we decided to do something different.
                    </p>
                    <p className="text-base text-muted-foreground leading-relaxed mb-6">
                      We combine strong Nordic identity with clear, natural ingredients and modern design.
                      Every product is carefully developed to deliver real results - not just nice packaging.
                    </p>
                    <p className="text-base text-muted-foreground leading-relaxed mb-8">
                      Today we help hundreds of people live more energetic, healthy, and productive lives.
                      And we're just getting started.
                    </p>

                    <ul className="space-y-3 mb-10">
                      {[
                        'Natural ingredients without unnecessary additives',
                        'Manufactured in the EU according to GMP standards',
                        'Transparent ingredient lists',
                        'Free from gluten and lactose',
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
                  <span className="section-label block mb-4">Our values</span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
                    What we stand for
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Our values run through everything we do - from product development to customer service.
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
                  <span className="section-label block mb-4">Our mission</span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-8">
                    Help people live better lives
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                    We believe that small changes can make big differences. By offering high-quality,
                    natural supplements we help people to:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="BoltIcon" size={32} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">Get more energy</h3>
                      <p className="text-muted-foreground">Start the day strong and maintain energy all day long</p>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="ClockIcon" size={32} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">Increase endurance</h3>
                      <p className="text-muted-foreground">Perform better over longer periods, regardless of activity</p>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="SparklesIcon" size={32} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">Improve wellbeing</h3>
                      <p className="text-muted-foreground">Feel healthier, stronger, and more balanced</p>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-3xl p-8 md:p-12">
                    <h3 className="text-2xl font-bold text-foreground mb-4">Want to join the journey?</h3>
                    <p className="text-lg text-muted-foreground mb-6">
                      We are proud of our products and even prouder of our customers.
                      Every day we hear from people whose lives have improved thanks to our supplements.
                    </p>
                    <p className="text-base text-muted-foreground">
                      And we're just getting started. Together we're building the future for natural dietary supplements in the Nordics.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>  );
}