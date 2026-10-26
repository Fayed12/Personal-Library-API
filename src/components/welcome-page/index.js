/**
 * Personal Library API - Interactive Welcome Experience & Offline Simulation Engine
 * Modern Vanilla JS with realistic API mocks matching the true backend behavior.
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

  if (track && prevBtn && nextBtn) {
    const updateArrows = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      prevBtn.disabled = track.scrollLeft <= 5;
      nextBtn.disabled = track.scrollLeft >= maxScroll - 5;
    };

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -240, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: 240, behavior: 'smooth' });
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
    container.addEventListener('touchstart', () => {
      container.classList.add('touch-active', 'is-touching');
      setTimeout(() => {
        container.classList.remove('touch-active', 'is-touching');
      }, 1200);
    }, { passive: true });

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

// ============================================================================
// 7. High-Fidelity Mock Database & Offline Simulation Engine (booksData.json based)
// ============================================================================

const SEED_BOOKS = [
  { "_id": "66f1a1000000000000000001", "title": "Clean Code", "author": "Robert C. Martin", "category": "software-engineering", "pages": 464, "pagesRead": 464, "currentPage": 464, "rating": 4.5, "status": "completed", "publishedYear": 2008, "tags": ["clean-code", "best-practices"], "createdAt": "2026-01-10T10:00:00.000Z", "updatedAt": "2026-01-10T10:00:00.000Z" },
  { "_id": "66f1a1000000000000000002", "title": "The Pragmatic Programmer", "author": "Andrew Hunt", "category": "software-engineering", "pages": 352, "pagesRead": 352, "currentPage": 352, "rating": 4.5, "status": "completed", "publishedYear": 1999, "tags": ["best-practices", "career"], "createdAt": "2026-01-11T11:15:00.000Z", "updatedAt": "2026-01-11T11:15:00.000Z" },
  { "_id": "66f1a1000000000000000003", "title": "Eloquent JavaScript", "author": "Marijn Haverbeke", "category": "programming", "pages": 472, "pagesRead": 200, "currentPage": 200, "rating": 4.0, "status": "reading", "publishedYear": 2018, "tags": ["javascript", "fundamentals"], "createdAt": "2026-01-12T12:00:00.000Z", "updatedAt": "2026-01-12T12:00:00.000Z" },
  { "_id": "66f1a1000000000000000004", "title": "You Don't Know JS Yet", "author": "Kyle Simpson", "category": "programming", "pages": 200, "pagesRead": 200, "currentPage": 200, "rating": 4.0, "status": "completed", "publishedYear": 2020, "tags": ["javascript", "fundamentals"], "createdAt": "2026-01-13T14:30:00.000Z", "updatedAt": "2026-01-13T14:30:00.000Z" },
  { "_id": "66f1a1000000000000000005", "title": "Node.js Design Patterns", "author": "Mario Casciaro", "category": "programming", "pages": 660, "pagesRead": 120, "currentPage": 120, "rating": 4.5, "status": "reading", "publishedYear": 2020, "tags": ["nodejs", "design-patterns"], "createdAt": "2026-01-14T09:20:00.000Z", "updatedAt": "2026-01-14T09:20:00.000Z" },
  { "_id": "66f1a1000000000000000006", "title": "MongoDB: The Definitive Guide", "author": "Shannon Bradshaw", "category": "programming", "pages": 514, "pagesRead": 0, "currentPage": 0, "rating": 0, "status": "planned", "publishedYear": 2019, "tags": ["mongodb", "databases"], "createdAt": "2026-01-15T16:00:00.000Z", "updatedAt": "2026-01-15T16:00:00.000Z" },
  { "_id": "66f1a1000000000000000007", "title": "Designing Data-Intensive Applications", "author": "Martin Kleppmann", "category": "software-engineering", "pages": 616, "pagesRead": 616, "currentPage": 616, "rating": 5.0, "status": "completed", "publishedYear": 2017, "tags": ["databases", "architecture"], "createdAt": "2026-01-16T17:45:00.000Z", "updatedAt": "2026-01-16T17:45:00.000Z" },
  { "_id": "66f1a1000000000000000008", "title": "Refactoring", "author": "Martin Fowler", "category": "software-engineering", "pages": 448, "pagesRead": 90, "currentPage": 90, "rating": 4.0, "status": "reading", "publishedYear": 2018, "tags": ["refactoring", "best-practices"], "createdAt": "2026-01-17T08:10:00.000Z", "updatedAt": "2026-01-17T08:10:00.000Z" },
  { "_id": "66f1a1000000000000000009", "title": "The Mythical Man-Month", "author": "Frederick Brooks", "category": "software-engineering", "pages": 336, "pagesRead": 0, "currentPage": 0, "rating": 0, "status": "planned", "publishedYear": 1975, "tags": ["project-management", "classic"], "createdAt": "2026-01-18T13:00:00.000Z", "updatedAt": "2026-01-18T13:00:00.000Z" },
  { "_id": "66f1a1000000000000000010", "title": "The Lean Startup", "author": "Eric Ries", "category": "business", "pages": 336, "pagesRead": 336, "currentPage": 336, "rating": 4.0, "status": "completed", "publishedYear": 2011, "tags": ["startups", "strategy"], "createdAt": "2026-01-19T10:30:00.000Z", "updatedAt": "2026-01-19T10:30:00.000Z" },
  { "_id": "66f1a1000000000000000011", "title": "Zero to One", "author": "Peter Thiel", "category": "business", "pages": 224, "pagesRead": 224, "currentPage": 224, "rating": 4.5, "status": "completed", "publishedYear": 2014, "tags": ["startups", "strategy"], "createdAt": "2026-01-20T11:50:00.000Z", "updatedAt": "2026-01-20T11:50:00.000Z" },
  { "_id": "66f1a1000000000000000012", "title": "Good to Great", "author": "Jim Collins", "category": "business", "pages": 320, "pagesRead": 0, "currentPage": 0, "rating": 0, "status": "planned", "publishedYear": 2001, "tags": ["management", "strategy"], "createdAt": "2026-01-21T15:20:00.000Z", "updatedAt": "2026-01-21T15:20:00.000Z" },
  { "_id": "66f1a1000000000000000013", "title": "Sapiens", "author": "Yuval Noah Harari", "category": "history", "pages": 443, "pagesRead": 443, "currentPage": 443, "rating": 4.5, "status": "completed", "publishedYear": 2011, "tags": ["humanity", "anthropology"], "createdAt": "2026-01-22T14:10:00.000Z", "updatedAt": "2026-01-22T14:10:00.000Z" },
  { "_id": "66f1a1000000000000000014", "title": "Guns, Germs, and Steel", "author": "Jared Diamond", "category": "history", "pages": 480, "pagesRead": 150, "currentPage": 150, "rating": 3.5, "status": "reading", "publishedYear": 1997, "tags": ["civilization", "anthropology"], "createdAt": "2026-01-23T18:00:00.000Z", "updatedAt": "2026-01-23T18:00:00.000Z" },
  { "_id": "66f1a1000000000000000015", "title": "The Silk Roads", "author": "Peter Frankopan", "category": "history", "pages": 636, "pagesRead": 0, "currentPage": 0, "rating": 0, "status": "planned", "publishedYear": 2015, "tags": ["trade", "civilization"], "createdAt": "2026-01-24T12:40:00.000Z", "updatedAt": "2026-01-24T12:40:00.000Z" },
  { "_id": "66f1a1000000000000000016", "title": "A Brief History of Time", "author": "Stephen Hawking", "category": "science", "pages": 212, "pagesRead": 212, "currentPage": 212, "rating": 4.0, "status": "completed", "publishedYear": 1988, "tags": ["physics", "cosmology"], "createdAt": "2026-01-25T16:30:00.000Z", "updatedAt": "2026-01-25T16:30:00.000Z" },
  { "_id": "66f1a1000000000000000017", "title": "Cosmos", "author": "Carl Sagan", "category": "science", "pages": 396, "pagesRead": 396, "currentPage": 396, "rating": 5.0, "status": "completed", "publishedYear": 1980, "tags": ["astronomy", "cosmology"], "createdAt": "2026-01-26T09:00:00.000Z", "updatedAt": "2026-01-26T09:00:00.000Z" },
  { "_id": "66f1a1000000000000000018", "title": "The Selfish Gene", "author": "Richard Dawkins", "category": "science", "pages": 360, "pagesRead": 100, "currentPage": 100, "rating": 3.5, "status": "reading", "publishedYear": 1976, "tags": ["biology", "evolution"], "createdAt": "2026-01-27T11:20:00.000Z", "updatedAt": "2026-01-27T11:20:00.000Z" },
  { "_id": "66f1a1000000000000000019", "title": "Code Complete", "author": "Steve McConnell", "category": "software-engineering", "pages": 960, "pagesRead": 300, "currentPage": 300, "rating": 4.0, "status": "completed", "publishedYear": 2004, "tags": ["best-practices", "classic"], "createdAt": "2026-01-28T14:15:00.000Z", "updatedAt": "2026-01-28T14:15:00.000Z" },
  { "_id": "66f1a1000000000000000020", "title": "Clean Architecture", "author": "Robert C. Martin", "category": "software-engineering", "pages": 432, "pagesRead": 0, "currentPage": 0, "rating": 0, "status": "planned", "publishedYear": 2017, "tags": ["architecture", "clean-code"], "createdAt": "2026-01-29T17:00:00.000Z", "updatedAt": "2026-01-29T17:00:00.000Z" }
];

/**
 * Executes a simulated endpoint request matching real controller logic.
 * Enables the user to test the entire API suite even when disconnected!
 */
