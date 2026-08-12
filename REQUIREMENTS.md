# Shoe Slideshow — Requirements

## Tujuan
Web layar sentuh untuk tablet Android besar. Operator memilih model sepatu, lalu proses oven, dan melihat foto instruksi dalam slideshow.

## Sumber foto
- Google Drive folder root: `1ryc3nuSlhlVXJ7TbrW3l1gipgU0gvlEp`
- Struktur: `Root / Model / Oven / Foto`
- Folder/file Drive harus dapat dibaca oleh siapa saja dengan link.
- Urutan foto mengikuti nama file secara alfabetis. Gunakan prefix seperti `01-...jpg`, `02-...jpg`.

## Alur operator
1. Pilih model.
2. Pilih proses (Oven 1–4 atau folder proses lain yang tersedia).
3. Slideshow foto otomatis berjalan setiap 5 detik.
4. Tap foto/area slideshow sekali untuk pause, tap lagi untuk melanjutkan.
5. Tombol kembali memungkinkan operator memilih proses atau model lain.

## UI
- Optimasi landscape tablet Android dan target sentuh minimum 56px.
- Dark navy/black dengan aksen oranye; font Plus Jakarta Sans.
- Slideshow memakai gambar selebar layar, indikator nomor slide dan status pause/play.
- Pesan empty state bila folder proses kosong atau gagal dimuat.
- Tombol layar penuh tersedia jika browser mendukung.
- Wake Lock dicoba selama slideshow untuk menjaga layar tetap menyala, bila browser mendukung.

## Arsitektur & keamanan
- Next.js App Router untuk deploy Vercel.
- Endpoint server `/api/catalog` memakai Google Drive API dengan environment variable `GOOGLE_DRIVE_API_KEY` dan `GOOGLE_DRIVE_ROOT_FOLDER_ID`.
- API key tidak pernah dikirim ke browser atau disimpan di GitHub.
- Deployment diakses oleh siapa saja yang memiliki URL Vercel.

## Bukan cakupan versi pertama
- Halaman upload/admin dan pengaturan urutan manual.
- Autentikasi operator.
