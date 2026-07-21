import re

with open('src/components/AgencyLanding.tsx', 'r') as f:
    content = f.read()

# 1. Fix FEATURE_ITEMS by moving it inside the AgencyLanding component
# Find the start of AgencyLanding component
component_start = "export default function AgencyLanding({ copy, projects }: { copy?: any; projects?: Project[] }) {\n  const { t } = useLanguage();"

# Remove FEATURE_ITEMS from outside the component
feature_items_pattern = re.compile(r'const FEATURE_ITEMS = \[.*?\];', re.DOTALL)
feature_items_match = feature_items_pattern.search(content)

if feature_items_match:
    content = content.replace(feature_items_match.group(0), '')
    
    # Redefine FEATURE_ITEMS dynamically inside the component
    feature_items_dynamic = """
  const FEATURE_ITEMS = [
    {
      num: '01',
      title: t.guarantee.item2Title,
      description: t.guarantee.item2Desc
    },
    {
      num: '02',
      title: t.contact.perk2Title + ' Tanpa Perantara',
      description: t.differences.items[0].desc
    },
    {
      num: '03',
      title: 'Kode Bersih & Terstruktur',
      description: t.differences.items[2].desc
    },
    {
      num: '04',
      title: 'Harga Transparan, Tanpa Biaya Tersembunyi',
      description: t.pricing.desc
    },
    {
      num: '05',
      title: 'Pendampingan Pasca-Launch',
      description: t.pricing.includeItems[4]
    }
  ];
"""
    content = content.replace(component_start, component_start + "\n" + feature_items_dynamic)


# 2. Fix Section titles and hardcoded headers:

# Portofolio / Proyek section (approx line 534)
content = re.sub(r'<span>Portofolio</span>', r'<span>{t.nav.portfolio}</span>', content)
content = re.sub(r'Proyek, <span.*?Beragam Kompleksitas</span>', r'{t.credibility.card2Title}', content)
# Layanan section
content = re.sub(r'<span>Layanan</span>', r'<span>{t.nav.services}</span>', content)
# Kredibilitas
content = re.sub(r'<span>Kredibilitas</span>', r'<span>{t.credibility.badge}</span>', content)
# Proses Kerja
content = re.sub(r'<span>Proses Kerja</span>', r'<span>{t.nav.workflow}</span>', content)
# Keunggulan
content = re.sub(r'<span>Keunggulan</span>', r'<span>{t.nav.advantages}</span>', content)
content = re.sub(r'Proses Kerja Terstruktur\{\' \'\}\s*<span[^>]*>\s*untuk Hasil Terbaik\s*</span>', r'{t.process.mainHeading}', content)
content = re.sub(r'Yang Membedakan\{\' \'\}\s*<span[^>]*>\s*Cara Saya Bekerja\s*</span>', r'{t.differences.mainHeading} <span className="bg-gradient-to-r from-theme-accent via-[#6AA0F2] to-[#9BC2FA] bg-clip-text text-transparent font-black">{t.differences.mainHeadingHighlight}</span>', content)


# Save
with open('src/components/AgencyLanding.tsx', 'w') as f:
    f.write(content)

