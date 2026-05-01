'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const reviews = [
  {
    name: 'Erik Lindström',
    location: 'Stockholm',
    rating: 5,
    text: 'Har använt Vikingfuel i tre veckor nu och skillnaden är otrolig! Vaknar piggare på morgonen och har mycket bättre fokus genom hela dagen. Som småbarnsförälder har det varit en game-changer. Rekommenderar verkligen!',
    product: 'Vikingfuel - Testo-support',
    date: 'Mars 2026',
    image: 'https://cdn.corenexis.com/files/c/8895963720.png'
  },
  {
    name: 'Marcus Bergström',
    location: 'Göteborg',
    rating: 5,
    text: 'Köpte 3-pack för att spara pengar och är supernöjd. Produkten känns premium från första kapseln. Leveransen gick blixtsnabbt och förpackningen var riktigt snygg. Märker redan skillnad i energinivåerna.',
    product: 'Vikingfuel - Testo-support 3-pack',
    date: 'April 2026',
  },
  {
    name: 'Johan Karlsson',
    location: 'Malmö',
    rating: 5,
    text: 'Började med en burk för att testa och blev så imponerad att jag gick direkt till 6-pack. Har haft problem med låg energi och trötthet i flera år, men denna produkt har verkligen hjälpt. Känner mig starkare och mer motiverad varje dag.',
    product: 'Vikingfuel - Testo-support 6-pack',
    date: 'April 2026',
    image: 'https://cdn.corenexis.com/files/c/3687461720.png'
  },
  {
    name: 'Anna Svensson',
    location: 'Uppsala',
    rating: 5,
    text: 'Efter att ha fött mitt andra barn kämpade jag med ständig trötthet och brist på energi. Testade Vikingfuel på rekommendation från en vän och är så glad att jag gjorde det! Har fått tillbaka min gamla energi och känner mig mycket piggare.',
    product: 'Vikingfuel - Testo-support',
    date: 'April 2026',
  },
  {
    name: 'Lars Nilsson',
    location: 'Helsingborg',
    rating: 5,
    text: 'Som 52-åring har jag märkt att energin börjar tryta lite grand. Vikingfuel har hjälpt mig att hålla igång både på jobbet och när jag tränar. Naturliga ingredienser och tydlig effekt - perfekt!',
    product: 'Vikingfuel - Testo-support',
    date: 'April 2026',
    image: 'https://cdn.corenexis.com/files/c/1566957720.png'
  },
  {
    name: 'Maria Andersson',
    location: 'Linköping',
    rating: 5,
    text: 'Har testat många olika kosttillskott genom åren, men inget har varit lika effektivt som Vikingfuel. Märker skillnad redan efter några dagar. Bra smak och lätt att svälja.',
    product: 'Vikingfuel - Testo-support',
    date: 'April 2026',
  },
  {
    name: 'Peter Johansson',
    location: 'Västerås',
    rating: 5,
    text: 'Tränar mycket och behöver tillskott som hjälper till med återhämtning. Vikingfuel har blivit en viktig del av min rutin. Känner mig starkare och återhämtar snabbare mellan passen.',
    product: 'Vikingfuel - Testo-support',
    date: 'April 2026',
  },
  {
    name: 'Sara Lindberg',
    location: 'Örebro',
    rating: 5,
    text: 'Efter en lång period av stress och utmattning hittade jag äntligen något som hjälper. Vikingfuel har gett mig tillbaka balansen och energin jag behöver för att klara av vardagen.',
    product: 'Vikingfuel - Testo-support',
    date: 'Mars 2026',
  },
  {
    name: 'Anders Persson',
    location: 'Norrköping',
    rating: 4,
    text: 'Bra produkt som lever upp till förväntningarna. Tar det varje morgon och känner mig mer alert genom dagen. Lite högre pris än konkurrerande produkter men kvaliteten känns värd det.',
    product: 'Vikingfuel - Testo-support',
    date: 'April 2026',
  },
  {
    name: 'Emma Gustafsson',
    location: 'Halmstad',
    rating: 5,
    text: 'Min sambo och jag delar på ett paket. Båda mår mycket bättre nu! Han har fått bättre fokus på jobbet och jag har mer energi till träningen. Kommer definitivt att köpa fler när det börjar ta slut.',
    product: 'Vikingfuel - Testo-support 3-pack',
    date: 'April 2026',
  },
  {
    name: 'Daniel Holm',
    location: 'Jönköping',
    rating: 5,
    text: 'Arbetar långa dagar på kontoret och behöver något som håller energin uppe. Vikingfuel hjälper mig att hålla fokus och produktivitet hela dagen. Perfekt för moderna livsstilen.',
    product: 'Vikingfuel - Testo-support',
    date: 'Mars 2026',
  },
  {
    name: 'Linda Svensson',
    location: 'Kalmar',
    rating: 5,
    text: 'Har testat många energiprodukter genom åren, men denna sticker verkligen ut. Naturliga ingredienser, tydlig effekt och ingen konstig eftersmak. Rekommenderar till alla som känner sig trötta.',
    product: 'Vikingfuel - Testo-support',
    date: 'April 2026',
  },
  {
    name: 'Robert Karlsson',
    location: 'Växjö',
    rating: 5,
    text: 'Som småbarnsförälder behöver jag all energi jag kan få. Denna produkt har räddat mina dagar! Vaknar utvilad och klarar av hela dagen utan att känna mig utmattad.',
    product: 'Vikingfuel - Testo-support',
    date: 'April 2026',
  },
  {
    name: 'Camilla Nilsson',
    location: 'Karlstad',
    rating: 4,
    text: 'Bra kvalitet och effekt. Märker skillnad i återhämtningen efter träning. Kommer fortsätta använda det här. Förpackningen kunde vara lite snyggare men produkten är utmärkt.',
    product: 'Vikingfuel - Testo-support',
    date: 'Mars 2026',
  },
  {
    name: 'Magnus Eriksson',
    location: 'Skövde',
    rating: 5,
    text: 'Från att vara trött hela tiden till att ha energi att både träna och arbeta effektivt. Vikingfuel har förändrat mitt liv till det bättre. Tack för en fantastisk produkt!',
    product: 'Vikingfuel - Testo-support 3-pack',
    date: 'April 2026',
  },
  {
    name: 'Helena Andersson',
    location: 'Borås',
    rating: 5,
    text: 'Min läkare rekommenderade naturliga tillskott för bättre energi. Vikingfuel var det bästa valet jag gjort! Märker skillnad i både humör och fysisk prestationsförmåga.',
    product: 'Vikingfuel - Testo-support',
    date: 'April 2026',
  },
];

