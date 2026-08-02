/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — API Service
   JWT-authenticated REST API wrapper
   ═══════════════════════════════════════════════════════════ */

class ApiService {
  constructor() {
    // 1. config.js da BACKEND_URL belgilangan bo'lsa — shuni ishlatamiz (eng ishonchli)
    // 2. localStorage da saqlangan URL bo'lsa — shuni ishlatamiz (settings orqali o'zgartirilgan)
    // 3. Aks holda lokal manzilga qarab avtomatik aniqlaymiz

    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
      || hostname === '[::1]' || hostname === '::1';

    // Eski noto'g'ri URL ni tozalash (frontend serveri porti bilan)
    const savedUrl = localStorage.getItem('api_base_url');
    if (savedUrl && savedUrl.includes(':3000')) {
      localStorage.removeItem('api_base_url');
    }

    // Prioritet: config.js > localStorage > auto-detect
    const autoUrl = isLocalhost ? 'http://127.0.0.1:8000' : window.location.origin;
    this.baseUrl = window.BACKEND_URL
      || localStorage.getItem('api_base_url')
      || autoUrl;

    this.prefix = '/v1';
  }

  /* ── Token helpers ── */
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  setTokens(access, refresh) {
    localStorage.setItem('access_token', access);
    if (refresh) localStorage.setItem('refresh_token', refresh);
  }

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  /* ── Build headers ── */
  _headers(isJson = true) {
    const h = {};
    if (isJson) h['Content-Type'] = 'application/json';
    const token = this.getAccessToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  }

  /* ── Refresh token ── */
  async refreshAccessToken() {
    const refresh = this.getRefreshToken();
    if (!refresh) throw new Error('No refresh token');

    const res = await fetch(`${this.baseUrl}${this.prefix}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) {
      this.clearTokens();
      throw new Error('Token refresh failed');
    }

    const data = await res.json();
    this.setTokens(data.access, data.refresh || refresh);
    return data.access;
  }

  /* ── Core request method ── */
  async request(endpoint, options = {}) {
    const { method = 'GET', body, params, isFormData = false } = options;

    let url = `${this.baseUrl}${this.prefix}${endpoint}`;

    // Append query params
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, val);
        }
      });
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    const fetchOptions = {
      method,
      headers: this._headers(!isFormData),
    };

    if (body) {
      fetchOptions.body = isFormData ? body : JSON.stringify(body);
    }

    let res = await fetch(url, fetchOptions);

    // Auto-refresh on 401
    if (res.status === 401 && this.getRefreshToken()) {
      try {
        await this.refreshAccessToken();
        fetchOptions.headers = this._headers(!isFormData);
        res = await fetch(url, fetchOptions);
      } catch {
        window.dispatchEvent(new CustomEvent('auth:logout'));
        throw new Error('Session expired');
      }
    }

    // No content
    if (res.status === 204) return null;

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      let errorMsg = data?.detail || data?.message;
      if (!errorMsg && data && typeof data === 'object') {
        const keys = Object.keys(data);
        if (keys.length > 0) {
          errorMsg = keys.map(k => `${k}: ${Array.isArray(data[k]) ? data[k].join(', ') : JSON.stringify(data[k])}`).join(' | ');
        }
      }
      const error = new Error(errorMsg || `HTTP ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  /* ── CRUD shortcuts ── */
  get(endpoint, params) {
    return this.request(endpoint, { method: 'GET', params });
  }

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  }

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  }

