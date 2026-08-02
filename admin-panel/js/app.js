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
        
        // Agar gash o'zgarmasa (masalan oldindan /dashboard da turgan bo'lsa),
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
});
