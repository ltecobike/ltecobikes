const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  const toggleMenu = () => {
    const isOpen = mainNav.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  };

  menuToggle.addEventListener("click", toggleMenu);

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = mainNav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      mainNav.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const revealElements = document.querySelectorAll(".section, .card, .feature-box, .contact-box, .cta-box");

revealElements.forEach((el) => {
  el.classList.add("reveal");
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, {
  threshold: 0.12
});

revealElements.forEach((el) => observer.observe(el));

const carousels = document.querySelectorAll("[data-carousel]");

carousels.forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(track.querySelectorAll(".carousel-card"));
  const dotsContainer = carousel.querySelector("[data-carousel-dots]");
  const controlsRoot = carousel.parentElement;
  const prevBtn = controlsRoot.querySelector("[data-carousel-prev]");
  const nextBtn = controlsRoot.querySelector("[data-carousel-next]");
  const autoplayEnabled = carousel.dataset.autoplay === "true";

  if (!track || !slides.length) return;

  let index = 0;
  let pages = 1;
  let perView = 1;
  let autoplayId = null;

  const getGap = () => {
    const styles = window.getComputedStyle(track);
    return parseFloat(styles.columnGap || styles.gap || 0);
  };

  const getPerView = () => {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  const buildDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";

    for (let i = 0; i < pages; i += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Ir al grupo ${i + 1}`);
      dot.addEventListener("click", () => {
        index = i;
        update();
        restartAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  };

  const update = () => {
    perView = getPerView();
    pages = Math.max(1, Math.ceil(slides.length / perView));
    if (index >= pages) index = 0;

    const gap = getGap();
    const firstSlide = slides[0];
    const slideWidth = firstSlide.getBoundingClientRect().width;
    const offset = index * (slideWidth + gap) * perView;

    track.style.transform = `translateX(-${offset}px)`;

    const dots = dotsContainer ? dotsContainer.querySelectorAll(".carousel-dot") : [];
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
    });
  };

  const next = () => {
    index = (index + 1) % pages;
    update();
  };

  const prev = () => {
    index = (index - 1 + pages) % pages;
    update();
  };

  const stopAutoplay = () => {
    if (autoplayId) {
      clearInterval(autoplayId);
      autoplayId = null;
    }
  };

  const startAutoplay = () => {
    if (!autoplayEnabled || pages <= 1) return;
    stopAutoplay();
    autoplayId = setInterval(next, 4500);
  };

  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  buildDots();
  update();
  startAutoplay();

  nextBtn?.addEventListener("click", () => {
    next();
    restartAutoplay();
  });

  prevBtn?.addEventListener("click", () => {
    prev();
    restartAutoplay();
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", startAutoplay);

  window.addEventListener("resize", () => {
    const oldPages = pages;
    update();
    if (pages !== oldPages) {
      buildDots();
      update();
    }
  });
});


const galleries = document.querySelectorAll("[data-gallery]");

galleries.forEach((gallery) => {
  const track = gallery.querySelector(".card-gallery-track");
  const slides = Array.from(gallery.querySelectorAll(".card-gallery-slide"));
  const prevBtn = gallery.querySelector("[data-gallery-prev]");
  const nextBtn = gallery.querySelector("[data-gallery-next]");
  const dotsContainer = gallery.querySelector("[data-gallery-dots]");
  const autoplayEnabled = gallery.dataset.autoplay === "true";

  if (!track || !slides.length) return;

  let index = 0;
  let autoplayId = null;

  if (slides.length <= 1) {
    gallery.classList.add("single-slide");
  }

  const buildDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";

    slides.forEach((_, slideIndex) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "card-gallery-dot";
      dot.setAttribute("aria-label", `Ir a la foto ${slideIndex + 1}`);
      dot.addEventListener("click", () => {
        index = slideIndex;
        update();
        restartAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  };

  const update = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    const dots = dotsContainer ? dotsContainer.querySelectorAll(".card-gallery-dot") : [];
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
    });
  };

  const next = () => {
    index = (index + 1) % slides.length;
    update();
  };

  const prev = () => {
    index = (index - 1 + slides.length) % slides.length;
    update();
  };

  const stopAutoplay = () => {
    if (autoplayId) {
      clearInterval(autoplayId);
      autoplayId = null;
    }
  };

  const startAutoplay = () => {
    if (!autoplayEnabled || slides.length <= 1) return;
    stopAutoplay();
    autoplayId = setInterval(next, 3200);
  };

  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  buildDots();
  update();
  startAutoplay();

  nextBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    next();
    restartAutoplay();
  });

  prevBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    prev();
    restartAutoplay();
  });

  gallery.addEventListener("mouseenter", stopAutoplay);
  gallery.addEventListener("mouseleave", startAutoplay);
  gallery.addEventListener("focusin", stopAutoplay);
  gallery.addEventListener("focusout", startAutoplay);
});
