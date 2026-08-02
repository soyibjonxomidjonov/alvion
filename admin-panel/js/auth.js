/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Auth Module
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
    this._user = { phone_number: 'admin' };
    return { access: 'dummy-token' };
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
