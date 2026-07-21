import re

def update_file(filename, is_id):
    with open(filename, 'r') as f:
        content = f.read()

    # Starter
    if is_id:
        content = re.sub(r'starterTag: "MVP & Validasi"', 'starterTag: "Untuk Validasi Ide"', content)
        content = re.sub(r'starterTitle: "Starter — Prototype"', 'starterTitle: "Starter — MVP Prototype"', content)
        content = re.sub(r'starterDesc: "Sempurna untuk startup yang ingin memvalidasi ide ke pasar dengan cepat namun tetap profesional."', 'starterDesc: "Cocok untuk validasi ide atau produk tahap awal sebelum meluncurkannya ke pasar secara luas."', content)
        
        starter_includes_old = r"""starterIncludes: \[
      'Frontend \(React/Next\.js\) Responsif',
      'Backend \(Node/Go\) & Database Dasar',
      'Desain UI/UX Eksklusif \(Tailwind\)',
      'Garansi Bug Fixing 30 Hari',
      '100% Hak Cipta & Source Code'
    \]"""
        starter_includes_new = """starterIncludes: [
      '1 Platform (Web / Mobile)',
      'Fitur Inti & Core Logic',
      'Estimasi 2–4 Minggu Pengerjaan',
      '1x Revisi Besar',
      'Kode Bersih & Siap Skala'
    ]"""
        content = re.sub(starter_includes_old, starter_includes_new, content)
        
        content = re.sub(r'growthTag: "Skala Produksi"', 'growthTag: "Untuk Rilis ke Publik"', content)
        content = re.sub(r'growthTitle: "Growth — Siap Skala"', 'growthTitle: "Growth — Production Ready"', content)
        content = re.sub(r'growthDesc: "Aplikasi skala penuh dengan arsitektur tangguh dan performa optimal untuk menampung ribuan pengguna aktif."', 'growthDesc: "Cocok untuk bisnis yang siap merilis produk secara resmi ke pengguna umum dengan fitur lengkap dan integrasi backend."', content)
        
    else:
        # EN
        content = re.sub(r'starterTag: "MVP & Validation"', 'starterTag: "For Idea Validation"', content)
        content = re.sub(r'starterTitle: "Starter — Prototype"', 'starterTitle: "Starter — MVP Prototype"', content)
        content = re.sub(r'starterDesc: "Perfect for startups wanting to validate ideas to the market quickly while staying professional."', 'starterDesc: "Perfect for validating ideas or early-stage products before launching them widely to the market."', content)
        
        starter_includes_old = r"""starterIncludes: \[
      'Responsive Frontend \(React/Next\.js\)',
      'Basic Backend \(Node/Go\) & Database',
      'Exclusive UI/UX Design \(Tailwind\)',
      '30-Day Bug Fixing Guarantee',
      '100% Copyright & Source Code'
    \]"""
        starter_includes_new = """starterIncludes: [
      '1 Platform (Web / Mobile)',
      'Core Features & Logic',
      'Estimated 2–4 Weeks Turnaround',
      '1x Major Revision',
      'Clean & Scalable Code'
    ]"""
        content = re.sub(starter_includes_old, starter_includes_new, content)
        
        content = re.sub(r'growthTag: "Production Scale"', 'growthTag: "For Public Release"', content)
        content = re.sub(r'growthTitle: "Growth — Ready to Scale"', 'growthTitle: "Growth — Production Ready"', content)
        content = re.sub(r'growthDesc: "Full-scale application with robust architecture and optimal performance to handle thousands of active users."', 'growthDesc: "Suitable for businesses ready to officially release products to the public with complete features and backend integration."', content)

    with open(filename, 'w') as f:
        f.write(content)

update_file('src/lib/i18n/id.ts', True)
update_file('src/lib/i18n/en.ts', False)
