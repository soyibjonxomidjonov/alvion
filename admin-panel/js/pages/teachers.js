/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Teachers Page
   ═══════════════════════════════════════════════════════════ */

window.router.register('/teachers', async () => {
  const container = document.getElementById('main-content');
  
  container.innerHTML = `
    <div class="page-header animate-fade-in-down">
      <div></div>
      <div class="page-header-actions">
        <button class="btn btn-primary" id="btn-add-teacher">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          O'qituvchi qo'shish
        </button>
      </div>
    </div>
    <div id="table-container" class="animate-fade-in-up" style="animation-delay: 100ms">
      <div class="skeleton skeleton-card" style="height: 400px"></div>
    </div>
  `;

  let coursesData = [];
  let certsData = [];

  async function loadData() {
    try {
      const [teachersRes, coursesRes, certsRes] = await Promise.all([
        window.api.getTeachers(),
        window.api.getCourses(),
        window.api.getCertificates()
      ]);

      coursesData = window.helpers.parseListResponse(coursesRes).results;
      certsData = window.helpers.parseListResponse(certsRes).results;
      const teachers = window.helpers.parseListResponse(teachersRes).results;

      // Enriched
      const enriched = teachers.map(t => {
        const course = coursesData.find(c => String(c.id) === String(t.course_id));
        const teacherCerts = certsData.filter(c => String(c.teacher_id) === String(t.id));
        return {
          ...t,
          course_name: course ? course.name : '—',
          cert_count: teacherCerts.length
        };
      });

      const table = window.DataTable.build({
        columns: [
          { key: 'name', label: 'Ism sharif', render: val => `
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="avatar avatar-sm" style="background: ${window.helpers.stringToColor(val)}">${window.helpers.getInitials(val)}</div>
              <strong>${val}</strong>
            </div>
          `},
          { key: 'specialization', label: 'Mutaxassislik' },
          { key: 'experience', label: 'Tajriba' },
          { key: 'course_name', label: 'Kurs' },
          { key: 'cert_count', label: 'Sertifikatlar', align: 'center', render: val => `
            <span class="badge ${val > 0 ? 'badge-accent' : 'badge-neutral'}">${val} ta</span>
          `},
        ],
        data: enriched,
        onEdit: (row) => openTeacherModal(row),
        onDelete: (row) => deleteTeacher(row.id),
        customActions: [
          {
            type: 'primary',
            title: 'Sertifikatlar',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
            onClick: (row) => manageCertificates(row)
          }
        ]
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

  function openTeacherModal(item = null) {
    const isEdit = !!item;
    const courseOptions = coursesData.map(c => ({ value: c.id, label: c.name }));
    
    const schema = [
      { name: 'name', label: 'Ism sharif', type: 'text', required: true, col: 1 },
      { name: 'specialization', label: 'Mutaxassislik', type: 'text', required: true, col: 2 },
      { name: 'experience', label: 'Tajriba', type: 'text', col: 2 },
      { name: 'course_id', label: 'Biriktirilgan kurs', type: 'select', options: courseOptions, required: true, col: 1 },
    ];
    
    const form = window.FormBuilder.build(schema, item || {}, async (data) => {
      if (isEdit) {
        await window.api.updateTeacher(item.id, data);
        window.toast.success('O\'qituvchi ma\'lumotlari yangilandi');
      } else {
        await window.api.createTeacher(data);
        window.toast.success('Yangi o\'qituvchi qo\'shildi');
      }
      window.modal.close();
      loadData();
    });

    window.modal.open({
      title: isEdit ? 'O\'qituvchini tahrirlash' : 'Yangi o\'qituvchi',
      content: form,
      footer: `
        <button class="btn btn-ghost" onclick="window.modal.close()">Bekor qilish</button>
        <button class="btn btn-primary" onclick="document.querySelector('.dynamic-form').dispatchEvent(new Event('submit'))">Saqlash</button>
      `
    });
  }

  function deleteTeacher(id) {
    window.modal.confirm({
      text: 'O\'qituvchini o\'chirmoqchimisiz?',
      isDanger: true,
      onConfirm: async () => {
        try {
          await window.api.deleteTeacher(id);
          window.toast.success('O\'chirildi');
          loadData();
        } catch (err) { window.toast.error(err.message); }
      }
    });
  }

  // Manage Certificates
  function manageCertificates(teacher) {
    const teacherCerts = certsData.filter(c => String(c.teacher_id) === String(teacher.id));
    
    const content = document.createElement('div');
    content.innerHTML = `
      <div style="margin-bottom: var(--space-4);">
        <h4 style="margin-bottom: var(--space-3)">Yangi sertifikat</h4>
        <div class="cert-add-row">
          <input type="text" id="cert-subject" class="form-input" placeholder="Fan (masalan: IELTS)">
          <input type="text" id="cert-level" class="form-input" placeholder="Daraja (masalan: 8.0)">
          <button class="btn btn-primary" id="btn-save-cert">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Qo'shish
          </button>
        </div>
      </div>
      <h4>Mavjud sertifikatlar</h4>
      <div id="cert-list" style="margin-top: var(--space-2)"></div>
    `;

    const renderList = (list) => {
      const container = content.querySelector('#cert-list');
      if (!list.length) {
        container.innerHTML = '<p class="text-tertiary">Sertifikatlar yo\'q</p>';
        return;
      }
      
      container.innerHTML = list.map(c => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:var(--space-2) 0; border-bottom:1px solid var(--border-secondary)">
          <div>
            <strong>${window.helpers.escapeHtml(c.certificate_subject)}</strong> 
            <span class="badge badge-accent" style="margin-left: 8px">${window.helpers.escapeHtml(c.certificate_level)}</span>
          </div>
          <button class="btn btn-icon btn-sm btn-ghost text-danger" onclick="window.deleteCert(${c.id}, ${teacher.id})">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      `).join('');
    };

    renderList(teacherCerts);

    // Bind Add
    content.querySelector('#btn-save-cert').addEventListener('click', async () => {
      const subject = content.querySelector('#cert-subject').value.trim();
      const level = content.querySelector('#cert-level').value.trim();
      
      if (!subject || !level) {
        window.toast.warning('Barcha maydonlarni to\'ldiring');
        return;
      }
      
      try {
        await window.api.createCertificate({
          teacher_id: teacher.id,
          certificate_subject: subject,
          certificate_level: level
        });
        window.toast.success('Sertifikat qo\'shildi');
        
        // Refresh silently
        const res = await window.api.getCertificates();
        certsData = window.helpers.parseListResponse(res).results;
        renderList(certsData.filter(c => String(c.teacher_id) === String(teacher.id)));
        
        content.querySelector('#cert-subject').value = '';
        content.querySelector('#cert-level').value = '';
      } catch (err) {
        window.toast.error(err.message);
      }
    });

    window.modal.open({
      title: `${teacher.name} sertifikatlari`,
      content: content,
      size: 'lg'
    });
  }

  // Global helper for delete from within innerHTML
  window.deleteCert = async (id, teacherId) => {
    try {
      await window.api.deleteCertificate(id);
      window.toast.success('O\'chirildi');
      // Refresh silently
      const res = await window.api.getCertificates();
      certsData = window.helpers.parseListResponse(res).results;
      
      const teacherCerts = certsData.filter(c => String(c.teacher_id) === String(teacherId));
      
      const container = document.getElementById('cert-list');
      if (container) {
         if (!teacherCerts.length) {
            container.innerHTML = '<p class="text-tertiary">Sertifikatlar yo\'q</p>';
          } else {
            container.innerHTML = teacherCerts.map(c => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:var(--space-2) 0; border-bottom:1px solid var(--border-secondary)">
                <div>
                  <strong>${window.helpers.escapeHtml(c.certificate_subject)}</strong> 
                  <span class="badge badge-accent" style="margin-left: 8px">${window.helpers.escapeHtml(c.certificate_level)}</span>
                </div>
                <button class="btn btn-icon btn-sm btn-ghost text-danger" onclick="window.deleteCert(${c.id}, ${teacherId})">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            `).join('');
          }
      }
    } catch (err) {
      window.toast.error(err.message);
    }
  };

  document.getElementById('btn-add-teacher').addEventListener('click', () => openTeacherModal());

  loadData();
});
