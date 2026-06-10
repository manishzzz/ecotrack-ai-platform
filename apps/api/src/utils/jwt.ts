import jwt, { type SignOptions, type Secret } from "jsonwebtoken";
import { env } from "../config/env.js";

type TokenPayload = {
  sub: string;
  role: "USER" | "ADMIN";
  email: string;
};

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET as Secret, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}
