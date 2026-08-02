/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Modal Manager
   ═══════════════════════════════════════════════════════════ */

class ModalManager {
  constructor() {
    this._overlay = document.createElement('div');
    this._overlay.className = 'modal-overlay';
    
    this._overlay.addEventListener('click', (e) => {
      if (e.target === this._overlay) this.close();
    });

    document.body.appendChild(this._overlay);

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) this.close();
    });
  }

  isOpen() {
    return this._overlay.classList.contains('active');
  }

  open(options = {}) {
    const {
      title = '',
      content = '',
      footer = '',
      size = '', // 'lg' for large
      onClose = null
    } = options;

    this.onCloseCallback = onClose;

    this._overlay.innerHTML = `
      <div class="modal ${size ? `modal-${size}` : ''}">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close" id="modal-close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div class="modal-body" id="modal-body-container">
          ${typeof content === 'string' ? content : ''}
        </div>
        ${footer ? `
          <div class="modal-footer" id="modal-footer-container">
            ${typeof footer === 'string' ? footer : ''}
          </div>
        ` : ''}
      </div>
    `;

    // Append Node content if provided
    if (typeof content !== 'string') {
      const bodyContainer = this._overlay.querySelector('#modal-body-container');
      bodyContainer.innerHTML = '';
      bodyContainer.appendChild(content);
    }

    if (typeof footer !== 'string' && footer) {
      const footerContainer = this._overlay.querySelector('#modal-footer-container');
      footerContainer.innerHTML = '';
      footerContainer.appendChild(footer);
    }

    this._overlay.querySelector('#modal-close-btn').addEventListener('click', () => this.close());
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Show modal
    requestAnimationFrame(() => {
      this._overlay.classList.add('active');
    });
  }

  close() {
    if (!this.isOpen()) return;
    
    this._overlay.classList.remove('active');
    
    setTimeout(() => {
      document.body.style.overflow = '';
      this._overlay.innerHTML = ''; // Clean up DOM
      if (this.onCloseCallback) this.onCloseCallback();
      this.onCloseCallback = null;
    }, 300); // Wait for transition
  }

  /**
   * Helper to quickly show a confirmation dialog
   */
  confirm(options) {
    const {
      title = 'Tasdiqlang',
      text = 'Siz haqiqatdan ham ushbu amalni bajarmoxchimisiz?',
      confirmText = 'Ha, tasdiqlayman',
      cancelText = 'Bekor qilish',
      isDanger = false,
      onConfirm
    } = options;

    const content = `
      <div class="confirm-icon ${isDanger ? 'confirm-icon-danger' : ''}">
        ${isDanger 
          ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'}
      </div>
      <p class="confirm-text">${text}</p>
    `;

    const footer = `
      <button class="btn btn-ghost" id="confirm-cancel">${cancelText}</button>
      <button class="btn ${isDanger ? 'btn-danger' : 'btn-primary'}" id="confirm-ok">${confirmText}</button>
    `;

    this.open({ title, content, footer });

    document.getElementById('confirm-cancel').addEventListener('click', () => this.close());
    document.getElementById('confirm-ok').addEventListener('click', () => {
      this.close();
      if (onConfirm) onConfirm();
    });
  }
}

window.modal = new ModalManager();
