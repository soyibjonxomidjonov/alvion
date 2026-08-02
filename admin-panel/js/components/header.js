/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Header Component
   ═══════════════════════════════════════════════════════════ */

class Header {
  constructor() {
    this.container = document.getElementById('header-container');
    
    document.addEventListener('click', (e) => {
      // Close dropdown if clicked outside
      const dropdown = document.getElementById('user-dropdown');
      if (dropdown && dropdown.classList.contains('active')) {
        const isClickInside = e.target.closest('#user-menu-btn') || e.target.closest('#user-dropdown');
        if (!isClickInside) {
          dropdown.classList.remove('active');
        }
      }
    });
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="header-left">
        <button class="header-mobile-toggle" id="mobile-menu-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
        <div class="header-page-info">
          <h1 class="header-page-title" id="header-title">Dashboard</h1>
          <div class="header-page-subtitle" id="header-subtitle">Umumiy ko'rish</div>
        </div>
      </div>
      
      <div class="header-right">
        <!-- Theme Toggle -->
        <button class="header-action" id="theme-toggle-btn" title="Tema o'zgartirish">
          <svg class="theme-toggle-icon" id="theme-toggle-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${document.documentElement.getAttribute('data-theme') === 'dark' 
              ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'
              : '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'}
          </svg>
        </button>
        
        <!-- User Menu -->
        <div class="dropdown">
          <button class="header-action" id="user-menu-btn" style="border-radius: 50%;">
            <div class="avatar avatar-sm">A</div>
          </button>
          
          <div class="dropdown-menu" id="user-dropdown">
            <button class="dropdown-item" onclick="window.router.navigate('/settings')">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              Sozlamalar
            </button>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item dropdown-item-danger" id="logout-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              Tizimdan chiqish
            </button>
          </div>
        </div>
      </div>
    `;

    // Event Listeners
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const icon = document.getElementById('theme-toggle-icon');
        if (icon) {
          icon.innerHTML = newTheme === 'dark' 
            ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'
            : '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>';
        }
      });
    }

    const menuBtn = document.getElementById('user-menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('user-dropdown')?.classList.toggle('active');
      });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        window.modal.confirm({
          title: 'Tizimdan chiqish',
          text: 'Rostdan ham tizimdan chiqmoqchimisiz?',
          confirmText: 'Chiqish',
          isDanger: true,
          onConfirm: () => window.auth.logout()
        });
      });
    }

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-mobile-overlay');
        if (sidebar) sidebar.classList.toggle('open');
        if (overlay) overlay.style.display = sidebar?.classList.contains('open') ? 'block' : 'none';
      });
    }
    
    const overlay = document.querySelector('.sidebar-mobile-overlay');
    if(overlay) {
        overlay.addEventListener('click', () => {
            document.querySelector('.sidebar')?.classList.remove('open');
            overlay.style.display = 'none';
        });
    }
  }
}

window.Header = new Header();
