# 🍳 Personalized Recipe & Grocery Manager

A backend project that demonstrates **CRUD, authentication, authorization, middleware, and validation** with a real-world use case.  

This service allows users to create and manage recipes, generate grocery lists based on selected recipes, and securely share recipes with others. It combines **recipes ↔ groceries** with role-based access control.

---

## ✨ Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication with refresh tokens
  - Role-based access: Users vs Admins
- 📝 **CRUD Operations**
  - Recipes (create, update, delete, view)
  - Ingredients management
- 🛒 **Grocery List Generator**
  - Automatically compiles groceries from chosen recipes
- 🔗 **Recipe Sharing**
  - Generate unique shortlinks for read-only recipe sharing
- ⚙️ **Middleware**
  - Request logging
  - Authentication/authorization guard
  - Input validation (Zod)
  - Rate limiting

---

## 🏗 Tech Stack

- **Backend Framework**: Node.js + Express  
- **Database**: MongoDB
- **Authentication**: JWT + bcrypt  
- **Validation**: Zod  

---

## 🔑 API Endpoints

### Auth
- `POST /auth/register` → Register user  
- `POST /auth/login` → Login and get JWT  

### Recipes
- `GET /recipes` → List all recipes (user-owned + shared/public)  
- `POST /recipes` → Create recipe  
- `PUT /recipes/:id` → Update recipe (owner or admin only) 
- `DELETE /recipes/:id` → Delete recipe  

### Sharing
- `GET /recipes/:id/share` → Generate a shareable link  
- `GET /share/:token` → Access shared recipe (read-only)  

### Groceries
- `GET /groceries` → Generate grocery list from selected recipes  

---

## 🛠 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/AshmitSherigar/grocefy.git
cd grocefy
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Create a `.env` file:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/grocefy
JWT_SECRET=your_jwt_secret
```

### 4. Run in development
```bash
node script.js
```

---

## 🚀 Future Enhancements

- 📱 Add a frontend (React/Next.js)  
- 🔔 Push notifications for expiring ingredients  

