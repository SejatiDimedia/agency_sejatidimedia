import re

# Update dicts
def update_dicts():
    for f_name, is_id in [('src/lib/i18n/id.ts', True), ('src/lib/i18n/en.ts', False)]:
        with open(f_name, 'r') as f:
            content = f.read()
        
        if 'features:' not in content:
            if is_id:
                feat_obj = """
  features: {
    f1: "Tanpa Perantara",
    f2: "Kode Bersih & Terstruktur",
    f3: "Harga Transparan, Tanpa Biaya Tersembunyi",
    f4: "Pendampingan Pasca-Launch"
  },"""
            else:
                feat_obj = """
  features: {
    f1: "No Middlemen",
    f2: "Clean & Structured Code",
    f3: "Transparent Pricing, No Hidden Fees",
    f4: "Post-Launch Support"
  },"""
            content = content.replace('faq: {', feat_obj + '\n  faq: {')
            with open(f_name, 'w') as f:
                f.write(content)

update_dicts()

# Update AgencyLanding.tsx
with open('src/components/AgencyLanding.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "title: t.contact.perk2Title + ' Tanpa Perantara',",
    "title: t.contact.perk2Title + ' ' + t.features.f1,"
)
content = content.replace(
    "title: 'Kode Bersih & Terstruktur',",
    "title: t.features.f2,"
)
content = content.replace(
    "title: 'Harga Transparan, Tanpa Biaya Tersembunyi',",
    "title: t.features.f3,"
)
content = content.replace(
    "title: 'Pendampingan Pasca-Launch',",
    "title: t.features.f4,"
)

with open('src/components/AgencyLanding.tsx', 'w') as f:
    f.write(content)

