# Deadline Panic Mode — Frontend (React + Vite + Tailwind)

SPA untuk Deadline Panic Mode. Mengonsumsi Laravel REST API via axios
(bearer token). Dark mode, tema indigo/violet/pink.

## Setup

```bash
npm install
cp .env.example .env   # pastikan VITE_API_URL menunjuk ke backend
npm run dev
```

App berjalan di http://localhost:5173

## Environment

`.env`:

```
VITE_API_URL=http://127.0.0.1:8000/api
```

> Backend Laravel harus berjalan lebih dulu (`php artisan serve` di folder
> `backend`). Origin `http://localhost:5173` sudah di-allow di CORS backend.

## Akun demo

- email: `demo@panic.test`
- password: `password`

Di halaman Landing / Login ada tombol **Login Demo** untuk masuk cepat.

## Struktur

```
src/
  lib/api.js            # axios instance + interceptor token + extractError
  services/tasks.js     # wrapper endpoint task & dashboard
  context/
    AuthContext.jsx     # state user, login/register/logout, simpan token
    ToastContext.jsx    # toast notifikasi
  components/
    ProtectedRoute.jsx  # redirect ke /login bila belum auth
    AppLayout.jsx       # Navbar + container untuk halaman terproteksi
    Navbar, TaskCard, TaskForm, StatCard, StatusBadge, PriorityBadge,
    ProgressBar, EmptyState, LoadingSpinner, ConfirmModal
    ui/ (Button, Input, Select, Textarea)
  pages/
    Landing, Login, Register, Dashboard, Tasks,
    TaskCreate, TaskEdit, TaskDetail, Profile, NotFound
  utils/format.js       # format tanggal, mapping warna status/prioritas
  App.jsx               # routing
  main.jsx              # entry
```

## Routing

| Path                | Halaman      | Akses        |
|---------------------|--------------|--------------|
| `/`                 | Landing      | Publik       |
| `/login`            | Login        | Publik       |
| `/register`         | Register     | Publik       |
| `/dashboard`        | Dashboard    | Login        |
| `/tasks`            | Daftar Tugas | Login        |
| `/tasks/create`     | Tambah Tugas | Login        |
| `/tasks/:id`        | Detail Tugas | Login        |
| `/tasks/:id/edit`   | Edit Tugas   | Login        |
| `/profile`          | Profile      | Login        |
| `*`                 | Not Found    | Publik       |

Token disimpan di `localStorage` (`dpm_token`) dan otomatis dilampirkan
sebagai `Authorization: Bearer <token>` lewat interceptor axios.
