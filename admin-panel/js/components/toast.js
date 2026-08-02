/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Toast Notifications
   ═══════════════════════════════════════════════════════════ */

class ToastManager {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  }

  _createIcon(type) {
    const icons = {
      success: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>',
      error: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
      warning: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
      info: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
    };
    return icons[type] || icons.info;
  }

  show(title, message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    toast.innerHTML = `
      <div class="toast-icon">
        ${this._createIcon(type)}
      </div>
      <div class="toast-content">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <button class="toast-close">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    `;

    this.container.appendChild(toast);

    let isClosed = false;

    const closeToast = () => {
      if (isClosed) return;
      isClosed = true;
      toast.classList.add('toast-exit');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300); // Matches slideOutRight duration
    };

    toast.querySelector('.toast-close').addEventListener('click', closeToast);

    if (duration > 0) {
      setTimeout(closeToast, duration);
    }
  }

  success(message, title = 'Muvaffaqiyatli') {
    this.show(title, message, 'success');
  }

  error(message, title = 'Xatolik') {
    this.show(title, message, 'error');
  }

  warning(message, title = 'Diqqat') {
    this.show(title, message, 'warning', 5000);
  }

  info(message, title = 'Ma\'lumot') {
    this.show(title, message, 'info');
  }
}

window.toast = new ToastManager();
