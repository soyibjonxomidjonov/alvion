/* ═══════════════════════════════════════════════════════════
   Alvion O'quv Markazi — Mobile Navigation Controller
   Telefon va Telegram Web App bottom navigation
   ═══════════════════════════════════════════════════════════ */

class MobileNav {
  constructor() {
    this.bottomNav = null;
    this.moreDrawer = null;
    this.moreOverlay = null;
    this.isMoreOpen = false;

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
    this._showIfMobile();

    // Listen for route changes to update active state
    window.addEventListener('hashchange', () => this.updateActive());

    // Initial active state
    this.updateActive();

    // Update badge
    this.updateBadge();

    // Swipe down to close drawer
    this._initSwipeClose();
  }

  _showIfMobile() {
    const isMobile = window.innerWidth <= 768;
    const isTgWebApp = window.Telegram?.WebApp?.initData?.length > 0;

    if (isMobile || isTgWebApp) {
      this.bottomNav.style.display = 'flex';
      this.bottomNav.style.flexDirection = 'column';
      document.body.classList.add('has-bottom-nav');
    }

    // Also react to resize
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        this.bottomNav.style.display = 'flex';
        this.bottomNav.style.flexDirection = 'column';
        document.body.classList.add('has-bottom-nav');
      } else {
        this.bottomNav.style.display = 'none';
        document.body.classList.remove('has-bottom-nav');
        this.closeMore();
      }
    });
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
      // silent fail
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

    this.moreDrawer.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      isDragging = true;
    }, { passive: true });

    this.moreDrawer.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const deltaY = e.touches[0].clientY - startY;
      if (deltaY > 0) {
        this.moreDrawer.style.transform = `translateY(${deltaY}px)`;
        this.moreDrawer.style.transition = 'none';
      }
    }, { passive: true });

    this.moreDrawer.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const deltaY = e.changedTouches[0].clientY - startY;
      this.moreDrawer.style.transition = '';
      this.moreDrawer.style.transform = '';

      if (deltaY > 80) {
        this.closeMore();
      }
    }, { passive: true });
  }
}

window.mobileNav = new MobileNav();