export default function ReviewsSection() {
  const [visibleReviews, setVisibleReviews] = useState(10);

  const showMoreReviews = () => {
    if (visibleReviews === 10) {
      setVisibleReviews(20);
    } else if (visibleReviews === 20) {
      setVisibleReviews(25);
    }
  };

  const displayedReviews = reviews.slice(0, visibleReviews);
  const hasMoreReviews = visibleReviews < reviews.length;

  return (
    <section id="reviews" className="py-20 bg-muted/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="section-label block mb-3">Recensioner</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
            Vad våra kunder säger
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Icon key={i} name="StarIcon" size={18} variant="solid" />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">4.9 av 5</span>
            <span className="text-sm text-muted-foreground">({reviews.length} recensioner)</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {displayedReviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl p-6 border border-border hover:shadow-product transition-all duration-300"
            >
              {/* Stars */}
              <div className={`flex text-yellow-400 ${review.image ? 'mb-4' : 'mb-2'}`}>
                {[...Array(review.rating)].map((_, j) => (
                  <Icon key={j} name="StarIcon" size={15} variant="solid" />
                ))}
              </div>

              {/* Review Image */}
              {review.image && (
                <div className="mb-4 rounded-xl overflow-hidden aspect-[9/16]">
                  <AppImage
                    src={review.image}
                    alt={`Recension från ${review.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}

              <p className={`text-sm text-foreground leading-relaxed italic ${review.image ? 'mb-6' : 'mb-4'}`}>
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{review.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {review.location} · {review.date}
                  </p>
                </div>
                <span className="text-[10px] font-medium text-primary bg-accent px-2 py-1 rounded-full whitespace-nowrap">
                  {review.product}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show More Button */}
        {hasMoreReviews && (
          <div className="text-center mt-12">
            <button
              onClick={showMoreReviews}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full text-base hover:bg-green-400 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Visa mer recensioner
              <Icon name="ChevronDownIcon" size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}