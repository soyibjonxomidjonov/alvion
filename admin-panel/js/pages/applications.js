/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Applications Page
   (Filtered view of RegisterUsers for new applications)
   ═══════════════════════════════════════════════════════════ */

window.router.register('/applications', async () => {
  const container = document.getElementById('main-content');
  
  container.innerHTML = `
    <div class="page-header animate-fade-in-down">
      <div class="header-page-info">
        <h2 class="header-page-title" style="font-size: var(--fs-xl)">Yangi Arizalar</h2>
        <div class="header-page-subtitle">So'nggi 7 kun ichida kelib tushgan arizalar ro'yxati</div>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-secondary" onclick="window.router.navigate('/users')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Barcha foydalanuvchilar
        </button>
      </div>
    </div>
    <div id="table-container" class="animate-fade-in-up" style="animation-delay: 100ms">
      <div class="skeleton skeleton-card" style="height: 400px"></div>
    </div>
  `;

  async function loadData() {
    try {
      const data = await window.api.getRegisterUsers();
      const allUsers = window.helpers.parseListResponse(data).results;
      
      // Filter for last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentApps = allUsers.filter(u => new Date(u.created_at) >= sevenDaysAgo);
      
      const table = window.DataTable.build({
        columns: [
          { key: 'full_name', label: 'Ism sharif', render: val => `<strong>${val}</strong>` },
          { key: 'phone_number', label: 'Telefon' },
          { key: 'english_level', label: 'Daraja' },
          { key: 'created_at', label: 'Kelib tushgan vaqt', format: 'datetime' },
        ],
        data: recentApps,
        emptyText: 'Yangi arizalar mavjud emas',
        customActions: [
          {
            type: 'primary',
            title: 'Ko\'rish',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
            onClick: (row) => viewDetails(row)
          }
        ],
        onDelete: (row) => deleteRegUser(row.id)
      });
      
      const tc = document.getElementById('table-container');
      if (tc) {
        tc.innerHTML = '';
        tc.appendChild(table);
      }
    } catch (err) {
      if (window.toast) window.toast.error(err.message);
    }
  }

  function viewDetails(user) {
    const content = `
      <div class="settings-section" style="margin-bottom:0; border:none; padding:0">
        <div class="settings-row">
          <div class="settings-row-info">
            <div class="settings-row-desc">Ism sharif</div>
            <div class="settings-row-label">${window.helpers.escapeHtml(user.full_name)}</div>
          </div>
        </div>
        <div class="settings-row">
          <div class="settings-row-info">
            <div class="settings-row-desc">Telefon raqam</div>
            <div class="settings-row-label">${window.helpers.escapeHtml(user.phone_number)}</div>
          </div>
        </div>
        <div class="settings-row">
          <div class="settings-row-info">
            <div class="settings-row-desc">Yosh</div>
            <div class="settings-row-label">${user.age}</div>
          </div>
        </div>
        <div class="settings-row">
          <div class="settings-row-info">
            <div class="settings-row-desc">Manzil</div>
            <div class="settings-row-label">${window.helpers.escapeHtml(user.address)}</div>
          </div>
        </div>
        <div class="settings-row">
          <div class="settings-row-info">
            <div class="settings-row-desc">Ingliz tili darajasi</div>
            <div class="settings-row-label"><span class="badge badge-accent">${window.helpers.escapeHtml(user.english_level)}</span></div>
          </div>
        </div>
        <div class="settings-row">
          <div class="settings-row-info">
            <div class="settings-row-desc">Qulay vaqt</div>
            <div class="settings-row-label">${window.helpers.escapeHtml(user.convenient_time)}</div>
          </div>
        </div>
        <div class="settings-row" style="flex-direction: column; align-items: flex-start; gap: var(--space-2)">
          <div class="settings-row-desc">Izoh</div>
          <div class="settings-row-label" style="background: var(--bg-tertiary); padding: var(--space-3); border-radius: var(--radius-sm); width: 100%; white-space: pre-wrap;">${window.helpers.escapeHtml(user.comment) || 'Izoh qoldirilmagan'}</div>
        </div>
      </div>
    `;
    
    window.modal.open({
      title: 'Ariza tafsilotlari',
      content: content,
      footer: `<button class="btn btn-ghost" onclick="window.modal.close()">Yopish</button>`
    });
  }

  function deleteRegUser(id) {
    window.modal.confirm({
      text: 'Ushbu arizani o\'chirmoqchimisiz?',
      isDanger: true,
      onConfirm: async () => {
        try {
          await window.api.deleteRegisterUser(id);
          window.toast.success('O\'chirildi');
          loadData();
          
          // trigger badge update
          if (window.Sidebar) window.Sidebar.updateBadges();
        } catch (err) { window.toast.error(err.message); }
      }
    });
  }

  loadData();
});
