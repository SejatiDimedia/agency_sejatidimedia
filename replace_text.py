import re

with open('src/components/AgencyLanding.tsx', 'r') as f:
    content = f.read()

# 1. Add import
if 'useLanguage' not in content:
    content = content.replace("import { Project } from '../lib/api/glio-projects';", "import { Project } from '../lib/api/glio-projects';\nimport { useLanguage } from '../lib/i18n/LanguageContext';")

# 2. Add hook inside component
if 'const { t } = useLanguage();' not in content:
    content = content.replace("export default function AgencyLanding({ projects }: { projects: Project[] }) {\n", "export default function AgencyLanding({ projects }: { projects: Project[] }) {\n  const { t } = useLanguage();\n")

# 3. Replace Hero Section Text
content = content.replace('"TERSEDIA UNTUK KLIEN BARU"', '{t.hero.badge}')
content = content.replace('Software Developer Independen untuk Bisnis yang Butuh Sistem, Bukan Sekadar', '{t.hero.title}')
content = content.replace('Website', '{t.hero.titleHighlight}')
content = content.replace('Dari latar belakang industri manufaktur ke proyek independen — saya membangun aplikasi web, mobile, dan backend dengan standar yang sama seperti sistem yang menangani operasional bisnis nyata setiap hari.', '{t.hero.subtitle}')
content = content.replace('Sistem Manufaktur Nyata', '{t.hero.card1Title}')
content = content.replace('Terbiasa membangun sistem yang menangani transaksi, inventori, dan proses kerja harian — bukan sekadar landing page.', '{t.hero.card1Desc}')
content = content.replace('Bisa Diuji Langsung', '{t.hero.card2Title}')
content = content.replace('Kode dapat diaudit di GitHub, aplikasi aktif dan bisa dicoba langsung — tidak hanya screenshot portofolio.', '{t.hero.card2Desc}')
content = content.replace('"Cek Portofolio & Live Demo"', '{t.hero.btnPrimary}')
content = content.replace('"Lihat Kompetensi"', '{t.hero.btnSecondary}')

with open('src/components/AgencyLanding.tsx', 'w') as f:
    f.write(content)

