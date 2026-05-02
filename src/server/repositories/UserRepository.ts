import { prisma } from "../../lib/prisma";

// Busca usuário da academia
export class UserRepository {
  // Método de busca de usuário pelo email
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }
}
