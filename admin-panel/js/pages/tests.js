/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Tests Page (Full CRUD)
   Test → Question → Choice (nested), TestResult with filters
   ═══════════════════════════════════════════════════════════ */

window.router.register('/tests', async () => {
  const container = document.getElementById('main-content');

  container.innerHTML = `
    <div class="tabs mb-6 animate-fade-in-down">
      <button class="tab-btn active" data-target="tab-tests">Testlar</button>
      <button class="tab-btn" data-target="tab-results">Natijalar</button>
    </div>

    <!-- ── Tests Tab ── -->
    <div class="tab-content active" id="tab-tests">
      <div class="page-header">
        <div class="filter-row" id="tests-filter-row">
          <select class="form-select filter-select" id="filter-course-tests">
            <option value="">Barcha kurslar</option>
          </select>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-primary" id="btn-add-test">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Yangi test
          </button>
        </div>
      </div>
      <div id="tests-container">
        <div class="skeleton skeleton-card" style="height:300px"></div>
      </div>
    </div>

    <!-- ── Results Tab ── -->
    <div class="tab-content" id="tab-results">
      <div class="page-header">
        <div class="filter-row" id="results-filter-row">
          <select class="form-select filter-select" id="filter-test-results">
            <option value="">Barcha testlar</option>
          </select>
          <select class="form-select filter-select" id="filter-passed-results">
            <option value="">Natija: Barchasi</option>
            <option value="true">To'g'ri javoblar</option>
            <option value="false">Noto'g'ri javoblar</option>
          </select>
          <div class="search-filter-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
            <input type="text" class="search-filter-input" id="filter-user-id" placeholder="Foydalanuvchi ID yoki ism...">
          </div>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary" id="btn-export-results">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Excel yuklash
          </button>
        </div>
      </div>
      <div id="results-container">
        <div class="skeleton skeleton-card" style="height:300px"></div>
      </div>
    </div>
  `;

  // ── Tab switcher ──
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

  // ── State ──
  let testsData = [];
  let coursesData = [];
  let courseOptions = [];
  let allResults = [];
  let botUsersData = [];
  let regUsersData = [];

  // ── Init ──
  async function init() {
    try {
      const [resC, resB, resR] = await Promise.all([
        window.api.getCourses(),
        window.api.getBotUsers().catch(() => null),
        window.api.getRegisterUsers().catch(() => null),
      ]);

      coursesData = window.helpers.parseListResponse(resC).results;
      courseOptions = coursesData.map(c => ({ value: c.id, label: c.name }));

      if (resB) botUsersData = window.helpers.parseListResponse(resB).results;
      if (resR) regUsersData = window.helpers.parseListResponse(resR).results;

      // Populate course filter
      const filterCourse = document.getElementById('filter-course-tests');
      coursesData.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        filterCourse.appendChild(opt);
      });

      filterCourse.addEventListener('change', () => renderTestsTable());

      await Promise.all([loadTests(), loadResults()]);
    } catch (e) {
      window.toast?.error(e.message);
    }
  }

  // ══════════════════════════════════════
  //  TESTS CRUD
  // ══════════════════════════════════════

  async function loadTests() {
    const res = await window.api.getTests();
    testsData = window.helpers.parseListResponse(res).results;
    renderTestsTable();
  }

  function renderTestsTable() {
    const courseFilter = document.getElementById('filter-course-tests')?.value || '';
    let filtered = testsData.map(d => ({
      ...d,
      course_name: coursesData.find(c => String(c.id) === String(d.course))?.name || '—'
    }));
    if (courseFilter) {
      filtered = filtered.filter(t => String(t.course) === courseFilter);
    }

    const table = window.DataTable.build({
      columns: [
        { key: 'name', label: 'Test nomi' },
        { key: 'course_name', label: 'Kurs' },
        { key: 'created_at', label: 'Yaratilgan', format: 'date' },
      ],
      data: filtered,
      onEdit: row => openTestModal(row),
      onDelete: row => deleteTest(row.id),
      customActions: [
        {
          type: 'primary',
          title: 'Savollarni boshqarish',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',
          onClick: row => openQuestionsManager(row)
        }
      ],
      emptyText: 'Hali test qo\'shilmagan'
    });

    const tc = document.getElementById('tests-container');
    tc.innerHTML = '';
    tc.appendChild(table);
  }

  function openTestModal(item = null) {
    const isEdit = !!item;
    const schema = [
      { name: 'name', label: 'Test nomi', type: 'text', required: true, placeholder: 'Masalan: Beginner daraja testi' },
      { name: 'course', label: 'Kurs', type: 'select', options: courseOptions, required: true, placeholder: 'Kursni tanlang' },
    ];
    const form = window.FormBuilder.build(schema, item || {}, async data => {
      if (isEdit) {
        await window.api.updateTest(item.id, data);
      } else {
        await window.api.createTest(data);
      }
      window.toast.success('Saqlandi ✓');
      window.modal.close();
      loadTests();
    });
    const footerEl = document.createElement('div');
    footerEl.innerHTML = `
      <button class="btn btn-ghost" onclick="window.modal.close()">Bekor qilish</button>
      <button class="btn btn-primary" id="modal-submit-btn">Saqlash</button>
    `;
    footerEl.querySelector('#modal-submit-btn').addEventListener('click', () => {
      form.dispatchEvent(new Event('submit'));
    });
    window.modal.open({ title: isEdit ? 'Testni tahrirlash' : 'Yangi test', content: form, footer: footerEl });
  }

  function deleteTest(id) {
    window.modal.confirm({
      isDanger: true,
      title: 'Testni o\'chirish',
      text: 'Test bilan birga barcha savollar va javoblar ham o\'chib ketadi!',
      confirmText: 'Ha, o\'chirish',
      onConfirm: async () => {
        await window.api.deleteTest(id);
        window.toast.success('O\'chirildi');
        loadTests();
      }
    });
  }

  // ══════════════════════════════════════
  //  QUESTIONS & CHOICES MANAGER
  // ══════════════════════════════════════

  async function openQuestionsManager(test) {
    const wrapper = document.createElement('div');
    wrapper.className = 'questions-manager';
    wrapper.innerHTML = `
      <div class="qm-header">
        <p class="qm-meta">
          <span class="badge badge-accent">${test.name}</span>
          <span class="text-tertiary">— savollarni qo'shing va javoblarni belgilang</span>
        </p>
        <button class="btn btn-primary btn-sm" id="btn-add-question">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Savol qo'shish
        </button>
      </div>
      <div id="questions-list" class="questions-list">
        <div class="qm-loading">
          <div class="skeleton" style="height:80px;border-radius:var(--radius-md);margin-bottom:8px"></div>
          <div class="skeleton" style="height:80px;border-radius:var(--radius-md)"></div>
        </div>
      </div>
    `;

    const footerEl = document.createElement('div');
    footerEl.innerHTML = `<button class="btn btn-ghost" onclick="window.modal.close()">Yopish</button>`;

    window.modal.open({
      title: `📋 Savollar — ${test.name}`,
      content: wrapper,
      size: 'lg',
      footer: footerEl
    });

    await renderQuestions(test.id, wrapper);

    wrapper.querySelector('#btn-add-question').addEventListener('click', () => {
      openQuestionForm(test.id, null, wrapper);
    });
  }

  async function renderQuestions(testId, wrapper) {
    const listEl = wrapper.querySelector('#questions-list');
    listEl.innerHTML = '<div class="qm-loading"><div class="skeleton" style="height:80px;border-radius:var(--radius-md)"></div></div>';

    try {
      const res = await window.api.getQuestions({ search: testId });
      const all = window.helpers.parseListResponse(res).results;
      const questions = all.filter(q => String(q.test) === String(testId));

      if (questions.length === 0) {
        listEl.innerHTML = `
          <div class="qm-empty">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            <p>Hali savol qo'shilmagan</p>
          </div>
        `;
        return;
      }

      listEl.innerHTML = '';
      for (const q of questions) {
        const qCard = await buildQuestionCard(q, testId, wrapper);
        listEl.appendChild(qCard);
      }
    } catch (e) {
      listEl.innerHTML = `<p class="text-danger" style="padding:var(--space-4)">Xatolik: ${window.helpers.escapeHtml(e.message)}</p>`;
    }
  }

  async function buildQuestionCard(question, testId, wrapper) {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.dataset.qid = question.id;

    // Load choices
    let choices = [];
    try {
      const cRes = await window.api.getChoices({ search: question.id });
      const allChoices = window.helpers.parseListResponse(cRes).results;
      choices = allChoices.filter(c => String(c.question) === String(question.id));
    } catch {}

    const correctCount = choices.filter(c => c.is_correct).length;

    card.innerHTML = `
      <div class="question-header" data-qid="${question.id}">
        <div class="question-info">
          <span class="question-num">Q</span>
          <span class="question-text">${window.helpers.escapeHtml(question.text)}</span>
        </div>
        <div class="question-meta">
          <span class="badge ${correctCount > 0 ? 'badge-success' : 'badge-warning'}">${choices.length} javob · ${correctCount} to'g'ri</span>
          <div class="question-actions">
            <button class="btn btn-icon btn-sm btn-ghost" title="Tahrirlash" data-action="edit-q" data-qid="${question.id}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            </button>
            <button class="btn btn-icon btn-sm btn-ghost text-danger" title="O'chirish" data-action="del-q" data-qid="${question.id}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
            <button class="btn btn-icon btn-sm btn-ghost" title="Kengaytirish" data-action="toggle-q" data-qid="${question.id}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
        </div>
      </div>
      <div class="question-choices" id="choices-${question.id}" style="display:none">
        <div class="choices-list">
          ${choices.map(c => buildChoiceHTML(c)).join('')}
        </div>
      </div>
    `;

    // Toggle expand
    card.querySelector('[data-action="toggle-q"]').addEventListener('click', () => {
      const choicesEl = card.querySelector(`#choices-${question.id}`);
      const isOpen = choicesEl.style.display !== 'none';
      choicesEl.style.display = isOpen ? 'none' : 'block';
      card.querySelector('[data-action="toggle-q"]').style.transform = isOpen ? '' : 'rotate(180deg)';
    });

    // Edit question
    card.querySelector('[data-action="edit-q"]').addEventListener('click', () => {
      openQuestionForm(testId, { ...question, choices }, wrapper);
    });

    // Delete question
    card.querySelector('[data-action="del-q"]').addEventListener('click', () => {
      window.modal.confirm({
        isDanger: true,
        title: 'Savolni o\'chirish',
        text: 'Savol bilan birga barcha javob variantlari ham o\'chib ketadi!',
        confirmText: 'Ha, o\'chirish',
        onConfirm: async () => {
          await window.api.deleteQuestion(question.id);
          window.toast.success('Savol o\'chirildi');
          renderQuestions(testId, wrapper);
        }
      });
    });

    card.querySelectorAll('[data-action="del-c"]').forEach(btn => {
      const cid = Number(btn.dataset.cid);
      btn.addEventListener('click', () => {
        window.modal.confirm({
          isDanger: true,
          title: 'Javob variantini o\'chirish',
          text: 'Bu javob varianti o\'chib ketadi.',
          confirmText: 'O\'chirish',
          onConfirm: async () => {
            await window.api.deleteChoice(cid);
            window.toast.success('Javob o\'chirildi');
            renderQuestions(testId, wrapper);
          }
        });
      });
    });

    return card;
  }

  function buildChoiceHTML(choice) {
    return `
      <div class="choice-item ${choice.is_correct ? 'choice-correct' : ''}">
        <div class="choice-indicator">
          ${choice.is_correct
            ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/></svg>'
          }
        </div>
        <span class="choice-text">${window.helpers.escapeHtml(choice.text)}</span>
      </div>
    `;
  }

  function openQuestionForm(testId, question = null, wrapper) {
    const isEdit = !!question;
    const initData = { test: testId, text: question?.text || '' };
    if (question && question.choices) {
      question.choices.forEach((c, idx) => {
        if (idx < 4) {
          initData[`choice_${idx + 1}`] = c.text;
          if (c.is_correct) initData.correct_choice = String(idx + 1);
        }
      });
    }

    const schema = [
      { name: 'test', type: 'hidden', value: testId },
      { name: 'text', label: 'Savol matni', type: 'textarea', required: true, placeholder: 'Savolni kiriting...' },
      { name: 'choice_1', label: 'A javob', type: 'text', required: true },
      { name: 'choice_2', label: 'B javob', type: 'text', required: true },
      { name: 'choice_3', label: 'C javob', type: 'text', required: true },
      { name: 'choice_4', label: 'D javob', type: 'text', required: true },
      { name: 'correct_choice', label: 'To\'g\'ri javob qaysi?', type: 'select', options: [
        { value: '1', label: 'A javob' },
        { value: '2', label: 'B javob' },
        { value: '3', label: 'C javob' },
        { value: '4', label: 'D javob' }
      ], required: true }
    ];

    const form = window.FormBuilder.build(schema, initData, async data => {
      const qData = { test: data.test, text: data.text };
      let qId = question?.id;

      document.getElementById('modal-submit-btn').disabled = true;
      document.getElementById('modal-submit-btn').innerHTML = 'Saqlanmoqda...';

      try {
        if (isEdit) {
          await window.api.updateQuestion(qId, qData);
        } else {
          const newQ = await window.api.createQuestion(qData);
          qId = newQ.id;
        }

        // Handle choices
        for (let i = 1; i <= 4; i++) {
          const cText = data[`choice_${i}`];
          if (!cText) continue;
          const isCorrect = String(data.correct_choice) === String(i);

          if (isEdit && question.choices && question.choices[i - 1]) {
            await window.api.updateChoice(question.choices[i - 1].id, {
              question: qId, text: cText, is_correct: isCorrect
            });
          } else {
            await window.api.createChoice({
              question: qId, text: cText, is_correct: isCorrect
            });
          }
        }

        window.toast.success('Savol va javoblar saqlandi ✓');
        window.modal.close();
        setTimeout(() => renderQuestions(testId, wrapper), 300);
      } catch (e) {
        window.toast.error(e.message);
        document.getElementById('modal-submit-btn').disabled = false;
        document.getElementById('modal-submit-btn').innerHTML = 'Saqlash';
      }
    });

    const footerEl = document.createElement('div');
    footerEl.innerHTML = `
      <button class="btn btn-ghost" onclick="window.modal.close()">Bekor qilish</button>
      <button class="btn btn-primary" id="modal-submit-btn">Saqlash</button>
    `;
    footerEl.querySelector('#modal-submit-btn').addEventListener('click', () => {
      form.dispatchEvent(new Event('submit'));
    });
    window.modal.open({ title: isEdit ? 'Savolni tahrirlash' : 'Yangi savol', content: form, footer: footerEl });
  }

  // ══════════════════════════════════════
  //  TEST RESULTS — Bug fix + user info
  // ══════════════════════════════════════

  async function loadResults() {
    try {
      const resResults = await window.api.getTestResults();
      allResults = window.helpers.parseListResponse(resResults).results;

      // Populate test filter dropdown
      const filterTestEl = document.getElementById('filter-test-results');
      if (filterTestEl && filterTestEl.options.length === 1) {
        testsData.forEach(t => {
          const opt = document.createElement('option');
          opt.value = t.id;
          opt.textContent = t.name;
          filterTestEl.appendChild(opt);
        });

        filterTestEl.addEventListener('change', renderResultsTable);
        document.getElementById('filter-passed-results').addEventListener('change', renderResultsTable);
        document.getElementById('filter-user-id').addEventListener('input', () => {
          clearTimeout(window._resultSearchTimer);
          window._resultSearchTimer = setTimeout(renderResultsTable, 300);
        });
      }

      renderResultsTable();
    } catch (e) {
      const rc = document.getElementById('results-container');
      if (rc) {
        rc.innerHTML = `<p class="text-danger" style="padding:var(--space-4)">Xatolik: ${window.helpers.escapeHtml(e.message)}</p>`;
      }
    }
  }

  /**
   * User ma'lumotlarini topish (bot_user yoki register_user dan)
   */
  function findUserInfo(testUserId) {
    // avval register users dan qidirish (chat_id yoki id)
    const regUser = regUsersData.find(u =>
      String(u.id) === String(testUserId) || String(u.chat_id) === String(testUserId)
    );
    if (regUser) {
      return {
        full_name: regUser.full_name || '—',
        phone: regUser.phone_number || '—',
        source: 'registered'
      };
    }

    // bot users dan qidirish
    const botUser = botUsersData.find(u =>
      String(u.id) === String(testUserId) || String(u.chat_id) === String(testUserId)
    );
    if (botUser) {
      return {
        full_name: botUser.username ? `@${botUser.username}` : `Chat: ${botUser.chat_id}`,
        phone: '—',
        source: 'bot'
      };
    }

    return { full_name: '—', phone: '—', source: 'unknown' };
  }

  function getFilteredResults() {
    const testFilter = document.getElementById('filter-test-results')?.value || '';
    const passedFilter = document.getElementById('filter-passed-results')?.value || '';
    const userFilter = (document.getElementById('filter-user-id')?.value || '').trim().toLowerCase();

    let filtered = allResults.map(d => {
      const userInfo = findUserInfo(d.test_user);
      return {
        ...d,
        test_name: testsData.find(t => String(t.id) === String(d.test))?.name || `Test #${d.test}`,
        full_name: userInfo.full_name,
        phone_number: userInfo.phone,
      };
    });

    if (testFilter) filtered = filtered.filter(r => String(r.test) === testFilter);
    if (passedFilter !== '') filtered = filtered.filter(r => String(r.is_passed) === passedFilter);
    if (userFilter) {
      filtered = filtered.filter(r =>
        String(r.test_user).toLowerCase().includes(userFilter) ||
        String(r.full_name).toLowerCase().includes(userFilter) ||
        String(r.phone_number).toLowerCase().includes(userFilter)
      );
    }

    return filtered;
  }

  function renderResultsTable() {
    const filtered = getFilteredResults();

    const table = window.DataTable.build({
      columns: [
        { key: 'test_user', label: 'Foydalanuvchi ID', render: val => `<span class="badge badge-info">#${val}</span>` },
        { key: 'full_name', label: 'Ism' },
        { key: 'phone_number', label: 'Telefon' },
        { key: 'test_name', label: 'Test' },
        { key: 'test_question', label: 'Savol ID', render: val => `<code style="font-family:monospace;font-size:0.75rem">Q#${val}</code>` },
        {
          key: 'is_passed',
          label: 'Natija',
          render: val => val
            ? `<span class="badge badge-success">✅ To'g'ri</span>`
            : `<span class="badge badge-danger">❌ Noto'g'ri</span>`
        },
      ],
      data: filtered,
      emptyText: allResults.length === 0
        ? 'Test natijalari mavjud emas'
        : 'Filtr bo\'yicha natijalar topilmadi'
    });

    const rc = document.getElementById('results-container');
    rc.innerHTML = '';
    rc.appendChild(table);
  }

  // Export Results — user ma'lumotlari bilan
  container.querySelector('#btn-export-results').addEventListener('click', () => {
    const filtered = getFilteredResults();
    window.exporter.exportToExcel(filtered, 'Test_Natijalari', {
      test_user: 'Foydalanuvchi ID',
      full_name: 'Ism familiya',
      phone_number: 'Telefon raqam',
      test_name: 'Test nomi',
      test_question: 'Savol ID',
      is_passed: { label: 'Natija', fn: val => val ? 'To\'g\'ri' : 'Noto\'g\'ri' },
    });
  });

  // Bind add test button
  container.querySelector('#btn-add-test').addEventListener('click', () => openTestModal());

  // Start
  init();
});
