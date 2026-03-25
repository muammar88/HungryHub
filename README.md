# 📘 HungryHub – Restaurant Menu Management API

## 📌 Overview

Repository ini berisi implementasi REST API untuk sistem Restaurant Menu Management, dikembangkan sebagai bagian dari technical assessment Backend Software Engineer di HungryHub.

Aplikasi ini mendukung:

- Manajemen autentikasi (JWT)
- CRUD Restaurant & Menu
- Pencarian data menggunakan Elasticsearch

---

## 🔗 Repository

https://github.com/muammar88/HungryHub.git

---

## 🎯 Objectives

- Implementasi RESTful API
- Desain database relational yang efisien
- Integrasi MySQL + Elasticsearch
- Authentication menggunakan JWT (access & refresh token)
- Validasi dan error handling
- Struktur backend scalable

---

## 🛠️ Tech Stack

- Framework: NestJS
- Language: TypeScript
- Database: MySQL
- Search Engine: Elasticsearch
- ORM: Prisma
- Auth: JWT
- Validation: class-validator
- Documentation: Swagger
- Containerization: Docker

---

## 🧪 Unit Testing

Aplikasi ini menggunakan Jest untuk unit testing.

Menjalankan Test

npm run test

Watch Mode

npm run test:watch

Coverage

npm run test:cov

Hasil coverage tersedia di folder: coverage/

## Struktur Testing

src/ ├── auth/ │ ├── auth.service.spec.ts │ ├── auth.controller.spec.ts
├── restaurants/ │ ├── restaurants.service.spec.ts │ ├──
restaurants.controller.spec.ts ├── menu_items/ │ ├──
menu_items.service.spec.ts │ ├── menu_items.controller.spec.ts

## Testing Strategy

- Mock dependency (Prisma, Elasticsearch, JWT)
- Menggunakan jest.fn()
- Fokus pada business logic & error handling

---

## 🔐 Authentication

API menggunakan JWT Authentication.

Flow:

1. Login → dapat access_token & refresh_token
2. Gunakan access_token untuk akses endpoint protected
3. Gunakan refresh_token untuk mendapatkan token baru

---

## 📬 API Endpoints

## 🔐 Auth

| Method | Endpoint      | Description   |
| ------ | ------------- | ------------- |
| POST   | /auth/login   | Login user    |
| POST   | /auth/refresh | Refresh token |

### Request Login

```json
{
  "username": "admin",
  "password": "admin"
}
```

### Request Refresh

```json
{
  "refresh_token": "your_refresh_token"
}
```

---

## 🏪 Restaurant (Protected)

Header wajib:

```
Authorization: Bearer <access_token>
```

| Method | Endpoint                    | Description           |
| ------ | --------------------------- | --------------------- |
| POST   | /restaurants                | Create restaurant     |
| GET    | /restaurants                | Get all restaurants   |
| GET    | /restaurants/:id            | Get detail restaurant |
| PUT    | /restaurants/:id            | Update restaurant     |
| DELETE | /restaurants/:id            | Delete restaurant     |
| POST   | /restaurants/:id/menu_items | Add menu              |
| GET    | /restaurants/:id/menu_items | Get menu list         |

---

## 🍽️ Menu Items

| Method | Endpoint        | Description |
| ------ | --------------- | ----------- |
| PUT    | /menu_items/:id | Update menu |
| DELETE | /menu_items/:id | Delete menu |

---

## 🔍 Query Parameters (Menu List)

Endpoint:

```
GET /restaurants/:id/menu_items
```

| Query    | Type   | Description                     |
| -------- | ------ | ------------------------------- |
| search   | string | Pencarian                       |
| category | string | appetizer, main, dessert, drink |
| page     | number | Halaman                         |
| limit    | number | Limit data                      |

---

## 🧱 Data Models

### Restaurant

- id
- name
- address
- phone
- opening_hours

### Menu Item

- id
- name
- description
- price
- category
- is_available
- restaurant_id

---

## ⚙️ Installation

### Clone

```
git clone https://github.com/muammar88/HungryHub.git
cd HungryHub
```

### Install

```
npm install
```

---

## ⚙️ Environment

Buat file `.env`:

```
DATABASE_URL="mysql://root:@localhost:3306/hungryhub_db"

ELASTIC_NODE=http://localhost:9200
ELASTIC_USERNAME=elastic
ELASTIC_PASSWORD=your_password

JWT_SECRET=your_secret_key
JWT_EXPIRES=expired_time
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES=expired_refresh_time
```

---

## 🐬 MySQL

```
CREATE DATABASE hungryhub_db;
```

---

## 🔍 Elasticsearch

```
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=true" \
  -e "ELASTIC_PASSWORD=your_password" \
  docker.elastic.co/elasticsearch/elasticsearch:8.13.0
```

---

## 🗄️ Migration

```
npx prisma migrate dev
```

---

## 🌱 Seed

```
npx prisma db seed
```

---

## ▶️ Run App

```
npm run start:dev
```

URL:

```
http://localhost:3000
```

---

## 📘 Swagger

```
http://localhost:3000/documentation
```

---

## 🔎 Elasticsearch Data

```json
{
  "id": 1,
  "name": "Resto Nusantara",
  "address": "Jl. Sudirman",
  "menus": [
    {
      "name": "Nasi Goreng",
      "category": "main",
      "price": 22000
    }
  ]
}
```

---

## ⚠️ Notes

- Semua endpoint restaurant & menu membutuhkan JWT
- Gunakan access_token di header Authorization
- Gunakan refresh_token untuk mendapatkan token baru

---

## ✅ Features

- Authentication JWT
- Refresh token
- CRUD Restaurant
- CRUD Menu Item
- Filter + pagination
- Elasticsearch integration
- Swagger documentation
- Validation DTO
- Error handling

---

## 👨‍💻 Author

Muammar Kadafi 🚀  
Backend Developer – HungryHub
