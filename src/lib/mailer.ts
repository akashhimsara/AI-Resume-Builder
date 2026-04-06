import nodemailer from "nodemailer";
import { getEmailEnv } from "@/lib/env";

let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const emailEnv = getEmailEnv();
  cachedTransporter = nodemailer.createTransport({
    host: emailEnv.SMTP_HOST,
    port: emailEnv.SMTP_PORT,
    secure: emailEnv.SMTP_SECURE,
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

  await transporter.sendMail({
    from: `"${emailEnv.EMAIL_FROM_NAME}" <${emailEnv.EMAIL_FROM}>`,
    to: input.to,
    subject: "Reset your password",
    text: `You requested a password reset. Use this link to set a new password: ${input.resetUrl}\n\nThis link will expire in 30 minutes. If you did not request this, you can ignore this email.`,
    html: `<p>You requested a password reset.</p><p><a href="${input.resetUrl}">Click here to reset your password</a></p><p>This link will expire in 30 minutes.</p><p>If you did not request this, you can ignore this email.</p>`,
  });
}
