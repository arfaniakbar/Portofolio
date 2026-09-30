/**
 * ============================================================================
 * MUHAMMAD ARFANI AKBAR — PORTFOLIO INTERACTIONS & ANIMATION ENGINE
 * Ultra-Smooth, Responsive, Elegant
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. THEME SWITCHER (DARK / LIGHT) ---
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  // Check saved preference or system theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    htmlRoot.classList.remove('dark', 'light');
    htmlRoot.classList.add(savedTheme);
  } else {
    // Default to dark
    htmlRoot.classList.add('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      if (htmlRoot.classList.contains('dark')) {
        htmlRoot.classList.remove('dark');
        htmlRoot.classList.add('light');
        localStorage.setItem('theme', 'light');
      } else {
        htmlRoot.classList.remove('light');
        htmlRoot.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // --- 2. READING SCROLL PROGRESS BAR & NAVBAR SHADOW ---
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const navbarWrapper = document.getElementById('navbarWrapper');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / docHeight) * 100;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercentage}%`;
    }

    if (navbarWrapper) {
      if (scrollTop > 30) {
        navbarWrapper.classList.add('scrolled');
      } else {
        navbarWrapper.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // --- 3. MOBILE MENU DRAWER ---
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMobileMenu() {
    if (!mobileToggle || !mobileDrawer) return;
    const isOpen = mobileToggle.classList.toggle('open');
    mobileDrawer.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileToggle && mobileDrawer && mobileDrawer.classList.contains('active')) {
        mobileToggle.classList.remove('open');
        mobileDrawer.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // --- 4. LIVE WITA CLOCK (BANJARMASIN / ASIA-MAKASSAR) ---
  const localTimeDisplay = document.getElementById('localTimeDisplay');
  function updateLiveClock() {
    if (!localTimeDisplay) return;
    try {
      const now = new Date();
      const timeString = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Makassar',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now);
      localTimeDisplay.textContent = `${timeString} WITA`;
    } catch (e) {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      localTimeDisplay.textContent = `${h}:${m}:${s} WITA`;
    }
  }
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // --- 5. STATS COUNTER ANIMATION ---
  const statCounters = document.querySelectorAll('.counter');
  let countersStarted = false;

  function runCounters() {
    statCounters.forEach((counter) => {
      const target = +counter.getAttribute('data-target') || 0;
      const duration = 1800; // ms
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease Out Quart
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easeOut * target);

        counter.textContent = currentCount;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          counter.textContent = target;
        }
      }
      requestAnimationFrame(updateNumber);
    });
  }

  // --- 6. SCROLL REVEAL (INTERSECTION OBSERVER) ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // Check if hero stats are revealed to start counting
        if (!countersStarted && entry.target.closest('#beranda') || entry.target.classList.contains('hero-stats-row')) {
          countersStarted = true;
          runCounters();
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el) => revealObserver.observe(el));

  // Run counters for hero on load
  setTimeout(() => {
    if (!countersStarted) {
      countersStarted = true;
      runCounters();
    }
  }, 400);

  // --- 7. ACTIVE NAVIGATION LINK HIGHLIGHTER ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightActiveNavLink() {
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNavLink, { passive: true });

  // --- 8. SKILLS CATEGORY FILTER TABS ---
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      skillTabs.forEach((btn) => btn.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          // subtle re-animate
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --- 9. 3D CARD TILT EFFECT (DESKTOP) ---
  const profileCard = document.getElementById('profileCard');
  if (profileCard && window.matchMedia('(pointer: fine)').matches) {
    profileCard.addEventListener('mousemove', (e) => {
      const rect = profileCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      profileCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    profileCard.addEventListener('mouseleave', () => {
      profileCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  // --- 10. CERTIFICATE LIGHTBOX MODAL ---
  const certModal = document.getElementById('certModal');
  const modalCertImg = document.getElementById('modalCertImg');
  const modalCaption = document.getElementById('modalCaption');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const certCards = document.querySelectorAll('.cert-card');

  function openCertModal(imageSrc, title) {
    if (!certModal || !modalCertImg || !modalCaption) return;
    modalCertImg.src = imageSrc;
    modalCaption.textContent = title;
    certModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCertModal() {
    if (!certModal) return;
    certModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  certCards.forEach((card) => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-cert');
      const title = card.getAttribute('data-title') || 'Pratinjau Sertifikat';
      openCertModal(imgSrc, title);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCertModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeCertModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
      closeCertModal();
    }
  });

  // --- 11. 1-CLICK EMAIL COPY & TOAST NOTIFICATION ---
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(title, message) {
    if (!toastNotification) return;
    if (toastTitle) toastTitle.textContent = title;
    if (toastMessage) toastMessage.textContent = message;

    toastNotification.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3500);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'arfaniakbar99@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast('Berhasil Disalin!', `${email} telah disalin ke clipboard.`);

        const originalHtml = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Tersalin!</span>';
        setTimeout(() => {
          copyEmailBtn.innerHTML = originalHtml;
        }, 2000);
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Berhasil Disalin!', `${email} telah disalin ke clipboard.`);
      }
    });
  }

  // --- 12. CONTACT FORM DISPATCH (EMAIL REDIRECT) ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName')?.value || '';
      const email = document.getElementById('senderEmail')?.value || '';
      const subject = document.getElementById('senderSubject')?.value || '';
      const message = document.getElementById('senderMessage')?.value || '';

      if (!name || !email || !message) {
        showToast('Perhatian', 'Mohon lengkapi data nama, email, dan pesan Anda.');
        return;
      }

      // Construct Direct Email Mailto Link
      const mailtoSubject = subject ? `[Portofolio] ${subject}` : 'Pesan Baru dari Portofolio Web';
      const mailtoBody = `Halo Arfani Akbar,\n\nSaya ${name} (${email}).\n\nTopik/Subjek:\n${subject || '-'}\n\nIsi Pesan:\n${message}\n\n---\nDikirim dari Portofolio Web`;
      const mailtoUrl = `mailto:arfaniakbar99@gmail.com?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;

      showToast('Mengalihkan...', 'Membuka aplikasi Email Anda untuk mengirim pesan.');

      setTimeout(() => {
        window.location.href = mailtoUrl;
        contactForm.reset();
      }, 1000);
    });
  }

  // --- 13. BACK TO TOP BUTTON ---
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 14. DYNAMIC YEAR IN FOOTER ---
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
