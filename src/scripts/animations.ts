import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

// Live SplitText instances, so ClientRouter page-loads can revert the
// previous page's splits before re-splitting fresh DOM.
let splits: SplitText[] = [];

export function initAnimations() {
  // ClientRouter navigations re-run this on every astro:page-load:
  // tear down the previous page's triggers before wiring the new one.
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  splits.forEach((split) => split.revert());
  splits = [];

  if (reduced.matches) {
    // CSS already keeps everything visible under reduced motion; nothing to run.
    return;
  }

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
    if (words.length) {
      // The mask does the hiding, so the words stay opaque: they ride up
      // from behind the clipped line instead of fading. Position and
      // opacity are set in one call so no frame shows the resting state.
      gsap.set(words, { autoAlpha: 1, yPercent: 130 });
      tl.to(
        words,
        { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.045 },
        "-=0.2",
      );
    }
    if (sub.length)
      tl.fromTo(
        sub,
        { y: 18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5 },
        "-=0.3",
      );
    if (cta.length)
      // Buttons fade in place, no vertical travel, so the row never shifts.
      tl.fromTo(
        cta,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.4, stagger: 0.08 },
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

  /* -- navbar condenses into a floating glass pill after first scroll - */
  const header = document.querySelector("[data-site-header]");
  if (header) {
    ScrollTrigger.create({
      start: 48,
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

  /* -- split text: company names decode in per character (random
       order, blur + fade) as they scroll into view --------------------- */
  document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    const split = new SplitText(el, { type: "chars" });
    splits.push(split);

    gsap.from(split.chars, {
      opacity: 0,
      y: 6,
      filter: "blur(10px)",
      duration: 0.6,
      ease: "power2.out",
      stagger: { each: 0.035, from: "random" },
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });
}
