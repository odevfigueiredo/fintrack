import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import type { LoginInput, RegisterInput } from "@fintrack/shared";
import { env } from "../config/env";
import { AppError } from "../errors/app-error";
import { userRepository } from "../repositories/user.repository";

function publicUser(user: { id: string; name: string; email: string; createdAt: Date }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString()
  };
}

function signAccessToken(user: { id: string; email: string }) {
  const options: SignOptions = {
    subject: user.id,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
  };

  return jwt.sign({ email: user.email }, env.JWT_SECRET, {
    ...options
  });
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);

    if (existing) {
      throw new AppError("Este e-mail ja esta cadastrado", 409);
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash
    });

    return {
      user: publicUser(user),
      accessToken: signAccessToken(user)
    };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError("Credenciais invalidas", 401);
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError("Credenciais invalidas", 401);
    }

    return {
      user: publicUser(user),
      accessToken: signAccessToken(user)
    };
  },

  async me(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("Usuario nao encontrado", 404);
    }

    return publicUser(user);
  }
};
