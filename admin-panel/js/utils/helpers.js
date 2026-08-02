/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Helper Utilities
   ═══════════════════════════════════════════════════════════ */

/**
 * Format date to readable string
 */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format datetime
 */
function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Relative time (e.g., "2 soat oldin")
 */
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = Date.now();
  const d = new Date(dateStr).getTime();
  const diff = now - d;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) return formatDate(dateStr);
  if (days > 0) return `${days} kun oldin`;
  if (hours > 0) return `${hours} soat oldin`;
  if (minutes > 0) return `${minutes} daqiqa oldin`;
  return 'Hozirgina';
}

/**
 * Format number with spaces (e.g., 1 500 000)
 */
function formatNumber(num) {
  if (num === null || num === undefined) return '—';
  return Number(num).toLocaleString('uz-UZ').replace(/,/g, ' ');
}

/**
 * Format price (e.g., 500 000 so'm)
 */
function formatPrice(num) {
  if (num === null || num === undefined) return '—';
  return `${formatNumber(num)} so'm`;
}

/**
 * Debounce function
 */
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Generate initials from name
 */
function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

/**
 * Generate a random color for avatars based on string hash
 */
function stringToColor(str) {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
    '#f59e0b', '#10b981', '#3b82f6', '#14b8a6',
    '#f97316', '#06b6d4', '#84cc16', '#e11d48',
  ];
  let hash = 0;
  for (let i = 0; i < (str || '').length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Truncate text
 */
function truncate(text, maxLen = 50) {
  if (!text) return '';
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Parse array or paginated result
 */
function parseListResponse(data) {
  // DRF can return array or { count, next, previous, results }
  if (Array.isArray(data)) {
    return { results: data, count: data.length, next: null, previous: null };
  }
  return {
    results: data.results || [],
    count: data.count || 0,
    next: data.next,
    previous: data.previous,
  };
}

/**
 * Create an element from HTML string
 */
function createElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

// Expose helpers globally
window.helpers = {
  formatDate,
  formatDateTime,
  timeAgo,
  formatNumber,
  formatPrice,
  debounce,
  getInitials,
  stringToColor,
  truncate,
  escapeHtml,
  parseListResponse,
  createElement,
};
