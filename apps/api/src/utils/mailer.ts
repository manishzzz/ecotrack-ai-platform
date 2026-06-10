import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    });
  }

  return transporter;
}

export async function sendEmail(to: string, subject: string, html: string) {
  const client = getTransporter();
  if (!client) {
    console.info(`Email transport not configured. Intended email to ${to}: ${subject}`);
    return false;
  }

  await client.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html
  });

  return true;
}
