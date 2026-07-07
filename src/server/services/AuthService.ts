import { Prisma, User } from "@prisma/client";
import { UserRepository } from "../repositories/UserRepository";
import { SessionRepository } from "../repositories/SessionRepository";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { AppError } from "@/lib/errors";

const userRepository = new UserRepository();
const sessionRepository = new SessionRepository();

type UserWithAcademy = Prisma.UserGetPayload<{
  include: {
    academy: true;
  };
}>;

export class AuthService {
  /* 
    Método de login do usuário com lógica

    - Usuário precisa estar ativo

    Retorno: token do usuário para persistência
  */
  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; user: Omit<UserWithAcademy, "password"> }> {
    const user = (await userRepository.findByEmail(
      email,
    )) as UserWithAcademy | null;

    // Credenciais inválidas = 401 (não 404). Mesma mensagem e status do caso de
    // senha errada abaixo, para não revelar se o e-mail existe (evita enumeration).
    if (!user) {
      throw new AppError("Email ou senha invalidos", 401);
    }

    // Comparando senha
    const passwordValided = await bcrypt.compare(password, user.password);

    if (!passwordValided || !user.active) {
      throw new AppError("Email ou senha invalidos", 401);
    }

    const payload = { userId: user.id, academyId: user.academyId };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    // Salvando sessão no banco em milesegundos (7 dias)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await sessionRepository.create({ userId: user.id, token, expiresAt });

    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  // Busca perfil do usuário autenticado
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }
    return user;
  }
}
