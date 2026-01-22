import { Resend } from 'resend';

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

function buildResetUrl(token: string): string {
  const base = requiredEnv('SITE_BASE_URL').replace(/\/$/, '');
  return `${base}/update-password?token=${encodeURIComponent(token)}`;
}

export async function sendPasswordResetEmail(params: {
  toEmail: string;
  token: string;
}): Promise<void> {
  const apiKey = requiredEnv('RESEND_API_KEY');

  const skipEmailInDev = process.env.NODE_ENV === 'development' && process.env.SKIP_EMAIL_SEND === 'true';
  const resetUrl = buildResetUrl(params.token);

  if (skipEmailInDev) {
    console.log('[DEV] Password reset email skipped:', { to: params.toEmail, resetUrl });
    return;
  }

  const from = process.env.EMAIL_FROM || process.env.CONTACT_FROM || 'NeuroBreath <onboarding@resend.dev>';
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: params.toEmail,
    subject: 'Reset your NeuroBreath password',
    text:
      `You requested a password reset for NeuroBreath.\n\n` +
      `Reset link (valid for 1 hour):\n${resetUrl}\n\n` +
      `If you did not request this, you can ignore this email.`,
  });

  if (error) {
    throw new Error(error.message || 'Failed to send password reset email');
  }
}
