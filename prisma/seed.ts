import { PrismaClient, Role } from "@prisma/client";
//import { hashPassword } from "../src/lib/password";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const academyName = process.env.SEED_ACADEMY_NAME ?? "Fly Bungee";
  const name = process.env.SEED_ADMIN_NAME ?? "Admin";
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password)
    throw new Error("Defina dados SEED antes de rodar o seed.");

  // Cria ou procura por academia "upsert"
  // Where deve conter um campo unique/primary key
  const academy = await prisma.academy.upsert({
    where: { name: academyName },
    update: {},
    create: { name: academyName },
  });

  //const passwordHash = await hashPassword(password);
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Cria ou encontra usuario dentro do banco
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Admin",
      email,
      password: passwordHash,
      role: Role.ADMIN,
      academyId: academy.id,
    },
  });

  console.log(`Seed OK: ${email}, ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