function simulateOfflineEndpoint(rawRoute, method = 'GET') {
  const [pathname, queryString] = rawRoute.split('?');
  const params = new URLSearchParams(queryString || '');
  const cleanPath = pathname.trim().replace(/\/+$/, '');

  // 1. Health Endpoint
  if (cleanPath === '/api/health') {
    return {
      status: "ok",
      developer: "mohamed fayed",
      uptime: 489.12,
      timestamp: new Date().toISOString(),
      service: "Personal Library API",
      message: "Server is online and healthy (Simulated Offline Mode)"
    };
  }

  // 2. Aggregations (/api/books/stats/...)
  if (cleanPath === '/api/books/stats') {
    const totalPages = SEED_BOOKS.reduce((sum, b) => sum + b.pages, 0);
    return {
      status: "success",
      data: [
        {
          totalBooks: SEED_BOOKS.length,
          totalPages: totalPages,
          averagePages: Number((totalPages / SEED_BOOKS.length).toFixed(2))
        }
      ]
    };
  }

  if (cleanPath === '/api/books/stats/count') {
    let list = SEED_BOOKS;
    const cat = params.get('category');
    if (cat) list = list.filter(b => b.category.toLowerCase().includes(cat.toLowerCase()));
    return {
      status: "success",
      data: [{ total: list.length }]
    };
  }

  if (cleanPath === '/api/books/stats/average-rating') {
    const rated = SEED_BOOKS.filter(b => b.rating > 0);
    const avg = rated.reduce((acc, b) => acc + Number(b.rating), 0) / rated.length;
    return {
      status: "success",
      data: [
        {
          averageRating: Number(avg.toFixed(2)),
          ratedBooks: rated.length
        }
      ]
    };
  }

  if (cleanPath === '/api/books/stats/by-category') {
    const catMap = {};
    SEED_BOOKS.forEach(b => {
      if (!catMap[b.category]) {
        catMap[b.category] = { count: 0, totalPages: 0, books: [] };
      }
      catMap[b.category].count += 1;
      catMap[b.category].totalPages += b.pages;
      catMap[b.category].books.push({
        _id: b._id,
        title: b.title,
        author: b.author,
        createdAt: b.createdAt
      });
    });

    const result = Object.entries(catMap).map(([category, data]) => ({
      count: data.count,
      totalPages: data.totalPages,
      books: data.books,
      category
    })).sort((a, b) => b.totalPages - a.totalPages);

    return { status: "success", data: result };
  }

  if (cleanPath === '/api/books/stats/by-status') {
    const statusMap = {};
    SEED_BOOKS.forEach(b => {
      if (!statusMap[b.status]) {
        statusMap[b.status] = { count: 0, totalPages: 0, totalPagesRead: 0, books: [] };
      }
      statusMap[b.status].count += 1;
      statusMap[b.status].totalPages += b.pages;
      statusMap[b.status].totalPagesRead += b.pagesRead;
      statusMap[b.status].books.push({
        _id: b._id,
        title: b.title,
        author: b.author,
        createdAt: b.createdAt
      });
    });

    const result = Object.entries(statusMap).map(([status, data]) => ({
      count: data.count,
      totalPages: data.totalPages,
      totalPagesRead: data.totalPagesRead,
      books: data.books,
      status
    })).sort((a, b) => b.totalPages - a.totalPages);

    return { status: "success", data: result };
  }

  if (cleanPath === '/api/books/stats/ratings-by-category') {
    const catMap = {};
    SEED_BOOKS.filter(b => b.rating > 0).forEach(b => {
      if (!catMap[b.category]) catMap[b.category] = { sum: 0, count: 0, books: [] };
      catMap[b.category].sum += Number(b.rating);
      catMap[b.category].count += 1;
      catMap[b.category].books.push({ _id: b._id, title: b.title, author: b.author });
    });

    const result = Object.entries(catMap).map(([category, d]) => ({
      averageRating: Number((d.sum / d.count).toFixed(2)),
      ratedBooks: d.count,
      books: d.books,
      category
    })).sort((a, b) => b.averageRating - a.averageRating);

    return { status: "success", data: result };
  }

  if (cleanPath === '/api/books/stats/by-author') {
    const minBooks = Number(params.get('minBooks') || 1);
    const authorMap = {};
    SEED_BOOKS.forEach(b => {
      if (!authorMap[b.author]) authorMap[b.author] = { count: 0, totalPages: 0 };
      authorMap[b.author].count += 1;
      authorMap[b.author].totalPages += b.pages;
    });

    const result = Object.entries(authorMap)
      .filter(([_, d]) => d.count >= minBooks)
      .map(([author, d]) => ({ author, count: d.count, totalPages: d.totalPages }))
      .sort((a, b) => b.count - a.count || b.totalPages - a.totalPages);

    return { status: "success", count: result.length, data: result };
  }

  // 3. Curated Special GET Queries
  if (cleanPath === '/api/books/top-rated') {
    const result = [...SEED_BOOKS].sort((a, b) => b.rating - a.rating).slice(0, 5);
    return { status: "success", count: result.length, data: result };
  }

  if (cleanPath === '/api/books/recent') {
    const result = [...SEED_BOOKS].sort((a, b) => b.publishedYear - a.publishedYear).slice(0, 5);
    return { status: "success", count: result.length, data: result };
  }

  if (cleanPath === '/api/books/must-reads') {
    const result = SEED_BOOKS.filter(b => b.rating >= 4.5 && b.status === "completed");
    return { status: "success", count: result.length, data: result };
  }

  if (cleanPath === '/api/books/not-heavy') {
    const result = SEED_BOOKS.filter(b => b.pages <= 300);
    return { status: "success", count: result.length, data: result };
  }

  if (cleanPath === '/api/books/weekend-reads') {
    const result = SEED_BOOKS.filter(b => b.pages <= 250);
    return { status: "success", count: result.length, data: result };
  }

  if (cleanPath === '/api/books/next-up') {
    const result = SEED_BOOKS.filter(b => b.status === "planned");
    return { status: "success", count: result.length, data: result };
  }

  if (cleanPath === '/api/books/unfinished') {
    // $expr: pagesRead < pages && pagesRead > 0
    const result = SEED_BOOKS.filter(b => b.pagesRead < b.pages && b.pagesRead > 0);
    return { status: "success", count: result.length, data: result };
  }

  if (cleanPath === '/api/books/inconsistent') {
    // Audit data check: completed but pagesRead < pages
    const result = SEED_BOOKS.filter(b => b.status === "completed" && b.pagesRead < b.pages);
    return { status: "success", count: result.length, data: result };
  }

  // Category route parameter: /api/books/category/:category
  if (cleanPath.startsWith('/api/books/category/')) {
    const cat = cleanPath.split('/api/books/category/')[1];
    const result = SEED_BOOKS.filter(b => b.category.toLowerCase() === decodeURIComponent(cat).toLowerCase());
    return { status: "success", count: result.length, data: result };
  }

  // 4. POST / Mutation Endpoints
  if (method === 'POST') {
    if (cleanPath === '/api/books/bulk') {
      return {
        status: "success",
        message: {
          insertedCount: SEED_BOOKS.length,
          data: SEED_BOOKS.slice(0, 3).map(b => ({ ...b, _id: "66f1b00000000000000000" + b._id.slice(-2) }))
        }
      };
    }
    return {
      status: "success",
      location: "get /api/books/66f1b0000000000000000099",
      message: {
        data: {
          _id: "66f1b0000000000000000099",
          title: "System Design Interview",
          author: "Alex Xu",
          category: "software-engineering",
          pages: 300,
          pagesRead: 50,
          currentPage: 50,
          rating: 4.5,
          status: "reading",
          publishedYear: 2020,
          tags: ["system-design", "architecture"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    };
  }

  // 5. PATCH / Progress / Rating / Tags
  if (method === 'PATCH') {
    if (cleanPath.includes('/progress')) {
      const book = { ...SEED_BOOKS[2] };
      book.pagesRead = 350;
      book.currentPage = 350;
      book.status = "reading";
      book.updatedAt = new Date().toISOString();
      return {
        status: "success",
        location: `get /api/books/${book._id}`,
        message: book
      };
    }
    if (cleanPath.includes('/rating')) {
      return {
        status: "success",
        message: "rating updated successfully",
        data: { rating: 4.8, updatedAt: new Date().toISOString() }
      };
    }
    if (cleanPath.includes('/tags')) {
      const book = { ...SEED_BOOKS[0] };
      book.tags = [...new Set([...book.tags, "mastery", "craftsmanship"])];
      return {
        status: "success",
        location: `get /api/books/${book._id}`,
        message: book
      };
    }
    if (cleanPath === '/api/books/bulk/category') {
      return {
        status: "success",
        message: "data updated successfully"
      };
    }
    return {
      status: "success",
      message: "book updated successfully",
      data: SEED_BOOKS[0]
    };
  }

  // 6. PUT Endpoint
  if (method === 'PUT') {
    return {
      status: "success",
      message: "book replaced successfully",
      data: { ...SEED_BOOKS[0], updatedAt: new Date().toISOString() }
    };
  }

  // 7. DELETE Endpoints
  if (method === 'DELETE') {
    if (cleanPath === '/api/books/all') {
      return { status: "success", message: "all data deleted successfully" };
    }
    if (cleanPath === '/api/books/bulk') {
      return { status: "success", message: "data deleted successfully", deletedCount: 3 };
    }
    return {
      status: "success",
      message: {
        data: {
          _id: "66f1a1000000000000000001",
          title: "Clean Code",
          author: "Robert C. Martin",
          pages: 464,
          status: "completed"
        }
      }
    };
  }

  // 8. Single Book Lookup by ID: /api/books/:id
  if (cleanPath.match(/^\/api\/books\/[a-f0-9]{24}$/i) || cleanPath === '/api/books/:id') {
    return {
      status: "success",
      data: SEED_BOOKS[0]
    };
  }

  // 9. Master GET /api/books with dynamic simulated filters
  if (cleanPath === '/api/books' || cleanPath === '') {
    let result = [...SEED_BOOKS];

    // Filter by category
    const cat = params.get('category');
    if (cat) result = result.filter(b => b.category.toLowerCase().includes(cat.toLowerCase()));

    // Filter by status
    const stat = params.get('status');
    if (stat) result = result.filter(b => b.status.toLowerCase() === stat.toLowerCase());

    // Filter notStatus
    const notStat = params.get('notStatus');
    if (notStat) result = result.filter(b => b.status.toLowerCase() !== notStat.toLowerCase());

    // Filter author
    const auth = params.get('author');
    if (auth) result = result.filter(b => b.author.toLowerCase().includes(auth.toLowerCase()));

    // Filter minRating
    const minR = params.get('minRating');
    if (minR) result = result.filter(b => b.rating >= Number(minR));

    // Filter maxRating
    const maxR = params.get('maxRating');
    if (maxR) result = result.filter(b => b.rating <= Number(maxR));

    // Filter pages range
    const pagesOver = params.get('pagesOver');
    if (pagesOver) result = result.filter(b => b.pages > Number(pagesOver));
    const pagesUnder = params.get('pagesUnder');
    if (pagesUnder) result = result.filter(b => b.pages < Number(pagesUnder));

    // Filter year
    const fromYear = params.get('fromYear');
    if (fromYear) result = result.filter(b => b.publishedYear >= Number(fromYear));

    // Pagination (limit & page)
    const limit = Math.min(Number(params.get('limit') || 5), 20);
    const page = Math.max(Number(params.get('page') || 1), 1);
    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    return {
      status: "success",
      count: paginated.length,
      data: paginated
    };
  }

  // Fallback generic response
  return {
    status: "success",
    message: `Executed simulation for [${method}] ${rawRoute}`,
    endpoint: rawRoute,
    simulated: true,
    data: SEED_BOOKS.slice(0, 2)
  };
}

// 7. Interactive API Simulator Component
function initSimulator() {
  const methodSelect = document.getElementById('sim-method');
  const urlInput = document.getElementById('sim-url');
  const sendBtn = document.getElementById('sim-send');
  const outputEl = document.getElementById('sim-output');

  if (!sendBtn || !urlInput || !outputEl) return;

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

  // Support hitting Enter in the URL input
  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const route = urlInput.value.trim();
      const method = methodSelect?.value || 'GET';
      triggerSimulation(route, method);
    }
  });

  async function triggerSimulation(route, method) {
    outputEl.textContent = 'Executing request...';

    // Normalize endpoint (replace generic :id with a realistic MongoDB ObjectID if present)
    let executionRoute = route;
    if (executionRoute.includes(':id')) {
      executionRoute = executionRoute.replace(':id', '66f1a1000000000000000001');
    }

    let isLiveResponse = false;
    let liveData = null;

    // Attempt real live fetch first with a short timeout to check connectivity
    if (window.location.protocol.startsWith('http') && method === 'GET') {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 900);

        const res = await fetch(executionRoute, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          liveData = await res.json();
          isLiveResponse = true;
        }
      } catch (e) {
        // Fallback silently to offline simulator
      }
    }

    setTimeout(() => {
      if (isLiveResponse && liveData) {
        outputEl.textContent = JSON.stringify(liveData, null, 2);
        showToast(`Received live server response (200 OK)`);
      } else {
        const simulatedResult = simulateOfflineEndpoint(executionRoute, method);
        outputEl.textContent = JSON.stringify(simulatedResult, null, 2);
        showToast(`Offline simulation executed: [${method}] ${route}`);
      }
    }, 200);
  }
}

// 8. Health Check Button Action with Live / Offline Indicator
function initHealthCheck() {
  const healthBtns = [
    document.getElementById('check-health-btn'),
    document.getElementById('check-health-btn-mobile')
  ].filter(Boolean);

  healthBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span class="status-dot"></span> Connecting...';

      let isConnected = false;
      if (window.location.protocol.startsWith('http')) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1200);
          const res = await fetch('/api/health', { signal: controller.signal });
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            showToast(`Server is Online! (${data.message || 'Healthy'})`);
            btn.innerHTML = '<span class="status-dot"></span> Server Online';
            isConnected = true;
            return;
          }
        } catch (err) {
          // Server offline
        }
      }

      if (!isConnected) {
        setTimeout(() => {
          btn.innerHTML = '<span class="status-dot"></span> Offline Demo Mode';
          showToast('App Disconnected: Offline Simulation Engine is Active & Ready!');
        }, 350);
      }
    });
  });
}

// Helper Toast notification with accessible ARIA live role
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
  }, 3200);
}
