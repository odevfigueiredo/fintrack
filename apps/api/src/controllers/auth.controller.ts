import { loginSchema, registerSchema } from "@fintrack/shared";
import type { Request, Response } from "express";
import { requireUserId } from "../lib/request";
import { authService } from "../services/auth.service";

export const authController = {
  async register(request: Request, response: Response) {
    const input = registerSchema.parse(request.body);
    const result = await authService.register(input);
    return response.status(201).json(result);
  },

  async login(request: Request, response: Response) {
    const input = loginSchema.parse(request.body);
    const result = await authService.login(input);
    return response.json(result);
  },

  async me(request: Request, response: Response) {
    const user = await authService.me(requireUserId(request));
    return response.json(user);
  }
};
