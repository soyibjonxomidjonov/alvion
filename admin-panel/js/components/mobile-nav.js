/* ═══════════════════════════════════════════════════════════
   Alvion O'quv Markazi — Mobile Navigation Controller
   Telefon va Telegram Web App bottom navigation
   Cross-platform: smart resize handling + Telegram detection
   ═══════════════════════════════════════════════════════════ */

class MobileNav {
  constructor() {
    this.bottomNav = null;
    this.moreDrawer = null;
    this.moreOverlay = null;
    this.isMoreOpen = false;
    this._resizeTimer = null;

    // Bottom nav page → button ID mapping
    this.navMap = {
      '/dashboard':    'bnav-dashboard',
      '/courses':      'bnav-courses',
      '/applications': 'bnav-applications',
      '/users':        'bnav-users',
    };

    // Pages shown in "Ko'proq" drawer
    this.morePages = ['/lessons', '/teachers', '/prices', '/news', '/tests', '/broadcast', '/settings'];
  }

  init() {
    this.bottomNav  = document.getElementById('bottom-nav');
    this.moreDrawer  = document.getElementById('more-drawer');
    this.moreOverlay = document.getElementById('more-drawer-overlay');

    if (!this.bottomNav) return;

    // Show bottom nav on mobile
    this._updateVisibility();

    // Listen for route changes to update active state
    window.addEventListener('hashchange', () => this.updateActive());

    // Initial active state
    this.updateActive();

    // Update badge
    this.updateBadge();

    // Swipe down to close drawer
    this._initSwipeClose();

    // Debounced resize listener
    window.addEventListener('resize', () => {
      clearTimeout(this._resizeTimer);
      this._resizeTimer = setTimeout(() => {
        this._updateVisibility();
        // Also update sidebar collapsed state on resize
        if (window.Sidebar) {
          window.Sidebar._applyCollapsedState();
        }
      }, 150);
    });
  }

  _isTelegramWebApp() {
    try {
      const tg = window.Telegram?.WebApp;
      // Telegram WebApp provides initData string when running inside Telegram
      return tg && (tg.initData?.length > 0 || tg.initDataUnsafe?.user);
    } catch {
      return false;
    }
  }

  _updateVisibility() {
    if (!this.bottomNav) return;

    const isMobile = window.innerWidth <= 768;
    const isTgWebApp = this._isTelegramWebApp();

    if (isMobile || isTgWebApp) {
      this.bottomNav.style.display = 'flex';
      this.bottomNav.style.flexDirection = 'column';
      document.body.classList.add('has-bottom-nav');

      // On Telegram WebApp: hide desktop sidebar entirely
      if (isTgWebApp) {
        document.body.classList.add('tg-web-app');
      }
    } else {
      this.bottomNav.style.display = 'none';
      document.body.classList.remove('has-bottom-nav');
      // Close drawer if open on resize to desktop
      if (this.isMoreOpen) {
        this.closeMore();
      }
    }
  }

  updateActive() {
    const currentPath = window.router?.getCurrentPath() || '/dashboard';

    // Reset all
    document.querySelectorAll('.bottom-nav-item').forEach(btn => {
      btn.classList.remove('active');
    });

    // Activate matching
    const btnId = this.navMap[currentPath];
    if (btnId) {
      const btn = document.getElementById(btnId);
      if (btn) btn.classList.add('active');
    } else if (this.morePages.includes(currentPath)) {
      // Highlight "Ko'proq" button when on a sub-page
      const moreBtn = document.getElementById('bnav-more');
      if (moreBtn) moreBtn.classList.add('active');
    }
  }

  async updateBadge() {
    try {
      const badge = document.getElementById('bnav-app-badge');
      if (!badge) return;

      const data = await window.api.getRegisterUsers();
      const count = data?.count || (Array.isArray(data) ? data.length : 0);

      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'block';
      } else {
        badge.style.display = 'none';
      }
    } catch (e) {
      // silent fail — not critical
    }
  }

  openMore() {
    if (!this.moreDrawer || !this.moreOverlay) return;
    this.isMoreOpen = true;
    this.moreOverlay.classList.add('active');
    this.moreDrawer.classList.add('active');

    // Highlight more button
    const moreBtn = document.getElementById('bnav-more');
    if (moreBtn) moreBtn.classList.add('active');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  closeMore() {
    if (!this.moreDrawer || !this.moreOverlay) return;
    this.isMoreOpen = false;
    this.moreOverlay.classList.remove('active');
    this.moreDrawer.classList.remove('active');

    // Restore body scroll
    document.body.style.overflow = '';

    // Re-apply correct active state
    this.updateActive();
  }

  goTo(path) {
    this.closeMore();
    // Small delay for smooth drawer close animation
    setTimeout(() => {
      window.router.navigate(path);
    }, 180);
  }

  _initSwipeClose() {
    if (!this.moreDrawer) return;

    let startY = 0;
    let isDragging = false;
    let currentY = 0;

    this.moreDrawer.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      isDragging = true;
      currentY = 0;
      this.moreDrawer.style.transition = 'none';
    }, { passive: true });

    this.moreDrawer.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const deltaY = e.touches[0].clientY - startY;
      if (deltaY > 0) {
        currentY = deltaY;
        this.moreDrawer.style.transform = `translateY(${deltaY}px)`;
      }
    }, { passive: true });

    this.moreDrawer.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      this.moreDrawer.style.transition = '';
      this.moreDrawer.style.transform = '';

      if (currentY > 80) {
        this.closeMore();
      }
    }, { passive: true });
  }
}

window.mobileNav = new MobileNav();
