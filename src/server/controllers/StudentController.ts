import { studentSchema } from "@/schemas/students.schema";
import { StudentService } from "../services/StudentService";
import { NextResponse } from "next/server";

const studentService = new StudentService();

export class StudentController {
  async store(req: Request, academyId: string) {
    try {
      const body = await req.json();
      const parsed = studentSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          { error: "Dados inválidos: " + parsed.error.issues[0].message },
          { status: 400 },
        );
      }

      const result = await studentService.create(parsed.data, academyId);

      return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Erro interno no sevidor" },
        { status: 400 },
      );
    }
  }

  async index(academyId: string) {
    try {
      const students = await studentService.list(academyId);
      return NextResponse.json(students, { status: 200 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Erro ao buscar alunos" },
        { status: 400 },
      );
    }
  }
}
