with open('src/components/AgencyLanding.tsx', 'r') as f:
    content = f.read()

# --- WORKFLOW (MILESTONES MAP) ---
content = content.replace(
    '{milestone.tag}',
    '{t.milestones[idx].tag}'
)
content = content.replace(
    '{milestone.title}',
    '{t.milestones[idx].title}'
)
content = content.replace(
    '{milestone.description}',
    '{t.milestones[idx].description}'
)
content = content.replace(
    'milestone.deliverables.map',
    't.milestones[idx].deliverables.map'
)
# Update the title at index 0 for active milestone
content = content.replace(
    '{MILESTONES[activeMilestone].title}',
    '{t.milestones[activeMilestone].title}'
)

# --- CREDIBILITY CARDS ---
content = content.replace(
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">Pengalaman Manufaktur</h3>',
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">{t.credibility.card1Title}</h3>'
)
content = content.replace(
    '<p className="text-xs text-theme-fore-muted leading-relaxed mt-3">Berpengalaman mengembangkan & memelihara sistem internal (seperti ERP, inventori, dan HCM) di perusahaan manufaktur nyata yang menuntut keandalan tinggi.</p>',
    '<p className="text-xs text-theme-fore-muted leading-relaxed mt-3">{t.credibility.card1Desc}</p>'
)

content = content.replace(
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">Proyek, Beragam Kompleksitas</h3>',
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">{t.credibility.card2Title}</h3>'
)
content = content.replace(
    '<p className="text-xs text-theme-fore-muted leading-relaxed mt-3">Mulai dari MVP validasi ide hingga sistem ERP multi-tenant untuk kebutuhan enterprise. Setiap proyek didokumentasikan dan dapat ditelusuri riwayat pengerjaannya.</p>',
    '<p className="text-xs text-theme-fore-muted leading-relaxed mt-3">{t.credibility.card2Desc}</p>'
)

content = content.replace(
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">Verifikasi Terbuka</h3>',
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">{t.credibility.card3Title}</h3>'
)
content = content.replace(
    '<p className="text-xs text-theme-fore-muted leading-relaxed mt-3">Transparansi kode melalui GitHub dan riwayat profesional yang bisa diverifikasi secara terbuka di LinkedIn, memberikan rasa aman 100%.</p>',
    '<p className="text-xs text-theme-fore-muted leading-relaxed mt-3">{t.credibility.card3Desc}</p>'
)

# --- FAQ ---
content = content.replace(
    '<h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.12] text-theme-fore text-left">\n                Pertanyaan Umum\n              </h2>',
    '<h2 className="text-3xl sm:text-4.5xl font-sans font-extrabold tracking-tight leading-[1.12] text-theme-fore text-left">\n                {t.faq.mainHeading}\n              </h2>'
)
content = content.replace(
    '<h4 className="text-sm font-sans font-bold text-theme-fore">Ada Pertanyaan?</h4>',
    '<h4 className="text-sm font-sans font-bold text-theme-fore">{t.faq.askTitle}</h4>'
)
content = content.replace(
    '<p className="text-[11px] text-theme-fore-muted leading-relaxed">\n                  Tanyakan apa saja terkait kebutuhan pengembangan software, revisi, atau penawaran khusus.\n                </p>',
    '<p className="text-[11px] text-theme-fore-muted leading-relaxed">\n                  {t.faq.askDesc}\n                </p>'
)
content = content.replace(
    '<label htmlFor="custom-q-input" className="text-[9px] font-mono uppercase tracking-wider text-theme-fore-subtle font-bold">\n                      Tulis pertanyaan Anda.\n                    </label>',
    '<label htmlFor="custom-q-input" className="text-[9px] font-mono uppercase tracking-wider text-theme-fore-subtle font-bold">\n                      {t.faq.askLabel}\n                    </label>'
)
content = content.replace(
    'placeholder="Tulis di sini..."',
    'placeholder={t.faq.askPlaceholder}'
)
content = content.replace(
    '<h4 className="text-lg font-sans font-bold text-theme-fore">Konsultasi Berhasil Dikirim!</h4>',
    '<h4 className="text-lg font-sans font-bold text-theme-fore">{t.faq.askSuccess}</h4>'
)
content = content.replace(
    '<p className="text-xs text-theme-fore-muted leading-relaxed max-w-xs mx-auto">\n                      Saya akan membalas pertanyaan Anda ke email yang Anda daftarkan maksimal dalam 24 jam kerja.\n                    </p>',
    '<p className="text-xs text-theme-fore-muted leading-relaxed max-w-xs mx-auto">\n                      {t.faq.askSuccessDesc}\n                    </p>'
)

# For FAQ items mapping
# The FAQ items are currently mapped over a hardcoded array in JSX.
# Wait, let's see how FAQ is mapped! I don't know yet.
# Let's replace the whole FAQ array logic. But I need to see it first.

with open('src/components/AgencyLanding.tsx', 'w') as f:
    f.write(content)
