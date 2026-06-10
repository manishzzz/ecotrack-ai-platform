import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import { AUTH_COOKIE_NAME, clearAuthCookie, setAuthCookie } from "../utils/auth-cookie.js";
import { verifyToken } from "../utils/jwt.js";
import { isStrongPassword } from "../utils/password.js";
import {
  getUserById,
  loginUser,
  loginWithGoogle,
  registerUser,
  resetPassword,
  sendPasswordReset
} from "../services/auth.service.js";

export const authRouter = Router();
const passwordSchema = z
  .string()
  .min(10)
  .max(128)
  .refine(isStrongPassword, "Password must include upper, lower, number, and symbol characters.");

authRouter.post(
  "/register",
  asyncHandler(async (request, response) => {
    const schema = z.object({
      name: z.string().min(2).max(80),
      email: z.string().email(),
      password: passwordSchema
    });

    const body = schema.parse(request.body);
    const data = await registerUser(body.name, body.email, body.password);
    setAuthCookie(response, data.token);
    response.status(201).json(data);
  })
);

authRouter.post(
  "/login",
  asyncHandler(async (request, response) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(1)
    });

    const body = schema.parse(request.body);
    const data = await loginUser(body.email, body.password);
    setAuthCookie(response, data.token);
    response.json(data);
  })
);

authRouter.post(
  "/google",
  asyncHandler(async (request, response) => {
    const schema = z.object({
      credential: z.string().min(1)
    });

    const body = schema.parse(request.body);
    const data = await loginWithGoogle(body.credential);
    setAuthCookie(response, data.token);
    response.json(data);
  })
);

authRouter.post(
  "/forgot-password",
  asyncHandler(async (request, response) => {
    const schema = z.object({
      email: z.string().email()
    });

    const body = schema.parse(request.body);
    await sendPasswordReset(body.email);
    response.json({ message: "If the account exists, a reset email has been sent." });
  })
);

authRouter.post(
  "/reset-password",
  asyncHandler(async (request, response) => {
    const schema = z.object({
      token: z.string().min(1).max(256),
      password: passwordSchema
    });

    const body = schema.parse(request.body);
    await resetPassword(body.token, body.password);
    response.json({ message: "Password reset successful." });
  })
);

authRouter.get(
  "/me",
  asyncHandler(async (request, response) => {
    const header = request.headers.authorization;
    const headerToken = header?.startsWith("Bearer ") ? header.replace("Bearer ", "") : null;
    const cookieToken = request.cookies?.[AUTH_COOKIE_NAME];
    const token = headerToken ?? cookieToken;

    if (!token) {
      response.json({ user: null });
      return;
    }

    let userId: string;
    try {
      userId = verifyToken(token).sub;
    } catch {
      clearAuthCookie(response);
      response.json({ user: null });
      return;
    }

    const user = await getUserById(userId);
    if (!user) {
      clearAuthCookie(response);
      response.json({ user: null });
      return;
    }

    response.json({ user });
  })
);

authRouter.post(
  "/logout",
  asyncHandler(async (_request, response) => {
    clearAuthCookie(response);
    response.json({ message: "Logged out." });
  })
);
