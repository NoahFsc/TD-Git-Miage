// Breadcrumb scroll indicator with color adapting to current section
(function () {
  const bc = document.getElementById("breadcrumb");
  if (!bc) return;

  const list = bc.querySelector("ul");
  const dot = bc.querySelector(".bc-dot");
  const links = Array.from(bc.querySelectorAll("a[data-target]"));
  const sections = links
    .map((a) => a.getAttribute("data-target"))
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  // Smooth scroll fallback for older browsers
  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("data-target");
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  function getAccentColor(el) {
    const c = getComputedStyle(el).getPropertyValue("--accent").trim();
    return c || "#0ea5a6";
  }

  function activate(sectionId) {
    const link = links.find((l) => l.getAttribute("data-target") === sectionId);
    const section = document.getElementById(sectionId);
    if (!link || !section) return;

    links.forEach((l) => l.classList.toggle("is-active", l === link));

    // Move the dot next to the active link
    const linkRect = link.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    const centerY = linkRect.top - listRect.top + linkRect.height / 2;
    bc.style.setProperty("--dot-top", `${centerY}px`);

    // Update accent color on breadcrumb
    const accent = getAccentColor(section);
    bc.style.setProperty("--bc-accent", accent);
    dot.style.backgroundColor = accent;
  }

  let activeId = null;

  function updateActive() {
    if (!sections.length) return;
    const viewportCenter = window.innerHeight / 2;
    let best = null;
    let bestDist = Infinity;
    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const dist = Math.abs(center - viewportCenter);
      if (dist < bestDist) {
        bestDist = dist;
        best = sec;
      }
    }
    if (best && best.id !== activeId) {
      activeId = best.id;
      activate(best.id);
    } else if (best && activeId) {
      // Keep dot aligned when resizing/layout shifts
      activate(activeId);
    }
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
    }
  });
  window.addEventListener("resize", updateActive);
  window.addEventListener("load", updateActive);
})();
