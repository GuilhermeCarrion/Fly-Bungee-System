import { PrismaClient, Role } from "@prisma/client";
//import { hashPassword } from "../src/lib/password";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Cria ou procura por academia "upsert"
  // Where deve conter um campo unique/primary key
  const academy = await prisma.academy.upsert({
    where: { name: "Fly Bungee" },
    update: {},
    create: { name: "Fly Bungee" },
  });

  // Dados teste de ADMIN
  const email = "admin@flybungee.com";
  const password = "Admin@123";

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

  //console.log(`Seed OK: ${email}, ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
