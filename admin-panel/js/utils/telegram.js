/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Telegram WebApp SDK wrapper
   ═══════════════════════════════════════════════════════════ */

class TelegramWebAppManager {
  constructor() {
    this.tg = window.Telegram?.WebApp;
    this.isWebApp = !!this.tg && !!this.tg.initData;
  }

  init() {
    if (!this.isWebApp) return;

    this.tg.ready();
    this.tg.expand();

    // Sync theme
    this.syncTheme();
    this.tg.onEvent('themeChanged', () => this.syncTheme());
  }

  syncTheme() {
    if (!this.isWebApp) return;
    
    // Check if user has explicitly set theme in app settings
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return; // Respect app settings over TG settings

    const isDark = this.tg.colorScheme === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    // Update theme toggle icon if it exists
    const toggleIcon = document.getElementById('theme-toggle-icon');
    if (toggleIcon) {
      toggleIcon.innerHTML = isDark
        ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>' // Sun (switch to light)
        : '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'; // Moon (switch to dark)
    }
  }

  setupMainButton(text, callback, isVisible = false) {
    if (!this.isWebApp) return;

    this.tg.MainButton.setText(text);
    this.tg.MainButton.onClick(callback);
    
    if (isVisible) {
      this.tg.MainButton.show();
    } else {
      this.tg.MainButton.hide();
    }
  }

  showMainButton() {
    if (this.isWebApp) this.tg.MainButton.show();
  }

  hideMainButton() {
    if (this.isWebApp) this.tg.MainButton.hide();
  }
  
  showMainButtonLoading() {
    if (this.isWebApp) this.tg.MainButton.showProgress();
  }
  
  hideMainButtonLoading() {
    if (this.isWebApp) this.tg.MainButton.hideProgress();
  }

  setupBackButton(callback, isVisible = false) {
    if (!this.isWebApp) return;

    this.tg.BackButton.onClick(callback);
    
    if (isVisible) {
      this.tg.BackButton.show();
    } else {
      this.tg.BackButton.hide();
    }
  }

  showBackButton() {
    if (this.isWebApp) this.tg.BackButton.show();
  }

  hideBackButton() {
    if (this.isWebApp) this.tg.BackButton.hide();
  }

  getInitData() {
    return this.isWebApp ? this.tg.initData : null;
  }
  
  getInitDataUnsafe() {
    return this.isWebApp ? this.tg.initDataUnsafe : null;
  }
  
  getUser() {
    return this.isWebApp ? this.tg.initDataUnsafe?.user : null;
  }
}

window.tgApp = new TelegramWebAppManager();
