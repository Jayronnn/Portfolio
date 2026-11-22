/* =========================================================
   NAVIGATION, MOBILE MENU, SCROLL REVEAL, FILTERS, FORM & SNAP
   ========================================================= */
(function () {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinksList = document.getElementById("nav-links");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const reveals = document.querySelectorAll(".reveal");

  // 1. Mobile Menu Toggle
  if (menuToggle && navLinksList) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinksList.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navLinksList.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 2. Active Navigation Highlight on Scroll
  function updateActiveLink() {
    const scrollPos = window.scrollY + 180;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  }

  // 3. Scroll Reveal Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((el) => observer.observe(el));

  // 4. Interactive Projects Carousel & Category Filter
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = Array.from(document.querySelectorAll(".project-card"));
  const track = document.getElementById("projects-track");
  const prevBtn = document.getElementById("projects-prev");
  const nextBtn = document.getElementById("projects-next");
  const dotsContainer = document.getElementById("carousel-dots");
  const controls = document.querySelector(".carousel-controls");

  let currentIndex = 0;

  function getCardsPerView() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 960) return 2;
    return 3;
  }

  function getVisibleCards() {
    return projectCards.filter((card) => !card.classList.contains("is-hidden"));
  }

  function updateCarousel(newIndex = currentIndex) {
    if (!track) return;
    const visibleCards = getVisibleCards();
    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, visibleCards.length - cardsPerView);

    currentIndex = Math.min(Math.max(newIndex, 0), maxIndex);

    if (visibleCards.length > 0 && currentIndex > 0) {
      const card = visibleCards[0];
      const cardWidth = card.getBoundingClientRect().width;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
      const offset = currentIndex * (cardWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;
    } else {
      track.style.transform = "translateX(0px)";
    }

    if (prevBtn) {
      prevBtn.disabled = currentIndex <= 0;
      prevBtn.classList.toggle("disabled", currentIndex <= 0);
    }
    if (nextBtn) {
      nextBtn.disabled = currentIndex >= maxIndex;
      nextBtn.classList.toggle("disabled", currentIndex >= maxIndex);
    }

    if (controls) {
      controls.style.display = visibleCards.length <= cardsPerView ? "none" : "flex";
    }

    if (dotsContainer) {
      dotsContainer.innerHTML = "";
      const totalDots = maxIndex + 1;
      if (totalDots > 1) {
        for (let i = 0; i < totalDots; i++) {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = `carousel-dot ${i === currentIndex ? "active" : ""}`;
          dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
          dot.addEventListener("click", () => updateCarousel(i));
          dotsContainer.appendChild(dot);
        }
      }
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => updateCarousel(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => updateCarousel(currentIndex + 1));
  }

  // Filter Buttons
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        const shouldShow = filter === "all" || category === filter;
        card.classList.toggle("is-hidden", !shouldShow);
      });

      updateCarousel(0);
    });
  });

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  if (track) {
    track.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    track.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            updateCarousel(currentIndex + 1);
          } else {
            updateCarousel(currentIndex - 1);
          }
        }
      },
      { passive: true }
    );
  }

  window.addEventListener("resize", () => {
    updateCarousel(currentIndex);
  });

  // Initialize carousel position
  updateCarousel(0);

  // 5. Contact Form Submission
  const contactForm = document.getElementById("contact-form");
  const formFeedback = document.getElementById("form-feedback");

  if (contactForm && formFeedback) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      );

      formFeedback.textContent =
        "Opening your email client to send the message...";
      window.location.href = `mailto:jayronmallari@gmail.com?subject=${subject}&body=${body}`;

      contactForm.reset();
    });
  }

  // 6. Desktop One-Scroll Section Snap (1 wheel tick = next/prev section)
  let isScrollingSection = false;
  const sectionList = Array.from(sections);

  window.addEventListener(
    "wheel",
    (e) => {
      // Payagan ang browser zoom (Ctrl + Scroll o touchpad pinch-to-zoom)
      if (e.ctrlKey || e.metaKey) return;

      // Desktop (> 960px) lang; normal scroll pa rin sa mobile
      if (window.innerWidth <= 960) return;

      // Huwag mag-snap kapag nag-i-scroll sa loob ng textarea
      if (e.target.closest("textarea")) return;

      e.preventDefault();
      if (isScrollingSection || Math.abs(e.deltaY) < 10) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const currentScroll = window.scrollY + window.innerHeight * 0.4;

      let currentIndex = sectionList.findIndex(
        (sec) =>
          currentScroll >= sec.offsetTop &&
          currentScroll < sec.offsetTop + sec.offsetHeight
      );

      if (currentIndex === -1) currentIndex = 0;

      const nextIndex = Math.min(
        Math.max(currentIndex + direction, 0),
        sectionList.length - 1
      );

      if (nextIndex !== currentIndex) {
        isScrollingSection = true;
        sectionList[nextIndex].scrollIntoView({ behavior: "smooth" });

        setTimeout(() => {
          isScrollingSection = false;
        }, 750);
      }
    },
    { passive: false }
  );

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();
})();