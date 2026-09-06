# GO! Track Express

Monorepo for the GO! Track Express courier tracking app: a Node/Express +
MongoDB backend, a React admin console, and an Expo (React Native) mobile app.

- **App**: GO! Track Express
- **Managing Director**: Mr Amaresh Kumar
- **CIN**: U53200DL2025PTC457332
- **Registered Office**: Shop No-G-3, P. No. 12, Suneja Tower-II, District
  Center, Janakpuri A-3, West Delhi, New Delhi, Delhi, 110058

## Structure

```
go-track-express/
├── backend/   Node/Express + MongoDB API (JavaScript, no TypeScript)
├── admin/     React + Vite admin console (JWT auth, role-based)
├── mobile/    Expo Router mobile app (JavaScript, no auth/login)
└── README.md
```

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed     # seeds demo services/products/CMS/contact areas + admin user
npm run dev       # starts on http://localhost:4000
```

Requires a running MongoDB (`DATABASE_URL` in `.env`). Redis and Firebase are
optional — the app runs fully in demo mode without them (tracking, caching,
and push notifications all degrade gracefully to safe no-ops/logs).

Default seeded admin login (**change immediately**):
- Email: `admin@example.com`
- Password: `ChangeMe123!`

Demo AWB numbers to try tracking (no real courier credentials needed):
`GO123456789`, `GO987654321`, `GO555555555`.

### 2. Admin console

```bash
cd admin
cp .env.example .env   # point VITE_API_BASE_URL at the backend
npm install
npm run dev             # http://localhost:5173
```

### 3. Mobile app

```bash
cd mobile
cp .env.example .env   # point EXPO_PUBLIC_API_BASE_URL at the backend
npm install
npm run start
```

## Swapping in a real AWB tracking provider

The backend ships with a pluggable `TrackingProvider` interface. Set
`TRACKING_PROVIDER=awb` plus `AWB_API_URL` / `AWB_API_KEY` in `backend/.env`
to switch from the built-in `DemoTrackingProvider` to the real `AWBProvider` —
no mobile or admin changes required.

## Notes

- Mobile has no authentication anywhere — it opens straight to Home and stays
  fully anonymous; only the backend admin API is protected by JWT with roles
  (SUPER_ADMIN / ADMIN / CONTENT_MANAGER / SUPPORT).
- No secrets ship in the mobile bundle — only `EXPO_PUBLIC_*` vars are used
  client-side.
- No hardcoded external URLs, phone numbers, or CMS copy exist in mobile
  code — everything is backend-driven, with `https://example.com` used as a
  placeholder anywhere a real URL hasn't been supplied yet.
