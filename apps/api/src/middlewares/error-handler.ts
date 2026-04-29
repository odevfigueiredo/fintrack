import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error";

export function errorHandler(error: Error, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return response.status(422).json({
      message: "Dados invalidos",
      issues: error.flatten()
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
      issues: error.issues
    });
  }

  console.error(error);

  return response.status(500).json({
    message: "Erro interno do servidor"
  });
}
