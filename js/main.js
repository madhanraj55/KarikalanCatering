// Interactive Logic for Karikalan Catering

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // 2. Header Scroll Effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 3. Dynamic Menu Filter
  const tabButtons = document.querySelectorAll('.tab-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-category');

      menuCards.forEach(card => {
        if (filterCategory === 'all' || card.getAttribute('data-category') === filterCategory) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4. Live Quote Calculator
  const guestSlider = document.getElementById('guestSlider');
  const guestCountDisplay = document.getElementById('guestCountDisplay');
  const feastType = document.getElementById('feastType');
  const eventDate = document.getElementById('eventDate');
  const clientName = document.getElementById('clientName');
  const clientPhone = document.getElementById('clientPhone');

  const summaryGuests = document.getElementById('summaryGuests');
  const summaryPackage = document.getElementById('summaryPackage');
  const summaryRate = document.getElementById('summaryRate');
  const summaryTotal = document.getElementById('summaryTotal');
  const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');

  // Rates in INR per plate
  const packageRates = {
    'elai-saapadu': { name: 'Traditional Banana Leaf Royal Feast (Veg)', rate: 350 },
    'royal-nonveg': { name: 'Chozha Arasu Non-Veg Royal Biryani Feast', rate: 550 },
    'grand-wedding': { name: 'Grand Chola Wedding Feast (Veg + Non-Veg)', rate: 700 },
    'mini-tiffin': { name: 'Royal Evening Tiffin & Live Counters', rate: 250 }
  };

  function updateQuotation() {
    if (!guestSlider || !feastType) return;

    const count = parseInt(guestSlider.value, 10);
    const selectedPkg = packageRates[feastType.value] || packageRates['elai-saapadu'];

    if (guestCountDisplay) guestCountDisplay.textContent = count;
    if (summaryGuests) summaryGuests.textContent = count + ' Guests';
    if (summaryPackage) summaryPackage.textContent = selectedPkg.name;
    if (summaryRate) summaryRate.textContent = '₹' + selectedPkg.rate + ' / plate';

    const totalEstimate = count * selectedPkg.rate;
    if (summaryTotal) summaryTotal.textContent = '₹' + totalEstimate.toLocaleString('en-IN');
  }

  if (guestSlider) {
    guestSlider.addEventListener('input', updateQuotation);
  }
  if (feastType) {
    feastType.addEventListener('change', updateQuotation);
  }

  // Initial Calculation
  updateQuotation();

  // 5. WhatsApp Direct Booking Integration
  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const name = clientName?.value?.trim() || 'Guest';
      const phone = clientPhone?.value?.trim() || 'Not specified';
      const date = eventDate?.value || 'Upcoming Date';
      const count = guestSlider ? guestSlider.value : '200';
      const selectedPkg = packageRates[feastType?.value || 'elai-saapadu'];
      const total = (parseInt(count, 10) * selectedPkg.rate).toLocaleString('en-IN');

      const message = `*👑 PATTANAM KARIKALAN CATERING BOOKING INQUIRY 👑*
---------------------------------------
*Client Name:* ${name}
*Contact Number:* ${phone}
*Event Date:* ${date}
*Guests:* ${count} Persons
*Selected Feast:* ${selectedPkg.name}
*Estimated Budget:* ₹${total} (Approx)
---------------------------------------
Hello Karikalan Catering Team, I would like to check availability and confirm details for our celebration!`;

      // Official WhatsApp Number from the board: 9894579444
      const waNumber = '919894579444';
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

      window.open(waUrl, '_blank');
    });
  }
});
