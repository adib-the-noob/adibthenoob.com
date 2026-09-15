/* Per-page UI wiring. Runs on every astro:page-load (initial load and
   each ClientRouter navigation), so it always binds to fresh DOM. */

let clockTimer: ReturnType<typeof setInterval> | undefined;
let swapHooked = false;

function applyTheme() {
  try {
    const stored = localStorage.getItem("theme");
    const light = stored
      ? stored === "light"
      : window.matchMedia("(prefers-color-scheme: light)").matches;
    document.documentElement.classList.toggle("light", light);
  } catch {
    /* private mode — fall back to whatever is already applied */
  }
}

export function initUI() {
  /* -- mobile menu ---------------------------------------------------- */
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.getElementById("mobile-menu");

  if (toggle instanceof HTMLButtonElement && menu) {
    const sync = (open: boolean) => {
      toggle.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
    };

    toggle.addEventListener("click", () => {
      sync(menu.hidden);
    });

    toggle.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !menu.hidden) sync(false);
    });

    document.querySelectorAll("[data-menu-close]").forEach((link) => {
      link.addEventListener("click", () => sync(false));
    });
  }

  /* -- light/dark toggle ---------------------------------------------- */
  const themeToggle = document.querySelector("[data-theme-toggle]");

  if (themeToggle instanceof HTMLButtonElement) {
    themeToggle.addEventListener("click", () => {
      const light = document.documentElement.classList.toggle("light");
      try {
        localStorage.setItem("theme", light ? "light" : "dark");
      } catch {
        /* private mode — choice just won't persist */
      }
    });
  }

  /* -- hero status card: live Dhaka clock ----------------------------- */
  const clock = document.getElementById("dhaka-clock");

  if (clock) {
    if (clockTimer) clearInterval(clockTimer);
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Dhaka",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => {
      clock.textContent = fmt.format(new Date());
    };
    tick();
    clockTimer = setInterval(tick, 1000);
  }

  /* -- ClientRouter swaps replace <html> attributes with the incoming
        page's (which carry no classes) — restore js/theme after every
        swap so the reveal gates and white mode survive navigation. --- */
  if (!swapHooked) {
    swapHooked = true;
    document.addEventListener("astro:after-swap", () => {
      document.documentElement.classList.add("js");
      applyTheme();
    });
  }
}
