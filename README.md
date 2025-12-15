## Event Ticket – Setup & Features

### Overview
Full-stack event ticketing app with organizer tools (create/manage events, scan tickets) and customer flows (browse, book, download PDF with QR, check status).

### Tech Stack
- Frontend: React (Vite), React Router, Tailwind (via @tailwindcss/vite), Axios
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- Utilities: jsPDF, qrcode, html5-qrcode for scanning

### Features
- Auth: signup/login, token stored in localStorage
- Organizer: add events (future dates only), list/delete, view details, scan QR for entry
- Public: view events, book tickets, auto-status based on approval mode
- Tickets: PDF with QR for approved tickets; fetch ticket status by email

### Prerequisites
- Node.js 18+
- MongoDB connection string

### Backend Setup
```bash
cd backend
cp env.example .env
# edit .env: set MONGODB_URI, PORT (optional), JWT_SECRET
npm install
npm run dev   # or npm start
```
Server runs at `http://localhost:3000` by default.

### Frontend Setup
```bash
cd frontend
cp env.example .env
# edit .env: VITE_API_BASE_URL=http://localhost:3000 (or your backend URL)
npm install
npm run dev
```
Vite defaults to `http://localhost:5173`.

### Key Endpoints (backend)
- Auth: `POST /auth/signup`, `POST /auth/login`
- Events: `GET /event` (public list), `GET /event/:id` (public), `POST /event` (auth), `GET /event/my-events` (auth), `DELETE /event/:id` (auth)
- Registrations: `POST /registrations` (book), `GET /registrations/my?email=...`, `POST /registrations/scan` (scanner), `PATCH /registrations/:id` (approve/reject)

### App Routes (frontend)
- `/` dashboard (featured stats) | `/events` all events
- `/book/:id` book selected event | `/tickets` check status/download
- `/login`, `/signup`
- Organizer: `/org/events`, `/org/events/add`, `/org/events/:id`, `/org/scanner`

### Flow
1) Organizer logs in, creates events (only future dates allowed).  
2) Customers book events; if approvalMode=auto, ticket is approved instantly with QR/PDF.  
3) Customers can revisit `/tickets` with email to see status/download.  
4) Organizer scans QR at `/org/scanner` to validate entry.

### Notes
- Ensure `JWT_SECRET` is set in backend `.env` for login tokens.
- Update `VITE_API_BASE_URL` if backend runs on a different host/port.

