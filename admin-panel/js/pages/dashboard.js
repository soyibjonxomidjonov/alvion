/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Dashboard Page
   ═══════════════════════════════════════════════════════════ */

window.router.register('/dashboard', async () => {
  const container = document.getElementById('main-content');
  
  // Show skeleton
  container.innerHTML = `
    <div class="stats-grid mb-6">
      <div class="skeleton skeleton-card"></div>
      <div class="skeleton skeleton-card"></div>
      <div class="skeleton skeleton-card"></div>
      <div class="skeleton skeleton-card"></div>
    </div>
    <div class="content-grid content-grid-2">
      <div class="card"><div class="skeleton skeleton-text"></div></div>
      <div class="card"><div class="skeleton skeleton-text"></div></div>
    </div>
  `;

  try {
    // Fetch data concurrently
    const [courses, teachers, users, apps, events] = await Promise.all([
      window.api.getCourses(),
      window.api.getTeachers(),
      window.api.getBotUsers(),
      window.api.getRegisterUsers(),
      window.api.getEvents()
    ]);

    const coursesCount = window.helpers.parseListResponse(courses).count;
    const teachersCount = window.helpers.parseListResponse(teachers).count;
    const usersCount = window.helpers.parseListResponse(users).count;
    
    const parsedApps = window.helpers.parseListResponse(apps);
    const appsCount = parsedApps.count;
    const recentApps = parsedApps.results.slice(0, 5);

    const parsedEvents = window.helpers.parseListResponse(events);
    const recentEvents = parsedEvents.results.slice(0, 5);

    // Build UI
    container.innerHTML = '';
    
    // Stats
    const statsGrid = document.createElement('div');
    statsGrid.className = 'stats-grid mb-6 stagger-children';
    
    statsGrid.appendChild(window.StatsCard.build({
      label: 'Jami kurslar',
      value: coursesCount,
      color: 'accent',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/><path d="M18 5v17"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg>'
    }));

    statsGrid.appendChild(window.StatsCard.build({
      label: 'O\'qituvchilar',
      value: teachersCount,
      color: 'success',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>'
    }));

    statsGrid.appendChild(window.StatsCard.build({
      label: 'Bot foydalanuvchilar',
      value: usersCount,
      color: 'info',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
    }));

    statsGrid.appendChild(window.StatsCard.build({
      label: 'Yangi arizalar',
      value: appsCount,
      color: 'warning',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>'
    }));

    container.appendChild(statsGrid);

    // Quick Actions
    const quickActionsCard = document.createElement('div');
    quickActionsCard.className = 'card mb-6 animate-fade-in-up';
    quickActionsCard.style.animationDelay = '100ms';
    quickActionsCard.innerHTML = `
      <div class="card-header">
        <h3 class="card-title">Tezkor harakatlar</h3>
      </div>
      <div class="quick-actions">
        <div class="quick-action-btn" onclick="window.router.navigate('/courses')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
          <span>Kurs yaratish</span>
        </div>
        <div class="quick-action-btn" onclick="window.router.navigate('/broadcast')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          <span>Xabar yuborish</span>
        </div>
        <div class="quick-action-btn" onclick="window.router.navigate('/news')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>Yangilik qo'shish</span>
        </div>
        <div class="quick-action-btn" onclick="window.router.navigate('/users')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          <span>Eksport qilsish</span>
        </div>
      </div>
    `;
    container.appendChild(quickActionsCard);

    // Grid for recent items
    const contentGrid = document.createElement('div');
    contentGrid.className = 'content-grid content-grid-2 animate-fade-in-up';
    contentGrid.style.animationDelay = '200ms';

    // Applications
    const appsHtml = recentApps.length > 0 ? recentApps.map(app => `
      <div class="recent-item">
        <div class="recent-item-avatar" style="background: ${window.helpers.stringToColor(app.full_name)}">
          ${window.helpers.getInitials(app.full_name)}
        </div>
        <div class="recent-item-content">
          <div class="recent-item-name">${window.helpers.escapeHtml(app.full_name)}</div>
          <div class="recent-item-meta">${window.helpers.escapeHtml(app.phone_number)} • ${window.helpers.escapeHtml(app.english_level)}</div>
        </div>
        <div class="recent-item-time">${window.helpers.timeAgo(app.created_at)}</div>
      </div>
    `).join('') : '<div class="table-empty"><p>Arizalar yo\'q</p></div>';

    // Events
    const eventsHtml = recentEvents.length > 0 ? recentEvents.map(event => `
      <div class="recent-item">
        <div class="recent-item-avatar" style="background: var(--accent-muted); color: var(--accent)">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div class="recent-item-content">
          <div class="recent-item-name">${window.helpers.escapeHtml(event.name)}</div>
          <div class="recent-item-meta">${window.helpers.truncate(event.description, 40)}</div>
        </div>
        <div class="recent-item-time">${window.helpers.timeAgo(event.created_at)}</div>
      </div>
    `).join('') : '<div class="table-empty"><p>Yangiliklar yo\'q</p></div>';

    contentGrid.innerHTML = `
      <div class="card card-hover">
        <div class="card-header">
          <h3 class="card-title">Yangi Arizalar</h3>
          <button class="btn btn-ghost btn-sm" onclick="window.router.navigate('/applications')">Barchasi</button>
        </div>
        <div class="recent-list">${appsHtml}</div>
      </div>
      <div class="card card-hover">
        <div class="card-header">
          <h3 class="card-title">So'nggi Yangiliklar</h3>
          <button class="btn btn-ghost btn-sm" onclick="window.router.navigate('/news')">Barchasi</button>
        </div>
        <div class="recent-list">${eventsHtml}</div>
      </div>
    `;

    container.appendChild(contentGrid);

  } catch (err) {
    console.error(err);
    container.innerHTML = `
      <div class="empty-state">
        <p class="text-danger">Ma'lumotlarni yuklashda xatolik yuz berdi.</p>
        <button class="btn btn-primary mt-4" onclick="window.router._onRouteChange()">Qayta urinish</button>
      </div>
    `;
  }
});
