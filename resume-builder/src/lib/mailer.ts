import nodemailer from "nodemailer";
import { getEmailEnv } from "@/lib/env";

let cachedTransporter: nodemailer.Transporter | null = null;
let hasVerifiedTransporter = false;

function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const emailEnv = getEmailEnv();
  const secure = emailEnv.SMTP_PORT === 465 ? true : emailEnv.SMTP_SECURE;

  cachedTransporter = nodemailer.createTransport({
    host: emailEnv.SMTP_HOST,
    port: emailEnv.SMTP_PORT,
    secure,
    auth: {
      user: emailEnv.SMTP_USER,
      pass: emailEnv.SMTP_PASS,
    },
  });

  return cachedTransporter;
}

export async function sendResetPasswordEmail(input: {
  to: string;
  resetUrl: string;
}) {
  const emailEnv = getEmailEnv();
  const transporter = getTransporter();

  // Verify credentials once in production so SMTP misconfiguration fails with a clear server log.
  if (process.env.NODE_ENV === "production" && !hasVerifiedTransporter) {
    await transporter.verify();
    hasVerifiedTransporter = true;
  }

  await transporter.sendMail({
    from: `"${emailEnv.EMAIL_FROM_NAME}" <${emailEnv.EMAIL_FROM}>`,
    to: input.to,
    subject: "Reset your password",
    text: `You requested a password reset. Use this link to set a new password: ${input.resetUrl}\n\nThis link will expire in 30 minutes. If you did not request this, you can ignore this email.`,
    html: `<p>You requested a password reset.</p><p><a href="${input.resetUrl}">Click here to reset your password</a></p><p>This link will expire in 30 minutes.</p><p>If you did not request this, you can ignore this email.</p>`,
  });
}
