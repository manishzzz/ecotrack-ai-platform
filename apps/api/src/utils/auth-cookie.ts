import { Response } from "express";
import { getAuthCookieOptions } from "../config/security.js";

export const AUTH_COOKIE_NAME = "ecotrack_token";

export function setAuthCookie(response: Response, token: string) {
  response.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
}

export function clearAuthCookie(response: Response) {
  response.clearCookie(AUTH_COOKIE_NAME, {
    ...getAuthCookieOptions(),
    maxAge: undefined
  });
}
