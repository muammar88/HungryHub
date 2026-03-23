# 📘 HungryHub – Restaurant Menu Management API

## 📌 Overview

Repository ini berisi implementasi REST API untuk sistem **Restaurant Menu Management**, yang dikembangkan sebagai bagian dari **technical assessment Backend Software Engineer di HungryHub**.

Aplikasi ini memungkinkan pengelolaan data restoran dan menu, serta mendukung **pencarian data menggunakan Elasticsearch**.

---

## 🔗 Repository

👉 https://github.com/muammar88/HungryHub.git

---

## 🎯 Objectives

Project ini dibuat untuk:

- Mengimplementasikan RESTful API
- Mendesain relasi database yang efisien
- Mengintegrasikan **MySQL + Elasticsearch**
- Menerapkan validasi dan error handling
- Membangun backend yang scalable dan maintainable

---

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MySQL
- **Search Engine**: Elasticsearch
- **ORM**: Prisma
- **Validation**: class-validator
- **API Documentation**: Swagger
- **Containerization**: Docker

---

## 🧱 Data Models

### 🏪 Restaurant

- `id` (number)
- `name` (string, required)
- `address` (string, required)
- `phone` (string)
- `opening_hours` (string)

---

### 🍽️ Menu Item

- `id` (number)
- `name` (string, required)
- `description` (string)
- `price` (number, required)
- `category` (string)
- `restaurant_id` (relation)

---

## 📬 API Endpoints

### 🏪 Restaurant

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | /restaurants     | Create restaurant       |
| GET    | /restaurants     | Get all restaurants     |
| GET    | /restaurants/:id | Get detail + menu items |
| PUT    | /restaurants/:id | Update restaurant       |
| DELETE | /restaurants/:id | Delete restaurant       |

---

### 🍽️ Menu Item

| Method | Endpoint                    | Description                      |
| ------ | --------------------------- | -------------------------------- |
| POST   | /restaurants/:id/menu_items | Create menu item                 |
| GET    | /restaurants/:id/menu_items | Get menu items (filter category) |
| PUT    | /menu_items/:id             | Update menu item                 |
| DELETE | /menu_items/:id             | Delete menu item                 |

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/muammar88/HungryHub.git
cd HungryHub
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Setup Environment

Buat file `.env`:

```env
DATABASE_URL="mysql://root:@localhost:3306/hungryhub_db"

ELASTIC_NODE=http://localhost:9200
ELASTIC_USERNAME=elastic
ELASTIC_PASSWORD=3ekiDFkbQ8ATn0E50v7Y
```

---

## 🐬 Setup MySQL

1. Pastikan MySQL sudah berjalan
2. Buat database:

```sql
CREATE DATABASE hungryhub_db;
```

---

## 🔍 Setup Elasticsearch

### 🔧 Menggunakan Docker (REKOMENDASI)

```bash
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=true" \
  -e "ELASTIC_PASSWORD=3ekiDFkbQ8ATn0E50v7Y" \
  docker.elastic.co/elasticsearch/elasticsearch:8.13.0
```

---

### 🔎 Test Elasticsearch

```bash
curl -u elastic:3ekiDFkbQ8ATn0E50v7Y http://localhost:9200
```

Jika berhasil, akan muncul response JSON.

---

## 🗄️ Database Migration

```bash
npx prisma migrate dev
```

---

## 🌱 Seed Data

```bash
npx prisma db seed
```

Seed akan:

- Menyimpan data ke MySQL
- Mengirim data ke Elasticsearch

---

## ▶️ Run Application

```bash
npm run start:dev
```

Aplikasi berjalan di:

```
http://localhost:3000
```

---

## 📬 API Documentation

Swagger tersedia di:

```
http://localhost:3000/documentation
```

---

## 🔎 Elasticsearch Integration

Contoh data yang dikirim ke Elasticsearch:

```json
{
  "id": 1,
  "name": "Resto Nusantara",
  "menus": [
    {
      "id": 1,
      "name": "Nasi Goreng",
      "category": "Makanan",
      "price": 22000
    }
  ]
}
```

---

## ✅ Features

- CRUD Restaurant
- CRUD Menu Item
- Relasi Restaurant ↔ Menu Item
- Filter menu berdasarkan kategori
- Integrasi Elasticsearch
- Validasi DTO
- Error handling standar
- Seed otomatis ke DB & Elasticsearch

---

## ⚠️ Notes

- Pastikan Elasticsearch dan MySQL sudah berjalan sebelum seed
- Gunakan Elasticsearch versi 8.x agar kompatibel dengan client

---

## 👨‍💻 Author

**Muammar Kadafi** 🚀
Backend Developer Candidate – HungryHub
