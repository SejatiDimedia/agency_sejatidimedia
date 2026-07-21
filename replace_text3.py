import re

with open('src/components/AgencyLanding.tsx', 'r') as f:
    content = f.read()

# Guarantee section
content = content.replace('Jaminan Klien', '{t.guarantee.badge}')
content = content.replace('Kenapa Aman Berinvestasi di Sini?', '{t.guarantee.mainHeading}')
content = content.replace('Setiap kerja sama didasari oleh transparansi, profesionalisme, dan komitmen untuk meminimalkan risiko di pihak Anda.', '{t.guarantee.desc}')
content = content.replace('Revisi Terstruktur', '{t.guarantee.item1Title}')
content = content.replace('Setiap paket sudah mencakup alokasi revisi. Anda tidak akan terjebak dengan hasil akhir yang tidak sesuai ekspektasi.', '{t.guarantee.item1Desc}')
content = content.replace('100% Hak Cipta Anda', '{t.guarantee.item2Title}')
content = content.replace('Source code, desain, dan seluruh aset digital sepenuhnya milik Anda setelah proyek lunas — tanpa lisensi berulang.', '{t.guarantee.item2Desc}')
content = content.replace('Pembayaran Bertahap', '{t.guarantee.item3Title}')
content = content.replace('Pembayaran dilakukan per milestone, sehingga Anda bisa mengevaluasi progress sebelum melanjutkan ke tahap berikutnya secara aman.', '{t.guarantee.item3Desc}')

# Pricing section
content = content.replace('"Transparan"', '{t.pricing.badge}')
content = content.replace('Skala Harga yang Jelas, Sesuai Kebutuhan Anda.', '{t.pricing.mainHeading}')
content = content.replace('Tidak ada biaya tersembunyi. Anda tahu persis apa yang Anda dapatkan sejak hari pertama.', '{t.pricing.desc}')
content = content.replace('"Untuk Validasi Ide"', '{t.pricing.starterLabel}')
content = content.replace('"Starter — MVP Prototype"', '{t.pricing.starterTitle}')
content = content.replace('"Sempurna untuk startup atau bisnis yang ingin memvalidasi ide dengan cepat ke pasar menggunakan aplikasi fungsional."', '{t.pricing.starterDesc}')
content = content.replace('"Mulai dari Rp 5jt"', '{t.pricing.starterPrice}')
content = content.replace('"Estimasi: 2-4 Minggu"', '{t.pricing.starterTime}')
content = content.replace('"Mulai dari Sini"', '{t.pricing.starterBtn}')

content = content.replace('"Untuk Rilis ke Publik"', '{t.pricing.growthLabel}')
content = content.replace('"Growth — Production Ready"', '{t.pricing.growthTitle}')
content = content.replace('"Aplikasi skala penuh dengan arsitektur tangguh, keamanan tingkat lanjut, dan performa optimal untuk menampung ribuan pengguna."', '{t.pricing.growthDesc}')
content = content.replace('"Mulai dari Rp 15jt"', '{t.pricing.growthPrice}')
content = content.replace('"Estimasi: 1-2 Bulan"', '{t.pricing.growthTime}')
content = content.replace('"Diskusikan Proyek Anda"', '{t.pricing.growthBtn}')

content = content.replace('"Enterprise & Sistem Kompleks"', '{t.pricing.customLabel}')
content = content.replace('"Custom Architecture"', '{t.pricing.customTitle}')
content = content.replace('"Sistem berskala besar (ERP, platform multi-tenant, migrasi sistem lama) dengan integrasi kompleks dan kebutuhan keamanan tinggi."', '{t.pricing.customDesc}')
content = content.replace('"Berdasarkan Scope"', '{t.pricing.customPrice}')
content = content.replace('"Fleksibel"', '{t.pricing.customTime}')
content = content.replace('"Ceritakan Kebutuhan Anda"', '{t.pricing.customBtn}')

# Contact section
content = content.replace('Kapasitas Terbatas Setiap Kuartal', '{t.contact.badge}')
content = content.replace('Mari Bangun Sistem yang ', '{t.contact.mainHeading}')
content = content.replace('Benar-Benar Anda Butuhkan', '{t.contact.mainHeadingHighlight}')
content = content.replace('Saya membatasi jumlah proyek yang diterima setiap kuartal agar setiap klien mendapat perhatian penuh — bukan dikerjakan sambil lalu di antara proyek lain.', '{t.contact.desc}')
content = content.replace('Preview Mingguan', '{t.contact.perk1Title}')
content = content.replace('Update progress build langsung ke staging Anda setiap minggu.', '{t.contact.perk1Desc}')
content = content.replace('Komunikasi Langsung', '{t.contact.perk2Title}')
content = content.replace('Akses prioritas via WhatsApp/Telegram untuk respons cepat.', '{t.contact.perk2Desc}')
content = content.replace('Nama Lengkap', '{t.contact.formName}')
content = content.replace('Email', '{t.contact.formEmail}')
content = content.replace('Deskripsi Proyek', '{t.contact.formProject}')
content = content.replace('"Ceritakan sedikit tentang proyek atau masalah yang ingin Anda selesaikan..."', 't.contact.formProjectPlaceholder')
content = content.replace('Kirim Pesan', '{t.contact.formBtn}')

with open('src/components/AgencyLanding.tsx', 'w') as f:
    f.write(content)

