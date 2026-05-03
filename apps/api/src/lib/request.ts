import type { Request } from "express";
import { AppError } from "../errors/app-error";

export function requireUserId(request: Request) {
  if (!request.user?.id) {
    throw new AppError("Usuário não autenticado", 401);
  }

  return request.user.id;
}

export function requireParam(request: Request, name: string) {
  const value = request.params[name];

  if (typeof value !== "string" || value.length === 0) {
    throw new AppError(`Parametro ${name} invalido`, 400);
  }

  return value;
}
