import re

for file in ['src/lib/i18n/id.ts', 'src/lib/i18n/en.ts']:
    with open(file, 'r') as f:
        content = f.read()
    
    if 'portfolio:' not in content:
        if 'id.ts' in file:
            portfolio_obj = """
  portfolio: {
    badge: "Portofolio",
    mainHeading: "Karya Rekayasa",
    mainHeadingHighlight: "Beragam Kompleksitas",
    desc: "Mulai dari MVP validasi ide hingga sistem ERP multi-tenant untuk kebutuhan enterprise. Setiap proyek didokumentasikan.",
    viewAll: "Lihat Semua Proyek",
    viewProject: "Lihat Proyek"
  },"""
            perk3 = 'perk2Desc: "Akses prioritas via WhatsApp/Telegram untuk respons cepat.",\n    perk3Title: "Serah Terima Kode Penuh",\n    perk3Desc: "100% hak cipta, commit history bersih, dan panduan deployment lengkap.",'
        else:
            portfolio_obj = """
  portfolio: {
    badge: "Portfolio",
    mainHeading: "Engineering",
    mainHeadingHighlight: "Various Complexities",
    desc: "From idea validation MVPs to multi-tenant ERP systems for enterprise needs. Every project is documented.",
    viewAll: "View All Projects",
    viewProject: "View Project"
  },"""
            perk3 = 'perk2Desc: "Priority access via WhatsApp/Telegram for fast response.",\n    perk3Title: "Full Code Handover",\n    perk3Desc: "100% copyright, clean commit history, and complete deployment guide.",'

        # Insert portfolio obj after footer
        content = content.replace('footer: {', portfolio_obj + '\n  footer: {')
        
        # Replace perk2Desc to inject perk3
        content = re.sub(r'perk2Desc: ".*?",', perk3, content)
        
        with open(file, 'w') as f:
            f.write(content)
