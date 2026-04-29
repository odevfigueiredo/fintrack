import { describe, expect, it } from "vitest";
import { createTransactionSchema, registerSchema } from "@fintrack/shared";

describe("shared validation", () => {
  it("normaliza e-mail de cadastro", () => {
    const parsed = registerSchema.parse({
      name: "Ana Souza",
      email: "ANA@EXAMPLE.COM",
      password: "supersecret"
    });

    expect(parsed.email).toBe("ana@example.com");
  });

  it("rejeita transacao sem valor positivo", () => {
    expect(() =>
      createTransactionSchema.parse({
        title: "Cafe",
        amount: 0,
        type: "expense",
        categoryId: "category-id",
        date: "2026-04-29"
      })
    ).toThrow();
  });
});
