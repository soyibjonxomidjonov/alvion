/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Sidebar Component
   ═══════════════════════════════════════════════════════════ */

class Sidebar {
  constructor() {
    this.container = document.getElementById('sidebar-container');
    this.links = [
      { path: '/dashboard', label: 'Bosh sahifa', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>' },
      { path: '/courses', label: 'Kurslar', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/><path d="M18 5v17"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg>' },
      { path: '/lessons', label: 'Dars jadvallari', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>' },
      { path: '/teachers', label: 'O\'qituvchilar', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>' },
      { path: '/prices', label: 'Narxlar', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="2"/><path d="m21 21-6-6m6 0-6-6m6 6H3"/><path d="M3 16V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>' },
      { path: '/news', label: 'Yangiliklar', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
      { path: '/users', label: 'Foydalanuvchilar', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
      { path: '/applications', label: 'Arizalar', badge: true, icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>' },
      { path: '/tests', label: 'Testlar', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-4.5 4.5a2.121 2.121 0 0 1-3 0l-1.5-1.5"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>' },
      { path: '/broadcast', label: 'Xabar yuborish', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' },
      { path: '/settings', label: 'Sozlamalar', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
    ];
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l9 4-9 4-9-4 9-4z"/><path d="M3 10v4l9 4 9-4v-4"/><path d="M3 14v4l9 4 9-4v-4"/></svg>
        </div>
        <div class="sidebar-brand">
          <div class="sidebar-brand-name">TaskFlow</div>
          <div class="sidebar-brand-sub">Admin Panel</div>
        </div>
      </div>
      
      <div class="sidebar-nav">
        <div class="sidebar-section">
          <div class="sidebar-section-title">Asosiy menyu</div>
          ${this.links.map(link => `
            <button class="sidebar-link" data-path="${link.path}" onclick="window.router.navigate('${link.path}')">
              ${link.icon}
              <span class="sidebar-link-text">${link.label}</span>
              ${link.badge ? '<span class="sidebar-link-badge" id="sidebar-app-badge" style="display:none">0</span>' : ''}
            </button>
          `).join('')}
        </div>
      </div>
      
      <div class="sidebar-footer">
        <div class="sidebar-user" onclick="window.router.navigate('/settings')">
          <div class="avatar avatar-sm">A</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name" id="sidebar-user-name">Admin</div>
            <div class="sidebar-user-role">Administrator</div>
          </div>
        </div>
      </div>
    `;

    // Highlight current
    const currentPath = window.router.getCurrentPath();
    const currentLink = this.container.querySelector(`.sidebar-link[data-path="${currentPath}"]`);
    if (currentLink) currentLink.classList.add('active');

    // Fetch new applications count
    this.updateBadges();
  }

  async updateBadges() {
    try {
      const appBadge = document.getElementById('sidebar-app-badge');
      if (!appBadge) return;

      const data = await window.api.getRegisterUsers();
      const count = data?.count || (Array.isArray(data) ? data.length : 0);
      
      if (count > 0) {
        appBadge.textContent = count > 99 ? '99+' : count;
        appBadge.style.display = 'block';
      } else {
        appBadge.style.display = 'none';
      }
    } catch (e) {
      console.error('Failed to update badges', e);
    }
  }

  updateUser() {
    const user = window.auth.getUser();
    const nameEl = document.getElementById('sidebar-user-name');
    if (nameEl && user) {
      nameEl.textContent = user.phone_number;
    }
  }
}

window.Sidebar = new Sidebar();
