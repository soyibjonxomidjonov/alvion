/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — SPA Router (Hash-based)
   ═══════════════════════════════════════════════════════════ */

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.container = null;

    window.addEventListener('hashchange', () => this._onRouteChange());
  }

  init(containerId) {
    this.container = document.getElementById(containerId);
    this._onRouteChange();
  }

  register(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path) {
    window.location.hash = `#${path}`;
  }

  getCurrentPath() {
    return window.location.hash.slice(1) || '/dashboard';
  }

  async _onRouteChange() {
    const path = this.getCurrentPath();

    // Auth guard
    if (path !== '/login' && !window.auth.isAuthenticated()) {
      this.navigate('/login');
      return;
    }

    // Redirect from login if already authenticated
    if (path === '/login' && window.auth.isAuthenticated()) {
      this.navigate('/dashboard');
      return;
    }

    // Find matching route — /login is handled by HTML layout, not a JS handler
    if (path === '/login') return;

    const handler = this.routes[path];

    if (!handler) {
      // Only redirect if not already on dashboard to prevent loop
      if (path !== '/dashboard') {
        this.navigate('/dashboard');
      }
      return;
    }

    // Update active sidebar link
    document.querySelectorAll('.sidebar-link').forEach(link => {
      const linkPath = link.getAttribute('data-path');
      link.classList.toggle('active', linkPath === path);
    });

    // Close mobile sidebar
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-mobile-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.style.display = 'none';

    // Update header title
    this._updatePageTitle(path);

    // Show/hide app layout
    const appLayout = document.getElementById('app-layout');
    const loginPage = document.getElementById('login-page');

    if (path === '/login') {
      if (appLayout) appLayout.style.display = 'none';
      if (loginPage) loginPage.style.display = 'flex';
    } else {
      if (appLayout) appLayout.style.display = 'flex';
      if (loginPage) loginPage.style.display = 'none';
    }

    // Execute handler
    this.currentRoute = path;
    try {
      await handler();
    } catch (err) {
      console.error(`Route error [${path}]:`, err);
      if (this.container) {
        this.container.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h3 class="empty-state-title">Xatolik yuz berdi</h3>
            <p class="empty-state-text">${err.message}</p>
          </div>
        `;
      }
    }
  }

  _updatePageTitle(path) {
    const titles = {
      '/dashboard': { title: 'Dashboard', sub: 'Umumiy ko\'rish' },
      '/courses': { title: 'Kurslar', sub: 'Kurslarni boshqarish' },
      '/lessons': { title: 'Dars Jadvali', sub: 'Darslarni boshqarish' },
      '/teachers': { title: 'O\'qituvchilar', sub: 'O\'qituvchilarni boshqarish' },
      '/prices': { title: 'Narxlar', sub: 'To\'lov va chegirmalar' },
      '/news': { title: 'Yangiliklar', sub: 'E\'lonlar va tadbirlar' },
      '/users': { title: 'Foydalanuvchilar', sub: 'Bot foydalanuvchilari' },
      '/applications': { title: 'Arizalar', sub: 'Yangi ro\'yxatdan o\'tganlar' },
      '/tests': { title: 'Testlar', sub: 'Test va natijalar' },
      '/broadcast': { title: 'Xabar Yuborish', sub: 'Ommaviy xabar' },
      '/settings': { title: 'Sozlamalar', sub: 'Tizim sozlamalari' },
    };

    const info = titles[path] || { title: 'TaskFlow', sub: '' };

    const titleEl = document.getElementById('header-title');
    const subEl = document.getElementById('header-subtitle');
    if (titleEl) titleEl.textContent = info.title;
    if (subEl) subEl.textContent = info.sub;

    document.title = `${info.title} — TaskFlow Admin`;
  }
}

window.router = new Router();
