import { z } from 'zod';

export const DISPOSABLE_DOMAINS = [
  'mailinator.com',
  'guerrillamail.com',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'throwawaymail.com',
  'yopmail.com',
  'dispostable.com',
  'sharklasers.com',
  'getnada.com',
];

export const normalizeScale = (val: unknown): 'small' | 'medium' | 'large' | 'enterprise' => {
  if (typeof val !== 'string') return 'small';
  const lower = val.toLowerCase();
  if (lower.includes('mvp') || lower.includes('small') || lower.includes('fast')) return 'small';
  if (lower.includes('medium')) return 'medium';
  if (lower.includes('high') || lower.includes('large') || lower.includes('custom') || lower.includes('architecture')) return 'large';
  if (lower.includes('enterprise')) return 'enterprise';
  return 'small';
};

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
  email: z
    .string()
    .email('Format email tidak valid')
    .refine(
      (email) => {
        const domain = email.split('@')[1]?.toLowerCase();
        return !domain || !DISPOSABLE_DOMAINS.includes(domain);
      },
      { message: 'Alamat email sekali pakai (disposable email) tidak diizinkan' }
    ),
  service: z.string().min(1, 'Layanan wajib dipilih'),
  scale: z.preprocess(normalizeScale, z.enum(['small', 'medium', 'large', 'enterprise'])),
  message: z.string().min(10, 'Pesan minimal 10 karakter').max(2000, 'Pesan maksimal 2000 karakter'),
  honeypot: z.string().max(0).optional().or(z.literal('')),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
