export type TemplateId = 'classic' | 'professional';

export interface TemplateInfo {
  id: TemplateId;
  name: string;
  badge: string;
  descriptionId: string;
  descriptionEn: string;
  previewGradient: string;
  features: string[];
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: 'classic',
    name: 'Classic (Aurora / Dark & Light)',
    badge: 'V1 Original',
    descriptionId: 'Desain orisinal dengan tema gelap/terang, efek pencahayaan dinamis Aurora, dan visual futuristic tech.',
    descriptionEn: 'Original design with dark & light theme, dynamic Aurora ambient lighting, and futuristic tech visuals.',
    previewGradient: 'from-slate-900 via-indigo-950 to-blue-900',
    features: ['Dark & Light Mode', 'Aurora Ambient Lighting', 'Dynamic Neon Accents', 'Glint Star Flares'],
  },
  {
    id: 'professional',
    name: 'Professional (Clean Portal Style)',
    badge: 'V2 Redesign',
    descriptionId: 'Desain bersih berfokus pada gaya workspace portal: dominan light-mode, tanpa efek Aurora, palet warna navy/slate elegan.',
    descriptionEn: 'Clean design focused on portal workspace style: light-mode only, no Aurora effects, elegant navy/slate palette.',
    previewGradient: 'from-slate-100 via-blue-50 to-slate-200',
    features: ['Light Mode Only', 'Clean Slate & Navy Palette', 'Portal-Matched Aesthetic', 'Minimalist High-Contrast'],
  },
];

export const TEMPLATE_STORAGE_KEY = 'sejatidimedia-template';

export function getActiveTemplate(): TemplateId {
  if (typeof window === 'undefined') return 'classic';
  const saved = localStorage.getItem(TEMPLATE_STORAGE_KEY);
  if (saved === 'professional' || saved === 'classic') {
    return saved;
  }
  return 'classic';
}

export function setActiveTemplate(template: TemplateId): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TEMPLATE_STORAGE_KEY, template);
  window.dispatchEvent(new CustomEvent('sejatidimedia-template-change', { detail: template }));
}
