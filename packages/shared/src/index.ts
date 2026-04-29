import { z } from "zod";

export const transactionTypeSchema = z.enum(["income", "expense"]);
export const categoryTypeSchema = z.enum(["income", "expense"]);

export const moneySchema = z.coerce
  .number({ invalid_type_error: "Valor invalido" })
  .positive("O valor deve ser maior que zero")
  .finite("O valor deve ser finito");

export const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.string().email("E-mail invalido").toLowerCase(),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres")
});

export const loginSchema = z.object({
  email: z.string().email("E-mail invalido").toLowerCase(),
  password: z.string().min(1, "Informe sua senha")
});

export const createCategorySchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(80, "Nome muito longo"),
  color: z.string().regex(/^#([0-9A-Fa-f]{6})$/, "Use uma cor hexadecimal"),
  type: categoryTypeSchema
});

export const updateCategorySchema = createCategorySchema.partial();

export const createTransactionSchema = z.object({
  title: z.string().min(2, "Titulo muito curto").max(120, "Titulo muito longo"),
  amount: moneySchema,
  type: transactionTypeSchema,
  categoryId: z.string().min(1, "Categoria obrigatoria"),
  date: z.coerce.date(),
  description: z.string().max(500, "Descricao muito longa").optional().nullable()
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Use o formato YYYY-MM")
    .optional(),
  type: transactionTypeSchema.optional(),
  categoryId: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional()
});

export const createGoalSchema = z.object({
  title: z.string().min(2, "Titulo muito curto").max(120, "Titulo muito longo"),
  targetAmount: moneySchema,
  currentAmount: z.coerce.number().min(0).finite().optional().default(0),
  deadline: z.coerce.date()
});

export const updateGoalSchema = createGoalSchema.partial();

export type TransactionType = z.infer<typeof transactionTypeSchema>;
export type CategoryType = z.infer<typeof categoryTypeSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionQuery = z.infer<typeof transactionQuerySchema>;
export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type ApiCategory = {
  id: string;
  name: string;
  color: string;
  type: CategoryType;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiTransaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  category?: Pick<ApiCategory, "id" | "name" | "color" | "type">;
  date: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiGoal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
};

export type DashboardCategorySlice = {
  categoryId: string;
  categoryName: string;
  color: string;
  amount: number;
};

export type DashboardMonthlyPoint = {
  month: string;
  income: number;
  expense: number;
};

export type DashboardSummary = {
  balance: number;
  monthIncome: number;
  monthExpense: number;
  highestExpenseCategory: DashboardCategorySlice | null;
  recentTransactions: ApiTransaction[];
  monthlySummary: DashboardMonthlyPoint[];
  categorySummary: DashboardCategorySlice[];
};

export type AuthResponse = {
  user: ApiUser;
  accessToken: string;
};

export type ApiErrorResponse = {
  message: string;
  issues?: unknown;
};
