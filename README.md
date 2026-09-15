# Ketik100

Ketik100 adalah web game belajar mengetik yang ringan, responsif, dan dirancang agar latihan keyboard terasa lebih menyenangkan untuk siswa, termasuk siswa berkebutuhan khusus (ABK).

## Fitur game

- **Kenal Huruf**: satu huruf tampil per ronde, tanpa kewajiban mengetik spasi.
- **Kata Pendek**: satu kata sederhana dan familiar per kartu.
- **Kenal Angka**: satu angka/nomor per ronde.
- **Kalimat Mini**: kalimat pendek untuk tahap lanjutan.
- Countdown **3 → 2 → 1 → GO!** sebelum permainan.
- Kartu soal besar dengan visual yang jelas dan minim distraksi.
- Keyboard visual dengan tombol berikutnya yang menyala.
- Skor, combo, bintang, progress bar, dan ronde.
- Animasi reward, confetti, card success, dan feedback visual.
- Tidak ada sistem nyawa/game over; jawaban salah dapat dicoba lagi.
- Text-to-Speech Bahasa Indonesia untuk membacakan instruksi/soal.
- Mode Fokus untuk menyembunyikan bagian non-game.
- Best score tersimpan di browser melalui `localStorage`.
- Responsive untuk HP kecil, tablet, laptop, dan desktop.
- Mendukung `prefers-reduced-motion`.

## Prinsip desain ABK

Ketik100 memakai pola satu target dalam satu waktu. Pada mode Kenal Huruf, siswa cukup melihat satu huruf besar, mencari tombol yang sama, lalu menekannya. Jawaban salah tidak mengurangi skor atau mengakhiri permainan; aplikasi memberi feedback singkat dan memberi kesempatan mencoba lagi.

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

## Catatan

Speech synthesis bergantung pada dukungan browser dan voice Bahasa Indonesia yang tersedia pada perangkat pengguna.
