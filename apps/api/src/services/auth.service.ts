import crypto from "node:crypto";
import { OAuth2Client } from "google-auth-library";
import { Role } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { signToken } from "../utils/jwt.js";
import { sendEmail } from "../utils/mailer.js";
import { toPublicUser } from "../utils/user.js";

let googleClient: OAuth2Client | null = null;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function registerUser(name: string, email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await hashPassword(password)
    }
  });

  return {
    token: signToken({ sub: user.id, email: user.email, role: user.role }),
    user: toPublicUser(user)
  };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: normalizeEmail(email) } });
  if (!user?.passwordHash) {
    throw new Error("Invalid email or password.");
  }

  const matches = await comparePassword(password, user.passwordHash);
  if (!matches) {
    throw new Error("Invalid email or password.");
  }

  return {
    token: signToken({ sub: user.id, email: user.email, role: user.role }),
    user: toPublicUser(user)
  };
}

export async function loginWithGoogle(credential: string) {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new Error("Google login is not configured for this deployment.");
  }

  if (!googleClient) {
    googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw new Error("Google login failed.");
  }

  const user = await prisma.user.upsert({
    where: { email: payload.email },
    update: {
      name: payload.name ?? payload.email.split("@")[0],
      avatarUrl: payload.picture,
      provider: "google"
    },
    create: {
      email: payload.email,
      name: payload.name ?? payload.email.split("@")[0],
      avatarUrl: payload.picture,
      provider: "google"
    }
  });

  return {
    token: signToken({ sub: user.id, email: user.email, role: user.role }),
    user: toPublicUser(user)
  };
}

export async function sendPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email: normalizeEmail(email) } });
  if (!user) {
    return;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(resetToken);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: tokenHash,
      resetTokenExpiresAt: expiresAt
    }
  });

  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await sendEmail(
    user.email,
    "Reset your EcoTrack AI password",
    `<p>Hello ${user.name},</p><p>Use the link below to reset your password. It expires in 30 minutes.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
  );
}

export async function resetPassword(token: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: hashResetToken(token),
      resetTokenExpiresAt: { gt: new Date() }
    }
  });

  if (!user) {
    throw new Error("This password reset link is invalid or expired.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(password),
      resetToken: null,
      resetTokenExpiresAt: null
    }
  });
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  return user ? toPublicUser(user) : null;
}
