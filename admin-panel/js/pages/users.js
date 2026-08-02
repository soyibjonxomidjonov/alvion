/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Users Page
   ═══════════════════════════════════════════════════════════ */

window.router.register('/users', async () => {
  const container = document.getElementById('main-content');

  container.innerHTML = `
    <div class="tabs mb-6 animate-fade-in-down">
      <button class="tab-btn active" data-target="tab-bot-users">Bot Foydalanuvchilari</button>
      <button class="tab-btn" data-target="tab-registered">Ro'yxatdan o'tganlar</button>
    </div>

    <!-- Bot Users Tab -->
    <div class="tab-content active" id="tab-bot-users">
      <div class="page-header">
        <div class="filter-row" id="bot-filter-row">
          <div class="search-filter-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
            <input type="text" class="search-filter-input" id="search-bot-users" placeholder="Chat ID yoki username...">
          </div>
          <select class="form-select filter-select" id="filter-bot-admin">
            <option value="">Barcha holat: Barchasi</option>
            <option value="true">Adminlar</option>
            <option value="false">Oddiy foydalanuvchilar</option>
          </select>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary" id="btn-export-bot">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Excel formatida yuklash
          </button>
        </div>
      </div>
      <div id="bot-table-container">
        <div class="skeleton skeleton-card" style="height: 400px"></div>
      </div>
    </div>

    <!-- Registered Users Tab -->
    <div class="tab-content" id="tab-registered">
      <div class="page-header">
        <div class="filter-row" id="reg-filter-row">
          <div class="search-filter-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
            <input type="text" class="search-filter-input" id="search-reg-users" placeholder="ID, chat ID, ism yoki telefon...">
          </div>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary" id="btn-export-reg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Excel formatida yuklash
          </button>
        </div>
      </div>
      <div id="reg-table-container">
        <div class="skeleton skeleton-card" style="height: 400px"></div>
      </div>
    </div>
  `;

  // Tab switching logic
  const tabBtns = container.querySelectorAll('.tab-btn');
  const tabContents = container.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(targetId).classList.add('active');
    });
  });

  let botUsersData = [];
  let regUsersData = [];

  /* ══════════════════════════════════════
     BOT USERS
  ══════════════════════════════════════ */

  async function loadBotUsers() {
    try {
      const data = await window.api.getBotUsers();
      botUsersData = window.helpers.parseListResponse(data).results;
      renderBotUsersTable();
    } catch (err) {
      if (window.toast) window.toast.error(err.message);
      document.getElementById('bot-table-container').innerHTML =
        `<p class="text-danger" style="padding:var(--space-4)">Xatolik: ${window.helpers.escapeHtml(err.message)}</p>`;
    }
  }

  function getFilteredBotUsers() {
    const adminFilter = document.getElementById('filter-bot-admin')?.value || '';
    const searchVal = (document.getElementById('search-bot-users')?.value || '').trim().toLowerCase();

    let filtered = [...botUsersData];

    if (adminFilter !== '') {
      filtered = filtered.filter(u => String(u.is_admin) === adminFilter);
    }

    if (searchVal) {
      filtered = filtered.filter(u => {
        const chatId = String(u.chat_id || '').toLowerCase();
        const username = String(u.username || '').toLowerCase();
        const fullName = String(u.full_name || '').toLowerCase();
        return chatId.includes(searchVal) || username.includes(searchVal) || fullName.includes(searchVal);
      });
    }

    return filtered;
  }

  function renderBotUsersTable() {
    const filtered = getFilteredBotUsers();

    const table = window.DataTable.build({
      columns: [
        { key: 'id', label: 'ID', width: '60px' },
        { key: 'chat_id', label: 'Chat ID' },
        { key: 'username', label: 'Username', render: val => val ? `@${val}` : '<span style="color:var(--text-tertiary)">—</span>' },
        {
          key: 'is_admin',
          label: 'Admin',
          render: val => val
            ? '<span class="badge badge-success">Admin</span>'
            : '<span class="badge badge-secondary">Foydalanuvchi</span>'
        },
      ],
      data: filtered,
      customActions: [
        {
          type: 'primary',
          title: 'Admin holatini o\'zgartirish',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
          onClick: (row) => toggleAdminStatus(row)
        }
      ],
      emptyText: filtered.length === 0 && botUsersData.length > 0
        ? 'Qidiruv natijalari topilmadi'
        : 'Bot foydalanuvchilari mavjud emas'
    });

    document.getElementById('bot-table-container').innerHTML = '';
    document.getElementById('bot-table-container').appendChild(table);
  }

  // Bind filters
  document.getElementById('filter-bot-admin')?.addEventListener('change', renderBotUsersTable);
  document.getElementById('search-bot-users')?.addEventListener('input', () => {
    clearTimeout(window._botSearchTimer);
    window._botSearchTimer = setTimeout(renderBotUsersTable, 250);
  });

  async function toggleAdminStatus(user) {
    if (!confirm(`Siz rostdan ham ushbu foydalanuvchining admin holatini o'zgartirmoqchimisiz?`)) return;
    try {
      await window.api.updateBotUser(user.id, { is_admin: !user.is_admin });
      if (window.toast) window.toast.success("Admin holati o'zgartirildi!");
      loadBotUsers();
    } catch (err) {
      if (window.toast) window.toast.error("Xatolik yuz berdi: " + err.message);
    }
  }

  /* ══════════════════════════════════════
     REGISTER USERS
  ══════════════════════════════════════ */

  async function loadRegUsers() {
    try {
      const data = await window.api.getRegisterUsers();
      regUsersData = window.helpers.parseListResponse(data).results;
      renderRegUsersTable();
    } catch (err) {
      if (window.toast) window.toast.error(err.message);
      document.getElementById('reg-table-container').innerHTML =
        `<p class="text-danger" style="padding:var(--space-4)">Xatolik: ${window.helpers.escapeHtml(err.message)}</p>`;
    }
  }

  function getFilteredRegUsers() {
    const searchVal = (document.getElementById('search-reg-users')?.value || '').trim().toLowerCase();

    let filtered = [...regUsersData];

    if (searchVal) {
      filtered = filtered.filter(u => {
        const id = String(u.id || '').toLowerCase();
        const chatId = String(u.chat_id || '').toLowerCase();
        const name = String(u.full_name || '').toLowerCase();
        const phone = String(u.phone_number || '').toLowerCase();
        
        return id.includes(searchVal) || 
               chatId.includes(searchVal) || 
               name.includes(searchVal) || 
               phone.includes(searchVal);
      });
    }

    return filtered;
  }

  function renderRegUsersTable() {
    const filtered = getFilteredRegUsers();

    const table = window.DataTable.build({
      columns: [
        { key: 'full_name', label: 'Ism sharif', render: val => `<strong>${window.helpers.escapeHtml(val || '—')}</strong>` },
        { key: 'phone_number', label: 'Telefon' },
        { key: 'age', label: 'Yosh' },
        { key: 'english_level', label: 'Daraja', render: val => val ? `<span class="badge badge-accent">${window.helpers.escapeHtml(val)}</span>` : '—' },
        { key: 'created_at', label: 'Sana', format: 'date' },
      ],
      data: filtered,
      customActions: [
        {
          type: 'secondary',
          title: 'Tafsilotlar',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
          onClick: (row) => viewDetails(row)
        }
      ],
      onDelete: (row) => deleteRegUser(row.id),
      emptyText: filtered.length === 0 && regUsersData.length > 0
        ? 'Qidiruv natijalari topilmadi'
        : 'Ro\'yxatdan o\'tganlar mavjud emas'
    });

    document.getElementById('reg-table-container').innerHTML = '';
    document.getElementById('reg-table-container').appendChild(table);
  }

  // Bind reg filters
  document.getElementById('search-reg-users')?.addEventListener('input', () => {
    clearTimeout(window._regSearchTimer);
    window._regSearchTimer = setTimeout(renderRegUsersTable, 250);
  });

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
            <div class="settings-row-label">${user.age || '—'}</div>
          </div>
        </div>
        <div class="settings-row">
          <div class="settings-row-info">
            <div class="settings-row-desc">Manzil</div>
            <div class="settings-row-label">${window.helpers.escapeHtml(user.address || '—')}</div>
          </div>
        </div>
        <div class="settings-row">
          <div class="settings-row-info">
            <div class="settings-row-desc">Ingliz tili darajasi</div>
            <div class="settings-row-label"><span class="badge badge-accent">${window.helpers.escapeHtml(user.english_level || '—')}</span></div>
          </div>
        </div>
        <div class="settings-row">
          <div class="settings-row-info">
            <div class="settings-row-desc">Qulay vaqt</div>
            <div class="settings-row-label">${window.helpers.escapeHtml(user.convenient_time || '—')}</div>
          </div>
        </div>
        <div class="settings-row">
          <div class="settings-row-info">
            <div class="settings-row-desc">Chat ID</div>
            <div class="settings-row-label font-mono">${user.chat_id || '—'}</div>
          </div>
        </div>
        <div class="settings-row" style="flex-direction: column; align-items: flex-start; gap: var(--space-2)">
          <div class="settings-row-desc">Izoh</div>
          <div class="settings-row-label" style="background: var(--bg-tertiary); padding: var(--space-3); border-radius: var(--radius-sm); width: 100%; white-space: pre-wrap;">${window.helpers.escapeHtml(user.comment) || 'Izoh qoldirilmagan'}</div>
        </div>
      </div>
    `;

    window.modal.open({
      title: 'Foydalanuvchi tafsilotlari',
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
          loadRegUsers();
        } catch (err) { window.toast.error(err.message); }
      }
    });
  }

  /* ══════════════════════════════════════
     EXPORTS
  ══════════════════════════════════════ */

  container.querySelector('#btn-export-bot').addEventListener('click', () => {
    const filtered = getFilteredBotUsers();
    window.exporter.exportToExcel(filtered, 'Bot_Foydalanuvchilari', {
      id: 'ID',
      chat_id: 'Chat ID',
      username: 'Username',
      is_admin: { label: 'Admin', fn: val => val ? 'Ha' : 'Yo\'q' }
    });
  });

  document.getElementById('btn-export-reg').addEventListener('click', () => {
    const filtered = getFilteredRegUsers();
    window.exporter.exportToExcel(filtered, 'Royxatdan_otganlar', {
      id: 'ID',
      full_name: 'Ism Sharif',
      phone_number: 'Telefon',
      age: 'Yosh',
      address: 'Manzil',
      english_level: 'Daraja',
      convenient_time: 'Qulay vaqt',
      comment: 'Izoh',
      chat_id: 'Chat ID',
      created_at: { label: 'Sana', fn: val => window.helpers.formatDate(val) }
    });
  });

  loadBotUsers();
  loadRegUsers();
});
