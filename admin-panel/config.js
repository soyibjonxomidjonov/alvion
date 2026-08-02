/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Backend Configuration
   ─────────────────────────────────────────────────────────
   1. LOCAL kompyuterda (PC) ishlash uchun: 'http://127.0.0.1:8000'
   2. TELEGRAM WEBAPP da sinash uchun (Telefonda): Backend uchun alohida ngrok oching
      va shu yerga yozing (Masalan: 'https://backend-xxx.ngrok-free.app')
   3. SERVER (Production) uchun: Agar frontend va backend bir xil domenda bo'lsa,
      bo'sh qoldiring (ya'ni null yoki ''). Shunda avtomatik o'z domenini ishlatadi.
   ═══════════════════════════════════════════════════════════ */

// Hozirgi holat: Agar null bo'lsa api.js o'zi hal qiladi (Localhostda 8000 ga, serverda o'z domeniga)
// WebApp da telefonda ishlashi uchun BUNI BACKEND NGROK URL-IGA O'ZGARTIRING!
window.BACKEND_URL = null;
