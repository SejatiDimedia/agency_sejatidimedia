import re
for file in ['src/lib/i18n/id.ts', 'src/lib/i18n/en.ts']:
    with open(file, 'r') as f:
        content = f.read()
    if 'beranda:' not in content:
        if 'id.ts' in file:
            content = content.replace('nav: {', 'nav: {\n    home: "Beranda",\n    tech: "Teknologi",\n    workflow: "Proses Kerja",\n    advantages: "Keunggulan",')
            content = content.replace('Layanan",', 'Layanan",\n    portfolio: "Portofolio",')
        else:
            content = content.replace('nav: {', 'nav: {\n    home: "Home",\n    tech: "Technology",\n    workflow: "Workflow",\n    advantages: "Advantages",')
            content = content.replace('Services",', 'Services",\n    portfolio: "Portfolio",')
        with open(file, 'w') as f:
            f.write(content)
