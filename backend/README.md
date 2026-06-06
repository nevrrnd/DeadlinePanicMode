# Deadline Panic Mode — Backend (Laravel REST API)

REST API untuk aplikasi manajemen deadline tugas mahasiswa. Auth memakai
Laravel Sanctum (bearer token), database PostgreSQL (Supabase).

## Setup cepat

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

API berjalan di http://localhost:8000

> Secara default `.env` memakai `DB_CONNECTION=sqlite` agar bisa langsung jalan.
> Untuk Supabase, ubah blok `DB_*` di `.env` sesuai `.env.example`
> (lihat komentar di sana untuk lokasi tiap kredensial di Supabase Dashboard).

## Supabase PostgreSQL

Ambil credential dari Supabase Dashboard:

1. `Project Settings` -> `Database`
2. Gunakan connection info direct/session pooler untuk migrasi
3. Isi `backend/.env`:

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

Migrate ke Supabase:

```bash
php artisan migrate
```

Jangan jalankan `migrate:fresh` atau `db:wipe` ke database production kecuali memang ingin menghapus data.

Test setelah pindah database:

```bash
php artisan route:list --path=api
php artisan serve
```

Lalu login dari frontend. Jika database Supabase masih kosong dan butuh akun demo, jalankan:

```bash
php artisan db:seed
```

## Akun demo

- email: `demo@panic.test`
- password: `password`

## Endpoint

| Method | Endpoint                       | Auth | Keterangan                         |
|--------|--------------------------------|------|------------------------------------|
| POST   | `/api/register`                | -    | Daftar user baru                   |
| POST   | `/api/login`                   | -    | Login, balas token                 |
| POST   | `/api/logout`                  | ✓    | Revoke token aktif                 |
| GET    | `/api/user`                    | ✓    | User yang sedang login             |
| GET    | `/api/dashboard`               | ✓    | Ringkasan statistik                |
| GET    | `/api/tasks`                   | ✓    | List tugas (+filter, sort, search) |
| POST   | `/api/tasks`                   | ✓    | Tambah tugas                       |
| GET    | `/api/tasks/{task}`            | ✓    | Detail tugas                       |
| PUT    | `/api/tasks/{task}`            | ✓    | Edit tugas                         |
| DELETE | `/api/tasks/{task}`            | ✓    | Hapus tugas                        |
| PATCH  | `/api/tasks/{task}/toggle-done`| ✓    | Tandai selesai / belum             |

### Query params untuk `GET /api/tasks`

- `status`: `all|belum|selesai|santai|bahaya|panik|darurat|tamat`
- `priority`: `low|medium|high`
- `course`: nama mata kuliah (exact)
- `search`: kata kunci judul/mata kuliah/deskripsi
- `sort`: `deadline_asc|deadline_desc|newest|progress_desc`

## Status deadline otomatis (tidak disimpan di DB)

Dihitung dari `deadline` & `is_done` di `App\Models\Task::statusKey()`:

- `selesai` — `is_done = true` atau `progress = 100`
- `tamat`   — deadline sudah lewat
- `darurat` — sisa <= 24 jam
- `panik`   — sisa <= 3 hari
- `bahaya`  — sisa <= 7 hari
- `santai`  — sisa > 7 hari

Setiap response task berisi computed field: `status_key`, `status_label`,
`status_color`, `remaining_hours`, `remaining_days`, `remaining_time_text`.

## Restore dan purge task terhapus

Task yang dihapus memakai soft delete dan bisa di-restore maksimal 7 hari lewat:

```bash
POST /api/tasks/{id}/restore
```

Untuk menghapus permanen task soft deleted yang sudah lewat 7 hari, jalankan:

```bash
php artisan tasks:purge-deleted
```

## Deploy Backend

Rekomendasi: Railway untuk backend Laravel API ini karena setup PHP app, env, dan port lebih sederhana.

Build command:

```bash
composer install --no-dev --optimize-autoloader
```

Start command:

```bash
php artisan serve --host=0.0.0.0 --port=$PORT
```

Production commands setelah env terisi:

```bash
php artisan key:generate --force
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Health check:

```http
GET /api/health
```
