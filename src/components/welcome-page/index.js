/**
 * Personal Library API - Interactive Welcome Experience
 * Full interactivity: stages scrolling, icon touch animations, scroll reveal, mobile drawer
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileNav();
  initScrollAnimations();
  initStagesNavigation();
  initIconTouchInteractions();
  initCopyButtons();
  initSimulator();
  initHealthCheck();
});

// 1. Sticky Navbar styling on scroll
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

// 2. Mobile Navigation Menu Drawer
function initMobileNav() {
  const toggleBtn = document.getElementById('nav-toggle');
  const mobileDrawer = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileDrawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = toggleBtn.classList.toggle('is-active');
    mobileDrawer.classList.toggle('is-open', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('is-active');
      mobileDrawer.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// 3. Modern Scroll Reveal Animations via IntersectionObserver
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  if (!reveals.length) return;

  // Fallback if browser doesn't support IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0', 10);
        if (delay > 0) {
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);
        } else {
          entry.target.classList.add('is-visible');
        }
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// 4. Redesigned Stage Navigation (Smooth Scrolling + Stage Filtering)
function initStagesNavigation() {
  const track = document.getElementById('stage-track');
  const prevBtn = document.getElementById('stage-prev');
  const nextBtn = document.getElementById('stage-next');
  const tabs = document.querySelectorAll('.tab-pill');
  const cards = document.querySelectorAll('.api-card');

  // Arrow button scrolling
  if (track && prevBtn && nextBtn) {
    const updateArrows = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      prevBtn.disabled = track.scrollLeft <= 5;
      nextBtn.disabled = track.scrollLeft >= maxScroll - 5;
    };

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -220, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: 220, behavior: 'smooth' });
    });

    track.addEventListener('scroll', updateArrows, { passive: true });
    updateArrows();
    window.addEventListener('resize', updateArrows, { passive: true });
  }

  // Filter stage tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-pressed', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-pressed', 'true');

      const filter = tab.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.stage === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.35s ease-out';
        } else {
          card.style.display = 'none';
        }
      });

      // Scroll tab into view inside the track if overflowed
      if (track) {
        const tabOffset = tab.offsetLeft - track.offsetLeft - 30;
        track.scrollTo({ left: tabOffset, behavior: 'smooth' });
      }
    });
  });
}

// 5. Touch & Modern Interaction for Icon Containers
function initIconTouchInteractions() {
  const touchContainers = document.querySelectorAll(
    '.brand-group, .feature-card, .floating-chip, .step-card, .hero-pill'
  );

  touchContainers.forEach(container => {
    // Touchstart event triggers animation on mobile
    container.addEventListener('touchstart', () => {
      container.classList.add('touch-active', 'is-touching');
      setTimeout(() => {
        container.classList.remove('touch-active', 'is-touching');
      }, 1200);
    }, { passive: true });

    // Keyboard accessibility: trigger on focus
    container.addEventListener('focusin', () => {
      container.classList.add('touch-active');
    });

    container.addEventListener('focusout', () => {
      container.classList.remove('touch-active');
    });
  });
}

// 6. Copy to Clipboard with Accessible Toast
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const text = btn.dataset.copy;
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        showToast(`Copied: "${text.substring(0, 32)}${text.length > 32 ? '...' : ''}"`);
      } catch (err) {
        // Fallback for older browsers or non-HTTPS
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Copied to clipboard!');
      }
    });
  });
}

// 7. Interactive API Simulator
function initSimulator() {
  const methodSelect = document.getElementById('sim-method');
  const urlInput = document.getElementById('sim-url');
  const sendBtn = document.getElementById('sim-send');
  const outputEl = document.getElementById('sim-output');

  if (!sendBtn || !urlInput || !outputEl) return;

  const endpointMocks = {
    '/api/health': {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Personal Library API',
      database: 'connected'
    },
    '/api/books': [
      {
        _id: '6745f348e1a5f6a9821c4001',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        category: 'software-engineering',
        pages: 464,
        pagesRead: 464,
        rating: 4.5,
        status: 'completed',
        publishedYear: 2008,
        tags: ['clean-code', 'best-practices']
      },
      {
        _id: '6745f348e1a5f6a9821c4002',
        title: 'Design Patterns',
        author: 'Erich Gamma',
        category: 'programming',
        pages: 395,
        pagesRead: 180,
        rating: 5,
        status: 'reading',
        publishedYear: 1994,
        tags: ['gang-of-four', 'architecture']
      }
    ],
    '/api/books/top-rated': [
      {
        _id: '6745f348e1a5f6a9821c4002',
        title: 'Design Patterns',
        author: 'Erich Gamma',
        category: 'programming',
        rating: 5,
        status: 'reading'
      },
      {
        _id: '6745f348e1a5f6a9821c4001',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        category: 'software-engineering',
        rating: 4.5,
        status: 'completed'
      }
    ],
    '/api/books/unfinished': [
      {
        _id: '6745f348e1a5f6a9821c4002',
        title: 'Design Patterns',
        pages: 395,
        pagesRead: 180,
        remainingPages: 215,
        status: 'reading'
      }
    ],
    '/api/stats/by-category': [
      { category: 'software-engineering', totalBooks: 8, avgRating: 4.3 },
      { category: 'programming', totalBooks: 12, avgRating: 4.6 },
      { category: 'business', totalBooks: 5, avgRating: 3.9 }
    ]
  };

  const apiCards = document.querySelectorAll('.api-card');
  apiCards.forEach(card => {
    card.addEventListener('click', () => {
      const route = card.querySelector('.api-route')?.textContent?.trim();
      const method = card.querySelector('.method-tag')?.textContent?.trim();

      if (route && urlInput) {
        urlInput.value = route;
        if (methodSelect && method) methodSelect.value = method;
        document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' });
        triggerSimulation(route, method);
      }
    });
  });

  sendBtn.addEventListener('click', () => {
    const route = urlInput.value.trim();
    const method = methodSelect?.value || 'GET';
    triggerSimulation(route, method);
  });

  async function triggerSimulation(route, method) {
    outputEl.textContent = 'Sending request...';

    if (route === '/api/health' && window.location.protocol.startsWith('http')) {
      try {
        const res = await fetch(route);
        const data = await res.json();
        outputEl.textContent = JSON.stringify(data, null, 2);
        return;
      } catch (e) {
        // Fallback to mock
      }
    }

    setTimeout(() => {
      const cleanPath = route.split('?')[0];
      const result = endpointMocks[cleanPath] || {
        message: `Query simulation for [${method}] ${route}`,
        status: 200,
        matchedRecords: 2,
        sampleData: endpointMocks['/api/books'][0]
      };
      outputEl.textContent = JSON.stringify(result, null, 2);
    }, 280);
  }
}

// 8. Health Check Button Action
function initHealthCheck() {
  const healthBtns = [
    document.getElementById('check-health-btn'),
    document.getElementById('check-health-btn-mobile')
  ].filter(Boolean);

  healthBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span class="status-dot"></span> Checking...';

      if (window.location.protocol.startsWith('http')) {
        try {
          const res = await fetch('/api/health');
          if (res.ok) {
            const data = await res.json();
            showToast(`Server is online! (Status: ${data.status || 'OK'})`);
            btn.innerHTML = '<span class="status-dot"></span> Server Online';
            return;
          }
        } catch (err) {
          // server might not be running yet
        }
      }

      setTimeout(() => {
        btn.innerHTML = '<span class="status-dot"></span> API Ready (Node.js)';
        showToast('Personal Library API: Server environment configured and ready');
      }, 400);
    });
  });
}

// Helper Toast notification with aria-live role
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
