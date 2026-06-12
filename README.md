# 🚀 Internship Recruitment Management System

A robust, production-ready RESTful API designed to streamline the job posting and application lifecycle. Engineered with a focus on strict Role-Based Access Control (RBAC), data normalization, and secure authentication, this backend serves as the foundation for a multi-sided recruitment platform.

LIVE URL - https://internship-recruitment-management-system.onrender.com/

HEALTH - https://internship-recruitment-management-system.onrender.com/health

---

## ✨ Core Features & Role Capabilities

### 👨‍💼 Recruiter Operations
* **Job Management:** Create, read, update, and delete (CRUD) internship postings.
* **Resource Ownership:** Strict backend validation ensures recruiters can only modify or delete jobs they personally authored.
* **Applicant Tracking:** View all applications submitted to their specific job postings.
* **Status Workflows:** Update candidate application statuses through a strict pipeline (`APPLIED` → `SHORTLISTED` → `INTERVIEW_SCHEDULED` → `REJECTED` / `SELECTED`).
* **Analytics Dashboard:** Access real-time aggregation metrics detailing total active jobs, total applicants, and total shortlisted candidates.

### 🎓 Candidate Operations
* **Discovery:** Browse and filter active internship postings using dynamic query parameters (e.g., location, skills, status).
* **One-Click Apply:** Submit internship applications using a secure resume URL.
* **Application History:** Track personal application statuses and historical submissions via a dedicated endpoint.
* **Duplicate Prevention:** Database-level constraints prevent multiple applications to the same internship.

### 🛡️ Administrator Operations
* **System Oversight:** Unrestricted read-access to global system metrics.
* **Global Dashboard:** View aggregated data including total registered users, total system-wide internships, and the active recruiter count.

---
```markdown

## 🛠️ Technology Stack

* **Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Database:** [PostgreSQL](https://www.postgresql.org/) (Cloud-hosted via Supabase)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Validation:** [Zod](https://zod.dev/)
* **Authentication:** JSON Web Tokens (JWT) & bcrypt

---

## 📂 Architecture & Folder Structure

The project follows a modular, feature-based architecture to separate concerns and maintain clean routing hierarchies.

```text
backend/
├── prisma/                  # Database schema and migration history
│   └── schema.prisma        # Prisma models and enums
├── src/
│   ├── config/              # Centralized environment variable validation (env.ts)
│   ├── middlewares/         # Global error handling and RBAC protection
│   ├── modules/             # Feature-based business logic
│   │   ├── applications/    # Application controllers and routes
│   │   ├── auth/            # Registration, login, and profile controllers
│   │   ├── dashboards/      # Aggregation and analytics logic
│   │   └── internships/     # Job posting CRUD operations
│   ├── app.ts               # Express application configuration and route mounting
│   ├── db.ts                # Prisma client instantiation and connection pooling
│   └── server.ts            # Entry point and server initialization
├── package.json
└── tsconfig.json

```

---

## ⚙️ Local Setup & Installation

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn
* A local PostgreSQL database OR a free [Supabase](https://supabase.com/) account.

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/Internship-Recruitment-Management-System.git](https://github.com/your-username/Internship-Recruitment-Management-System.git)
cd Internship-Recruitment-Management-System/backend

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Configure Environment Variables

Create a `.env` file in the root of the `backend/` directory and add the following required variables:

```env
# Database connection string (from Supabase or local Postgres)
DATABASE_URL="postgresql://user:password@host:port/database"

# Secret key for signing JSON Web Tokens
JWT_SECRET_KEY="your_super_secret_jwt_key_here"

# Port for the Express server (Defaults to 5000)
PORT="5000"

```

### 4. Setup the Database

Run Prisma migrations to construct the tables, relationships, and enums in your database.

```bash
npx prisma migrate dev

```

Generate the Prisma Client for type-safe database access:

```bash
npx prisma generate

```

### 5. Run the Server

Start the development server:

```bash
npm start

```

The server will start, and you should see `Server running on port 5000` in the terminal.

---

## ☁️ Deployment Specifications

This API is configured for deployment on platforms like **Render**, using **Supabase** as the database provider.

### Essential Deployment Commands:

* **Build Command:** `npm install && npm run build && npm run migrate:deploy`
* **Start Command:** `npm start`

> **Note on IPv4 Environments:** When deploying on free-tier services that utilize IPv4 networks (like Render), ensure your Supabase `DATABASE_URL` uses the **Session Pooler** connection string rather than the Direct Connection string to prevent DNS resolution errors.

```