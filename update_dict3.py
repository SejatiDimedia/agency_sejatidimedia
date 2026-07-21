import re

def update_file(filename, is_id):
    with open(filename, 'r') as f:
        content = f.read()

    # Hero object
    if 'hero:' not in content:
        if is_id:
            hero_obj = """
  hero: {
    subtitle: "Setiap baris kode dirancang untuk stabilitas, kecepatan, dan pertumbuhan bisnis Anda secara jangka panjang.",
    btnPrimary: "Diskusikan Proyek Anda",
    btnSecondary: "Cek Portofolio & Live Demo"
  },"""
        else:
            hero_obj = """
  hero: {
    subtitle: "Every line of code is designed for stability, speed, and long-term business growth.",
    btnPrimary: "Discuss Your Project",
    btnSecondary: "Check Portfolio & Live Demo"
  },"""
        content = content.replace('nav: {', hero_obj + '\n  nav: {')

    # Update tech desc and mainHeading in id.ts
    if is_id:
        content = content.replace('mainHeading: "Dibangun dengan ",', 'mainHeading: "Teknologi yang ",')
        content = content.replace('mainHeadingHighlight: "Teknologi Modern",', 'mainHeadingHighlight: "Digunakan",\n    desc: "Tools dipilih berdasarkan kebutuhan proyek, bukan sekadar tren — memastikan performa, keamanan, dan kemudahan maintenance jangka panjang.",')
        
        # Update services
        content = content.replace('title: "Mobile App Development",\n        desc: "Pembuatan aplikasi mobile native/hybrid (iOS & Android) yang terintegrasi langsung dengan ekosistem sistem backend Anda.",', 
        'title: "Mobile App Development",\n        desc: "Aplikasi iOS & Android, native maupun cross-platform, dengan pengalaman pengguna yang mulus dan performa setara aplikasi native.",')
        
        content = content.replace('title: "Backend & API Architecture",\n        desc: "Merancang arsitektur database, RESTful API, dan mikrolayanan yang kuat untuk mendukung jutaan transaksi secara aman.",',
        'title: "REST API & Cloud Integration",\n        desc: "Backend API yang aman, terstruktur, dan siap menangani skala — lengkap dengan autentikasi, integrasi pembayaran, dan sistem real-time.",')

    else:
        # English equivalents
        content = content.replace('mainHeading: "Built with ",', 'mainHeading: "Technologies ",')
        content = content.replace('mainHeadingHighlight: "Modern Tech",', 'mainHeadingHighlight: "Used",\n    desc: "Tools are chosen based on project needs, not just trends — ensuring long-term performance, security, and ease of maintenance.",')
        
        content = content.replace('title: "Mobile App Development",\n        desc: "Creation of native/hybrid mobile apps (iOS & Android) integrated directly with your backend ecosystem.",',
        'title: "Mobile App Development",\n        desc: "iOS & Android apps, native or cross-platform, with seamless user experience and native-level performance.",')
        
        content = content.replace('title: "Backend & API Architecture",\n        desc: "Designing robust database architectures, RESTful APIs, and microservices to securely support millions of transactions.",',
        'title: "REST API & Cloud Integration",\n        desc: "Secure, structured, and scalable Backend APIs — complete with authentication, payment integration, and real-time systems.",')


    with open(filename, 'w') as f:
        f.write(content)

update_file('src/lib/i18n/id.ts', True)
update_file('src/lib/i18n/en.ts', False)
