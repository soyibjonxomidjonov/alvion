/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — News & Announcements
   ═══════════════════════════════════════════════════════════ */

window.router.register('/news', async () => {
  const container = document.getElementById('main-content');

  container.innerHTML = `
    <div class="tabs mb-6 animate-fade-in-down">
      <button class="tab-btn active" data-target="tab-events">Tadbirlar (Events)</button>
      <button class="tab-btn" data-target="tab-announcements">E'lonlar (Announcements)</button>
    </div>

    <!-- Events -->
    <div class="tab-content active" id="tab-events">
      <div class="page-header">
        <div></div>
        <div class="page-header-actions">
          <button class="btn btn-primary" id="btn-add-event">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tadbir qo'shish
          </button>
        </div>
      </div>
      <div id="events-container">
        <div class="skeleton skeleton-card" style="height: 300px"></div>
      </div>
    </div>

    <!-- Announcements -->
    <div class="tab-content" id="tab-announcements">
      <div class="page-header">
        <div></div>
        <div class="page-header-actions">
          <button class="btn btn-primary" id="btn-add-announcement">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            E'lon qo'shish
          </button>
        </div>
      </div>
      <div id="announcements-container">
        <div class="skeleton skeleton-card" style="height: 300px"></div>
      </div>
    </div>
  `;

  // Tabs
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

  async function init() {
    await Promise.all([
      loadEvents(),
      loadAnnouncements()
    ]);
  }

  /* ══════════════════════════════════
     EVENTS CRUD
  ══════════════════════════════════ */

  async function loadEvents() {
    try {
      const res = await window.api.getEvents();
      const data = window.helpers.parseListResponse(res).results;

      const table = window.DataTable.build({
        columns: [
          {
            key: 'name',
            label: 'Tadbir nomi',
            render: val => `<span style="white-space:normal;word-break:break-word;max-width:200px;display:inline-block">${window.helpers.escapeHtml(val || '—')}</span>`
          },
          {
            key: 'description',
            label: 'Tavsif',
            render: val => `<span style="white-space:normal;word-break:break-word;max-width:280px;display:inline-block;color:var(--text-secondary)">${window.helpers.escapeHtml(window.helpers.truncate(val, 80))}</span>`
          },
          { key: 'created_at', label: 'Sana', format: 'date', width: '120px' },
        ],
        data,
        onEdit: (row) => openEventModal(row),
        onDelete: (row) => deleteEvent(row.id),
        emptyText: 'Hali tadbir qo\'shilmagan'
      });

      document.getElementById('events-container').innerHTML = '';
      document.getElementById('events-container').appendChild(table);
    } catch (e) {
      if (window.toast) window.toast.error(e.message);
      document.getElementById('events-container').innerHTML =
        `<p class="text-danger" style="padding:var(--space-4)">Xatolik: ${window.helpers.escapeHtml(e.message)}</p>`;
    }
  }

  function openEventModal(item = null) {
    const isEdit = !!item;
    const schema = [
      { name: 'name', label: 'Tadbir nomi', type: 'text', required: true, placeholder: 'Tadbir nomini kiriting' },
      { name: 'description', label: 'Batafsil ma\'lumot', type: 'textarea', required: true, placeholder: 'Tadbir haqida batafsil...' }
    ];
    const form = window.FormBuilder.build(schema, item || {}, async (data) => {
      try {
        isEdit
          ? await window.api.updateEvent(item.id, data)
          : await window.api.createEvent(data);
        window.toast.success('Saqlandi ✓');
        window.modal.close();
        loadEvents();
      } catch (err) {
        window.toast.error(err.message);
      }
    });

    const footerEl = document.createElement('div');
    footerEl.innerHTML = `
      <button class="btn btn-ghost" onclick="window.modal.close()">Bekor qilish</button>
      <button class="btn btn-primary" id="modal-event-submit">Saqlash</button>
    `;
    footerEl.querySelector('#modal-event-submit').addEventListener('click', () => {
      form.dispatchEvent(new Event('submit'));
    });

    window.modal.open({
      title: isEdit ? 'Tadbirni tahrirlash' : 'Yangi tadbir',
      content: form,
      footer: footerEl
    });
  }

  function deleteEvent(id) {
    window.modal.confirm({
      isDanger: true,
      title: 'Tadbirni o\'chirish',
      text: 'Ushbu tadbir o\'chirib tashlanadi.',
      confirmText: 'Ha, o\'chirish',
      onConfirm: async () => {
        try {
          await window.api.deleteEvent(id);
          window.toast.success('O\'chirildi');
          loadEvents();
        } catch (err) {
          window.toast.error(err.message);
        }
      }
    });
  }

  /* ══════════════════════════════════
     ANNOUNCEMENTS CRUD
  ══════════════════════════════════ */

  async function loadAnnouncements() {
    try {
      const res = await window.api.getAnnouncements();
      const data = window.helpers.parseListResponse(res).results;

      const table = window.DataTable.build({
        columns: [
          {
            key: 'name',
            label: 'E\'lon nomi',
            render: val => `<span style="white-space:normal;word-break:break-word;max-width:200px;display:inline-block">${window.helpers.escapeHtml(val || '—')}</span>`
          },
          {
            key: 'description',
            label: 'Tavsif',
            render: val => `<span style="white-space:normal;word-break:break-word;max-width:280px;display:inline-block;color:var(--text-secondary)">${window.helpers.escapeHtml(window.helpers.truncate(val, 80))}</span>`
          },
        ],
        data,
        onEdit: (row) => openAnnouncementModal(row),
        onDelete: (row) => deleteAnnouncement(row.id),
        emptyText: 'Hali e\'lon qo\'shilmagan'
      });

      document.getElementById('announcements-container').innerHTML = '';
      document.getElementById('announcements-container').appendChild(table);
    } catch (e) {
      if (window.toast) window.toast.error(e.message);
      document.getElementById('announcements-container').innerHTML =
        `<p class="text-danger" style="padding:var(--space-4)">Xatolik: ${window.helpers.escapeHtml(e.message)}</p>`;
    }
  }

  function openAnnouncementModal(item = null) {
    const isEdit = !!item;
    const schema = [
      { name: 'name', label: 'E\'lon nomi', type: 'text', required: true, placeholder: 'E\'lon nomini kiriting' },
      { name: 'description', label: 'Batafsil ma\'lumot', type: 'textarea', required: true, placeholder: 'E\'lon haqida batafsil...' }
    ];
    const form = window.FormBuilder.build(schema, item || {}, async (data) => {
      try {
        isEdit
          ? await window.api.updateAnnouncement(item.id, data)
          : await window.api.createAnnouncement(data);
        window.toast.success('Saqlandi ✓');
        window.modal.close();
        loadAnnouncements();
      } catch (err) {
        window.toast.error(err.message);
      }
    });

    const footerEl = document.createElement('div');
    footerEl.innerHTML = `
      <button class="btn btn-ghost" onclick="window.modal.close()">Bekor qilish</button>
      <button class="btn btn-primary" id="modal-ann-submit">Saqlash</button>
    `;
    footerEl.querySelector('#modal-ann-submit').addEventListener('click', () => {
      form.dispatchEvent(new Event('submit'));
    });

    window.modal.open({
      title: isEdit ? 'E\'lonni tahrirlash' : 'Yangi e\'lon',
      content: form,
      footer: footerEl
    });
  }

  function deleteAnnouncement(id) {
    window.modal.confirm({
      isDanger: true,
      title: 'E\'lonni o\'chirish',
      text: 'Ushbu e\'lon o\'chirib tashlanadi.',
      confirmText: 'Ha, o\'chirish',
      onConfirm: async () => {
        try {
          await window.api.deleteAnnouncement(id);
          window.toast.success('O\'chirildi');
          loadAnnouncements();
        } catch (err) {
          window.toast.error(err.message);
        }
      }
    });
  }

  // Bind Buttons
  document.getElementById('btn-add-event').addEventListener('click', () => openEventModal());
  document.getElementById('btn-add-announcement').addEventListener('click', () => openAnnouncementModal());

  init();
});
