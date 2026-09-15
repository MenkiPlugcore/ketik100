# Ketik100 v1.2 — Adventure Mode

Ketik100 adalah web game belajar mengetik yang ringan, responsif, dan dirancang agar latihan keyboard terasa lebih menyenangkan untuk siswa, termasuk siswa berkebutuhan khusus (ABK).

## Adventure Mode

Versi 1.2 menambahkan progression layer supaya siswa punya alasan untuk kembali bermain tanpa memakai mekanik hukuman.

- Mascot pendamping **Kibo 🤖** dengan feedback positif selama permainan.
- **XP dan Level**: jawaban benar, peti, dan penyelesaian dunia memberikan XP.
- **Peti hadiah setiap 5 jawaban benar**, termasuk pada checkpoint terakhir sebelum permainan selesai.
- Hadiah peti berupa bonus bintang dan XP.
- **Jalur Petualangan** dengan empat dunia:
  - 🌳 Hutan Huruf — Kenal Huruf.
  - 🏡 Desa Kata — Kata Pendek.
  - 🏝️ Pulau Angka — Kenal Angka.
  - 🏰 Kastil Kalimat — Kalimat Mini.
- Semua dunia tetap dapat dipilih agar guru/pendamping dapat menyesuaikan materi dengan kemampuan siswa.
- Status dunia yang telah diselesaikan tersimpan di perangkat.
- Koleksi badge:
  - 🌟 Langkah Pertama.
  - 🔤 Master A–Z.
  - 📚 Penjelajah Kata.
  - 🔢 Sahabat Angka.
  - ✏️ Pahlawan Kalimat.
  - 🔥 Combo 5.
- Progress Adventure tersimpan di `localStorage` tanpa akun atau backend.

## Core Gameplay

- **Kenal Huruf**: satu huruf tampil per ronde, tanpa kewajiban mengetik spasi.
- **Kata Pendek**: satu kata sederhana dan familiar per kartu.
- **Kenal Angka**: satu angka/nomor per ronde, termasuk angka dua digit.
- **Kalimat Mini**: kalimat pendek untuk tahap lanjutan.
- Countdown **3 → 2 → 1 → GO!** sebelum permainan.
- Kartu soal besar dengan visual yang jelas dan minim distraksi.
- Keyboard visual dengan tombol berikutnya yang menyala, termasuk petunjuk tombol spasi.
- Skor, combo, bintang, progress bar, ronde, dan XP sesi.
- Animasi reward, confetti, card success, level up, badge toast, dan chest reward.
- Tidak ada sistem nyawa/game over; jawaban salah dapat dicoba lagi.
- Text-to-Speech Bahasa Indonesia untuk membacakan instruksi/soal.
- Mode Fokus untuk menyembunyikan bagian non-game.
- Best score tersimpan di browser.
- Responsive untuk HP kecil, tablet, laptop, dan desktop.
- Mendukung `prefers-reduced-motion`.

## Prinsip desain ramah ABK

Ketik100 memakai pola **satu target dalam satu waktu**. Pada Hutan Huruf, siswa cukup melihat satu huruf besar, mencari tombol yang sama, lalu menekannya. Jawaban salah tidak mengurangi bintang, XP, atau mengakhiri permainan. Sistem reward hanya dipakai sebagai penguatan positif.

Semua dunia sengaja tidak dikunci secara paksa. Urutan Huruf → Kata → Angka → Kalimat berfungsi sebagai jalur rekomendasi, tetapi guru tetap dapat langsung memilih materi yang sesuai kebutuhan siswa.

## Struktur

```text
ketik100/
├── index.html
├── styles.css
├── app.js
├── favicon.svg
└── README.md
```

Tidak membutuhkan proses build atau dependency JavaScript.

## Menjalankan lokal

Bisa langsung membuka `index.html`, tetapi server lokal lebih disarankan:

```bash
python3 -m http.server 8080
```

Lalu buka `http://localhost:8080`.

## Deploy

Karena seluruh aplikasi statis, Ketik100 dapat dipasang di GitHub Pages, Netlify, Cloudflare Pages, atau hosting statis lainnya.

## Penyimpanan lokal

Adventure Mode memakai key `ketik100-adventure-v12` untuk menyimpan XP, total bintang, jumlah jawaban benar, peti yang dibuka, badge, dan dunia yang telah diselesaikan. Best score per dunia tetap disimpan terpisah.

## Catatan

Speech synthesis bergantung pada dukungan browser dan voice Bahasa Indonesia yang tersedia pada perangkat pengguna.