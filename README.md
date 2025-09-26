# 📝 TenantNotes - Multi-Tenant Notes App

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, full-stack multi-tenant Notes application that empowers organizations to create, manage, and collaborate on notes securely within their workspace. Built with enterprise-grade security and scalability in mind.

## ✨ What makes TenantNotes special?

- **🏢 True Multi-Tenancy**: Complete data isolation between organizations
- **🔒 Enterprise Security**: JWT authentication with role-based access control
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **⚡ Real-time Updates**: Instant usage tracking and limit management
- **🎯 Plan-based Limits**: Free and Pro tiers with intelligent upgrade prompts

---

## 🚀 Features

### 🔐 Authentication & Security

- JWT authentication with access and refresh tokens
- Role-based access control (Admin / Member)
- HTTP-only cookies for token storage
- Tenant-scoped authorization for data isolation

### 🏢 Multi-Tenant Architecture

- Data isolation between organizations
- Tenant-based URL routing
- Designed to support multiple organizations
- Plan management: Free (3 notes) and Pro (unlimited) tiers

### 📝 Notes Management

- Create, read, update, and delete notes
- Title and content fields with responsive editing
- Permissions: Only note owners and tenant admins can modify notes
- Usage tracking for note limits

### 🎨 Frontend (Next.js 14)

- Responsive design for desktop and mobile
- App Router and TypeScript support
- Tailwind CSS for styling
- Interactive components: cards, dialogs, forms
- Toast notifications for user feedback

### ⚙️ Backend (Node.js + Express)

- RESTful API endpoints
- Middleware for authentication and error handling
- MongoDB integration with Mongoose
- Pagination with `page` and `limit` parameters
- Centralized error management

---

## 📂 Project Structure

```
multi-tenant-notes/
├── 📁 frontend/                    # Next.js 14 Frontend
│   ├── 📁 src/
│   │   ├── 📁 app/
│   │   │   ├── 📁 auth/
│   │   │   │   ├── 📁 login/       # Login page
│   │   │   │   └── 📁 register/    # Registration page
│   │   │   ├── 📁 [tenantSlug]/    # Dynamic tenant routes
│   │   │   │   └── 📁 dashboard/   # Tenant dashboard
│   │   │   ├── layout.tsx          # Root layout
│   │   │   └── page.tsx            # Landing page
│   │   ├── 📁 components/
│   │   │   ├── 📁 layout/          # Layout components
│   │   │   └── 📁 ui/              # Reusable UI components
│   │   ├── 📁 services/            # API service functions
│   │   ├── 📁 context/             # React context providers
│   │   └── 📁 utils/               # Utility functions
│   ├── package.json
│   └── tailwind.config.js
│
├── 📁 backend/                     # Node.js + Express Backend
│   ├── 📁 src/
│   │   ├── 📁 controllers/         # Route controllers
│   │   │   ├── auth.controller.ts  # Authentication logic
│   │   │   └── notes.controller.ts # Notes CRUD operations
│   │   ├── 📁 middlewares/         # Express middlewares
│   │   │   ├── auth.middleware.ts  # JWT verification
│   │   │   └── error.middleware.ts # Error handling
│   │   ├── 📁 models/              # MongoDB models
│   │   │   ├── user.model.ts       # User schema
│   │   │   ├── note.model.ts       # Note schema
│   │   │   └── tenant.model.ts     # Tenant schema
│   │   ├── 📁 routes/              # API routes
│   │   ├── 📁 utils/               # Utility functions
│   │   ├── app.ts                  # Express app configuration
│   │   └── index.ts                # Server entry point
│   └── package.json
│
└── README.md                       # This file
```

---

## ⚡ Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB with Mongoose
- **Auth:** JWT (access + refresh tokens), HTTP-only cookies
- **Deployment:** Vercel

---

## ⚙️ Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Taher-Chabra/Multi-Tenants-Notes-App.git
cd Multi-Tenants-Notes-App
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

npm run dev
```

**Required Environment Variables:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/tenant-notes
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tenant-notes

# JWT Secrets (generate secure random strings)
JWT_SECRET=your_super_secure_jwt_secret_here
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_here

# CORS
FRONTEND_URL=http://localhost:3000
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your configuration

npm run dev
```

**Frontend Environment Variables:**

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# Optional: Analytics, monitoring, etc.
# NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### 4️⃣ Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)

### User Roles & Permissions

| Role       | Permissions                                                                                                                               |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Member** | • Create personal notes<br>• Edit own notes<br>• View tenant notes<br>• Delete own notes                                                  |
| **Admin**  | • All member permissions<br>• Edit any tenant note<br>• Delete any tenant note<br>• Upgrade organization plan<br>• Manage tenant settings |

### Plan Limits

| Plan     | Note Limit | Features                                                             |
| -------- | ---------- | -------------------------------------------------------------------- |
| **Free** | 3 notes    | • Basic note management<br>• Role-based access<br>• Tenant isolation |
| **Pro**  | Unlimited  | • Unlimited notes<br>• Advanced features<br>• Priority support       |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Built with ❤️ using modern web technologies
- Inspired by the need for secure, scalable multi-tenant applications
- Special thanks to the open-source community for amazing tools and libraries

---

<p align="center">
  <strong>⭐ If you found this project helpful, please give it a star! ⭐</strong>
</p>
