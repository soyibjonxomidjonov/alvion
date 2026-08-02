/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Settings Page
   ═══════════════════════════════════════════════════════════ */

window.router.register('/settings', async () => {
  const container = document.getElementById('main-content');
  
  const currentUrl = window.api.baseUrl;
  
  container.innerHTML = `
    <div class="content-grid" style="grid-template-columns: 1fr; max-width: 800px; margin: 0 auto;">
      <div class="card animate-fade-in-up">
        <div class="card-header border-bottom pb-4 mb-4">
          <h2 class="card-title">Tizim Sozlamalari</h2>
        </div>
        
        <div class="settings-section">
          <h3 class="settings-title">Profil ma'lumotlari</h3>
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-label">Telefon raqam (Login)</div>
              <div class="settings-row-desc">Tizimga kirish uchun ishlatiladigan raqam</div>
            </div>
            <div class="settings-row-action font-mono text-tertiary">
              ${window.auth.getUser()?.phone_number || '—'}
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="settings-title">Ko'rinish (Mavzu)</h3>
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-label">Tungi rejim</div>
              <div class="settings-row-desc">Interfeys uchun qorong'u mavzuni yoqish</div>
            </div>
            <div class="settings-row-action">
              <label class="switch">
                <input type="checkbox" id="theme-switch" ${document.documentElement.getAttribute('data-theme') === 'dark' ? 'checked' : ''}>
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="settings-title">Backend API Manzili</h3>
          <div class="settings-row" style="flex-direction: column; align-items: flex-start; gap: var(--space-3);">
            <div class="settings-row-info">
              <div class="settings-row-label">Hozirgi API URL</div>
              <div class="settings-row-desc">
                Development: <code style="font-size:0.8rem">http://127.0.0.1:8000</code> &nbsp;|&nbsp;
                Ngrok misol: <code style="font-size:0.8rem">https://xxxx.ngrok-free.app</code>
              </div>
            </div>
            <div style="display:flex; gap: var(--space-2); width:100%; align-items:center;">
              <input 
                type="url" 
                class="form-input" 
                id="backend-url-input"
                placeholder="https://your-backend.com"
                value="${window.helpers.escapeHtml(currentUrl)}"
                style="flex:1; font-family: monospace; font-size: 0.85rem;"
              >
              <button class="btn btn-primary" id="btn-save-url">Saqlash</button>
              <button class="btn btn-secondary" id="btn-reset-url">Tiklash</button>
            </div>
            <p id="url-status" class="text-tertiary" style="font-size: var(--fs-xs); margin:0;">
              Joriy: <code style="font-size:0.8rem">${window.helpers.escapeHtml(currentUrl)}</code>
            </p>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="settings-title">Telegram WebApp Integratsiyasi</h3>
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-label">Avtomatik avtorizatsiya</div>
              <div class="settings-row-desc">Bot ichida ochilganda parol so'ramasdan kirish</div>
            </div>
            <div class="settings-row-action">
              <label class="switch">
                <input type="checkbox" id="tg-auth-switch" disabled>
                <span class="slider"></span>
              </label>
            </div>
          </div>
          <p class="text-tertiary mt-2" style="font-size: var(--fs-xs)">
            * WebApp initData validatsiyasi backendda (API) sozlanishi kerak.
          </p>
        </div>
      </div>
    </div>
  `;

  // Theme switch logic
  const themeSwitch = document.getElementById('theme-switch');
  themeSwitch.addEventListener('change', (e) => {
    const isDark = e.target.checked;
    const newTheme = isDark ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = document.getElementById('theme-toggle-icon');
    if (icon) {
      icon.innerHTML = newTheme === 'dark' 
        ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'
        : '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>';
    }
  });

  // Backend URL logic
  document.getElementById('btn-save-url').addEventListener('click', () => {
    const newUrl = document.getElementById('backend-url-input').value.trim().replace(/\/$/, '');
    if (!newUrl || !newUrl.startsWith('http')) {
      window.toast.error('Noto\'g\'ri URL! http:// yoki https:// bilan boshlang');
      return;
    }
    localStorage.setItem('api_base_url', newUrl);
    window.api.baseUrl = newUrl;
    document.getElementById('url-status').innerHTML = 
      `✅ Saqlandi: <code style="font-size:0.8rem">${window.helpers.escapeHtml(newUrl)}</code> — sahifa yangilanmoqda...`;
    setTimeout(() => window.location.reload(), 1200);
  });

  document.getElementById('btn-reset-url').addEventListener('click', () => {
    localStorage.removeItem('api_base_url');
    const defaultUrl = window.BACKEND_URL || 'http://127.0.0.1:8000';
    window.api.baseUrl = defaultUrl;
    document.getElementById('backend-url-input').value = defaultUrl;
    document.getElementById('url-status').innerHTML = 
      `🔄 Tiklandi: <code style="font-size:0.8rem">${window.helpers.escapeHtml(defaultUrl)}</code>`;
    setTimeout(() => window.location.reload(), 1200);
  });
});

