import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../errors/app-error";

type JwtPayload = {
  sub: string;
  email: string;
};

export function requireAuth(request: Request, _response: Response, next: NextFunction) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    throw new AppError("Token nao informado", 401);
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    request.user = {
      id: payload.sub,
      email: payload.email
    };
    next();
  } catch {
    throw new AppError("Token invalido ou expirado", 401);
  }
}
