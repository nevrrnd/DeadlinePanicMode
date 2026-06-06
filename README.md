# Deadline Panic Mode

Full stack app manajemen deadline tugas.

- Frontend: React + Vite + Tailwind (`frontend/`)
- Backend: Laravel REST API (`backend/`)
- Auth: Laravel Sanctum Bearer token
- Production DB: Supabase PostgreSQL

## Local Setup

Backend:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Local frontend env:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

## Supabase PostgreSQL

Ambil credential dari Supabase:

1. Buka Supabase Dashboard.
2. Pilih project.
3. Masuk ke `Project Settings` -> `Database`.
4. Ambil host, database, username, password, dan port dari connection info.
5. Untuk migrate, gunakan koneksi direct/session pooler port `5432`.

Isi `backend/.env` dengan format ini:

```env
DB_CONNECTION=pgsql
DB_HOST=your-supabase-host
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-password
DB_SSLMODE=require
DB_SEARCH_PATH=public
```

Untuk migrate ke Supabase:

```bash
cd backend
php artisan migrate
```

Jangan jalankan `migrate:fresh` atau `db:wipe` ke database production kecuali memang ingin menghapus data.

Test setelah pindah database:

```bash
php artisan route:list --path=api
php artisan serve
```

Lalu login dari frontend dengan akun yang sudah ada di database Supabase.
Jika database Supabase masih kosong, jalankan seeder hanya jika memang ingin membuat akun demo:

```bash
php artisan db:seed
```

## Backend Production Env

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-backend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

Laravel production commands:

```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Health check:

```http
GET /api/health
```

Expected response:

```json
{ "status": "ok", "app": "Deadline Panic Mode" }
```

## Frontend Production Env

```env
VITE_API_URL=https://your-backend-domain.com/api
```

Build:

```bash
cd frontend
npm install
npm run build
```

Deploy `frontend/dist` to Vercel/Netlify, or set the project root to `frontend` and build command to `npm run build`.

## Deleted Task Purge

Deleted tasks use soft delete and can be restored for 7 days.

Manual purge:

```bash
cd backend
php artisan tasks:purge-deleted
```

On Railway/Render/VPS, run that command daily through scheduler/cron if needed.

## API Notes

- Login: `POST /api/login`
- Protected requests: `Authorization: Bearer <token>`
- No Sanctum cookie SPA flow
- Do not call `/sanctum/csrf-cookie`
- CORS is controlled by `FRONTEND_URL` / `CORS_ALLOWED_ORIGINS`
