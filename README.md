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
- **Pulau Angka** — angka dan nomor singkat.
- **Kastil Kalimat** — kalimat mini untuk tahap lanjutan.

## Premium UI Pack

Versi terbaru memakai aset visual original Ketik100 melalui `assets/premium-icons.svg`.

Termasuk:

- Logo Ketik100/Kibo mark.
- Maskot Kibo original berbasis SVG.
- Ilustrasi Hutan Huruf, Desa Kata, Pulau Angka, dan Kastil Kalimat.
- Icon Play, Back, Restart, Sound On/Off, Keyboard Help.
- Star, XP Gem, Reward Chest, Badge, Trophy, Check, dan Combo Flame.
- Favicon baru yang mengikuti identitas visual Ketik100.
- Card, tombol, progress panel, modal reward, dan HUD game dengan tampilan premium.
- Responsive untuk HP kecil, tablet, laptop, dan desktop.
- `prefers-reduced-motion` tetap didukung.

Seluruh visual utama disimpan di repository sendiri sehingga tidak membutuhkan icon CDN eksternal.

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

## Prinsip desain ABK

Ketik100 memakai pola satu target dalam satu waktu. Jawaban salah tidak mengurangi skor atau mengakhiri permainan. Feedback dibuat singkat dan siswa diberi kesempatan mencoba kembali.

Dunia latihan juga tidak dikunci agar guru atau pendamping dapat memilih aktivitas berdasarkan kemampuan siswa, bukan berdasarkan urutan game.

## Struktur

```text
ketik100/
├── assets/
│   └── premium-icons.svg
├── index.html
├── home.css
├── home.js
├── game.html
├── game.css
├── game.js
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
