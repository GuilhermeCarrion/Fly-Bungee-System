import { Prisma, User } from "@prisma/client";
import { UserRepository } from "../repositories/UserRepository";
import { SessionRepository } from "../repositories/SessionRepository";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

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
  async login(email: string, password: string): Promise<string> {
    const user = (await userRepository.findByEmail(
      email,
    )) as UserWithAcademy | null;

    // Comparando senha
    const passwordValided = await bcrypt.compare(
      password,
      (user as any).password,
    );

    if (!user || !passwordValided || !user.active) {
      throw new Error("Email ou senha inválidos");
    }

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    // Salvando sessão no banco em milesegundos (7 dias)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await sessionRepository.create({ userId: user.id, token, expiresAt });

    return token;
  }
}
