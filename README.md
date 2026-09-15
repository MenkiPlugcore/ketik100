# Ketik100

Ketik100 adalah web game belajar mengetik yang ringan, responsif, dan dirancang agar latihan keyboard terasa menyenangkan untuk siswa, termasuk siswa berkebutuhan khusus (ABK).

## Adventure Mode v1.2

Alur utama sekarang dibuat seperti aplikasi/game:

```text
Adventure Map / Beranda
        ↓
Pilih Dunia
        ↓
Halaman Game Khusus
        ↓
Hasil Permainan
   ↙           ↘
Main Lagi   Pilih Dunia
```

Siswa tidak perlu scroll dari kartu pilihan menuju section permainan. Setiap dunia membuka `game.html` dengan mode masing-masing:

- `game.html?mode=huruf` — 🌳 Hutan Huruf
- `game.html?mode=kata` — 🏡 Desa Kata
- `game.html?mode=angka` — 🏝️ Pulau Angka
- `game.html?mode=kalimat` — 🏰 Kastil Kalimat

Jika parameter mode tidak valid, game otomatis memakai mode `huruf`.

## Fitur

- **Kenal Huruf**: satu huruf tampil per ronde tanpa mengetik spasi.
- **Kata Pendek**: satu kata sederhana per kartu.
- **Kenal Angka**: satu angka/nomor per ronde.
- **Kalimat Mini**: kalimat pendek untuk tahap lanjutan.
- Countdown **3 → 2 → 1 → GO!**.
- Kartu soal besar dan fokus pada satu target.
- Keyboard visual dengan tombol berikutnya yang menyala.
- Mascot **Kibo** dengan feedback positif.
- Skor, combo, bintang, XP, level, dan progress bar.
- Peti hadiah setiap 5 jawaban benar.
- Badge milestone.
- Confetti dan animasi reward.
- Text-to-Speech Bahasa Indonesia.
- Tidak ada sistem nyawa atau game over; jawaban salah dapat dicoba lagi.
- Progres Adventure tersimpan melalui `localStorage` dengan key `ketik100-adventure-v12`.
- Responsive untuk HP kecil, tablet, laptop, dan desktop.
- Mendukung `prefers-reduced-motion`.

## Struktur halaman

```text
ketik100/
├── index.html      # Adventure Map / pilih dunia
├── home.css        # Tampilan beranda
├── home.js         # Profil, XP, badge, status dunia
├── game.html       # Halaman gameplay khusus
├── game.css        # Tampilan gameplay
├── game.js         # Engine game semua mode
├── favicon.svg
└── README.md
```

File `game.html` digunakan oleh semua dunia agar maintenance tetap sederhana. Mode permainan dipilih melalui query parameter `mode`.

## Prinsip desain ABK

- Satu target utama dalam satu waktu.
- Instruksi singkat dan konsisten.
- Tombol besar dan kontras jelas.
- Kesalahan tidak menghapus progres.
- Tidak memakai hukuman atau game over.
- Guru tetap bebas memilih dunia tanpa sistem penguncian.
- Animasi dapat dikurangi otomatis melalui preferensi reduced motion perangkat.

## Menjalankan lokal

Tidak membutuhkan build atau dependency JavaScript.

```bash
python3 -m http.server 8080
```

Buka:

```text
http://localhost:8080
```

## Deploy

Ketik100 adalah web statis dan dapat dipasang di GitHub Pages, Netlify, Cloudflare Pages, atau hosting statis lainnya.
