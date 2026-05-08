# POBSI Sulawesi Tengah — Website Resmi

Website resmi **Persatuan Olahraga Biliar Seluruh Indonesia (POBSI)** Provinsi Sulawesi Tengah.

---

## ✨ Fitur

| Halaman | Fitur |
|---------|-------|
| **Beranda** | Hero slideshow (foto bisa dikelola via CRUD), statistik, profil, menu cepat |
| **Struktur Organisasi** | Bagan visual, grid card, tabel — CRUD pengurus (tanpa foto) |
| **Data Atlet** | Tabel + kartu mobile, CRUD lengkap + upload foto |
| **Kalender Kejuaraan** | Timeline, filter status, CRUD kejuaraan |
| **Berita** | Grid berita, upload foto, publish/draft, halaman detail |

---

## ⚙️ Instalasi

```bash
# 1. Install dependencies
npm install

# 2. Konfigurasi Supabase
# Edit: src/environments/environment.ts
# Isi supabaseUrl dan supabaseKey dari https://supabase.com

# 3. Jalankan
npm start
# Buka: http://localhost:4200
```

---

## 🗃️ SQL Schema — Jalankan di Supabase SQL Editor

```sql
-- ─── ATHLETES ───────────────────────────────────
CREATE TABLE athletes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  nik         TEXT NOT NULL,
  birth_date  DATE NOT NULL,
  birth_place TEXT NOT NULL DEFAULT '',
  gender      TEXT NOT NULL CHECK (gender IN ('Laki-laki','Perempuan')),
  category    TEXT NOT NULL DEFAULT '',
  club        TEXT NOT NULL DEFAULT '',
  address     TEXT DEFAULT '',
  phone       TEXT DEFAULT '',
  photo_url   TEXT,
  status      TEXT NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif','Tidak Aktif')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CHAMPIONSHIPS ──────────────────────────────
CREATE TABLE championships (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title                 TEXT NOT NULL,
  description           TEXT DEFAULT '',
  date_start            DATE NOT NULL,
  date_end              DATE NOT NULL,
  location              TEXT NOT NULL,
  category              TEXT NOT NULL DEFAULT '',
  organizer             TEXT DEFAULT '',
  status                TEXT NOT NULL DEFAULT 'Akan Datang'
                          CHECK (status IN ('Akan Datang','Berlangsung','Selesai','Dibatalkan')),
  registration_deadline DATE,
  contact               TEXT DEFAULT '',
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ─── NEWS ───────────────────────────────────────
CREATE TABLE news (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title      TEXT NOT NULL,
  content    TEXT NOT NULL,
  summary    TEXT NOT NULL DEFAULT '',
  photo_url  TEXT,
  author     TEXT NOT NULL DEFAULT '',
  category   TEXT NOT NULL DEFAULT 'Umum',
  published  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ORG MEMBERS (tanpa foto) ───────────────────
CREATE TABLE org_members (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  position   TEXT NOT NULL,
  division   TEXT NOT NULL DEFAULT 'Pimpinan',
  level      INTEGER NOT NULL DEFAULT 2,
  phone      TEXT DEFAULT '',
  email      TEXT DEFAULT '',
  period     TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 1,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── HERO SLIDES (foto beranda) ─────────────────
CREATE TABLE hero_slides (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title      TEXT DEFAULT '',
  subtitle   TEXT DEFAULT '',
  photo_url  TEXT,
  sort_order INTEGER NOT NULL DEFAULT 1,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SITE SETTINGS ──────────────────────────────
CREATE TABLE site_settings (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key        TEXT UNIQUE NOT NULL,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ROW LEVEL SECURITY ─────────────────────────
ALTER TABLE athletes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE championships ENABLE ROW LEVEL SECURITY;
ALTER TABLE news          ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members   ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides   ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON athletes      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON championships FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON news          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON org_members   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON hero_slides   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON site_settings FOR ALL USING (true) WITH CHECK (true);
```

---

## 🪣 Storage Bucket (untuk upload foto)

1. Masuk ke **Supabase → Storage → New Bucket**
2. Nama: `pobsi-photos` — centang **Public**
3. Tambahkan policy: **Allow all** untuk INSERT, SELECT, UPDATE, DELETE

---

## 📁 Struktur Proyek

```
src/app/
├── models/index.ts                       ← Semua interface
├── services/
│   ├── supabase.service.ts               ← Supabase client + storage
│   ├── athlete.service.ts
│   ├── championship.service.ts
│   ├── news.service.ts
│   ├── organization.service.ts
│   ├── site-settings.service.ts          ← Hero slides + site config
│   └── toast.service.ts
└── pages/
    ├── home/                             ← Beranda + hero slideshow CRUD
    ├── organization/                     ← Struktur organisasi (bagan/grid/tabel)
    ├── athletes/                         ← Data atlet
    ├── calendar/                         ← Kalender kejuaraan
    └── news/                             ← Berita list + detail
```

---

## 🎨 Branding

- **Merah**: `#C41E3A` · **Kuning**: `#FFD700`
- **Font Heading**: Oswald · **Font Body**: Source Sans 3
