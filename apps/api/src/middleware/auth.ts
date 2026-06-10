import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { AUTH_COOKIE_NAME } from "../utils/auth-cookie.js";
import { verifyToken } from "../utils/jwt.js";

declare module "express-serve-static-core" {
  interface Request {
    auth?: {
      userId: string;
      email: string;
      role: Role;
    };
  }
}

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  const header = request.headers.authorization;
  const headerToken = header?.startsWith("Bearer ") ? header.replace("Bearer ", "") : null;
  const cookieToken = request.cookies?.[AUTH_COOKIE_NAME];
  const token = headerToken ?? cookieToken;

  if (!token) {
    return response.status(401).json({ message: "Authentication required." });
  }

  try {
    const payload = verifyToken(token);
    request.auth = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role
    };
    return next();
  } catch {
    return response.status(401).json({ message: "Invalid or expired token." });
  }
}

export function requireRole(role: Role) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (request.auth?.role !== role) {
      return response.status(403).json({ message: "You do not have access to this resource." });
    }

    return next();
  };
}
