with open('src/components/AgencyLanding.tsx', 'r') as f:
    content = f.read()

# 1. Hero Subtitle
content = content.replace(
    'Setiap baris kode dirancang untuk stabilitas, kecepatan, dan pertumbuhan bisnis Anda secara jangka panjang.',
    '{t.hero.subtitle}'
)

# 2. Hero Buttons
content = content.replace(
    '<span>Diskusikan Proyek Anda</span>',
    '<span>{t.hero.btnPrimary}</span>'
)
content = content.replace(
    '<span>Cek Portofolio & Live Demo</span>',
    '<span>{t.hero.btnSecondary}</span>'
)

# 3. Services - Main Heading
# Wait, let's just replace 'Layanan{' '}' and 'Pengembangan Perangkat Lunak' manually since we know the context.
content = content.replace(
    "Layanan{' '}",
    "{t.nav.services}{' '}"
)
content = content.replace(
    'Pengembangan Perangkat Lunak\n                </span>',
    '{t.services.mainHeadingHighlight}\n                </span>'
)

# 4. Services - Subtitle/Desc 1 & 2
content = content.replace(
    'Aplikasi iOS & Android, native maupun cross-platform, dengan pengalaman pengguna yang mulus dan performa setara aplikasi native.',
    '{t.services.items[1].desc}'
)
content = content.replace(
    'Backend API yang aman, terstruktur, dan siap menangani skala — lengkap dengan autentikasi, integrasi pembayaran, dan sistem real-time.',
    '{t.services.items[2].desc}'
)
# And the titles for Service 3
content = content.replace(
    'REST API & Cloud Integration',
    '{t.services.items[2].title}'
)

# 5. Tech - Heading & Desc
content = content.replace(
    "Teknologi yang{' '}",
    "{t.tech.mainHeading}{' '}"
)
content = content.replace(
    'Digunakan\n                </span>',
    '{t.tech.mainHeadingHighlight}\n                </span>'
)
content = content.replace(
    'Tools dipilih berdasarkan kebutuhan proyek, bukan sekadar tren — memastikan performa, keamanan, dan kemudahan maintenance jangka panjang.',
    '{t.tech.desc}'
)

# 6. Tech - Content (Backend, Database, Mobile, Infra, Integration)
# Backend
content = content.replace(
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">Backend & API</h3>',
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">{t.tech.backend}</h3>'
)
content = content.replace(
    '<p className="text-xs text-theme-fore-muted leading-relaxed">Logika bisnis & manajemen server.</p>',
    '<p className="text-xs text-theme-fore-muted leading-relaxed">{t.tech.backendDesc}</p>'
)

# Database
content = content.replace(
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">Database</h3>',
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">{t.tech.database}</h3>'
)
content = content.replace(
    '<p className="text-xs text-theme-fore-muted leading-relaxed">Penyimpanan terstruktur & ORM.</p>',
    '<p className="text-xs text-theme-fore-muted leading-relaxed">{t.tech.databaseDesc}</p>'
)

# Mobile
content = content.replace(
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">Mobile</h3>',
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">{t.tech.mobile}</h3>'
)
content = content.replace(
    '<p className="text-xs text-theme-fore-muted leading-relaxed">Aplikasi iOS & Android native/hybrid.</p>',
    '<p className="text-xs text-theme-fore-muted leading-relaxed">{t.tech.mobileDesc}</p>'
)

# Infra
content = content.replace(
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">Infrastructure</h3>',
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">{t.tech.infra}</h3>'
)
content = content.replace(
    '<p className="text-xs text-theme-fore-muted leading-relaxed">Virtualisasi & integrasi cloud.</p>',
    '<p className="text-xs text-theme-fore-muted leading-relaxed">{t.tech.infraDesc}</p>'
)

# Integration
content = content.replace(
    '<h3 className="text-2xl font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">Integrasi Pihak Ketiga</h3>',
    '<h3 className="text-2xl font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">{t.tech.integration}</h3>'
)
content = content.replace(
    '<p className="text-xs text-theme-fore-muted leading-relaxed">Penghubungan dengan layanan eksternal untuk modul pembayaran aman, autentikasi terpusat, dan layanan berbasis API lainnya.</p>',
    '<p className="text-xs text-theme-fore-muted leading-relaxed">{t.tech.integrationDesc}</p>'
)

# 7. Kredibilitas - Heading & Desc
content = content.replace(
    'Latar Belakang & Kemampuan',
    '{t.credibility.mainHeading}'
)
content = content.replace(
    'Sebelum menekuni proyek independen, saya bekerja sebagai Software Developer di industri manufaktur — menangani sistem yang harus akurat dan diandalkan untuk proses operasional sehari-hari. Pengalaman itu saya bawa ke setiap proyek: kode yang bukan sekadar jalan, tapi juga stabil dan mudah dirawat jangka panjang.',
    '{t.credibility.desc}'
)

with open('src/components/AgencyLanding.tsx', 'w') as f:
    f.write(content)