  patch(endpoint, body) {
    return this.request(endpoint, { method: 'PATCH', body });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  /* ── Auth ── */
  async login(phone_number, password) {
    const res = await fetch(`${this.baseUrl}${this.prefix}/auth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number, password }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.detail || 'Login failed');
    }

    this.setTokens(data.access, data.refresh);
    return data;
  }

  /* ── Specific API calls ── */

  // Courses
  getCourses(params) { return this.get('/courses/', params); }
  getCourse(id) { return this.get(`/courses/${id}/`); }
  createCourse(data) { return this.post('/courses/', data); }
  updateCourse(id, data) { return this.put(`/courses/${id}/`, data); }
  deleteCourse(id) { return this.delete(`/courses/${id}/`); }

  // Teachers
  getTeachers(params) { return this.get('/teachers/', params); }
  getTeacher(id) { return this.get(`/teachers/${id}/`); }
  createTeacher(data) { return this.post('/teachers/', data); }
  updateTeacher(id, data) { return this.put(`/teachers/${id}/`, data); }
  deleteTeacher(id) { return this.delete(`/teachers/${id}/`); }

  // Certificates
  getCertificates(params) { return this.get('/certificates/', params); }
  createCertificate(data) { return this.post('/certificates/', data); }
  deleteCertificate(id) { return this.delete(`/certificates/${id}/`); }

  // Lessons
  getLessons(params) { return this.get('/lessons/', params); }
  createLesson(data) { return this.post('/lessons/', data); }
  updateLesson(id, data) { return this.put(`/lessons/${id}/`, data); }
  deleteLesson(id) { return this.delete(`/lessons/${id}/`); }

  // Lesson Info
  getLessonInfos(params) { return this.get('/lessoninfo/', params); }
  createLessonInfo(data) { return this.post('/lessoninfo/', data); }
  updateLessonInfo(id, data) { return this.put(`/lessoninfo/${id}/`, data); }
  deleteLessonInfo(id) { return this.delete(`/lessoninfo/${id}/`); }

  // Register Users (Applications)
  getRegisterUsers(params) { return this.get('/registeruser/', params); }
  getRegisterUser(id) { return this.get(`/registeruser/${id}/`); }
  deleteRegisterUser(id) { return this.delete(`/registeruser/${id}/`); }

  // Bot Users
  getBotUsers(params) { return this.get('/bot_users/', params); }
  updateBotUser(id, data) { return this.patch(`/bot_users/${id}/`, data); }

  // Tests
  getTests(params) { return this.get('/tests/', params); }
  createTest(data) { return this.post('/tests/', data); }
  updateTest(id, data) { return this.put(`/tests/${id}/`, data); }
  deleteTest(id) { return this.delete(`/tests/${id}/`); }

  // Questions
  getQuestions(params) { return this.get('/test_question/', params); }
  createQuestion(data) { return this.post('/test_question/', data); }
  updateQuestion(id, data) { return this.put(`/test_question/${id}/`, data); }
  deleteQuestion(id) { return this.delete(`/test_question/${id}/`); }

  // Choices
  getChoices(params) { return this.get('/test_choice/', params); }
  createChoice(data) { return this.post('/test_choice/', data); }
  updateChoice(id, data) { return this.put(`/test_choice/${id}/`, data); }
  deleteChoice(id) { return this.delete(`/test_choice/${id}/`); }

  // Test Results
  getTestResults(params) { return this.get('/test_result/', params); }

  // Events
  getEvents(params) { return this.get('/events/', params); }
  createEvent(data) { return this.post('/events/', data); }
  updateEvent(id, data) { return this.put(`/events/${id}/`, data); }
  deleteEvent(id) { return this.delete(`/events/${id}/`); }

  // Announcements
  getAnnouncements(params) { return this.get('/elonlar/', params); }
  createAnnouncement(data) { return this.post('/elonlar/', data); }
  updateAnnouncement(id, data) { return this.put(`/elonlar/${id}/`, data); }
  deleteAnnouncement(id) { return this.delete(`/elonlar/${id}/`); }

  // Aksiyalar
  getAksiyalar(params) { return this.get('/aksiyalar/', params); }
  createAksiya(data) { return this.post('/aksiyalar/', data); }
  updateAksiya(id, data) { return this.put(`/aksiyalar/${id}/`, data); }
  deleteAksiya(id) { return this.delete(`/aksiyalar/${id}/`); }

  // Chegirmalar
  getChegirmalar(params) { return this.get('/chegirmalar/', params); }
  createChegirma(data) { return this.post('/chegirmalar/', data); }
  updateChegirma(id, data) { return this.put(`/chegirmalar/${id}/`, data); }
  deleteChegirma(id) { return this.delete(`/chegirmalar/${id}/`); }

  // Monthly Payment
  getMonthlyPayments(params) { return this.get('/oylik_tolov/', params); }
  createMonthlyPayment(data) { return this.post('/oylik_tolov/', data); }
  updateMonthlyPayment(id, data) { return this.put(`/oylik_tolov/${id}/`, data); }
  deleteMonthlyPayment(id) { return this.delete(`/oylik_tolov/${id}/`); }

  // Payment Methods
  getPaymentMethods(params) { return this.get('/tolov_turlari/', params); }
  createPaymentMethod(data) { return this.post('/tolov_turlari/', data); }
  updatePaymentMethod(id, data) { return this.put(`/tolov_turlari/${id}/`, data); }
  deletePaymentMethod(id) { return this.delete(`/tolov_turlari/${id}/`); }

  // Single test getter
  getTest(id) { return this.get(`/tests/${id}/`); }

  // Broadcast — barcha bot foydalanuvchilariga xabar yuborish
  sendBroadcast(message) {
    return this.request('/send_message/', { method: 'POST', body: { message } });
  }
}

// Singleton
window.api = new ApiService();
