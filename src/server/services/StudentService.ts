import { StudentSchema } from "@/schemas/students.schema";
import { StudentRepository } from "../repositories/StudentRepository";

const repository = new StudentRepository();

export class StudentService {
  async create(data: StudentSchema, academyId: string) {
    const exist = await repository.findByCpf(data.cpf, academyId);

    if (exist)
      throw new Error("Aluno já cadastrado com este CPF nesta unidade");

    return await repository.create({ ...data, academyId });
  }

  async list(academyId: string) {
    return await repository.findAll(academyId);
  }

  async update(id: string, data: Partial<StudentSchema>, academyId: string) {
    const student = await repository.findById(id, academyId);

    if (!student) throw new Error("Aluno não encontrado");

    return await repository.update(id, data);
  }
}
