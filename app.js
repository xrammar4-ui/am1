(function () {
  /* Custom cursor */
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener("mousemove", e => {
    mx = e.clientX;
    my = e.clientY;
    if (dot) {
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    }
  });

  function animRing() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    if (ring) {
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
    }
    requestAnimationFrame(animRing);
  }
  animRing();

  document.querySelectorAll("a, button, [data-service], .faq-question, .project-card, .stack-card").forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });
  document.addEventListener("mousedown", () => document.body.classList.add("cursor-click"));
  document.addEventListener("mouseup", () => document.body.classList.remove("cursor-click"));

  /* Header hide on scroll down */
  let lastY = 0;
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y > 80 && y > lastY) header.classList.add("hide");
    else header.classList.remove("hide");
    lastY = y;
  }, { passive: true });

  /* Service accordion */
  document.querySelectorAll("[data-service]").forEach(item => {
    item.querySelector(".service-header").addEventListener("click", () => {
      const open = item.classList.contains("open");
      document.querySelectorAll("[data-service]").forEach(i => i.classList.remove("open"));
      if (!open) item.classList.add("open");
    });
  });

  /* FAQ accordion */
  document.querySelectorAll(".faq-item").forEach(item => {
    item.querySelector(".faq-question").addEventListener("click", () => {
      const open = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
      if (!open) item.classList.add("open");
    });
  });

  /* Language menu */
  const langBtn = document.getElementById("langBtn");
  const langMenu = document.getElementById("langMenu");
  langBtn.addEventListener("click", e => {
    e.stopPropagation();
    langMenu.classList.toggle("open");
  });
  document.addEventListener("click", () => langMenu.classList.remove("open"));
  langMenu.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      setLanguage(btn.dataset.lang, btn.dataset.dir);
      langMenu.classList.remove("open");
    });
  });

  /* Reveal on scroll */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

  /* Stats count-up */
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) {
          cur = target;
          clearInterval(t);
        }
        el.textContent = cur + "+";
      }, 35);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".stat-num").forEach(el => countObs.observe(el));


  /* Card stack shuffle */
  (function initStack() {
    const stack = document.getElementById("cardStack");
    if (!stack) return;
    const cards = Array.from(stack.querySelectorAll(".stack-card"));
    let order = cards.map((_, i) => i);
    let animating = false;

    function layout() {
      order.forEach((cardIdx, pos) => {
        const card = cards[cardIdx];
        const depth = pos;
        const scale = 1 - depth * 0.04;
        const y = depth * 14;
        const rot = depth * 1.8 * (depth % 2 === 0 ? 1 : -1);
        const z = cards.length - depth;
        card.style.zIndex = String(z);
        card.style.transform = `translateY(${y}px) scale(${scale}) rotate(${rot}deg)`;
        card.style.opacity = depth > 3 ? "0" : String(1 - depth * 0.08);
        card.style.pointerEvents = pos === 0 ? "auto" : "none";
      });
    }

    function shuffle() {
      if (animating) return;
      animating = true;
      const topIdx = order[0];
      const topCard = cards[topIdx];

      // fly out
      topCard.style.transition = "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s";
      topCard.style.transform = "translateY(-40px) translateX(30px) rotate(12deg) scale(0.95)";
      topCard.style.opacity = "0";

      setTimeout(() => {
        order = order.slice(1).concat(order[0]);
        // reset top card transition briefly then layout
        cards.forEach(c => { c.style.transition = "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.55s, box-shadow 0.55s"; });
        layout();
        animating = false;
      }, 320);
    }

    layout();
    stack.addEventListener("click", shuffle);
    // also allow clicking the top card specifically
    cards.forEach(c => c.addEventListener("click", e => { e.stopPropagation(); shuffle(); }));
  })();

  /* Init language */
  const saved = localStorage.getItem("evex-lang") || "en";
  const savedDir = localStorage.getItem("evex-dir") || "ltr";
  if (typeof setLanguage === "function") setLanguage(saved, savedDir);
})();
