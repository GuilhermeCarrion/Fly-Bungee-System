import { prisma } from "../../lib/prisma";

// Interface com o que a função precisa receber
interface CreateSessionDTO {
  userId: string;
  token: string;
  expiresAt: Date;
}

export class SessionRepository {
  // Método de criação de Session
  async create({ userId, token, expiresAt }: CreateSessionDTO) {
    return await prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }
}
