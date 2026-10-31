import { lazy, useEffect, useState } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { LazySection } from './components/LazySection';
import { Nav } from './components/Nav';
import { RetroSkin } from './components/RetroSkin';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { CursorProvider } from './providers/CursorProvider';
import { SmoothScrollProvider, useSmoothScroll } from './providers/SmoothScrollProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import Footer from './sections/Footer';
import Hero from './sections/Hero';
import Motto from './sections/Motto';
import Origin from './sections/Origin';
import Preloader, { shouldShowPreloader } from './sections/Preloader';
import Timeline from './sections/Timeline';
import WhatWeDid from './sections/WhatWeDid';

const ShopOnline = lazy(() => import('./sections/ShopOnline'));
const MvpBuilder = lazy(() => import('./sections/MvpBuilder'));
const Lessons = lazy(() => import('./sections/Lessons'));
const NextChapter = lazy(() => import('./sections/NextChapter'));

function Story() {
  const reduced = usePrefersReducedMotion();
  const { goToSection } = useSmoothScroll();
  const [booting, setBooting] = useState(() => shouldShowPreloader(reduced));

  // Arriving on a link like /#timeline should land there once the sections can be measured.
  useEffect(() => {
    if (booting) return;
    const id = window.location.hash.slice(1);
    if (id && id !== 'main') void goToSection(id);
  }, [booting, goToSection]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to the story
      </a>
      {booting && <Preloader onDone={() => setBooting(false)} />}
      <Nav />
      <main id="main">
        <Hero revealed={!booting} />
        <Origin />
        <Motto />
        <LazySection world="hinge" placeholderHeight="140vh">
          <ShopOnline />
        </LazySection>
        <WhatWeDid />
        <LazySection world="screen" placeholderHeight="130vh">
          <MvpBuilder />
        </LazySection>
        <Timeline />
        <LazySection world="screen" placeholderHeight="110vh">
          <Lessons />
        </LazySection>
        <LazySection world="night" placeholderHeight="130vh">
          <NextChapter />
        </LazySection>
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
      <CustomCursor />
      <RetroSkin />
    </>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <SmoothScrollProvider>
        <CursorProvider>
          <Story />
        </CursorProvider>
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}
