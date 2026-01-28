# 🚀 Social API – NestJS REST API

Backend REST API built with **NestJS**, **Prisma**, and **JWT Authentication using HttpOnly Cookies**.  
This project follows best practices such as DTO validation, global response interceptor, and Swagger API documentation.

---

## 🛠 Tech Stack

- **NestJS**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **JWT (Cookie-based Authentication)**
- **Swagger (OpenAPI)**
- **Class Validator**
- **Express (default Nest adapter)**

---

## ✨ Features

- 🔐 Authentication (Register & Login)
- 🍪 JWT stored in **HttpOnly Cookie**
- 👤 User & Profile relationship
- 🧾 Global response format (`success`, `message`, `data`)
- ✅ Request validation using DTO
- 📘 API documentation with Swagger
- 🌍 CORS enabled for frontend integration

---

## 📂 Project Structure

```txt
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/
│   └── strategies/
├── users/
├── profile/
├── common/
│   ├── interceptors/
│   ├── decorators/
│   └── interfaces/
├── app.module.ts
└── main.ts
prisma/
```

## ⚙️ Environment Variables

Create a .env file in the root directory:

```bash
DATABASE_URL="mysql://user:password@localhost:3306/mydb"
JWT_SECRET="supersecretkey"
PORT=3001
```

## 📦 Installation

```bash
# install dependencies
npm install

# generate prisma client
npx prisma generate

# run migration
npx prisma migrate dev

# start development server
npm run start:dev
```

## 🔐 Authentication Flow (JWT Cookie)

1. User login with email & password

2. Server generates JWT

3. JWT stored in HttpOnly Cookie

4. Browser automatically sends cookie on protected requests

5. Guard validates JWT from cookie

## 📘 API Documentation (Swagger)

After running the server, open :

```bash
http://localhost:3001/api
```

## 📥 Example API Response Format

```bash
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "email": "user@email.com"
  }
}
```

## 🧑‍💻 Author

Muhammad Furqan
Fullstack Developer
Tech Stack: Angular, React, Next.js, NestJS, Prisma
