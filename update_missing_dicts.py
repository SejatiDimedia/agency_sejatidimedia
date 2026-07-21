import re

def update_file(filename, is_id):
    with open(filename, 'r') as f:
        content = f.read()

    if is_id:
        content = re.sub(r'integrationDesc: "Penghubungan', 'integrationTitle: "Integrasi Pihak Ketiga",\n    integrationDesc: "Penghubungan', content)
        content = re.sub(r'pricing: \{\n    label: "Harga",', 'pricing: {\n    label: "Harga",\n    desc: "Pilih paket sesuai skala proyek Anda. Butuh sistem custom di luar paket ini? Diskusikan langsung untuk penawaran khusus.",', content)
    else:
        content = re.sub(r'integrationDesc: "Integration', 'integrationTitle: "Third-Party Integration",\n    integrationDesc: "Integration', content)
        content = re.sub(r'pricing: \{\n    label: "Pricing",', 'pricing: {\n    label: "Pricing",\n    desc: "Choose a package that fits your project scale. Need a custom system outside these packages? Let\'s discuss a tailored offer.",', content)

    with open(filename, 'w') as f:
        f.write(content)

update_file('src/lib/i18n/id.ts', True)
update_file('src/lib/i18n/en.ts', False)
