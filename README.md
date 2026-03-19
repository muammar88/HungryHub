# 📘 HungryHub – Restaurant Menu Management API

## 📌 Overview

Repository ini berisi implementasi REST API untuk sistem **Restaurant Menu Management**, yang dikembangkan sebagai bagian dari **technical assessment Backend Software Engineer di HungryHub**.

Aplikasi ini mensimulasikan sistem manajemen restoran sederhana, di mana pengguna dapat mengelola data restoran dan menu makanan yang tersedia.

---

## 🎯 Objectives

Project ini dibuat untuk:

* Mengimplementasikan RESTful API sesuai standar industri
* Mendesain relasi database yang efisien dan terstruktur
* Menerapkan validasi dan error handling yang baik
* Menunjukkan kemampuan dalam membangun backend yang scalable dan maintainable

---

## 🛠️ Tech Stack

* **Framework**: NestJS
* **Language**: TypeScript
* **Database**: MySQL
* **ORM**: Prisma *(atau TypeORM, sesuaikan)*
* **Validation**: class-validator
* **API Documentation**: Swagger

---

## 🧱 Data Models

### 🏪 Restaurant

* `id` (number)
* `name` (string, required)
* `address` (string, required)
* `phone` (string)
* `opening_hours` (string)

### 🍽️ Menu Item

* `id` (number)
* `name` (string, required)
* `description` (string)
* `price` (decimal, required)
* `category` (string) *(example: appetizer, main, dessert, drink)*
* `is_available` (boolean, default: true)
* `restaurant_id` (relation)

---

## 📬 API Endpoints

### 🏪 Restaurant

| Method | Endpoint         | Description                                |
| ------ | ---------------- | ------------------------------------------ |
| POST   | /restaurants     | Create a restaurant                        |
| GET    | /restaurants     | Get all restaurants                        |
| GET    | /restaurants/:id | Get restaurant detail (include menu items) |
| PUT    | /restaurants/:id | Update a restaurant                        |
| DELETE | /restaurants/:id | Delete a restaurant                        |

---

### 🍽️ Menu Item

| Method | Endpoint                    | Description                                   |
| ------ | --------------------------- | --------------------------------------------- |
| POST   | /restaurants/:id/menu_items | Create menu item                              |
| GET    | /restaurants/:id/menu_items | Get menu items (filter by category supported) |
| PUT    | /menu_items/:id             | Update menu item                              |
| DELETE | /menu_items/:id             | Delete menu item                              |

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-username/hungryhub-assessment.git
cd hungryhub-assessment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

Buat file `.env`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=hungryhub_db
```

---

### 4. Setup Database

Buat database MySQL, lalu jalankan migration:

Jika menggunakan Prisma:

```bash
npx prisma migrate dev
```

---

### 5. Seed Data

```bash
npx prisma db seed
```

Seed berisi:

* 2 restoran
* Masing-masing 5 menu items

---

### 6. Run Application

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
http://localhost:3000/api
```

---

## ✅ Features Implemented

* CRUD Restaurant
* CRUD Menu Item
* Relasi Restaurant ↔ Menu Item
* Filter menu berdasarkan category
* Validasi input menggunakan DTO
* Proper HTTP status codes
* Error handling dengan response yang jelas
* Seed data

---

## ⚠️ Error Handling

API ini menggunakan standar HTTP status code:

* `200` → Success
* `201` → Created
* `400` → Bad Request (validation error)
* `404` → Data not found

Semua error response memiliki format yang konsisten dan informatif.

---

## 📈 Design Decisions

* Menggunakan **modular architecture NestJS** untuk scalability
* Memisahkan controller, service, dan data access layer
* Menggunakan DTO + validation untuk menjaga integritas data
* Relasi database menggunakan foreign key untuk menjaga konsistensi
* Struktur dibuat sederhana namun mudah dikembangkan

---

## 🚀 Bonus Features

*(Sesuaikan kalau kamu implement)*

* Pagination pada endpoint list
* Filter menu berdasarkan category
* Authentication (JWT / API key)
* Docker setup
* Unit testing

---

## 📌 Notes

Project ini difokuskan pada:

* Clean code & readability
* Struktur aplikasi yang rapi
* Implementasi fitur yang sesuai requirement
* Kemudahan untuk di-maintain dan dikembangkan

---

## 👨‍💻 Author

**Muammar Kadafi**
Backend Developer Candidate – HungryHub
