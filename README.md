# Divya Setu (दिव्य सेतु) — Temple Management System

An enterprise-grade, full-stack digital management system built for holy temples (Somnath Temple). Provides intelligent darshan queue management, real-time crowd density monitoring, AI stampede alerts, privacy-preserving pilgrim registration, and role-based gate operations.

- **Hosted Web App**: [https://projectsomnath.netlify.app/](https://projectsomnath.netlify.app/)
- **Repository**: [https://github.com/avi4rag/Temple-Management.git](https://github.com/avi4rag/Temple-Management.git)

---

## 🏛️ Architectural Overview

Divya Setu operates on a decoupled full-stack architecture designed for maximum resilience, sub-second latency, and zero-compromise pilgrim privacy:

```
[ Pilgrim / Gate Operator / Admin ]
               │
               ▼
   [ React 18 + Vite SPA ] ──(Netlify / CDN)
         │           │
         │           └── [ Real-time SSE Stream (/api/v1/stream) ]
         ▼
[ Express API Gateway ] ──(Rate Limit / Helmet / CORS / JWT)
         │
         ├── [ Slot & Booking Controller ] (Atomic MongoDB Capacity Locks)
         ├── [ Crowd & Camera AI Controller ] (High-frequency TTL Telemetry)
         ├── [ Incident & Emergency Alert Hub ] (Instant Broadcast Engine)
         └── [ Staff Auth & Audit System ] (Bcrypt / Brute-force Lockout)
               │
               ▼
       [ MongoDB Database ]
```

---

## 🚀 Core Features

### 1. Smart Darshan Slot Booking
- Calendar slot reservation with live available spot counters.
- **Race condition prevention**: Atomic slot booking using MongoDB `$expr` and `$inc` operators.
- Support for special darshan assistance and Mahaprasad pre-orders.

### 2. Pilgrim Data Privacy First
- **Strict Compliance**: Only the last 4 digits (`idLast4`) of identity cards are stored in the database. Full Aadhaar / PAN numbers are **never stored or logged**.

### 3. Gate QR Code Pass & Real-time Check-in
- Each devotee receives a unique cryptographically generated QR ticket identifier.
- Gate operators scan passes at temple entry gates with duplicate check-in prevention and automated gate telemetry.

### 4. Real-time Crowd Telemetry & Automated Stampede Alerts
- Continuous occupancy monitoring across Garbhagriha (Sanctum), Sabha Mandapa, East Entry Gate, West Exit Corridor, Pilgrim Plaza, and Mahaprasad Hall.
- Dynamic wait-time computation algorithm based on real-time density ratios.
- **Automated Safety Trigger**: AI detects crowd occupancy exceeding 90% and automatically dispatches high/critical alerts to security personnel.

### 5. Multi-Role Staff Access Control (RBAC)
- Five segregated roles: `super_admin`, `admin`, `security`, `gate_staff`, and `crowd_manager`.
- Exponential lockout protection against brute-force login attempts (15-minute freeze on 5 consecutive failures).
- Immutable security audit logging for all critical operations.

### 6. Live Telemetry via Server-Sent Events (SSE)
- Persistent real-time event pipeline (`/api/v1/stream`) delivering instant crowd metrics and emergency broadcast alerts to connected screens without heavy polling.

### 7. Multi-Lingual Devotee Experience
- Full UI localization for 7 Indian languages: English, Hindi (हिंदी), Gujarati (ગુજરાતી), Marathi (मराठी), Tamil (தமிழ்), Telugu (తెలుగు), and Bengali (বাংলা).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, shadcn/ui, Radix UI, TanStack Query, Lucide Icons |
| **Backend API** | Node.js, Express 4, ES Modules, Zod, Helmet, Express Rate Limit, Pino |
| **Database** | MongoDB 8 via Mongoose ODM (Indexes, Virtuals, TTL Collections) |
| **Authentication** | JWT (JSON Web Tokens), Bcrypt.js, Secure HTTP Cookies |
| **Real-time** | Server-Sent Events (SSE) |
| **CI / CD** | GitHub Actions Workflow, Netlify |

---

## 💻 Quick Start & Local Setup

### Prerequisites
- Node.js 20+ and npm 10+
- MongoDB instance (local or MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/avi4rag/Temple-Management.git
cd Temple-Management
```

### 2. Frontend Setup
```bash
# Install frontend dependencies
npm ci

# Start frontend dev server
npm run dev
```
The frontend runs at `http://localhost:8080`.

### 3. Backend Setup
```bash
cd backend

# Install backend dependencies
npm install

# Seed default admin, camera feeds, and 7-day time slots
npm run seed

# Start backend server with file watcher
npm run dev
```
The API server runs at `http://localhost:5000` with API root at `/api/v1`.

---

## 📡 API Endpoints Reference

### Authentication (`/api/v1/auth`)
- `POST /login` — Staff login with brute-force lockout protection
- `POST /refresh` — Refresh expired access token
- `GET /me` — Current authenticated staff profile
- `POST /logout` — Invalidate staff session

### Time Slots (`/api/v1/slots`)
- `GET /?date=YYYY-MM-DD` — Public: Get available slots and capacities
- `POST /` — Admin: Create new darshan slot
- `PATCH /:id` — Admin: Update capacity or slot status
- `DELETE /:id` — Super Admin: Delete unused slot

### Bookings & Check-in (`/api/v1/bookings`)
- `POST /` — Public: Create darshan booking with atomic capacity deduction
- `GET /search?reference=DS-XXXXXX` — Public: Track booking status
- `POST /checkin` — Gate Staff: Validate and check in devotee via QR ticket ID
- `GET /stats` — Staff: Daily booking and entry statistics
- `PATCH /:id/cancel` — Cancel booking and restore slot capacity

### Crowd & AI Monitoring (`/api/v1/crowd`)
- `GET /metrics` — Public: Real-time zone density and wait time estimates
- `GET /cameras` — Public/Staff: Live camera feed status
- `GET /trends` — Analytics: 24-hour crowd density trend
- `POST /readings` — Ingest AI camera headcount telemetry

### Emergency Alerts & Announcements
- `GET /api/v1/alerts` — Staff: Active operational & emergency alerts
- `POST /api/v1/alerts` — Staff: Report new alert incident
- `PATCH /api/v1/alerts/:id/resolve` — Staff: Resolve alert with audit note
- `GET /api/v1/notifications` — Public: Active broadcast announcements
- `GET /api/v1/stream` — Real-time Server-Sent Events (SSE) stream

---

## 🔒 Security & Privacy Commitments

1. **No Sensitive ID Storage**: We never store 12-digit Aadhaar numbers or government photo IDs. Only the last 4 characters are kept for in-person gate verification.
2. **Brute Force Mitigation**: Tiered rate limiters protect all public endpoints, while auth routes freeze after repeated failed attempts.
3. **Audit Trails**: Security actions and check-in verifications are recorded in an immutable audit ledger.
4. **CORS & Strict Headers**: Helmet security headers and strict CORS allowlists protect against cross-site scripting and framing attacks.

---

## 📄 License & Attribution

Developed with devotion for Somnath Temple Management. All rights reserved.
