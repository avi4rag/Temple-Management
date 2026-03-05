# Divya Setu (दिव्य सेतु) — Temple Management System

An enterprise-grade, full-stack digital management system built for holy temples (Shree Somnath Jyotirlinga Temple). Provides intelligent darshan queue management, real-time crowd density monitoring, AI stampede alerts, privacy-preserving pilgrim registration, interactive isometric navigation, multi-lingual audio guides, and role-based administration operations.

- **Hosted Web App**: [https://projectsomnath.netlify.app/](https://projectsomnath.netlify.app/)
- **Repository**: [https://github.com/avi4rag/Temple-Management.git](https://github.com/avi4rag/Temple-Management.git)

---

## 🏛️ Architectural Overview

Divya Setu operates on a decoupled full-stack architecture designed for maximum resilience, sub-second latency, and zero-compromise pilgrim privacy:

```
[ Pilgrim / Gate Operator / Security Admin ]
                     │
                     ▼
       [ React 18 + Vite SPA (PWA) ] ──(Netlify CDN / Offline SW Cache)
             │                 │
             │                 └── [ Real-time SSE Stream (/api/v1/stream) ]
             ▼
    [ Express API Gateway ] ──(Rate Limit / Helmet / CORS / JWT Auth)
             │
             ├── [ Slot & Booking Controller ] (Atomic MongoDB Capacity Locks)
             ├── [ Crowd & Camera AI Controller ] (High-frequency TTL Telemetry)
             ├── [ Incident & Emergency Alert Hub ] (Instant Broadcast Engine)
             ├── [ Festival Protocols & Roster ] (Vigil Schedules & Guards)
             └── [ Staff Auth & Audit System ] (Bcrypt / Brute-force Lockout)
                     │
                     ▼
             [ MongoDB Database ] (Indexes, Virtuals, TTL Records)
```

---

## 🚀 Core Features & Innovations

### 1. Smart Darshan Slot Booking & Atomic Capacity
- Calendar slot reservation with live available spot counters.
- **Race Condition Prevention**: Atomic slot booking using MongoDB `$expr` and `$inc` operators.
- Support for special darshan assistance (wheelchair, senior citizen, infant care) and Mahaprasad pre-orders.
- Smart advisory badges highlighting lowest-wait-time slots and auspicious timings.

### 2. Devotee Privacy First (Zero-PII Storage)
- **Strict Compliance**: Only the last 4 digits (`idLast4`) of identity cards are stored.
- Full 12-digit Aadhaar / Passport / Voter ID numbers are **never stored, transmitted, or logged**.

### 3. Gate QR Code Pass & Real-time Check-in
- Each devotee receives a unique cryptographically generated QR ticket identifier.
- Gate operators scan passes at temple entry gates with duplicate check-in prevention, automated gate telemetry, and download/print capabilities.

### 4. Real-time Crowd Telemetry & Predictive Analytics
- Continuous occupancy monitoring across Garbhagriha (Sanctum), Sabha Mandapa, East Entry Gate, West Exit Corridor, Pilgrim Plaza, and Mahaprasad Hall.
- **Hour-by-Hour Crowd Influx Prediction**: Recharts-powered forecast modeling peak devotee influx versus optimal darshan windows.
- **Auspicious vs. Normal Day Comparisons**: Footfall analysis accounting for Shravan, Ekadashi, and Purnima.
- **Automated Safety Trigger**: AI detects crowd occupancy exceeding 90% and automatically dispatches high/critical alerts to security personnel.

### 5. Interactive Temple Map & Devotee Navigation
- Custom isometric SVG layout of the Somnath Temple complex with real-time zone density overlays.
- Category filters (Sanctum, Prasadam, Facilities, Cloakrooms, Emergency Aid).
- Devotee GPS distance tracker showing walking time and optimal route guidance.

### 6. Sacred Audio Guide & Sanctum Bell Chime
- **Sanctum Bell Simulator**: Web Audio API synthesizing resonant harmonic frequencies of a bronze sanctum bell (528 Hz Solfeggio Love frequency).
- **Web Speech Narration**: Multilingual audio guide introducing the history and sacred significance of Shree Somnath Jyotirlinga.

### 7. Festival Vigil Protocols & Security Operations
- Dynamic festival profiles (e.g. Maha Shivratri, Shravan Somwar) triggering 24-hour continuous darshan and enhanced security rules.
- **CCTV Zone Telemetry**: Live uptime tracking and zone-filtered security feeds.
- **Security Guard Roster**: Shift assignments for temple gates, sanctum cordon, and crowd control.
- **Incident Management**: Incident logging form and one-click CSV report exports for daily administration audits.

### 8. Multi-Lingual Devotee Experience
- Full UI localization for 7 Indian languages:
  - English
  - Hindi (हिंदी)
  - Gujarati (ગુજરાતી)
  - Marathi (मराठी)
  - Tamil (தமிழ்)
  - Telugu (తెలుగు)
  - Bengali (বাংলা)
- Interactive searchable language selection modal.

### 9. Multi-Role Staff Access Control (RBAC)
- Five segregated roles: `super_admin`, `admin`, `security`, `gate_staff`, and `crowd_manager`.
- Exponential lockout protection against brute-force login attempts (15-minute freeze on 5 consecutive failures).
- Immutable security audit logging for all critical operations.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS, shadcn/ui, Radix UI, TanStack Query, Recharts, Lucide Icons |
| **Code Splitting** | Rollup `manualChunks` (`vendor-react`, `vendor-charts`, `vendor-ui`) — all chunks under 450 kB |
| **Backend API** | Node.js, Express 4, ES Modules, Zod, Helmet, Express Rate Limit, Pino Logger |
| **Database** | MongoDB 8 via Mongoose ODM (Indexes, Virtuals, TTL Collections) |
| **Real-time** | Server-Sent Events (SSE) `/api/v1/stream` |
| **Accessibility** | WCAG 2.1 AA Compliant with descriptive ARIA labels and full keyboard navigation |
| **SEO & OpenGraph** | Schema.org `HinduTemple` JSON-LD, Twitter Cards, Canonical metadata |
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

### 3. Production Build & Audit
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### 4. Backend Setup
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
3. **Audit Trails**: Security actions, shift changes, and check-in verifications are recorded in an immutable audit ledger.
4. **CORS & Strict Headers**: Helmet security headers and strict CORS allowlists protect against cross-site scripting and framing attacks.

---

## 📄 License & Attribution

Developed with devotion for Shree Somnath Temple Trust Administration. All rights reserved.
