/* ============================================================
   DATAURUM — Main JavaScript
   Navigation, Animations, Form Handling
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollReveal();
  initContactForm();
  initSmoothScroll();
});


/* ============================================================
   NAVIGATION
   ============================================================ */
function initNavigation() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const mobileMenu = document.querySelector('.nav__mobile');
  const mobileLinks = mobileMenu?.querySelectorAll('a');

  // Compact nav on scroll
  let lastScroll = 0;
  const scrollThreshold = 60;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > scrollThreshold) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;

    // Update active nav link
    updateActiveNavLink();
  }, { passive: true });

  // Mobile menu toggle
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.contains('open');
      
      if (isOpen) {
        closeMobileMenu(toggle, mobileMenu);
      } else {
        openMobileMenu(toggle, mobileMenu);
      }
    });

    // Close menu on link click
    mobileLinks?.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu(toggle, mobileMenu);
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.classList.contains('open')) {
        closeMobileMenu(toggle, mobileMenu);
      }
    });
  }
}

function openMobileMenu(toggle, menu) {
  toggle.classList.add('open');
  menu.classList.add('open');
  document.body.classList.add('menu-open');
  toggle.setAttribute('aria-expanded', 'true');
}

function closeMobileMenu(toggle, menu) {
  toggle.classList.remove('open');
  menu.classList.remove('open');
  document.body.classList.remove('menu-open');
  toggle.setAttribute('aria-expanded', 'false');
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  
  let currentSection = '';
  const scrollPos = window.scrollY + 200;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href && href.substring(1) === currentSection) {
      link.classList.add('active');
    }
  });
}


/* ============================================================
   SCROLL REVEAL ANIMATIONS
   ============================================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    revealElements.forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => {
    observer.observe(el);
  });
}


/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');

  anchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = document.querySelector('.nav')?.offsetHeight || 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}


/* ============================================================
   CONTACT FORM
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const statusEl = document.getElementById('form-status');
    const originalText = submitBtn.textContent;

    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Gather form data
    const formData = {
      name: form.querySelector('#name').value,
      company: form.querySelector('#company').value,
      email: form.querySelector('#email').value,
      phone: form.querySelector('#phone').value,
      subject: form.querySelector('#subject').value,
      message: form.querySelector('#message').value
    };

    try {
      /* ===================================================
         EMAIL JS INTEGRATION
         ===================================================
         To activate email sending:
         
         1. Go to https://www.emailjs.com/ and create a free account
         2. Add an Email Service (e.g., Gmail) connected to:
            Hassantariqzaidi133@gmail.com
         3. Create an Email Template with these variables:
            {{name}}, {{company}}, {{email}}, {{phone}},
            {{subject}}, {{message}}
         4. Replace the placeholders below with your actual IDs:
            - YOUR_PUBLIC_KEY  → found in Account > API Keys
            - YOUR_SERVICE_ID  → found in Email Services
            - YOUR_TEMPLATE_ID → found in Email Templates
         5. Uncomment the emailjs code below and remove the
            simulated success timeout.
         =================================================== */

      // --- Uncomment after EmailJS setup ---
      // emailjs.init('YOUR_PUBLIC_KEY');
      // await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
      //   from_name: formData.name,
      //   from_company: formData.company,
      //   from_email: formData.email,
      //   from_phone: formData.phone,
      //   subject: formData.subject,
      //   message: formData.message,
      //   to_email: 'Hassantariqzaidi133@gmail.com'
      // });

      // Simulated success (remove after EmailJS setup)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      showFormStatus(statusEl, 'success', 'Thank you. Your inquiry has been sent successfully. We\'ll be in touch soon.');
      form.reset();

    } catch (error) {
      console.error('Form submission error:', error);
      showFormStatus(statusEl, 'error', 'Something went wrong. Please try again or contact us via WhatsApp.');
    }

    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  });
}

function showFormStatus(el, type, message) {
  if (!el) return;

  el.className = 'form-status ' + type;
  el.textContent = message;
  el.style.display = 'block';

  // Auto-hide after 8 seconds
  setTimeout(() => {
    el.style.display = 'none';
  }, 8000);
}
