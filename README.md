# Ketik100

Ketik100 adalah web latihan mengetik ringan dan responsif yang dirancang untuk membantu siswa belajar menggunakan keyboard secara bertahap, termasuk siswa berkebutuhan khusus (ABK).

## Fitur v1.0

- Latihan **Kenal Huruf**, **Kata Pendek**, **Kalimat**, dan **Angka**.
- Koreksi karakter langsung: benar ditandai hijau, salah ditandai merah.
- Bantuan visual keyboard untuk menunjukkan tombol berikutnya.
- Statistik ketepatan, kecepatan/WPM, karakter benar, dan progres sesi.
- **Mode Fokus** untuk mengurangi distraksi visual.
- **Text-to-Speech Bahasa Indonesia** melalui fitur bawaan browser.
- Pilihan ukuran teks: Normal, Besar, dan Sangat Besar.
- Tombol dan area interaksi dibuat besar untuk layar sentuh.
- Responsive untuk HP, tablet, laptop, dan desktop.
- Mendukung `prefers-reduced-motion`.
- Progress/preferensi lokal disimpan di perangkat melalui `localStorage`.
- Tidak membutuhkan database atau backend.

## Struktur

```text
ketik100/
├── index.html
├── styles.css
├── app.js
├── favicon.svg
└── README.md
```

## Menjalankan secara lokal

Karena aplikasi ini statis, dapat dibuka langsung melalui `index.html`. Untuk pengembangan disarankan menggunakan local server, misalnya:

```bash
python3 -m http.server 8080
```

Kemudian buka `http://localhost:8080`.

## Deploy

### GitHub Pages

1. Buka repository **Settings → Pages**.
2. Pada **Build and deployment**, pilih **Deploy from a branch**.
3. Pilih branch `main` dan folder `/ (root)`.
4. Simpan.

### Netlify

Hubungkan repository ini ke Netlify. Tidak ada build command yang diperlukan dan publish directory adalah root repository (`.`).

## Prinsip UX untuk siswa ABK

Ketik100 memakai latihan pendek, satu tugas utama per layar, instruksi sederhana, feedback positif, teks yang dapat diperbesar, dukungan suara, dan mode fokus. Aplikasi tidak memaksa siswa mengejar WPM tertentu; kecepatan hanya ditampilkan sebagai informasi.

## Roadmap yang disarankan

- Profil siswa lokal/guru.
- Level latihan berdasarkan kemampuan individual.
- Latihan nama sendiri, biodata, kosakata sekolah, dan aktivitas sehari-hari.
- Mode satu huruf besar di layar untuk tahap awal.
- Rekap hasil latihan per siswa.
- Import materi latihan buatan guru.
- Mode gambar → ketik nama benda.
- PWA/offline mode.
- Dashboard guru dengan Supabase jika nantinya membutuhkan sinkronisasi antar perangkat.

---

**Ketik100** — belajar mengetik dengan cara yang lebih ramah.
