# 📡 API Reference Documentation
**Base URL (Local):** `http://localhost:5000`  
**Base URL (Production):** `https://your-production-url.onrender.com`

## 🔐 Authentication
This API uses **JSON Web Tokens (JWT)** for authentication. 
For protected routes, include the JWT in the `Authorization` header:
`Authorization: Bearer <your_jwt_token>`

---

## 1. Authentication Module (`/auth`)

### `POST /auth/register`
Registers a new user in the system.
* **Access:** Public
* **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "RECRUITER" // Must be 'ADMIN', 'RECRUITER', or 'CANDIDATE'
  }
  
```

### `POST /auth/login`

Authenticates a user and returns a JWT.

* **Access:** Public
* **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}

```


* **Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}

```



### `GET /auth/profile`

Fetches the logged-in user's profile details.

* **Access:** Private (Any Authenticated User)

---

## 2. Internships Module (`/internships`)

### `GET /internships`

Fetches all active internships. Supports pagination, sorting, and filtering.

* **Access:** Private (Any Authenticated User)
* **Query Parameters:**
* `page` (number): Default `1`
* `limit` (number): Default `10`
* `location` (string): Filter by location
* `skills` (string): Filter by required skill (e.g., `Node.js`)
* `status` (string): `OPEN` or `CLOSED`



### `GET /internships/:id`

Fetches details of a specific internship.

* **Access:** Private (Any Authenticated User)

### `POST /internships`

Creates a new job posting.

* **Access:** Private (**Recruiter Only**)
* **Body:**
```json
{
  "title": "Backend Developer Intern",
  "description": "Work on Node.js and Postgres APIs.",
  "stipend": 5000,
  "location": "Remote",
  "skill_required": ["Node.js", "Prisma"],
  "deadline": "2026-12-31"
}

```



### `PUT /internships/:id`

Updates an existing internship. Fields are optional.

* **Access:** Private (**Recruiter Only** - Must be the creator)

### `DELETE /internships/:id`

Deletes an internship.

* **Access:** Private (**Recruiter Only** - Must be the creator)

### `POST /internships/:id/apply`

Submits an application for a specific internship.

* **Access:** Private (**Candidate Only**)
* **Body:**
```json
{
  "resume": "[https://aws.s3.com/my-resume.pdf](https://aws.s3.com/my-resume.pdf)"
}

```



### `GET /internships/:id/applications`

Views all applications submitted to a specific job posting.

* **Access:** Private (**Recruiter Only** - Must be the creator)

---

## 3. Applications Module (`/applications`)

### `GET /applications/me`

Fetches the application history for the currently logged-in candidate.

* **Access:** Private (**Candidate Only**)

### `PUT /applications/:id/status`

Updates the status of a specific candidate's application.

* **Access:** Private (**Recruiter Only** - Must own the associated internship)
* **Body:**
```json
{
  "status": "SHORTLISTED" // 'APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'REJECTED', 'SELECTED'
}

```



---

## 4. Dashboards Module (`/dashboards`)

### Recruiter Analytics

* **`GET /dashboards/recruiter/stats`** - General aggregate stats (total jobs, applicants, shortlisted).
* **`GET /dashboards/recruiter/internships`** - List of all internships created by this recruiter.
* **`GET /dashboards/recruiter/applications`** - List of all applications received by this recruiter.
* **`GET /dashboards/recruiter/shortlisted`** - List of all shortlisted candidates for this recruiter.
* *All Recruiter routes require the `RECRUITER` role.*

### Administrator Analytics

* **`GET /dashboards/admin/stats`** - System-wide aggregate stats.
* **`GET /dashboards/admin/internships`** - View all internships across the entire platform.
* **`GET /dashboards/admin/users`** - View all registered users on the platform.
* **`GET /dashboards/admin/active_recruiters`** - View all active recruiters.
* *All Admin routes require the `ADMIN` role.*

---

## 🛑 Standard Error Response

All validation and system errors follow a uniform structure for easy frontend handling:

```json
{
  "success": false,
  "message": "Error description goes here"
}

```