# Shoe Slideshow

Web slideshow instruksi proses sepatu untuk tablet Android, deploy di Vercel dan mengambil daftar folder/foto dari Google Drive.

## Struktur Google Drive

```text
Root folder
├── Revel 9
│   ├── Oven 1
│   │   ├── 01-Pemanasan.jpg
│   │   └── 02-Proses.jpg
│   └── Oven 2
├── Launch 12
└── Anthem 8
```

- Nama folder model dan proses otomatis menjadi pilihan operator.
- Hanya gambar yang ditampilkan dalam slideshow.
- Foto diurutkan berdasarkan nama file secara natural (`02.jpg` sebelum `10.jpg`).
- Folder/file harus dapat dibaca publik melalui link Google Drive.

## Environment Variable Vercel

| Name | Value |
| --- | --- |
| `GOOGLE_DRIVE_API_KEY` | API key yang dibatasi untuk Google Drive API |
| `GOOGLE_DRIVE_ROOT_FOLDER_ID` | ID folder root Google Drive |

Tambahkan keduanya pada **Production, Preview, dan Development**. API key hanya dipakai server endpoint `/api/catalog`; tidak dikirimkan ke browser atau disimpan dalam repository.

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Verifikasi

```bash
npm test
npm run build
```

## Penggunaan tablet

1. Buka URL Vercel di Chrome Android.
2. Pilih model, lalu proses.
3. Tap foto untuk pause atau lanjutkan slideshow.
4. Gunakan tombol `⛶` untuk mode layar penuh.

Interval slideshow adalah 5 detik. Browser yang mendukung Wake Lock akan berusaha menjaga layar tablet tetap menyala selama berada pada layar slideshow.
