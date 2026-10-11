// Interactive Logic for Karikalan Catering

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        document.body.classList.remove('no-scroll');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });

    // Close menu when clicking outside (background)
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        document.body.classList.remove('no-scroll');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      }
    });
  }

  // 2. Header Scroll Effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 3. Animated Number Counters (Triggers smoothly on scroll)
  const counterElements = document.querySelectorAll('.stat-count');
  let countersAnimated = false;

  function runCounters() {
    counterElements.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 3000; // ms
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function: easeOutExpo
        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = Math.floor(easeOut * target);

        counter.textContent = currentVal.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          counter.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  // IntersectionObserver to start counting when stats enter view
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          runCounters();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  } else {
    runCounters();
  }

  // 4. Interactive Carousel with Autoplay & Touch / Button Controls
  const track = document.getElementById('carouselTrack');
  const slides = document.querySelectorAll('.carousel-slide');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  let currentSlide = 0;
  let carouselInterval;
  const slideCount = slides.length;

  if (track && slideCount > 0) {
    // Generate dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      });
    }

    function updateCarousel() {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentSlide);
      });

      const dots = dotsContainer?.querySelectorAll('.dot');
      dots?.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });
    }

    function goToSlide(idx) {
      currentSlide = (idx + slideCount) % slideCount;
      updateCarousel();
      resetAutoplay();
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    prevBtn?.addEventListener('click', prevSlide);
    nextBtn?.addEventListener('click', nextSlide);

    function startAutoplay() {
      carouselInterval = setInterval(nextSlide, 4500);
    }

    function resetAutoplay() {
      clearInterval(carouselInterval);
      startAutoplay();
    }

    startAutoplay();

    // Pause on hover
    const carouselBox = document.querySelector('.carousel-container');
    if (carouselBox) {
      carouselBox.addEventListener('mouseenter', () => clearInterval(carouselInterval));
      carouselBox.addEventListener('mouseleave', () => startAutoplay());
    }

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 45) {
        nextSlide();
      } else if (touchEndX - touchStartX > 45) {
        prevSlide();
      }
    }, { passive: true });
  }

  // 5. One-Click Scroll to Top Button (Gentle, slow ease-in-out scroll)
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const startPosition = window.scrollY;
      if (startPosition <= 0) return;

      const duration = 1200; // 1.2s for a slow, gentle glide to top
      let startTime = null;
      const html = document.documentElement;
      const prevScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto'; // Temporarily disable CSS smooth behavior for custom duration

      function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, Math.round(startPosition * (1 - ease)));

        if (timeElapsed < duration) {
          requestAnimationFrame(step);
        } else {
          window.scrollTo(0, 0);
          html.style.scrollBehavior = prevScrollBehavior;
        }
      }

      requestAnimationFrame(step);
    });
  }

  // ==========================================
  // Story Cards Slider & Lightbox Modal
  // ==========================================
  const storyTrack = document.getElementById('storyTrack');
  const storyPrev = document.getElementById('storyPrev');
  const storyNext = document.getElementById('storyNext');
  const storyCards = document.querySelectorAll('.story-card');
  const storyModal = document.getElementById('storyModal');
  const storyModalClose = document.getElementById('storyModalClose');
  const storyModalBackdrop = document.getElementById('storyModalBackdrop');
  const modalStoryImg = document.getElementById('modalStoryImg');
  const modalStoryTitle = document.getElementById('modalStoryTitle');
  const modalStoryBadge = document.getElementById('modalStoryBadge');
  const modalStoryDesc = document.getElementById('modalStoryDesc');

  if (storyTrack && storyPrev && storyNext) {
    const scrollAmount = 300;
    storyPrev.addEventListener('click', () => {
      storyTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    storyNext.addEventListener('click', () => {
      storyTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  if (storyCards.length && storyModal) {
    function openStoryModal(card) {
      const img = card.querySelector('img');
      const title = card.getAttribute('data-title') || card.querySelector('.story-card-title')?.innerText || '';
      const badge = card.getAttribute('data-badge') || 'Story Feature';
      const desc = card.getAttribute('data-desc') || '';

      if (modalStoryImg && img) {
        modalStoryImg.src = img.src;
        modalStoryImg.alt = title;
      }
      if (modalStoryTitle) modalStoryTitle.innerText = title;
      if (modalStoryBadge) modalStoryBadge.innerHTML = `<i class="fa-solid fa-crown text-gold"></i> ${badge}`;
      if (modalStoryDesc) modalStoryDesc.innerText = desc;

      storyModal.classList.add('active');
      document.body.classList.add('no-scroll');
    }

    function closeStoryModal() {
      storyModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }

    storyCards.forEach(card => {
      card.addEventListener('click', () => openStoryModal(card));
    });

    if (storyModalClose) {
      storyModalClose.addEventListener('click', closeStoryModal);
    }
    if (storyModalBackdrop) {
      storyModalBackdrop.addEventListener('click', closeStoryModal);
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && storyModal.classList.contains('active')) {
        closeStoryModal();
      }
    });
  }
});

