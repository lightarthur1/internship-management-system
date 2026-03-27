# IMS Launch Checklist

## 1) Environment and Startup

### Backend
- File: `backend/.env`
- Required:
  - `MONGO_URI=<your_mongodb_connection_string>`
  - `JWT_SECRET=<your_secret>`
  - `PORT=5000` (optional)

Commands:
```bash
cd backend
npm install
npm run dev
```

Expected checks:
- API health: `GET http://localhost:5000/api/health`
- Console includes DB connect + server started logs.

### Frontend
- File: `.env`
- Required:
  - `VITE_API_BASE_URL=http://localhost:5000/api`

Commands:
```bash
npm install
npm run dev
```

Optional production check:
```bash
npm run build
npm run preview
```

---

## 2) Core API Surface (Quick Reference)

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### User profile
- `GET /api/users/me`
- `PATCH /api/users/me/profile`

### Student
- `PATCH /api/student/me/internship/start`
- `POST /api/student/me/logs`
- `GET /api/student/me/logs`
- `GET /api/student/me/workplace-reports`

### Academic supervisor
- `GET /api/academic/me/students`
- `GET /api/academic/students/:studentId/logs`
- `PATCH /api/academic/logs/:logId/review`
- `GET /api/academic/students/:studentId/workplace-reports`

### Workplace supervisor
- `GET /api/workplace/me/students`
- `POST /api/workplace/reports`
- `GET /api/workplace/reports`

### Admin
- `GET /api/admin/academic-supervisors`
- `GET /api/admin/students`
- `PATCH /api/admin/students/:studentId/academic-supervisor`

### Opportunities and letters
- `GET /api/opportunities`
- `POST /api/opportunities` (admin)
- `PATCH /api/opportunities/:id` (admin)
- `DELETE /api/opportunities/:id` (admin)
- `POST /api/letters/request` (student)
- `GET /api/letters/mine` (student)
- `GET /api/letters/admin/all` (admin)
- `PATCH /api/letters/admin/:id/status` (admin)

---

## 3) End-to-End QA Script (Demo Ready)

### Student flow
1. Log in as student.
2. Complete/edit profile (student ID, department, level, phone, location, company).
3. Start internship with workplace supervisor details.
4. Submit a report in Reports page.
5. Confirm new report appears in Previous Reports.

### Workplace supervisor flow
1. Log in as workplace supervisor.
2. Confirm assigned students are visible.
3. Click Write Report for one student.
4. Fill period, rating, summary, recommendation and submit.
5. Confirm report appears under Recent Submitted Reports.

### Academic supervisor flow
1. Log in as academic supervisor.
2. Confirm assigned students list/stats load.
3. Open View Reports for a student.
4. Type feedback in textarea and Save/Approve/Request Update.
5. Refresh and confirm feedback/status persistence.

### Admin flow
1. Log in as admin.
2. Verify dashboard stat cards load.
3. Open each quick action page:
   - Manage Opportunities
   - Approve Letters
   - Assign Supervisors
4. Perform one real update and confirm dashboard reflects it.

---

## 4) Role Access Sanity Checks

- Student cannot open admin/academic/workplace dashboards.
- Workplace cannot access admin/academic pages.
- Academic cannot access admin/workplace pages.
- Admin can access admin routes only.

---

## 5) Release Gate (Ship/No-Ship)

Ship when all are true:
- Backend starts without runtime errors.
- Frontend build passes.
- All 4 role flows pass QA script.
- Data persists after refresh and re-login.
- No console errors blocking critical actions.

No-Ship if any of these fail.

---

## 6) Quick Troubleshooting

- If frontend cannot reach backend:
  - Verify `.env` has correct `VITE_API_BASE_URL`.
  - Verify backend is running and `/api/health` returns `ok`.

- If role data looks empty:
  - Confirm the logged-in user role matches route expectations.
  - Re-check assignments (admin assigns academic; student start internship assigns workplace linkage).

- If dashboard appears but actions fail:
  - Re-login to refresh token.
  - Check browser network response body for API message.
