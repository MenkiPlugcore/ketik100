# Ketik100

Ketik100 adalah web game belajar mengetik yang ringan, responsif, dan dirancang agar latihan keyboard terasa lebih menyenangkan untuk siswa, termasuk siswa berkebutuhan khusus (ABK).

## Adventure Mode

Alur utama dibuat multi-page agar siswa tidak perlu scroll panjang:

```text
Adventure Map → pilih dunia → halaman game khusus → hasil → main lagi / pilih dunia lain
```

Mode tersedia:

- **Hutan Huruf** — satu huruf per ronde.
- **Desa Kata** — satu kata sederhana per kartu.
- **Taman Gambar / Picture Quest** — lihat ilustrasi lalu ketik nama gambar.
- **Pulau Angka** — angka dan nomor singkat.
- **Kastil Kalimat** — kalimat mini untuk tahap lanjutan.

## v1.3 — Picture Quest

Picture Quest menambahkan pembelajaran berbasis visual untuk siswa yang lebih mudah memahami benda melalui gambar.

- 10 ilustrasi SVG premium: apel, kucing, mobil, buku, rumah, ikan, bola, pensil, bunga, dan matahari.
- Gambar tampil besar di kartu soal tanpa menampilkan jawabannya.
- Siswa mengetik nama gambar dengan keyboard helper yang tetap aktif.
- Tombol **Bacakan** dapat menyebut nama gambar bila siswa membutuhkan dukungan auditori.
- Tetap memakai skor, combo, bintang, XP, level, peti hadiah, dan reward positif.
- Badge baru **Jago Gambar** setelah menyelesaikan Taman Gambar.
- Tidak ada game over atau pengurangan skor saat siswa salah.
- Semua progres tetap kompatibel dengan data Adventure Mode sebelumnya.

## Premium UI Pack

Visual utama Ketik100 memakai aset original melalui:

- `assets/premium-icons.svg` — Kibo, logo, 4 dunia lama, tombol, reward, badge, dan HUD icons.
- `assets/picture-quest.svg` — dunia Taman Gambar dan ilustrasi Picture Quest.

Seluruh visual disimpan di repository sendiri sehingga tidak membutuhkan icon CDN eksternal.

## Fitur game

- Countdown **3 → 2 → 1 → GO!** sebelum permainan.
- Kartu soal besar dengan visual jelas dan minim distraksi.
- Keyboard visual dengan tombol berikutnya yang menyala.
- Skor, combo, bintang, XP, level, progress bar, dan ronde.
- Peti hadiah setiap lima jawaban benar.
- Badge milestone dan best score.
- Animasi reward, confetti, card success, dan feedback visual.
- Tidak ada sistem nyawa/game over; jawaban salah dapat dicoba lagi.
- Text-to-Speech Bahasa Indonesia.
- Progres tersimpan di browser melalui `localStorage`.
- Responsive untuk HP kecil, tablet, laptop, dan desktop.
- `prefers-reduced-motion` tetap didukung.

## Prinsip desain ABK

Ketik100 memakai pola satu target dalam satu waktu. Jawaban salah tidak mengurangi skor atau mengakhiri permainan. Feedback dibuat singkat dan siswa diberi kesempatan mencoba kembali.

Pada Picture Quest, suara jawaban tidak diputar otomatis agar siswa tetap mencoba mengenali gambar terlebih dahulu. Dukungan auditori tersedia melalui tombol **Bacakan** bila diperlukan.

Dunia latihan tidak dikunci agar guru atau pendamping dapat memilih aktivitas berdasarkan kemampuan siswa, bukan berdasarkan urutan game.

## Struktur

```text
ketik100/
├── assets/
│   ├── premium-icons.svg
│   └── picture-quest.svg
├── index.html
├── home.css
├── home.js
├── game.html
├── game.css
├── game-v13.js
├── v13.css
├── favicon.svg
└── README.md
```

Tidak membutuhkan proses build atau dependency JavaScript.

## Menjalankan lokal

```bash
python3 -m http.server 8080
```

Lalu buka `http://localhost:8080`.

## Deploy

Ketik100 dapat dipasang di GitHub Pages, Netlify, Cloudflare Pages, atau hosting statis lainnya.

## Catatan

Speech synthesis bergantung pada dukungan browser dan voice Bahasa Indonesia yang tersedia pada perangkat pengguna.
