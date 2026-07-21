import re

def update_file(filename, is_id):
    with open(filename, 'r') as f:
        content = f.read()

    new_keys_id = """    formBtn: "Kirim Pesan",
    formNameLabel: "Nama Anda",
    formNamePlaceholder: "cth. Raden",
    formEmailLabel: "Alamat Email",
    formEmailPlaceholder: "cth. kontak@domain.com",
    formServiceLabel: "Layanan yang Dibutuhkan",
    formService1Title: "Web Application",
    formService1Desc: "Platform SaaS & Dashboard",
    formService2Title: "Aplikasi Mobile",
    formService2Desc: "SwiftUI, Kotlin, Flutter",
    formService3Title: "Cloud API & Integrasi",
    formService3Desc: "Express, Go, Database & OAuth",
    formService4Title: "Paket Enterprise Penuh",
    formService4Desc: "Desain sistem end-to-end",
    formScopeLabel: "Skala Proyek",
    formScope1Title: "MVP Prototype",
    formScope1Desc: "Pengerjaan cepat",
    formScope2Title: "Produksi Growth",
    formScope2Desc: "Aplikasi standar scalable",
    formScope3Title: "Enterprise Elite",
    formScope3Desc: "Sistem skala besar kustom",
    formDetailsLabel: "Detail & Tujuan Proyek",
    formDetailsPlaceholder: "Jelaskan secara singkat fitur, batasan teknis, atau tujuan proyek Anda...",
    formSubmit: "Kirim Konsultasi Proyek",
    formSubmitSuccess: "Permintaan Terkirim!",
    formSubmitSuccessDesc: "Detail proyek Anda telah diterima. Saya akan mempelajari kebutuhan teknis Anda dan menghubungi dalam waktu 12 jam."
"""

    new_keys_en = """    formBtn: "Send Message",
    formNameLabel: "Your Name",
    formNamePlaceholder: "e.g. Raden",
    formEmailLabel: "Email Address",
    formEmailPlaceholder: "e.g. contact@domain.com",
    formServiceLabel: "Required Service",
    formService1Title: "Web Application",
    formService1Desc: "SaaS Platform & Dashboard",
    formService2Title: "Mobile Application",
    formService2Desc: "SwiftUI, Kotlin, Flutter",
    formService3Title: "Cloud API & Integration",
    formService3Desc: "Express, Go, Database & OAuth",
    formService4Title: "Full Enterprise Package",
    formService4Desc: "End-to-end system design",
    formScopeLabel: "Project Scale",
    formScope1Title: "MVP Prototype",
    formScope1Desc: "Fast turnaround",
    formScope2Title: "Growth Production",
    formScope2Desc: "Standard scalable application",
    formScope3Title: "Enterprise Elite",
    formScope3Desc: "Custom large-scale system",
    formDetailsLabel: "Project Details & Goals",
    formDetailsPlaceholder: "Briefly explain the features, technical constraints, or goals of your project...",
    formSubmit: "Send Project Consultation",
    formSubmitSuccess: "Request Sent!",
    formSubmitSuccessDesc: "Your project details have been received. I will review your technical needs and contact you within 12 hours."
"""

    if is_id:
        content = re.sub(r'formBtn: "Kirim Pesan"', new_keys_id, content)
        content = re.sub(r'contact: "Kontak",', 'contact: "Kontak",\n    contactBadge: "Hubungi Kontak",', content)
        content = re.sub(r'pricing: \{', 'pricing: {\n    label: "Harga",', content)
    else:
        content = re.sub(r'formBtn: "Send Message"', new_keys_en, content)
        content = re.sub(r'contact: "Contact",', 'contact: "Contact",\n    contactBadge: "Contact Us",', content)
        content = re.sub(r'pricing: \{', 'pricing: {\n    label: "Pricing",', content)

    with open(filename, 'w') as f:
        f.write(content)

update_file('src/lib/i18n/id.ts', True)
update_file('src/lib/i18n/en.ts', False)
