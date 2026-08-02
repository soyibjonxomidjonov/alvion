/* ═══════════════════════════════════════════════════════════
   Alvion O'quv Markazi — Admin Panel App Initializer
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Initialize Telegram WebApp
  window.tgApp.init();

  // 2. Initial Theme Check
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  // 3. Login form handling
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const phone = document.getElementById('login-phone').value;
      const pass = document.getElementById('login-password').value;
      const btn = loginForm.querySelector('button[type="submit"]');
      
      btn.disabled = true;
      btn.classList.add('btn-loading');
      
      try {
        await window.auth.login(phone, pass);
        window.toast.success("Tizimga muvaffaqiyatli kirdingiz!");
        
        // Agar hash o'zgarmasa (masalan oldindan /dashboard da turgan bo'lsa),
        // interfeysni majburiy yangilaymiz:
        if (window.router.getCurrentPath() === '/dashboard') {
          window.router._onRouteChange();
        } else {
          window.router.navigate('/dashboard');
        }
      } catch (err) {
        window.toast.error(err.message || 'Login xatosi');
      } finally {
        btn.disabled = false;
        btn.classList.remove('btn-loading');
      }
    });
  }

  // 4. Initialize layout components
  window.Sidebar.render();
  window.Header.render();

  // 5. Initialize Router
  // Router automatically calls the handler for the current path
  window.router.init('main-content');

  // Trigger user info update in sidebar
  if (window.auth.isAuthenticated()) {
    window.Sidebar.updateUser();
  }

  // 6. Initialize Mobile Navigation (bottom nav + drawer)
  if (window.auth.isAuthenticated()) {
    window.mobileNav.init();
  }

  // After login — also init mobile nav
  window.addEventListener('auth:login', () => {
    window.mobileNav.init();
  });

  // 7. Sidebar collapse state on resize (desktop only)
  let _sidebarResizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(_sidebarResizeTimer);
    _sidebarResizeTimer = setTimeout(() => {
      // If resized to tablet, remove collapsed class (sidebar becomes icon-only via CSS)
      if (window.innerWidth <= 1024) {
        const sidebar = document.querySelector('.sidebar');
        const mainWrapper = document.querySelector('.main-wrapper');
        if (sidebar) sidebar.classList.remove('collapsed');
        if (mainWrapper) mainWrapper.classList.remove('sidebar-collapsed');
      } else {
        // Re-apply saved collapsed state on desktop
        if (window.Sidebar) {
          window.Sidebar._applyCollapsedState();
        }
      }
    }, 200);
  });
});
