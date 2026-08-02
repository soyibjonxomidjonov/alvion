/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Courses Page
   ═══════════════════════════════════════════════════════════ */

window.router.register('/courses', async () => {
  const container = document.getElementById('main-content');
  
  container.innerHTML = `
    <div class="page-header animate-fade-in-down">
      <div></div>
      <div class="page-header-actions">
        <button class="btn btn-primary" id="btn-add-course">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Yangi kurs qo'shish
        </button>
      </div>
    </div>
    <div id="table-container" class="animate-fade-in-up" style="animation-delay: 100ms">
      <div class="skeleton skeleton-card" style="height: 400px"></div>
    </div>
  `;

  // Schema for Course Form
  const formSchema = [
    { name: 'name', label: 'Kurs nomi', type: 'text', required: true, col: 1 },
    { name: 'duration', label: 'Davomiyligi (oy)', type: 'number', required: true, col: 2 },
    { name: 'lesson_per_week', label: 'Haftalik darslar', type: 'number', required: true, default: 3, col: 2 },
    { name: 'monthly_payment_base', label: 'Asosiy narx', type: 'number', col: 1 },
    { name: 'for_whom', label: 'Kimlar uchun', type: 'textarea', required: true, col: 1 },
    { name: 'results_course', label: 'Kutilayotgan natijalar', type: 'textarea', required: true, col: 1 },
  ];

  async function loadData() {
    try {
      const data = await window.api.getCourses();
      const parsed = window.helpers.parseListResponse(data);
      
      const table = window.DataTable.build({
        columns: [
          { key: 'id', label: 'ID', width: '60px' },
          { key: 'name', label: 'Kurs Nomi' },
          { key: 'duration', label: 'Davomiyligi', render: val => `${val} oy` },
          { key: 'lesson_per_week', label: 'Haftada', render: val => `${val} marta` },
          { key: 'monthly_payment_base', label: 'Narxi', format: 'price' },
          { key: 'created_at', label: 'Yaratilgan', format: 'date' },
        ],
        data: parsed.results,
        onEdit: (row) => openModal(row),
        onDelete: (row) => deleteItem(row.id)
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

  function openModal(item = null) {
    const isEdit = !!item;
    
    const form = window.FormBuilder.build(formSchema, item || {}, async (formData) => {
      if (isEdit) {
        await window.api.updateCourse(item.id, formData);
        window.toast.success('Kurs muvaffaqiyatli yangilandi');
      } else {
        await window.api.createCourse(formData);
        window.toast.success('Yangi kurs qo\'shildi');
      }
      window.modal.close();
      loadData();
    });

    window.modal.open({
      title: isEdit ? 'Kursni tahrirlash' : 'Yangi kurs',
      content: form,
      footer: `
        <button class="btn btn-ghost" onclick="window.modal.close()">Bekor qilish</button>
        <button class="btn btn-primary" id="modal-submit-btn" onclick="document.querySelector('.dynamic-form').dispatchEvent(new Event('submit'))">Saqlash</button>
      `
    });
  }

  function deleteItem(id) {
    window.modal.confirm({
      text: 'Haqiqatdan ham ushbu kursni o\'chirmoqchimisiz? Bunga bog\'liq barcha ma\'lumotlar o\'chib ketishi mumkin.',
      isDanger: true,
      onConfirm: async () => {
        try {
          await window.api.deleteCourse(id);
          window.toast.success('Kurs o\'chirildi');
          loadData();
        } catch (err) {
          window.toast.error(err.message);
        }
      }
    });
  }

  // Bind Add Button
  document.getElementById('btn-add-course').addEventListener('click', () => openModal());

  // Load initial data
  loadData();
});
