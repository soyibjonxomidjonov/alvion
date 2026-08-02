/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Broadcast Page
   Real API: POST /v1/send_message/ { message: "..." }
   ═══════════════════════════════════════════════════════════ */

window.router.register('/broadcast', async () => {
  const container = document.getElementById('main-content');

  container.innerHTML = `
    <div class="broadcast-layout animate-fade-in-up">

      <!-- ── Compose card ── -->
      <div class="card broadcast-compose-card">
        <div class="card-header">
          <div class="broadcast-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </div>
          <div>
            <h2 class="card-title">Ommaviy Xabar Yuborish</h2>
            <p class="card-subtitle">Botdan ro'yxatdan o'tgan barcha foydalanuvchilarga xabar yuboring</p>
          </div>
        </div>

        <!-- Stats row -->
        <div class="broadcast-stats" id="broadcast-stats">
          <div class="broadcast-stat-item loading-shimmer">
            <div class="broadcast-stat-value" id="stat-users">—</div>
            <div class="broadcast-stat-label">Bot foydalanuvchilari</div>
          </div>
        </div>

        <form id="broadcast-form">
          <div class="form-group">
            <label class="form-label" for="broadcast-message">
              Xabar matni <span class="required">*</span>
            </label>
            <textarea
              class="form-textarea"
              id="broadcast-message"
              name="message"
              rows="7"
              required
              maxlength="4096"
              placeholder="Xabar matnini kiriting...&#10;&#10;Telegram markdown formatini qo'llab quvvatlanishi bot sozlamalariga bog'liq."
            ></textarea>
            <div class="form-hint">
              <span id="char-count">0</span> / 4096 belgi
            </div>
          </div>

          <!-- Preview -->
          <div class="broadcast-preview" id="broadcast-preview" style="display:none">
            <div class="broadcast-preview-label">Ko'rinishi</div>
            <div class="broadcast-preview-bubble" id="broadcast-preview-text"></div>
          </div>

          <div class="broadcast-actions">
            <button type="button" class="btn btn-secondary" id="btn-preview-toggle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Ko'rib chiqish
            </button>
            <button type="submit" class="btn btn-primary" id="btn-send-broadcast">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Barchaga yuborish
            </button>
          </div>
        </form>
      </div>

      <!-- ── Tips card ── -->
      <div class="card broadcast-tips-card">
        <div class="card-header">
          <h3 class="card-title" style="font-size:var(--fs-base)">💡 Maslahatlar</h3>
        </div>
        <ul class="broadcast-tips-list">
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Xabar 4096 belgidan oshmasligi kerak</span>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Ko'p foydalanuvchiga yuborishda birozgina vaqt ketishi mumkin</span>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Bot bloklagan foydalanuvchilarga xabar yetib bormaydi</span>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Spam yuborishdan saqlaning — Telegram hisobingizni bloklab qo'yishi mumkin</span>
          </li>
        </ul>

        <div class="broadcast-history-section" id="broadcast-history">
          <div class="broadcast-history-title">📜 So'nggi yuborishlar</div>
          <div id="history-list" class="history-list">
            <p class="text-tertiary" style="font-size:var(--fs-sm);padding:var(--space-2) 0">Hali xabar yuborilmagan</p>
          </div>
        </div>
      </div>

    </div>
  `;

  // ── Load bot users count ──
  let botUserCount = 0;
  try {
    const res = await window.api.getBotUsers();
    const parsed = window.helpers.parseListResponse(res);
    botUserCount = parsed.count || parsed.results.length;
    document.getElementById('stat-users').textContent = botUserCount.toLocaleString('uz-UZ');
    document.getElementById('broadcast-stats').classList.remove('loading-shimmer');
  } catch {
    document.getElementById('stat-users').textContent = '?';
  }

  // ── Char counter ──
  const msgTextarea = document.getElementById('broadcast-message');
  const charCount = document.getElementById('char-count');
  msgTextarea.addEventListener('input', () => {
    const len = msgTextarea.value.length;
    charCount.textContent = len;
    charCount.style.color = len > 3800 ? 'var(--danger)' : '';
    // Live preview update
    updatePreview();
  });

  // ── Preview toggle ──
  const previewEl = document.getElementById('broadcast-preview');
  const previewText = document.getElementById('broadcast-preview-text');
  let previewOpen = false;

  function updatePreview() {
    if (!previewOpen) return;
    const val = msgTextarea.value.trim();
    previewText.textContent = val || '(bo\'sh)';
  }

  document.getElementById('btn-preview-toggle').addEventListener('click', () => {
    previewOpen = !previewOpen;
    previewEl.style.display = previewOpen ? 'block' : 'none';
    updatePreview();
  });

  // ── History ──
  const historyItems = JSON.parse(localStorage.getItem('broadcast_history') || '[]');
  renderHistory(historyItems);

  function renderHistory(items) {
    const listEl = document.getElementById('history-list');
    if (!items.length) {
      listEl.innerHTML = '<p class="text-tertiary" style="font-size:var(--fs-sm);padding:var(--space-2) 0">Hali xabar yuborilmagan</p>';
      return;
    }
    listEl.innerHTML = items.slice(-5).reverse().map(item => `
      <div class="history-item">
        <div class="history-item-msg">${window.helpers.escapeHtml(window.helpers.truncate(item.message, 60))}</div>
        <div class="history-item-meta">
          <span>${window.helpers.timeAgo(item.sentAt)}</span>
          <span class="badge badge-success" style="font-size:0.65rem">Yuborildi</span>
        </div>
      </div>
    `).join('');
  }

  // ── Form submit ──
  const form = document.getElementById('broadcast-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const message = msgTextarea.value.trim();
    if (!message) {
      window.toast?.warning('Xabar matnini kiriting!');
      return;
    }

    window.modal.confirm({
      title: 'Tasdiqlash',
      text: `<strong>${botUserCount.toLocaleString('uz-UZ')} ta</strong> bot foydalanuvchisiga xabar yubormoqchimisiz?`,
      confirmText: 'Ha, yuborish',
      onConfirm: async () => {
        const btn = document.getElementById('btn-send-broadcast');
        const originalHTML = btn.innerHTML;
        btn.disabled = true;
        btn.classList.add('btn-loading');
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Yuborilmoqda...`;

        try {
          await window.api.sendBroadcast(message);

          window.toast.success(`✅ Xabar ${botUserCount} ta foydalanuvchiga yuborildi!`);
          form.reset();
          charCount.textContent = '0';
          previewEl.style.display = 'none';
          previewOpen = false;

          // Save to local history
          const history = JSON.parse(localStorage.getItem('broadcast_history') || '[]');
          history.push({ message, sentAt: new Date().toISOString() });
          localStorage.setItem('broadcast_history', JSON.stringify(history.slice(-20)));
          renderHistory(history);

        } catch (err) {
          window.toast.error('Xatolik: ' + (err.message || 'Server javob bermadi'));
        } finally {
          btn.disabled = false;
          btn.classList.remove('btn-loading');
          btn.innerHTML = originalHTML;
        }
      }
    });
  });
});
