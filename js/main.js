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
  // Story Cards Infinite Loop Slider & Lightbox Modal
  // ==========================================
  const storyTrack = document.getElementById('storyTrack');
  const storyPrev = document.getElementById('storyPrev');
  const storyNext = document.getElementById('storyNext');
  const storyModal = document.getElementById('storyModal');
  const storyModalClose = document.getElementById('storyModalClose');
  const storyModalBackdrop = document.getElementById('storyModalBackdrop');
  const modalStoryImg = document.getElementById('modalStoryImg');
  const modalStoryVideo = document.getElementById('modalStoryVideo');
  const modalStoryTitle = document.getElementById('modalStoryTitle');
  const modalStoryBadge = document.getElementById('modalStoryBadge');
  const modalStoryDesc = document.getElementById('modalStoryDesc');

  let startAutoScroll = () => {};
  let stopAutoScroll = () => {};

  if (storyTrack) {
    const originalCards = Array.from(storyTrack.querySelectorAll('.story-card'));
    const totalOriginal = originalCards.length;

    if (totalOriginal > 1) {
      // 1. Clone cards for infinite seamless scrolling in both directions
      const prependClones = originalCards.map(c => {
        const clone = c.cloneNode(true);
        clone.classList.add('story-card-clone');
        return clone;
      });
      const appendClones = originalCards.map(c => {
        const clone = c.cloneNode(true);
        clone.classList.add('story-card-clone');
        return clone;
      });

      // Prepend in correct order
      prependClones.reverse().forEach(clone => {
        storyTrack.insertBefore(clone, storyTrack.firstChild);
      });
      // Append in correct order
      appendClones.forEach(clone => {
        storyTrack.appendChild(clone);
      });

      // Ensure videos in cloned cards autoplay properly
      storyTrack.querySelectorAll('video').forEach(vid => {
        vid.muted = true;
        vid.playsInline = true;
        vid.play().catch(() => {});
      });

      function getCardStep() {
        const firstCard = storyTrack.querySelector('.story-card');
        if (!firstCard) return 320;
        const gap = parseFloat(window.getComputedStyle(storyTrack).gap) || 20;
        return firstCard.offsetWidth + gap;
      }

      function getSetWidth() {
        return totalOriginal * getCardStep();
      }

      // Initial scroll position: place viewport on the original set (middle)
      function setInitialScroll() {
        const setWidth = getSetWidth();
        storyTrack.style.scrollBehavior = 'auto';
        storyTrack.scrollLeft = setWidth;
        setTimeout(() => {
          storyTrack.style.scrollBehavior = 'smooth';
        }, 120);
      }

      requestAnimationFrame(setInitialScroll);
      window.addEventListener('resize', () => {
        const step = getCardStep();
        if (!step) return;
        const currentIdx = Math.round(storyTrack.scrollLeft / step) % totalOriginal;
        storyTrack.style.scrollBehavior = 'auto';
        storyTrack.scrollLeft = getSetWidth() + (currentIdx * step);
        setTimeout(() => {
          storyTrack.style.scrollBehavior = 'smooth';
        }, 80);
      });

      // Seamless infinite loop normalization
      let isNormalizing = false;
      function normalizeInfiniteScroll() {
        if (isNormalizing) return;
        const step = getCardStep();
        const setWidth = getSetWidth();
        if (!setWidth || !step) return;

        // If scrolled into the appended clone set (past the last original card)
        if (storyTrack.scrollLeft >= setWidth * 2 - step * 0.3) {
          isNormalizing = true;
          storyTrack.style.scrollBehavior = 'auto';
          storyTrack.style.scrollSnapType = 'none';
          storyTrack.scrollLeft -= setWidth;
          void storyTrack.offsetWidth;
          storyTrack.style.scrollSnapType = '';
          setTimeout(() => {
            storyTrack.style.scrollBehavior = 'smooth';
            isNormalizing = false;
          }, 50);
        }
        // If scrolled into the prepended clone set (before the first original card)
        else if (storyTrack.scrollLeft <= step * 0.7) {
          isNormalizing = true;
          storyTrack.style.scrollBehavior = 'auto';
          storyTrack.style.scrollSnapType = 'none';
          storyTrack.scrollLeft += setWidth;
          void storyTrack.offsetWidth;
          storyTrack.style.scrollSnapType = '';
          setTimeout(() => {
            storyTrack.style.scrollBehavior = 'smooth';
            isNormalizing = false;
          }, 50);
        }
      }

      // Listen for scroll end (native scrollend + debounced fallback)
      let scrollEndDebounce = null;
      storyTrack.addEventListener('scroll', () => {
        clearTimeout(scrollEndDebounce);
        scrollEndDebounce = setTimeout(normalizeInfiniteScroll, 160);
      }, { passive: true });
      storyTrack.addEventListener('scrollend', normalizeInfiniteScroll);

      // Auto-scroll loop
      const autoScrollDelay = 3000;
      let autoScrollInterval = null;

      function autoScrollNext() {
        if (!storyTrack) return;
        const step = getCardStep();
        storyTrack.scrollBy({ left: step, behavior: 'smooth' });
      }

      startAutoScroll = function() {
        stopAutoScroll();
        autoScrollInterval = setInterval(autoScrollNext, autoScrollDelay);
      };

      stopAutoScroll = function() {
        if (autoScrollInterval) {
          clearInterval(autoScrollInterval);
          autoScrollInterval = null;
        }
      };

      startAutoScroll();

      // Pause on hover & touch
      storyTrack.addEventListener('mouseenter', stopAutoScroll);
      storyTrack.addEventListener('mouseleave', () => {
        if (!storyModal || !storyModal.classList.contains('active')) {
          startAutoScroll();
        }
      });
      storyTrack.addEventListener('touchstart', stopAutoScroll, { passive: true });
      storyTrack.addEventListener('touchend', () => {
        if (!storyModal || !storyModal.classList.contains('active')) {
          startAutoScroll();
        }
      }, { passive: true });

      if (storyPrev && storyNext) {
        storyPrev.addEventListener('click', () => {
          stopAutoScroll();
          storyTrack.scrollBy({ left: -getCardStep(), behavior: 'smooth' });
          startAutoScroll();
        });
        storyNext.addEventListener('click', () => {
          stopAutoScroll();
          storyTrack.scrollBy({ left: getCardStep(), behavior: 'smooth' });
          startAutoScroll();
        });
      }
    }
  }

  // Story Lightbox Modal
  if (storyTrack && storyModal) {
    function openStoryModal(card) {
      const img = card.querySelector('img');
      const video = card.querySelector('video');
      const videoSrc = card.getAttribute('data-video') || (video ? video.getAttribute('src') : null);
      const title = card.getAttribute('data-title') || card.querySelector('.story-card-title')?.innerText || '';
      const badge = card.getAttribute('data-badge') || 'Story Feature';
      const desc = card.getAttribute('data-desc') || '';

      if (videoSrc) {
        if (modalStoryImg) modalStoryImg.style.display = 'none';
        if (modalStoryVideo) {
          modalStoryVideo.src = videoSrc;
          modalStoryVideo.style.display = 'block';
          modalStoryVideo.currentTime = 0;
          modalStoryVideo.play().catch(() => {});
        }
      } else {
        if (modalStoryVideo) {
          modalStoryVideo.pause();
          modalStoryVideo.removeAttribute('src');
          modalStoryVideo.style.display = 'none';
        }
        if (modalStoryImg && img) {
          modalStoryImg.style.display = 'block';
          modalStoryImg.src = img.src;
          modalStoryImg.alt = title;
        }
      }

      if (modalStoryTitle) modalStoryTitle.innerText = title;
      if (modalStoryBadge) modalStoryBadge.innerHTML = `<i class="fa-solid fa-crown text-gold"></i> ${badge}`;
      if (modalStoryDesc) modalStoryDesc.innerText = desc;

      stopAutoScroll();
      storyModal.classList.add('active');
      document.body.classList.add('no-scroll');
    }

    function closeStoryModal() {
      if (modalStoryVideo) {
        modalStoryVideo.pause();
        modalStoryVideo.removeAttribute('src');
        modalStoryVideo.load();
      }
      storyModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
      startAutoScroll();
    }

    // Event delegation on storyTrack handles both original and cloned cards
    storyTrack.addEventListener('click', (e) => {
      const card = e.target.closest('.story-card');
      if (card) {
        openStoryModal(card);
      }
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

