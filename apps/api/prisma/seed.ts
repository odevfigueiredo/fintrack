import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const defaultCategories = [
  { name: "Alimentacao", color: "#22C55E", type: "expense" as const },
  { name: "Transporte", color: "#38BDF8", type: "expense" as const },
  { name: "Moradia", color: "#A78BFA", type: "expense" as const },
  { name: "Saude", color: "#FB7185", type: "expense" as const },
  { name: "Educacao", color: "#F59E0B", type: "expense" as const },
  { name: "Lazer", color: "#F472B6", type: "expense" as const },
  { name: "Salario", color: "#14B8A6", type: "income" as const },
  { name: "Freelance", color: "#06B6D4", type: "income" as const },
  { name: "Investimentos", color: "#84CC16", type: "income" as const }
];

async function main() {
  console.log("Seeding default categories...");
  for (const category of defaultCategories) {
    const existing = await prisma.category.findFirst({
      where: {
        userId: null,
        name: category.name,
        type: category.type
      }
    });

    if (!existing) {
      await prisma.category.create({ data: category });
    }
  }

  console.log("Seeding test user...");
  const testUserEmail = "user@fintrack.dev";
  let user = await prisma.user.findUnique({ where: { email: testUserEmail } });

  if (!user) {
    const passwordHash = await bcrypt.hash("123456", 10);
    user = await prisma.user.create({
      data: {
        name: "Test User",
        email: testUserEmail,
        passwordHash,
      }
    });
    console.log("Test user created.");
  } else {
    console.log("Test user already exists. Forcing password to 123456...");
    const passwordHash = await bcrypt.hash("123456", 10);
    await prisma.user.update({
      where: { email: testUserEmail },
      data: { passwordHash }
    });
  }

  // Seed user goals
  const existingGoal = await prisma.goal.findFirst({ where: { userId: user.id } });
  if (!existingGoal) {
    await prisma.goal.create({
      data: {
        userId: user.id,
        title: "Viagem para Europa",
        targetAmount: 15000,
        currentAmount: 3500,
        deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Next year
      }
    });
    console.log("Test goal created.");
  }

  // Seed user transactions
  const existingTransactions = await prisma.transaction.findFirst({ where: { userId: user.id } });
  if (!existingTransactions) {
    const categories = await prisma.category.findMany({ where: { userId: null } });
    
    const salaryCategory = categories.find(c => c.name === "Salario")!;
    const foodCategory = categories.find(c => c.name === "Alimentacao")!;
    const transportCategory = categories.find(c => c.name === "Transporte")!;
    const housingCategory = categories.find(c => c.name === "Moradia")!;

    await prisma.transaction.createMany({
      data: [
        {
          userId: user.id,
          categoryId: salaryCategory.id,
          title: "Salário Mensal",
          amount: 5000,
          type: "income",
          date: new Date(),
        },
        {
          userId: user.id,
          categoryId: housingCategory.id,
          title: "Aluguel",
          amount: 1500,
          type: "expense",
          date: new Date(),
        },
        {
          userId: user.id,
          categoryId: foodCategory.id,
          title: "Mercado",
          amount: 600,
          type: "expense",
          date: new Date(),
        },
        {
          userId: user.id,
          categoryId: transportCategory.id,
          title: "Uber",
          amount: 50,
          type: "expense",
          date: new Date(new Date().setDate(new Date().getDate() - 2)),
        }
      ]
    });
    console.log("Test transactions created.");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
