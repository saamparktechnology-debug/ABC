document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // STICKY HEADER & SCROLL TRANSFORMATIONS
  // ==========================================
  const header = document.querySelector('header');

  function checkHeaderScroll() {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  }

  window.addEventListener('scroll', checkHeaderScroll);
  checkHeaderScroll(); // Initial check on load

  // ==========================================
  // MOBILE NAVIGATION DRAWER
  // ==========================================
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('nav ul li a');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');

      // Prevent body scrolling when menu is open
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ==========================================
  // TAB SYSTEM (ABOUT PAGE)
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-header-btn');
  const tabPanels = document.querySelectorAll('.tab-content-panel');

  if (tabButtons.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePanel = document.getElementById(targetTab);
        if (activePanel) {
          activePanel.classList.add('active');
        }
      });
    });
  }

  // ==========================================
  // FAQ ACCORDION (SERVICES PAGE)
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other FAQs
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-answer').style.maxHeight = null;
          }
        });

        // Toggle current FAQ
        item.classList.toggle('active');

        if (!isActive) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = null;
        }
      });
    });
  }

  // ==========================================
  // PORTFOLIO FILTER SYSTEM
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-grid .portfolio-card');

  if (filterButtons.length > 0 && portfolioItems.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.classList.remove('hide');
          } else {
            item.classList.add('hide');
          }
        });

        // Refresh AOS scroll animations on filter change
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }
      });
    });
  }

  // ==========================================
  // PREMIUM CUSTOM VANILLA LIGHTBOX
  // ==========================================
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

  if (lightboxTriggers.length > 0) {
    // Create lightbox HTML structure dynamically
    const lightboxModal = document.createElement('div');
    lightboxModal.className = 'lightbox-modal';
    lightboxModal.innerHTML = `
      <span class="lightbox-close">&times;</span>
      <span class="lightbox-nav lightbox-prev"><i class="fas fa-chevron-left"></i></span>
      <span class="lightbox-nav lightbox-next"><i class="fas fa-chevron-right"></i></span>
      <img class="lightbox-content" src="" alt="Popup Image">
      <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(lightboxModal);

    const closeBtn = lightboxModal.querySelector('.lightbox-close');
    const prevBtn = lightboxModal.querySelector('.lightbox-prev');
    const nextBtn = lightboxModal.querySelector('.lightbox-next');
    const lightboxImg = lightboxModal.querySelector('.lightbox-content');
    const lightboxCaption = lightboxModal.querySelector('.lightbox-caption');

    let currentGallery = [];
    let currentIndex = 0;

    // Open Lightbox
    lightboxTriggers.forEach((trigger, index) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();

        // Find all triggers that are currently visible (i.e., not filtered out)
        currentGallery = Array.from(lightboxTriggers).filter(trig => {
          // If trigger is within a portfolio-card, verify card is visible
          const card = trig.closest('.portfolio-card');
          if (card) {
            return !card.classList.contains('hide');
          }
          return true;
        });

        // Find index of clicked trigger in the visible gallery
        currentIndex = currentGallery.indexOf(trigger);

        showLightboxImage();
        lightboxModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      });
    });

    function showLightboxImage() {
      if (currentGallery.length === 0) return;
      const targetTrigger = currentGallery[currentIndex];
      const imgSrc = targetTrigger.getAttribute('href');
      const imgTitle = targetTrigger.getAttribute('data-title') || '';
      const imgCategory = targetTrigger.getAttribute('data-category') || '';

      lightboxImg.src = imgSrc;
      lightboxCaption.innerHTML = `<h3>${imgTitle}</h3><p>${imgCategory}</p>`;

      // Show/Hide prev/next arrows based on gallery size
      prevBtn.style.display = currentGallery.length > 1 ? 'block' : 'none';
      nextBtn.style.display = currentGallery.length > 1 ? 'block' : 'none';
    }

    // Close Lightbox
    closeBtn.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    function closeLightbox() {
      lightboxModal.style.display = 'none';
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }

    // Next Image
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % currentGallery.length;
      showLightboxImage();
    });

    // Previous Image
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
      showLightboxImage();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightboxModal.style.display === 'block') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight' && currentGallery.length > 1) {
          currentIndex = (currentIndex + 1) % currentGallery.length;
          showLightboxImage();
        }
        if (e.key === 'ArrowLeft' && currentGallery.length > 1) {
          currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
          showLightboxImage();
        }
      }
    });
  }

  // ==========================================
  // CONTACT FORM VALIDATION & TOAST ALERT
  // ==========================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    // Dynamic Label Animation Fallback Helper
    const inputs = contactForm.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        if (input.value !== "") {
          input.classList.add('has-value');
        } else {
          input.classList.remove('has-value');
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const phoneInput = document.getElementById('phone');
      const messageInput = document.getElementById('message');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      let isValid = true;

      // Clear previous error states (if any)
      inputs.forEach(input => {
        input.style.borderColor = '';
      });

      if (!name) {
        if (nameInput) nameInput.style.borderColor = '#ff4444';
        isValid = false;
      }

      if (!phone) {
        if (phoneInput) phoneInput.style.borderColor = '#ff4444';
        isValid = false;
      }

      if (!message) {
        if (messageInput) messageInput.style.borderColor = '#ff4444';
        isValid = false;
      }

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin" style="margin-left: 8px;"></i>';

        const interestInput = document.getElementById('interest');
        const interest = interestInput ? interestInput.value : '';

        fetch("https://formsubmit.co/ajax/abdul.mukim.6471@gmail.com", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            Name: name,
            Phone: phone,
            Interest: interest,
            Message: message
          })
        })
          .then(response => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            if (response.ok) {
              showToast('Thank you! Your inquiry has been received. Our team will contact you shortly.', 'success');
              contactForm.reset();
              inputs.forEach(input => input.classList.remove('has-value'));
            } else {
              showToast('Something went wrong. Please try again later.', 'error');
            }
          })
          .catch(error => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            showToast('Failed to send details. Please check your connection.', 'error');
          });
      } else {
        showToast('Please fill in all required fields.', 'error');
      }
    });

    function validateEmail(email) {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).toLowerCase());
    }
  }

  // ==========================================
  // TOAST NOTIFICATION UTILITY
  // ==========================================
  function showToast(message, type = 'success') {
    let toast = document.querySelector('.toast-msg');

    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <i class="${type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}" 
         style="color: ${type === 'success' ? '#c5a880' : '#ff4444'}; font-size: 1.2rem;"></i>
      <span>${message}</span>
    `;

    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // ==========================================
  // SWIPER SLIDERS INITIALIZATION
  // ==========================================

  // Hero Slider
  if (document.querySelector('.hero-slider')) {
    new Swiper('.hero-slider', {
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      speed: 1000,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  // Testimonials Slider
  if (document.querySelector('.testimonials-slider')) {
    new Swiper('.testimonials-slider', {
      loop: true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
      speed: 800,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }

  // Portfolio Slider (Home Page Preview)
  if (document.querySelector('.portfolio-preview-slider')) {
    new Swiper('.portfolio-preview-slider', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 30,
        }
      }
    });
  }

  // ==========================================
  // AOS ANIMATIONS INITIALIZATION
  // ==========================================
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic'
    });
  }
});
