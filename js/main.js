/* ===========================
   MAIN.JS - Navigation & Utilities
   =========================== */

// ===== Navigation Setup =====
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupPageTransitions();
  setupAnimations();
});

function setupNavigation() {
  const burgerMenu = document.querySelector('.burger-menu');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  if (burgerMenu) {
    burgerMenu.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      burgerMenu.classList.toggle('active');
    });
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(link => link.classList.remove('active'));
      item.classList.add('active');
      if (navLinks) {
        navLinks.classList.remove('active');
        if (burgerMenu) burgerMenu.classList.remove('active');
      }
    });
  });

  // Set active link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      item.classList.add('active');
    }
  });
}

function setupPageTransitions() {
  const links = document.querySelectorAll('a[href$=".html"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Don't prevent default - let the page load
      // Just add animation class if needed
      document.body.classList.add('page-transition');
    });
  });
}

function setupAnimations() {
  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('stagger-item')) {
          entry.target.style.opacity = '1';
        }
        entry.target.classList.add('animate-slideUp');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.stagger-item, .feature-card, .card').forEach(el => {
    observer.observe(el);
  });

  // Add float animations to blobs
  const blobs = document.querySelectorAll('.blob');
  blobs.forEach((blob, index) => {
    blob.style.animationDelay = `${index * 0.5}s`;
  });
}

// ===== Utility Functions =====

/**
 * Generate a unique ID
 */
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Animate element with fade-in
 */
function animateElement(element, duration = 300) {
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  element.style.transition = `all ${duration}ms ease-out`;

  setTimeout(() => {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }, 10);
}

/**
 * Show notification
 */
function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
    color: white;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
    font-weight: 600;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideInRight 0.3s ease-out reverse';
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

/**
 * Format a number with commas
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Debounce function
 */
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

/**
 * Throttle function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Copy to clipboard
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Copied to clipboard!', 'success');
  }).catch(() => {
    showNotification('Failed to copy', 'error');
  });
}

/**
 * Get URL parameters
 */
function getUrlParams() {
  const params = {};
  const searchParams = new URLSearchParams(window.location.search);
  for (let [key, value] of searchParams) {
    params[key] = value;
  }
  return params;
}

/**
 * Smooth scroll to element
 */
function smoothScroll(element, offset = 100) {
  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({
    top: elementPosition - offset,
    behavior: 'smooth'
  });
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Get random color from gradient
 */
function getRandomGradientColor() {
  const colors = [
    '#ff6b9d',
    '#ffd93d',
    '#ff5e85',
    '#ffca00',
    '#ff8fab',
    '#ffe066'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Local storage helpers
 */
const LocalStorage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('LocalStorage set error:', e);
      return false;
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('LocalStorage get error:', e);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('LocalStorage remove error:', e);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('LocalStorage clear error:', e);
      return false;
    }
  }
};

/**
 * Session storage helpers
 */
const SessionStorage = {
  set: (key, value) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('SessionStorage set error:', e);
      return false;
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('SessionStorage get error:', e);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('SessionStorage remove error:', e);
      return false;
    }
  }
};

// Export utilities
window.AppUtils = {
  generateId,
  animateElement,
  showNotification,
  formatNumber,
  debounce,
  throttle,
  copyToClipboard,
  getUrlParams,
  smoothScroll,
  isInViewport,
  getRandomGradientColor,
  LocalStorage,
  SessionStorage
};
