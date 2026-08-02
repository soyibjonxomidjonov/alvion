/* ═══════════════════════════════════════════════════════════
   Alvion O'quv Markazi — Auth Module
   ═══════════════════════════════════════════════════════════ */

class AuthManager {
  constructor() {
    this._user = null;

    // Listen for forced logout
    window.addEventListener('auth:logout', () => this.logout());
  }

  isAuthenticated() {
    return true; // Loginni aylanib o'tish
  }

  async login(phone_number, password) {
    const data = await window.api.login(phone_number, password);
    this._user = { phone_number };
    window.dispatchEvent(new CustomEvent('auth:login'));
    return data;
  }

  logout() {
    this._user = null;
    window.router?.navigate('/dashboard');
  }

  getUser() {
    return this._user;
  }
}

window.auth = new AuthManager();
