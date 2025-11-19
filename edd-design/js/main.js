const doc = document;
const body = doc.body;

const yearEl = doc.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const hamburger = doc.querySelector('.hamburger');
const mobileMenu = doc.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
  const toggleMenu = () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.classList.toggle('open');
    mobileMenu.setAttribute('aria-hidden', expanded ? 'true' : 'false');
  };

  hamburger.addEventListener('click', toggleMenu);
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

// Smooth scroll fallback for browsers without CSS support
const navLinks = doc.querySelectorAll('a[href^="#"]');
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId !== '#') {
      const targetEl = doc.querySelector(targetId);
      if (targetEl) {
        event.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// Portfolio modal logic
const portfolioModal = doc.querySelector('[data-modal="portfolio"]');
const thanksModal = doc.querySelector('[data-modal="thanks"]');
const modalImage = portfolioModal?.querySelector('.modal-image');
const modalTitle = portfolioModal?.querySelector('.modal-title');
const modalCategory = portfolioModal?.querySelector('.modal-category');
const modalDescription = portfolioModal?.querySelector('.modal-description');

const openModal = (modal) => {
  modal?.classList.add('active');
  body.style.overflow = 'hidden';
};

const closeModals = () => {
  doc.querySelectorAll('.modal-overlay').forEach((overlay) => overlay.classList.remove('active'));
  body.style.overflow = '';
};

portfolioModal?.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal-overlay') || event.target.classList.contains('modal-close')) {
    closeModals();
  }
});

thanksModal?.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal-overlay') || event.target.classList.contains('modal-close')) {
    closeModals();
  }
});

doc.querySelectorAll('.modal-close').forEach((btn) => btn.addEventListener('click', closeModals));

const projectCards = doc.querySelectorAll('.portfolio-card');
projectCards.forEach((card) => {
  card.addEventListener('click', () => {
    const projectData = card.getAttribute('data-project');
    if (projectData) {
      const { title, category, image, description } = JSON.parse(projectData);
      if (modalImage) modalImage.src = image;
      if (modalImage) modalImage.alt = title;
      if (modalTitle) modalTitle.textContent = title;
      if (modalCategory) modalCategory.textContent = category;
      if (modalDescription) modalDescription.textContent = description;
      openModal(portfolioModal);
    }
  });
});

// Contact form validation
const contactForm = doc.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    [contactForm.name, contactForm.email, contactForm.message].forEach((field) => {
      field.classList.remove('error');
    });

    if (!name) {
      contactForm.name.classList.add('error');
      isValid = false;
    }
    if (!email || !emailPattern.test(email)) {
      contactForm.email.classList.add('error');
      isValid = false;
    }
    if (!message) {
      contactForm.message.classList.add('error');
      isValid = false;
    }

    if (isValid) {
      contactForm.reset();
      openModal(thanksModal);
    }
  });
}

// Fade-in observer
const animatedBlocks = doc.querySelectorAll('[data-animate]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  animatedBlocks.forEach((el) => observer.observe(el));
} else {
  animatedBlocks.forEach((el) => el.classList.add('visible'));
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModals();
  }
});
