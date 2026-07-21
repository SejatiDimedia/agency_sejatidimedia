import re

with open('src/components/AgencyLanding.tsx', 'r') as f:
    content = f.read()

# Replace the hardcoded FAQ mapping block with t.faq.items.map
# The block starts with `            {[` and ends with `              }\n            ].map((faq, idx) => (`
faq_pattern = re.compile(r'\{\[\s*\{\s*q: "Bagaimana sistem pembayarannya\?".*?\]\.map\(\(faq, idx\) => \(', re.DOTALL)
content = re.sub(faq_pattern, '{t.faq.items.map((faq, idx) => (', content)

# Update Pricing Cards text
# Card 1 Starter
content = content.replace(
    '<span className="text-[10px] font-mono uppercase tracking-widest text-theme-fore-subtle font-bold">MVP & Validasi</span>',
    '<span className="text-[10px] font-mono uppercase tracking-widest text-theme-fore-subtle font-bold">{t.pricingCards.starterTag}</span>'
)
content = content.replace(
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore">Starter — Prototype</h3>',
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore">{t.pricingCards.starterTitle}</h3>'
)
content = content.replace(
    '<p className="text-[11px] text-theme-fore-muted leading-relaxed">\n                Sempurna untuk startup yang ingin memvalidasi ide ke pasar dengan cepat namun tetap profesional.\n              </p>',
    '<p className="text-[11px] text-theme-fore-muted leading-relaxed">\n                {t.pricingCards.starterDesc}\n              </p>'
)
content = content.replace(
    '<span className="text-[10px] font-mono text-theme-fore-subtle uppercase">Mulai dari</span>',
    '<span className="text-[10px] font-mono text-theme-fore-subtle uppercase">{t.pricingCards.starterPrice}</span>'
)
# Starter Include Array mapping
starter_includes_pattern = re.compile(r'\{\[\s*\'Frontend \(React/Next\.js\) Responsif\'.*?\]\.map', re.DOTALL)
content = re.sub(starter_includes_pattern, '{t.pricingCards.starterIncludes.map', content)


# Card 2 Growth
content = content.replace(
    '<span className="text-[10px] font-mono uppercase tracking-widest text-theme-accent font-bold">Skala Produksi</span>',
    '<span className="text-[10px] font-mono uppercase tracking-widest text-theme-accent font-bold">{t.pricingCards.growthTag}</span>'
)
content = content.replace(
    '<h3 className="text-lg font-sans font-extrabold text-theme-base">Growth — Siap Skala</h3>',
    '<h3 className="text-lg font-sans font-extrabold text-theme-base">{t.pricingCards.growthTitle}</h3>'
)
content = content.replace(
    '<p className="text-[11px] text-theme-base/70 leading-relaxed">\n                Aplikasi skala penuh dengan arsitektur tangguh dan performa optimal untuk menampung ribuan pengguna aktif.\n              </p>',
    '<p className="text-[11px] text-theme-base/70 leading-relaxed">\n                {t.pricingCards.growthDesc}\n              </p>'
)
content = content.replace(
    '<span className="text-[10px] font-mono text-theme-base/60 uppercase">Mulai dari</span>',
    '<span className="text-[10px] font-mono text-theme-base/60 uppercase">{t.pricingCards.starterPrice}</span>' # Use starterPrice as it means "Starting from"
)
# Growth Include Array mapping
growth_includes_pattern = re.compile(r'\{\[\s*\'Web Application \+ API Backend\'.*?\]\.map', re.DOTALL)
content = re.sub(growth_includes_pattern, '{t.pricingCards.growthIncludes.map', content)


# Card 3 Custom
content = content.replace(
    '<span className="text-[10px] font-mono uppercase tracking-widest text-theme-fore-subtle font-bold">Skala Enterprise</span>',
    '<span className="text-[10px] font-mono uppercase tracking-widest text-theme-fore-subtle font-bold">{t.pricingCards.customTag}</span>'
)
content = content.replace(
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore">Custom — Sistem Kompleks</h3>',
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore">{t.pricingCards.customTitle}</h3>'
)
content = content.replace(
    '<p className="text-[11px] text-theme-fore-muted leading-relaxed">\n                Cocok untuk kebutuhan sistem skala besar, arsitektur rumit, dan terintegrasi dengan banyak proses bisnis operasional.\n              </p>',
    '<p className="text-[11px] text-theme-fore-muted leading-relaxed">\n                {t.pricingCards.customDesc}\n              </p>'
)
# Custom Include Array mapping
custom_includes_pattern = re.compile(r'\{\[\s*\'Arsitektur Multi-Platform\'.*?\]\.map', re.DOTALL)
content = re.sub(custom_includes_pattern, '{t.pricingCards.customIncludes.map', content)


with open('src/components/AgencyLanding.tsx', 'w') as f:
    f.write(content)
