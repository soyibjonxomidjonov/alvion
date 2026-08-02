/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Lessons Page (Combined)
   ═══════════════════════════════════════════════════════════ */

window.router.register('/lessons', async () => {
  const container = document.getElementById('main-content');
  
  container.innerHTML = `
    <div class="page-header animate-fade-in-down">
      <div>
        <h2 class="page-title">Dars guruhlari</h2>
        <p class="text-tertiary" style="font-size:var(--fs-sm)">Guruhlarni va ularning dars vaqtlarini (jadvallarini) boshqaring</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" id="btn-add-lesson">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Yangi guruh
        </button>
      </div>
    </div>
    
    <div id="lessons-table-container" class="animate-fade-in-up">
      <div class="skeleton skeleton-card" style="height: 300px"></div>
    </div>
  `;

  // Data state
  let lessonsData = [];

  async function loadLessons() {
    try {
      const data = await window.api.getLessons();
      lessonsData = window.helpers.parseListResponse(data).results;
      
      const table = window.DataTable.build({
        columns: [
          { key: 'id', label: 'ID', width: '60px' },
          { key: 'name', label: 'Guruh Nomi' },
        ],
        data: lessonsData,
        onEdit: (row) => openLessonModal(row),
        onDelete: (row) => deleteLesson(row.id),
        customActions: [
          {
            type: 'primary',
            title: 'Jadvallarni boshqarish',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>',
            onClick: (row) => openSchedulesManager(row)
          }
        ]
      });
      
      document.getElementById('lessons-table-container').innerHTML = '';
      document.getElementById('lessons-table-container').appendChild(table);
    } catch (err) {
      if (window.toast) window.toast.error(err.message);
    }
  }

  // --- LESSON CRUD ---
  function openLessonModal(item = null) {
    const isEdit = !!item;
    const schema = [{ name: 'name', label: 'Guruh nomi', type: 'text', required: true }];
    
    const form = window.FormBuilder.build(schema, item || {}, async (data) => {
      if (isEdit) {
        await window.api.updateLesson(item.id, data);
        window.toast.success('Guruh yangilandi');
      } else {
        await window.api.createLesson(data);
        window.toast.success('Yangi guruh qo\'shildi');
      }
      window.modal.close();
      await loadLessons();
    });

    window.modal.open({
      title: isEdit ? 'Guruhni tahrirlash' : 'Yangi guruh',
      content: form,
      footer: `
        <button class="btn btn-ghost" onclick="window.modal.close()">Bekor qilish</button>
        <button class="btn btn-primary" onclick="document.querySelector('.dynamic-form').dispatchEvent(new Event('submit'))">Saqlash</button>
      `
    });
  }

  function deleteLesson(id) {
    window.modal.confirm({
      text: 'O\'chirmoqchimisiz? Guruhga tegishli barcha dars jadvallari ham o\'chib ketadi.',
      isDanger: true,
      onConfirm: async () => {
        try {
          await window.api.deleteLesson(id);
          window.toast.success('O\'chirildi');
          await loadLessons();
        } catch (err) { window.toast.error(err.message); }
      }
    });
  }

  // --- SCHEDULES MANAGER (LessonInfo) ---
  async function openSchedulesManager(lesson) {
    const wrapper = document.createElement('div');
    wrapper.className = 'schedules-manager';
    wrapper.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:var(--space-3); flex-wrap:wrap; margin-bottom:var(--space-4); border-bottom: 1px solid var(--border-secondary); padding-bottom: var(--space-4);">
        <p class="text-tertiary" style="font-size:var(--fs-sm); flex: 1; min-width: 200px;">Ushbu guruh dars bo'ladigan vaqtlar va bo'sh joylar sonini belgilang.</p>
        <button class="btn btn-primary btn-sm" id="btn-add-schedule-inline" style="flex-shrink: 0; white-space: nowrap;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Jadval qo'shish
        </button>
      </div>
      <div id="inline-schedules-container">
        <div class="skeleton" style="height: 100px; border-radius: var(--radius-md);"></div>
      </div>
    `;

    window.modal.open({
      title: `📅 Dars jadvali — ${lesson.name}`,
      content: wrapper,
      size: 'lg',
      footer: `<button class="btn btn-ghost" onclick="window.modal.close()">Yopish</button>`
    });

    await renderInlineSchedules(lesson.id, wrapper);

    wrapper.querySelector('#btn-add-schedule-inline').addEventListener('click', () => {
      openScheduleForm(lesson, null, wrapper);
    });
  }

  async function renderInlineSchedules(lessonId, wrapper) {
    const container = wrapper.querySelector('#inline-schedules-container');
    container.innerHTML = '<div class="skeleton" style="height: 100px; border-radius: var(--radius-md);"></div>';

    try {
      // Get all schedules and filter by this lesson. 
      // (Using search or fetching all depends on API, we fetch all and filter client side to be safe)
      const res = await window.api.getLessonInfos({ search: lessonId });
      const schedules = window.helpers.parseListResponse(res).results.filter(s => String(s.lesson_id) === String(lessonId));

      if (schedules.length === 0) {
        container.innerHTML = `
          <div class="qm-empty">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            <p>Ushbu guruh uchun jadval qo'shilmagan</p>
          </div>
        `;
        return;
      }

      const table = window.DataTable.build({
        columns: [
          { key: 'start_time', label: 'Boshlanish vaqti', format: 'datetime' },
          { key: 'empty_spaces', label: 'Bo\'sh joylar', align: 'center', render: val => `<span class="badge badge-accent">${val} ta joy</span>` },
        ],
        data: schedules,
        onEdit: (row) => openScheduleForm({ id: lessonId }, row, wrapper),
        onDelete: (row) => deleteSchedule(row.id, lessonId, wrapper)
      });
      
      container.innerHTML = '';
      container.appendChild(table);
    } catch (e) {
      container.innerHTML = `<p class="text-danger">Xatolik: ${e.message}</p>`;
    }
  }

  function openScheduleForm(lesson, item = null, parentWrapper) {
    const isEdit = !!item;
    
    // Convert current modal to next modal
    const schema = [
      { name: 'lesson_id', type: 'hidden', value: lesson.id },
      { name: 'start_time', label: 'Boshlanish vaqti', type: 'datetime-local', required: true },
      { name: 'empty_spaces', label: 'Bo\'sh joylar', type: 'number', required: true, min: 0 }
    ];
    
    const form = window.FormBuilder.build(schema, item || { lesson_id: lesson.id }, async (data) => {
      if (isEdit) {
        await window.api.updateLessonInfo(item.id, data);
        window.toast.success('Jadval yangilandi');
      } else {
        await window.api.createLessonInfo(data);
        window.toast.success('Yangi jadval qo\'shildi');
      }
      window.modal.close();
      // Wait for modal animation, then reopen schedules manager
      setTimeout(() => openSchedulesManager(lesson), 300);
    });

    window.modal.open({
      title: isEdit ? 'Jadvalni tahrirlash' : 'Yangi jadval',
      content: form,
      footer: `
        <button class="btn btn-ghost" onclick="window.modal.close(); setTimeout(() => document.getElementById('btn-add-lesson').click(), 0)">Bekor qilish</button>
        <button class="btn btn-primary" onclick="document.querySelector('.dynamic-form').dispatchEvent(new Event('submit'))">Saqlash</button>
      `
    });
    
    // Fix back button for modal chaining
    const backBtn = document.querySelector('.modal-footer .btn-ghost');
    backBtn.onclick = () => {
      window.modal.close();
      setTimeout(() => openSchedulesManager(lesson), 300);
    };
  }

  function deleteSchedule(id, lessonId, wrapper) {
    window.modal.confirm({
      text: 'Ushbu dars vaqtini o\'chirmoqchimisiz?',
      isDanger: true,
      onConfirm: async () => {
        try {
          await window.api.deleteLessonInfo(id);
          window.toast.success('Jadval o\'chirildi');
          renderInlineSchedules(lessonId, wrapper);
        } catch (err) { window.toast.error(err.message); }
      }
    });
  }

  document.getElementById('btn-add-lesson').addEventListener('click', () => openLessonModal());

  loadLessons();
});
