/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Prices Page
   ═══════════════════════════════════════════════════════════ */

window.router.register('/prices', async () => {
  const container = document.getElementById('main-content');
  
  container.innerHTML = `
    <div class="tabs mb-6 animate-fade-in-down">
      <button class="tab-btn active" data-target="tab-monthly">Oylik to'lovlar</button>
      <button class="tab-btn" data-target="tab-discounts">Chegirmalar</button>
      <button class="tab-btn" data-target="tab-actions">Aksiyalar</button>
      <button class="tab-btn" data-target="tab-methods">To'lov turlari</button>
    </div>

    <!-- Monthly Payments -->
    <div class="tab-content active" id="tab-monthly">
      <div class="page-header">
        <div></div>
        <div class="page-header-actions">
          <button class="btn btn-primary" id="btn-add-monthly">Qo'shish</button>
        </div>
      </div>
      <div id="monthly-container">
        <div class="skeleton skeleton-card" style="height: 300px"></div>
      </div>
    </div>

    <!-- Discounts -->
    <div class="tab-content" id="tab-discounts">
      <div class="page-header">
        <div></div>
        <div class="page-header-actions">
          <button class="btn btn-primary" id="btn-add-discount">Qo'shish</button>
        </div>
      </div>
      <div id="discount-container">
        <div class="skeleton skeleton-card" style="height: 300px"></div>
      </div>
    </div>

    <!-- Actions (Aksiyalar) -->
    <div class="tab-content" id="tab-actions">
      <div class="page-header">
        <div></div>
        <div class="page-header-actions">
          <button class="btn btn-primary" id="btn-add-action">Qo'shish</button>
        </div>
      </div>
      <div id="action-container">
        <div class="skeleton skeleton-card" style="height: 300px"></div>
      </div>
    </div>

    <!-- Payment Methods -->
    <div class="tab-content" id="tab-methods">
      <div class="page-header">
        <div></div>
        <div class="page-header-actions">
          <button class="btn btn-primary" id="btn-add-method">Qo'shish</button>
        </div>
      </div>
      <div id="method-container">
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

  let coursesData = [];
  let courseOptions = [];

  async function init() {
    try {
      const res = await window.api.getCourses();
      coursesData = window.helpers.parseListResponse(res).results;
      courseOptions = coursesData.map(c => ({ value: c.id, label: c.name }));

      await Promise.all([
        loadMonthly(),
        loadDiscounts(),
        loadActions(),
        loadMethods()
      ]);
    } catch (e) {
      if (window.toast) window.toast.error(e.message);
    }
  }

  // --- MONTHLY ---
  async function loadMonthly() {
    const res = await window.api.getMonthlyPayments();
    const data = window.helpers.parseListResponse(res).results.map(d => ({
      ...d,
      course_name: coursesData.find(c => String(c.id) === String(d.course))?.name || '—'
    }));

    const table = window.DataTable.build({
      columns: [
        { key: 'course_name', label: 'Kurs nomi' },
        { key: 'price', label: 'Narx', format: 'price' },
      ],
      data,
      onEdit: (row) => openMonthlyModal(row),
      onDelete: (row) => deleteMonthly(row.id)
    });
    
    document.getElementById('monthly-container').innerHTML = '';
    document.getElementById('monthly-container').appendChild(table);
  }

  function openMonthlyModal(item = null) {
    const isEdit = !!item;
    const schema = [
      { name: 'course', label: 'Kurs', type: 'select', options: courseOptions, required: true },
      { name: 'price', label: 'Narx', type: 'number', required: true }
    ];
    const form = window.FormBuilder.build(schema, item || {}, async (data) => {
      isEdit ? await window.api.updateMonthlyPayment(item.id, data) : await window.api.createMonthlyPayment(data);
      window.toast.success('Saqlandi');
      window.modal.close();
      loadMonthly();
    });
    window.modal.open({ title: isEdit ? 'Tahrirlash' : 'Yangi narx', content: form, footer: `<button class="btn btn-primary" onclick="document.querySelector('.dynamic-form').dispatchEvent(new Event('submit'))">Saqlash</button>` });
  }

  function deleteMonthly(id) {
    window.modal.confirm({ isDanger: true, onConfirm: async () => { await window.api.deleteMonthlyPayment(id); window.toast.success('O\'chirildi'); loadMonthly(); }});
  }

  // --- DISCOUNTS ---
  async function loadDiscounts() {
    const res = await window.api.getChegirmalar();
    const data = window.helpers.parseListResponse(res).results.map(d => ({
      ...d,
      course_name: coursesData.find(c => String(c.id) === String(d.course))?.name || '—'
    }));

    const table = window.DataTable.build({
      columns: [
        { key: 'course_name', label: 'Kurs nomi' },
        { key: 'discount_percent', label: 'Chegirma', render: val => `${val}%` },
        { key: 'start_time', label: 'Boshlanish', format: 'datetime' },
        { key: 'end_time', label: 'Tugash', format: 'datetime' },
      ],
      data,
      onEdit: (row) => openDiscountModal(row),
      onDelete: (row) => deleteDiscount(row.id)
    });
    
    document.getElementById('discount-container').innerHTML = '';
    document.getElementById('discount-container').appendChild(table);
  }

  function openDiscountModal(item = null) {
    const isEdit = !!item;
    const schema = [
      { name: 'course', label: 'Kurs', type: 'select', options: courseOptions, required: true },
      { name: 'discount_percent', label: 'Chegirma (%)', type: 'number', required: true, min: 0, max: 100 },
      { name: 'start_time', label: 'Boshlanish', type: 'datetime-local', required: true },
      { name: 'end_time', label: 'Tugash', type: 'datetime-local', required: true }
    ];
    const form = window.FormBuilder.build(schema, item || {}, async (data) => {
      isEdit ? await window.api.updateChegirma(item.id, data) : await window.api.createChegirma(data);
      window.toast.success('Saqlandi');
      window.modal.close();
      loadDiscounts();
    });
    window.modal.open({ title: isEdit ? 'Tahrirlash' : 'Yangi chegirma', content: form, footer: `<button class="btn btn-primary" onclick="document.querySelector('.dynamic-form').dispatchEvent(new Event('submit'))">Saqlash</button>` });
  }

  function deleteDiscount(id) {
    window.modal.confirm({ isDanger: true, onConfirm: async () => { await window.api.deleteChegirma(id); window.toast.success('O\'chirildi'); loadDiscounts(); }});
  }

  // --- ACTIONS ---
  async function loadActions() {
    const res = await window.api.getAksiyalar();
    const data = window.helpers.parseListResponse(res).results.map(d => ({
      ...d,
      course_name: coursesData.find(c => String(c.id) === String(d.course))?.name || 'Barchasi uchun'
    }));

    const table = window.DataTable.build({
      columns: [
        { key: 'name', label: 'Aksiya nomi' },
        { key: 'course_name', label: 'Kurs' },
        { key: 'text', label: 'Matn', render: val => window.helpers.truncate(val, 40) },
      ],
      data,
      onEdit: (row) => openActionModal(row),
      onDelete: (row) => deleteAction(row.id)
    });
    
    document.getElementById('action-container').innerHTML = '';
    document.getElementById('action-container').appendChild(table);
  }

  function openActionModal(item = null) {
    const isEdit = !!item;
    const allCourses = [{ value: '', label: 'Barchasi uchun' }, ...courseOptions];
    const schema = [
      { name: 'name', label: 'Aksiya nomi', type: 'text', required: true },
      { name: 'course', label: 'Kurs (ixtiyoriy)', type: 'select', options: allCourses },
      { name: 'text', label: 'Aksiya matni', type: 'textarea', required: true }
    ];
    const form = window.FormBuilder.build(schema, item || {}, async (data) => {
      if (!data.course) data.course = null;
      isEdit ? await window.api.updateAksiya(item.id, data) : await window.api.createAksiya(data);
      window.toast.success('Saqlandi');
      window.modal.close();
      loadActions();
    });
    window.modal.open({ title: isEdit ? 'Tahrirlash' : 'Yangi aksiya', content: form, footer: `<button class="btn btn-primary" onclick="document.querySelector('.dynamic-form').dispatchEvent(new Event('submit'))">Saqlash</button>` });
  }

  function deleteAction(id) {
    window.modal.confirm({ isDanger: true, onConfirm: async () => { await window.api.deleteAksiya(id); window.toast.success('O\'chirildi'); loadActions(); }});
  }

  // --- METHODS ---
  async function loadMethods() {
    const res = await window.api.getPaymentMethods();
    const data = window.helpers.parseListResponse(res).results;

    const table = window.DataTable.build({
      columns: [
        { key: 'name', label: 'Turi (Bank/Plastik)' },
        { key: 'card_holder_name', label: 'Karta egasi' },
        { key: 'card_number', label: 'Karta raqami' },
        { key: 'is_active', label: 'Holati', render: val => val 
            ? '<span class="badge badge-success">Aktiv</span>' 
            : '<span class="badge badge-danger">Noaktiv</span>' 
        },
      ],
      data,
      onEdit: (row) => openMethodModal(row),
      onDelete: (row) => deleteMethod(row.id)
    });
    
    document.getElementById('method-container').innerHTML = '';
    document.getElementById('method-container').appendChild(table);
  }

  function openMethodModal(item = null) {
    const isEdit = !!item;
    const schema = [
      { name: 'name', label: 'Turi (Bank)', type: 'text', required: true, placeholder: "Masalan: Click, Payme, Uzcard" },
      { name: 'card_holder_name', label: 'Karta egasi ism familiyasi', type: 'text', required: true },
      { name: 'card_number', label: 'Karta raqami', type: 'text', required: true },
      { name: 'is_active', label: 'Aktiv', type: 'checkbox', default: true }
    ];
    const form = window.FormBuilder.build(schema, item || {}, async (data) => {
      isEdit ? await window.api.updatePaymentMethod(item.id, data) : await window.api.createPaymentMethod(data);
      window.toast.success('Saqlandi');
      window.modal.close();
      loadMethods();
    });
    window.modal.open({ title: isEdit ? 'Tahrirlash' : 'Yangi to\'lov turi', content: form, footer: `<button class="btn btn-primary" onclick="document.querySelector('.dynamic-form').dispatchEvent(new Event('submit'))">Saqlash</button>` });
  }

  function deleteMethod(id) {
    window.modal.confirm({ isDanger: true, onConfirm: async () => { await window.api.deletePaymentMethod(id); window.toast.success('O\'chirildi'); loadMethods(); }});
  }

  // Bind Buttons
  document.getElementById('btn-add-monthly').addEventListener('click', () => openMonthlyModal());
  document.getElementById('btn-add-discount').addEventListener('click', () => openDiscountModal());
  document.getElementById('btn-add-action').addEventListener('click', () => openActionModal());
  document.getElementById('btn-add-method').addEventListener('click', () => openMethodModal());

  init();
});
