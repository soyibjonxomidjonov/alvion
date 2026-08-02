FROM node:20-alpine
WORKDIR /app

# faqat package.json kerakli paketlarni o'rnatish uchun
COPY package*.json ./
RUN npm install

# qolgan barcha fayllarni (server.js, config.js, HTML/CSS/JS va h.k.) nusxalash
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]