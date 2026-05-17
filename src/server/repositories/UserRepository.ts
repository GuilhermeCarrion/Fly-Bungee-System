import { prisma } from "../../lib/prisma";

// Busca usuário da academia
export class UserRepository {
  // Método de busca de usuário pelo email
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  // Método de busca de usuário pelo ID
  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        active: true,
      },
    });
  }
}
