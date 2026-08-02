import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Default sender email (Use custom verified domain sejatidimedia.web.id)
const FROM_EMAIL = process.env.EMAIL_FROM || 'SejatiDimedia <onboarding@sejatidimedia.web.id>';

// Read logo.png for inline CID attachment (Gmail & Outlook standard)
let logoBuffer: Buffer | null = null;
try {
  const logoPath = path.join(process.cwd(), 'public', 'logo.png');
  if (fs.existsSync(logoPath)) {
    logoBuffer = fs.readFileSync(logoPath);
  }
} catch {
  // Ignore fallback
}

interface SendOnboardingEmailParams {
  to: string;
  name: string;
  projectName: string;
  activationUrl: string;
}

/**
 * Send Client Onboarding Email with Magic Link button & Kop Email Header (Logo + Brand Text)
 */
export async function sendOnboardingMagicLink({
  to,
  name,
  projectName,
  activationUrl,
}: SendOnboardingEmailParams) {
  const subject = `🎉 Selamat Datang di SejatiDimedia Client Portal - ${projectName}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7fa; color: #1e293b; margin: 0; padding: 20px; }
          .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 36px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
          .header { text-align: center; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; }
          .badge { display: inline-block; background: #eff6ff; color: #2563eb; font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 99px; margin-top: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
          .content { font-size: 14px; line-height: 1.6; color: #334155; }
          .btn-container { text-align: center; margin: 32px 0; }
          .btn { background-color: #2563eb; color: #ffffff !important; font-size: 13px; font-weight: 800; text-decoration: none; padding: 14px 28px; border-radius: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(37,99,235,0.25); text-transform: uppercase; letter-spacing: 0.5px; }
          .fallback { font-size: 11px; color: #64748b; background: #f8fafc; padding: 12px; border-radius: 10px; word-break: break-all; margin-top: 24px; border: 1px solid #e2e8f0; }
          .footer { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <!-- Kop Email Header -->
          <div class="header">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto; display: inline-table;">
              <tr>
                <td style="vertical-align: middle; padding-right: 12px;">
                  <img src="cid:logo_cid" alt="Logo" width="48" height="26" style="display: block; width: 48px; height: auto;" />
                </td>
                <td style="vertical-align: middle; font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                  SejatiDimedia
                </td>
              </tr>
            </table>
            <div>
              <span class="badge">Client Portal Onboarding</span>
            </div>
          </div>
          
          <div class="content">
            <p>Halo <strong>${name}</strong>,</p>
            <p>Selamat! Pengajuan project Anda <strong>"${projectName}"</strong> telah disetujui dan saat ini berada di status <strong style="color: #16a34a;">WON (Aktif)</strong>.</p>
            <p>Kami telah membuatkan akses ke <strong>Client Portal SejatiDimedia</strong> agar Anda dapat memantau status pengerjaan project, milestone, dan deliverables secara real-time.</p>
            
            <div class="btn-container">
              <a href="${activationUrl}" class="btn" target="_blank">Masuk ke Client Portal</a>
            </div>

            <p style="font-size: 12px; color: #64748b;">* Link aktivasi instan ini berlaku selama <strong>48 jam</strong> dan satu kali penggunaan.</p>
            
            <div class="fallback">
              <strong>Link Tidak Bisa Diklik?</strong> Salin dan tempel URL berikut di browser Anda:<br>
              <a href="${activationUrl}" style="color: #2563eb;">${activationUrl}</a>
            </div>
          </div>

          <div class="footer">
            &copy; 2026 SejatiDimedia Tech Agency. Seluruh hak cipta dilindungi.
          </div>
        </div>
      </body>
    </html>
  `;

  if (resend) {
    try {
      const response = await resend.emails.send({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html: htmlContent,
        attachments: logoBuffer ? [
          {
            filename: 'logo.png',
            content: logoBuffer,
            contentId: 'logo_cid',
          }
        ] : undefined,
      });

      if (response.error) {
        console.warn(`\n[Resend Testing Notice] ${response.error.message}`);
        console.log(`[Resend Fallback Link] To: ${to}`);
        console.log(`[Activation URL]: ${activationUrl}\n`);
        return { success: false, error: response.error.message, activationUrl };
      }

      console.log(`[Resend] Magic link email successfully sent to ${to}:`, response.data?.id);
      return { success: true, messageId: response.data?.id };
    } catch (error: any) {
      console.error(`[Resend Error] Failed sending email to ${to}:`, error?.message || error);
      console.log(`[Activation URL Fallback]: ${activationUrl}`);
      return { success: false, error: error?.message || 'Email delivery failed', activationUrl };
    }
  } else {
    console.log(`\n==================================================`);
    console.log(`[SIMULATED EMAIL SEND - RESEND_API_KEY NOT SET]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Activation Link: ${activationUrl}`);
    console.log(`==================================================\n`);
    return { success: true, simulated: true };
  }
}
