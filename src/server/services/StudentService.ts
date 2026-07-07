import { StudentSchema } from "@/schemas/students.schema";
import { StudentRepository } from "../repositories/StudentRepository";
import { AppError } from "@/lib/errors";

const repository = new StudentRepository();

export class StudentService {
  async create(data: StudentSchema, academyId: string) {
    const exist = await repository.findByCpf(data.cpf, academyId);

    if (exist)
      throw new AppError("Aluno já cadastrado com esse CPF nesta unidade", 409);

    return await repository.create({ ...data, academyId });
  }

  async list(academyId: string) {
    return await repository.findAll(academyId);
  }

  async update(id: string, data: Partial<StudentSchema>, academyId: string) {
    const student = await repository.findById(id, academyId);

    if (!student) throw new AppError("Aluno não encontrado", 404);

    return await repository.update(id, data);
  }
}
