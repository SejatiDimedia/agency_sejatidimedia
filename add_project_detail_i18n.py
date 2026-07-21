import re

id_content = """  projectDetail: {
    back: "Kembali ke Portofolio",
    detail: "Detail Proyek",
    spec: "Spesifikasi Proyek",
    status: "Status",
    statusComplete: "Selesai",
    statusOngoing: "Sedang Berjalan",
    timeline: "Timeline",
    tech: "Teknologi yang Digunakan",
    links: "Tautan Proyek",
    related: "Proyek Lainnya",
    relatedDesc: "Jelajahi karya rekayasa perangkat lunak lainnya.",
    viewAll: "Lihat Semua Proyek",
    detailLink: "Detail"
  },"""

en_content = """  projectDetail: {
    back: "Back to Portfolio",
    detail: "Project Details",
    spec: "Project Specifications",
    status: "Status",
    statusComplete: "Completed",
    statusOngoing: "Ongoing",
    timeline: "Timeline",
    tech: "Technologies Used",
    links: "Project Links",
    related: "Other Projects",
    relatedDesc: "Explore other software engineering works.",
    viewAll: "View All Projects",
    detailLink: "View Detail"
  },"""

def append_to_dict(filename, block):
    with open(filename, 'r') as f:
        content = f.read()
    
    # insert after the pricing object closes
    content = re.sub(r'(pricing: \{[\s\S]*?\},)', r'\1\n' + block, content)
    
    with open(filename, 'w') as f:
        f.write(content)

append_to_dict('src/lib/i18n/id.ts', id_content)
append_to_dict('src/lib/i18n/en.ts', en_content)
