import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

if (reduced.matches) {
  // CSS already keeps everything visible under reduced motion; nothing to run.
} else {
  /* -- hero: choreographed entrance --------------------------------- */
  const heroBits = document.querySelectorAll("[data-hero-anim]");
  if (heroBits.length) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const eyebrow = document.querySelectorAll("[data-hero-eyebrow]");
    const words = document.querySelectorAll("[data-hero-title] .hero-word");
    const sub = document.querySelectorAll("[data-hero-sub]");
    const cta = document.querySelectorAll("[data-hero-cta] > *");
    const card = document.querySelectorAll("[data-hero-card]");

    if (eyebrow.length)
      tl.fromTo(
        eyebrow,
        { y: 14, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.45 },
      );
    if (words.length)
      tl.fromTo(
        words,
        { y: 26, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.05 },
        "-=0.2",
      );
    if (sub.length)
      tl.fromTo(
        sub,
        { y: 18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5 },
        "-=0.3",
      );
    if (cta.length)
      tl.fromTo(
        cta,
        { y: 14, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.08 },
        "-=0.25",
      );
    if (card.length)
      tl.fromTo(
        card,
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.65 },
        "-=0.5",
      );
  }

  /* -- scroll reveals ------------------------------------------------ */
  gsap.set("[data-reveal]", { y: 24 });

  ScrollTrigger.batch("[data-reveal]", {
    start: "top 88%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        y: 0,
        autoAlpha: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        overwrite: true,
      }),
  });

  /* -- stagger groups: children cascade in ---------------------------- */
  document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
    const items = group.children;
    if (!items.length) return;

    gsap.set(items, { y: 20, autoAlpha: 0 });
    ScrollTrigger.create({
      trigger: group,
      start: "top 85%",
      once: true,
      onEnter: () =>
        gsap.to(items, {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.07,
        }),
    });
  });

  /* -- navbar gains presence after first scroll ---------------------- */
  const header = document.querySelector("[data-site-header]");
  if (header) {
    ScrollTrigger.create({
      start: 24,
      end: "max",
      onUpdate: (self) =>
        header.setAttribute("data-scrolled", String(self.isActive)),
    });
  }

  /* -- hero glow drifts slower than the page -------------------------- */
  document.querySelectorAll<HTMLElement>("[data-glow]").forEach((glow) => {
    gsap.to(glow, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: glow.closest("section") ?? glow,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}
