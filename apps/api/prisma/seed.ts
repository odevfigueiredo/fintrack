import { PrismaClient } from "@prisma/client";

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
