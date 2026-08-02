const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Docker'da Django boshqa konteynerda ishlaydi, shuning uchun
// manzilni environment variable orqali olamiz.
const DJANGO_URL = process.env.DJANGO_URL || 'http://127.0.0.1:8000';

// API requests ni Django ga yo'naltirish
app.use('/v1', createProxyMiddleware({
  target: DJANGO_URL,
  changeOrigin: true,
  pathRewrite: function (path, req) {
    return req.originalUrl;
  },
  onProxyRes: function (proxyRes, req, res) {
    console.log(`[PROXY] ${req.method} ${req.url} -> STATUS ${proxyRes.statusCode}`);
  },
  onError: function (err, req, res) {
    console.log(`[PROXY ERROR] Django server ishlamayapti yoki xato: ${err.message}`);
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Django Backend is down or unreachable.');
  }
}));

app.use('/media', createProxyMiddleware({
  target: DJANGO_URL,
  changeOrigin: true,
  pathRewrite: function (path, req) {
    return req.originalUrl;
  }
}));

// Frontend fayllarni berish (static fayllar shu papkaning o'zida)
app.use(express.static(__dirname));

// HTML fallback (SPA uchun)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n===========================================`);
  console.log(`TaskFlow Server ishga tushdi!`);
  console.log(`Frontend URL: http://localhost:${PORT}`);
  console.log(`API Proxy:    http://localhost:${PORT}/v1 -> ${DJANGO_URL}/v1`);
  console.log(`===========================================\n`);
});