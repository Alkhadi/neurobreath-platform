/**
 * NEUROBREATH BLOG - Main JavaScript
 * Features: Search, filter, sort, modal, deep-linking, live updates, reading mode
 * ============================================================================
 * 
 * HOW TO ADD A NEW POST:
 * 1. Edit /data/blog-posts.json
 * 2. Increment "version" field
 * 3. Add new post object to "posts" array
 * 4. Users will see update toast within 5 minutes
 */

(function() {
  'use strict';

  // ============================================================================
  // STATE
  // ============================================================================
  let allPosts = [];
  let filteredPosts = [];
  let displayedCount = 6;
  const postsPerPage = 6;
  let currentFilters = {
    search: '',
    condition: '',
    audience: '',
    sort: 'newest'
  };
  let lastVersion = null;
  let updateCheckInterval = null;

  // ============================================================================
  // DOM ELEMENTS
  // ============================================================================
  const elements = {
    searchInput: document.getElementById('blog-search'),
    conditionFilter: document.getElementById('filter-condition'),
    audienceFilter: document.getElementById('filter-audience'),
    sortFilter: document.getElementById('filter-sort'),
    resetBtn: document.getElementById('filter-reset'),
    postsGrid: document.getElementById('blog-posts-grid'),
    noResults: document.getElementById('blog-no-results'),
    loadMoreWrapper: document.getElementById('blog-load-more-wrapper'),
    loadMoreBtn: document.getElementById('blog-load-more'),
    postsCount: document.getElementById('blog-posts-count'),
    modal: document.getElementById('blog-post-modal'),
    modalClose: document.getElementById('blog-modal-close'),
    modalOverlay: document.querySelector('.blog-modal-overlay'),
    modalArticle: document.getElementById('blog-modal-article'),
    modalToc: document.getElementById('blog-modal-toc'),
    copyLinkBtn: document.getElementById('blog-copy-link'),
    printBtn: document.getElementById('blog-print'),
    shareBtn: document.getElementById('blog-share'),
    readingModeBtn: document.getElementById('reading-mode-toggle'),
    updateToast: document.getElementById('blog-update-toast'),
    refreshBtn: document.getElementById('blog-refresh-content'),
    toastCloseBtn: document.getElementById('blog-toast-close')
  };

  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  async function init() {
    // Load reading mode preference
    loadReadingMode();
    
    // Load posts
    await loadPosts();
    
    // Setup event listeners
    setupEventListeners();
    
    // Check for deep-linked post
    checkDeepLink();
    
    // Start live update checker
    startLiveUpdateChecker();
  }

  // ============================================================================
  // DATA LOADING
  // ============================================================================
  async function loadPosts(showToast = false) {
    try {
      const response = await fetch('/data/blog-posts.json', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (!response.ok) throw new Error('Failed to load posts');
      
      const data = await response.json();
      
      // Check if version changed
      if (lastVersion && lastVersion !== data.version && showToast) {
        showUpdateToast();
      }
      
      lastVersion = data.version;
      allPosts = data.posts || [];
      
      // Populate filters
      populateFilters();
      
      // Apply filters and render
      applyFilters();
      
    } catch (error) {
      console.error('Error loading posts:', error);
      showError('Failed to load blog posts. Please refresh the page.');
    }
  }

  function populateFilters() {
    // Get unique conditions
    const conditions = [...new Set(allPosts.map(p => p.condition))].sort();
    elements.conditionFilter.innerHTML = '<option value="">All Conditions</option>' +
      conditions.map(c => `<option value="${c}">${c}</option>`).join('');
    
    // Get unique audiences
    const audiences = [...new Set(allPosts.flatMap(p => p.audience))].sort();
    elements.audienceFilter.innerHTML = '<option value="">All Audiences</option>' +
      audiences.map(a => `<option value="${a}">${a}</option>`).join('');
  }

  // ============================================================================
  // FILTERING & SORTING
  // ============================================================================
  function applyFilters() {
    filteredPosts = allPosts.filter(post => {
      // Search filter
      if (currentFilters.search) {
        const searchLower = currentFilters.search.toLowerCase();
        const searchableText = `${post.title} ${post.excerpt} ${post.contentHtml}`.toLowerCase();
        if (!searchableText.includes(searchLower)) return false;
      }
      
      // Condition filter
      if (currentFilters.condition && post.condition !== currentFilters.condition) {
        return false;
      }
      
      // Audience filter
      if (currentFilters.audience && !post.audience.includes(currentFilters.audience)) {
        return false;
      }
      
      return true;
    });
    
    // Sort
    sortPosts();
    
    // Reset pagination
    displayedCount = postsPerPage;
    
    // Render
    renderPosts();
  }

  function sortPosts() {
    if (currentFilters.sort === 'newest') {
      filteredPosts.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));
    } else if (currentFilters.sort === 'relevant' && currentFilters.search) {
      // Simple relevance scoring
      filteredPosts.sort((a, b) => {
        const searchLower = currentFilters.search.toLowerCase();
        const aScore = (
          (a.title.toLowerCase().includes(searchLower) ? 10 : 0) +
          (a.excerpt.toLowerCase().includes(searchLower) ? 5 : 0)
        );
        const bScore = (
          (b.title.toLowerCase().includes(searchLower) ? 10 : 0) +
          (b.excerpt.toLowerCase().includes(searchLower) ? 5 : 0)
        );
        return bScore - aScore || new Date(b.datePublished) - new Date(a.datePublished);
      });
    }
  }

  // ============================================================================
  // RENDERING
  // ============================================================================
  function renderPosts() {
    elements.postsGrid.innerHTML = '';
    
    if (filteredPosts.length === 0) {
      elements.noResults.hidden = false;
      elements.loadMoreWrapper.hidden = true;
      return;
    }
    
    elements.noResults.hidden = true;
    
    const postsToShow = filteredPosts.slice(0, displayedCount);
    
    postsToShow.forEach(post => {
      const card = createPostCard(post);
      elements.postsGrid.appendChild(card);
    });
    
    // Show/hide load more
    if (filteredPosts.length > displayedCount) {
      elements.loadMoreWrapper.hidden = false;
      elements.postsCount.textContent = `Showing ${displayedCount} of ${filteredPosts.length} posts`;
    } else {
      elements.loadMoreWrapper.hidden = true;
    }
  }

  function createPostCard(post) {
    const card = document.createElement('article');
    card.className = 'blog-post-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('data-post-slug', post.slug);
    
    const audienceBadges = post.audience.slice(0, 2).map(a => 
      `<span class="blog-post-card-badge">${a}</span>`
    ).join('');
    
    const moreAudience = post.audience.length > 2 ? 
      `<span class="blog-post-card-badge">+${post.audience.length - 2} more</span>` : '';
    
    card.innerHTML = `
      <div class="blog-post-card-header">
        <div class="blog-post-card-meta">
          <span class="blog-post-card-badge blog-post-card-badge--condition">${post.condition}</span>
          ${audienceBadges}
          ${moreAudience}
        </div>
        <h3 class="blog-post-card-title">${escapeHtml(post.title)}</h3>
        <p class="blog-post-card-excerpt">${escapeHtml(post.excerpt)}</p>
      </div>
      <div class="blog-post-card-footer">
        <span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          ${formatDate(post.datePublished)}
        </span>
        <span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${post.readingMinutes} min
        </span>
      </div>
    `;
    
    card.addEventListener('click', () => openPost(post.slug));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPost(post.slug);
      }
    });
    
    return card;
  }

  // ============================================================================
  // MODAL
  // ============================================================================
  function openPost(slug) {
    const post = allPosts.find(p => p.slug === slug);
    if (!post) return;
    
    // Update URL
    history.pushState({ postSlug: slug }, '', `#${slug}`);
    
    // Render post
    renderPostModal(post);
    
    // Show modal
    elements.modal.hidden = false;
    elements.modal.setAttribute('aria-hidden', 'false');
    
    // Focus management
    elements.modalClose.focus();
    trapFocus();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  function renderPostModal(post) {
    const audienceList = post.audience.join(', ');
    
    elements.modalArticle.innerHTML = `
      <h1>${escapeHtml(post.title)}</h1>
      <div class="blog-post-meta">
        <span><strong>Audience:</strong> ${escapeHtml(audienceList)}</span>
        <span><strong>Published:</strong> ${formatDate(post.datePublished)}</span>
        <span><strong>Reviewed:</strong> ${formatDate(post.dateReviewed)}</span>
        <span><strong>Reading time:</strong> ${post.readingMinutes} minutes</span>
      </div>
      ${post.contentHtml}
      <div class="blog-post-sources">
        <h3>Sources and References</h3>
        <ul>
          ${post.sources.map(s => `
            <li>
              <a href="${s.url}" target="_blank" rel="noopener noreferrer">
                ${escapeHtml(s.title)}
              </a>
              ${s.pmid ? `<span style="color: var(--blog-text-light); font-size: 0.875rem;"> (PMID: ${s.pmid})</span>` : ''}
            </li>
          `).join('')}
        </ul>
      </div>
    `;
    
    // Generate TOC
    generateToc();
  }

  function generateToc() {
    const headings = elements.modalArticle.querySelectorAll('h2, h3');
    elements.modalToc.innerHTML = '';
    
    headings.forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;
      
      const link = document.createElement('a');
      link.href = `#${id}`;
      link.textContent = heading.textContent;
      link.style.paddingLeft = heading.tagName === 'H3' ? '1rem' : '0';
      
      link.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Update active state
        elements.modalToc.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      });
      
      elements.modalToc.appendChild(link);
    });
  }

  function closeModal() {
    elements.modal.hidden = true;
    elements.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Update URL
    history.pushState({}, '', window.location.pathname);
  }

  function trapFocus() {
    const focusableElements = elements.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    const handleTab = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };
    
    elements.modal.addEventListener('keydown', handleTab);
  }

  // ============================================================================
  // MODAL ACTIONS
  // ============================================================================
  function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      alert('Link copied!');
    });
  }

  function printPost() {
    window.print();
  }

  async function sharePost() {
    const url = window.location.href;
    const title = elements.modalArticle.querySelector('h1').textContent;
    
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        if (error.name !== 'AbortError') {
          copyLink(); // Fallback
        }
      }
    } else {
      copyLink(); // Fallback
    }
  }

  // ============================================================================
  // READING MODE
  // ============================================================================
  function loadReadingMode() {
    const isReadingMode = localStorage.getItem('blog-reading-mode') === 'true';
    if (isReadingMode) {
      document.body.classList.add('reading-mode');
      elements.readingModeBtn.setAttribute('aria-pressed', 'true');
    }
  }

  function toggleReadingMode() {
    const isActive = document.body.classList.toggle('reading-mode');
    elements.readingModeBtn.setAttribute('aria-pressed', isActive);
    localStorage.setItem('blog-reading-mode', isActive);
  }

  // ============================================================================
  // LIVE UPDATES
  // ============================================================================
  function startLiveUpdateChecker() {
    // Check every 5 minutes
    updateCheckInterval = setInterval(() => {
      checkForUpdates();
    }, 5 * 60 * 1000);
  }

  async function checkForUpdates() {
    try {
      const response = await fetch('/data/blog-posts.json', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (!response.ok) return;
      
      const data = await response.json();
      
      if (lastVersion && lastVersion !== data.version) {
        showUpdateToast();
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  }

  function showUpdateToast() {
    elements.updateToast.hidden = false;
  }

  function hideUpdateToast() {
    elements.updateToast.hidden = true;
  }

  async function refreshContent() {
    hideUpdateToast();
    await loadPosts(false);
  }

  // ============================================================================
  // EVENT LISTENERS
  // ============================================================================
  function setupEventListeners() {
    // Search
    elements.searchInput.addEventListener('input', debounce((e) => {
      currentFilters.search = e.target.value;
      applyFilters();
    }, 300));
    
    // Filters
    elements.conditionFilter.addEventListener('change', (e) => {
      currentFilters.condition = e.target.value;
      applyFilters();
    });
    
    elements.audienceFilter.addEventListener('change', (e) => {
      currentFilters.audience = e.target.value;
      applyFilters();
    });
    
    elements.sortFilter.addEventListener('change', (e) => {
      currentFilters.sort = e.target.value;
      applyFilters();
    });
    
    // Reset filters
    elements.resetBtn.addEventListener('click', () => {
      currentFilters = { search: '', condition: '', audience: '', sort: 'newest' };
      elements.searchInput.value = '';
      elements.conditionFilter.value = '';
      elements.audienceFilter.value = '';
      elements.sortFilter.value = 'newest';
      applyFilters();
    });
    
    document.querySelectorAll('.blog-filter-reset').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilters = { search: '', condition: '', audience: '', sort: 'newest' };
        elements.searchInput.value = '';
        elements.conditionFilter.value = '';
        elements.audienceFilter.value = '';
        elements.sortFilter.value = 'newest';
        applyFilters();
      });
    });
    
    // Load more
    elements.loadMoreBtn.addEventListener('click', () => {
      displayedCount += postsPerPage;
      renderPosts();
    });
    
    // Modal close
    elements.modalClose.addEventListener('click', closeModal);
    elements.modalOverlay.addEventListener('click', closeModal);
    
    // Modal actions
    elements.copyLinkBtn.addEventListener('click', copyLink);
    elements.printBtn.addEventListener('click', printPost);
    elements.shareBtn.addEventListener('click', sharePost);
    
    // Reading mode
    elements.readingModeBtn.addEventListener('click', toggleReadingMode);
    
    // Live updates
    elements.refreshBtn.addEventListener('click', refreshContent);
    elements.toastCloseBtn.addEventListener('click', hideUpdateToast);
    
    // ESC key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !elements.modal.hidden) {
        closeModal();
      }
    });
    
    // Browser back/forward
    window.addEventListener('popstate', () => {
      checkDeepLink();
    });
  }

  // ============================================================================
  // DEEP LINKING
  // ============================================================================
  function checkDeepLink() {
    const hash = window.location.hash.slice(1);
    if (hash && allPosts.some(p => p.slug === hash)) {
      openPost(hash);
    } else if (!hash && !elements.modal.hidden) {
      closeModal();
    }
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function showError(message) {
    elements.postsGrid.innerHTML = `
      <div class="blog-loading" style="color: #dc2626;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 3rem; height: 3rem;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <p>${message}</p>
      </div>
    `;
  }

  // ============================================================================
  // INIT ON DOM READY
  // ============================================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
