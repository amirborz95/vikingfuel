import React from 'react';
import SmoothScroll from './components/SmoothScroll';
import Nav from './components/Nav';
import Preloader from './components/Preloader';
import TrustMarquee from './components/sections/TrustMarquee';
import HowTo from './components/sections/HowTo';
import BrandFilm from './components/sections/BrandFilm';
import Pricing from './components/sections/Pricing';
import Reviews from './components/sections/Reviews';
import Quality from './components/sections/Quality';
import Faq from './components/sections/Faq';
import Footer from './components/sections/Footer';
import MobileStage from './components/sections/MobileStage';
import ClientStage from './components/ClientStage';

export default function V2Page() {
  return (
    <SmoothScroll>
      <Preloader />
      <Nav />

      <main>
        {/* The pinned film: hero → assembly → hold → ingredient ring → handoff */}
        <ClientStage />
        <MobileStage />

        <TrustMarquee />

        {/* Below the stage the product is done acting: the hand keeps it and
            carries it out of frame, and nothing floats over the sections after */}
        <Pricing />
        <HowTo />
        <BrandFilm />
        <Reviews />
        <Quality />

        <Faq />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
