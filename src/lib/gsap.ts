import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Restoring a mid-page scroll races with pinned and lazy sections, so a reload starts at the top.
// ScrollTrigger owns history.scrollRestoration, so a direct assignment would get overwritten.
ScrollTrigger.clearScrollMemory('manual');

export { gsap, ScrollTrigger, useGSAP };
