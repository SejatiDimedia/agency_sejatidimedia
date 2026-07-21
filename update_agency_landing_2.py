with open('src/components/AgencyLanding.tsx', 'r') as f:
    content = f.read()

# 1. Tech Frontend
content = content.replace(
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">Frontend</h3>',
    '<h3 className="text-lg font-sans font-extrabold text-theme-fore group-hover:text-theme-accent transition-colors">{t.tech.frontend}</h3>'
)
content = content.replace(
    '<p className="text-xs text-theme-fore-muted leading-relaxed">Untuk antarmuka yang cepat, responsif, dan interaktif.</p>',
    '<p className="text-xs text-theme-fore-muted leading-relaxed">{t.tech.frontendDesc}</p>'
)

# 2. MILESTONES array
# Since MILESTONES is a local variable, let's replace its definition with t.milestones
import re
milestones_pattern = re.compile(r'const MILESTONES = \[\s*\{.*?\}\s*\];', re.DOTALL)
content = re.sub(milestones_pattern, 'const MILESTONES = t.milestones;', content)

# But wait, t.milestones doesn't have codePreview! I didn't add codePreview to dictionaries because they are code!
# Let's map it instead:
# const MILESTONES = t.milestones.map((m, idx) => ({ ...m, codePreview: ORIGINAL_CODE_PREVIEWS[idx] }));
# Ah! That's complex. Let's just modify the JSX directly where MILESTONES is mapped.
