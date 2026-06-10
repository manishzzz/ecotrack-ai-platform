import { CookieOptions } from "express";
import { env } from "./env.js";

const baseOrigins = env.ALLOWED_ORIGINS
  ? env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : [];

export const allowedOrigins = Array.from(new Set([env.FRONTEND_URL, ...baseOrigins]));

export function getAuthCookieOptions(): CookieOptions {
  const isProduction = env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7
  };
}
