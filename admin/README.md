# GO! Track Express — Admin Console

React + Vite admin panel for managing services, products, CMS content, contact
areas, shipments, notifications and admin users for the GO! Track Express app.

## Setup

```bash
cp .env.example .env
# edit .env: VITE_API_BASE_URL should point at the backend, e.g. http://localhost:4000/api
npm install
npm run dev
```

Default seeded admin login (change immediately in production):

- Email: `admin@example.com`
- Password: `ChangeMe123!`

## Build

```bash
npm run build
npm run preview
```

## Roles

- **SUPER_ADMIN** — full access, including managing other admin users
- **ADMIN** — manage services/products/CMS/contact areas/app config
- **CONTENT_MANAGER** — manage services/products/CMS only
- **SUPPORT** — view shipments, notification logs, and manage contact submissions
