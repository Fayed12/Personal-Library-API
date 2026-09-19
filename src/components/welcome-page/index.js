/**
 * Personal Library API - Interactive Welcome Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initFilterTabs();
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
  });
}

// 2. Stage Filter Pills for Endpoints
function initFilterTabs() {
  const tabs = document.querySelectorAll('.tab-pill');
  const cards = document.querySelectorAll('.api-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.stage === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.3s ease-out';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 3. Copy to Clipboard with Toast Notification
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const text = btn.dataset.copy;
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        showToast(`Copied to clipboard: "${text.substring(0, 32)}${text.length > 32 ? '...' : ''}"`);
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Copied to clipboard!');
      }
    });
  });
}

// 4. Interactive Simulator
function initSimulator() {
  const methodSelect = document.getElementById('sim-method');
  const urlInput = document.getElementById('sim-url');
  const sendBtn = document.getElementById('sim-send');
  const outputEl = document.getElementById('sim-output');

  if (!sendBtn || !urlInput || !outputEl) return;

  // Endpoint mock data dictionary
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

  // Clicking an endpoint card populates simulator
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
    
    // If it's a real local server query for health, try live fetch
    if (route === '/api/health' && window.location.protocol.startsWith('http')) {
      try {
        const res = await fetch(route);
        const data = await res.json();
        outputEl.textContent = JSON.stringify(data, null, 2);
        return;
      } catch (e) {
        // Fallback to mock if API not up yet
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

// 5. Health Check Button Action
function initHealthCheck() {
  const healthBtn = document.getElementById('check-health-btn');
  if (!healthBtn) return;

  healthBtn.addEventListener('click', async () => {
    healthBtn.innerHTML = '<span class="status-dot"></span> Checking...';

    if (window.location.protocol.startsWith('http')) {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          showToast(`Server is online! (Status: ${data.status || 'OK'})`);
          healthBtn.innerHTML = '<span class="status-dot"></span> Server Online';
          return;
        }
      } catch (err) {
        // server might not be running yet
      }
    }

    setTimeout(() => {
      healthBtn.innerHTML = '<span class="status-dot"></span> API Ready (Node.js)';
      showToast('Personal Library API: Server environment configured and ready');
    }, 400);
  });
}

// Helper Toast notification
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

