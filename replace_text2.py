import re

with open('src/components/AgencyLanding.tsx', 'r') as f:
    content = f.read()

# Fix FEATURE_ITEMS to be inside the component so it can use `t`
# We will just replace the usage of FEATURE_ITEMS inline or redefine it inside.
# Since it's a constant array, let's find where it's used and replace it.

content = content.replace('"Dari ide hingga production. Saya menangani seluruh siklus pengembangan."', '{t.services.mainHeading}')
content = content.replace('Setiap proyek dimulai dari kebutuhan bisnis Anda, bukan dari template siap pakai. Arsitektur, keamanan, dan performa dirancang agar sistem tetap relevan seiring bisnis Anda berkembang.', '{t.services.desc}')
content = content.replace('"Web App & SaaS Development"', '{t.services.items[0].title}')
content = content.replace('"Membangun aplikasi web kompleks seperti dashboard admin, CRM, dan platform SaaS (Software as a Service) yang interaktif dan scalable."', '{t.services.items[0].desc}')
content = content.replace('"Mobile App Development"', '{t.services.items[1].title}')
content = content.replace('"Pembuatan aplikasi mobile native/hybrid (iOS & Android) yang terintegrasi langsung dengan ekosistem sistem backend Anda."', '{t.services.items[1].desc}')
content = content.replace('"Backend & API Architecture"', '{t.services.items[2].title}')
content = content.replace('"Merancang arsitektur database, RESTful API, dan mikrolayanan yang kuat untuk mendukung jutaan transaksi secara aman."', '{t.services.items[2].desc}')
content = content.replace('"Sistem Integrasi & Otomasi"', '{t.services.items[3].title}')
content = content.replace('"Menghubungkan berbagai sistem pihak ketiga (Payment Gateway, ERP, CRM) untuk mengotomatisasi alur kerja bisnis Anda."', '{t.services.items[3].desc}')

content = content.replace('"Teknologi"', '{t.tech.badge}')
content = content.replace('Dibangun dengan', '{t.tech.mainHeading}')
content = content.replace('Teknologi Modern', '{t.tech.mainHeadingHighlight}')
content = content.replace('"Frontend"', '{t.tech.frontend}')
content = content.replace('"Untuk antarmuka yang cepat, responsif, dan interaktif."', '{t.tech.frontendDesc}')
content = content.replace('"Backend & API"', '{t.tech.backend}')
content = content.replace('"Logika bisnis & manajemen server."', '{t.tech.backendDesc}')
content = content.replace('"Database"', '{t.tech.database}')
content = content.replace('"Penyimpanan terstruktur & ORM."', '{t.tech.databaseDesc}')
content = content.replace('"Mobile"', '{t.tech.mobile}')
content = content.replace('"Aplikasi iOS & Android native/hybrid."', '{t.tech.mobileDesc}')
content = content.replace('"Infrastructure"', '{t.tech.infra}')
content = content.replace('"Virtualisasi & integrasi cloud."', '{t.tech.infraDesc}')
content = content.replace('"Integrasi Pihak Ketiga"', '{t.tech.integration}')
content = content.replace('"Penghubungan dengan layanan eksternal untuk modul pembayaran aman, autentikasi terpusat, dan layanan berbasis API lainnya."', '{t.tech.integrationDesc}')

with open('src/components/AgencyLanding.tsx', 'w') as f:
    f.write(content)

