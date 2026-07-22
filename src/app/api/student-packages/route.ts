import { StudentPackageController } from "@/server/controllers/StudentPackageController";
import {
  authenticateRequest,
  authorizeRequest,
} from "@/server/middleware/AuthMiddleware";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

const controller = new StudentPackageController();

export async function POST(req: Request) {
  const { error, academyId } = await authorizeRequest(req, [
    Role.ADMIN,
    Role.GESTOR,
  ]);
  if (error) return error;
  return controller.store(req, academyId as string);
}

export async function GET(req: Request) {
  const { error, academyId } = authenticateRequest(req);
  if (error) return error;

  const studentId = new URL(req.url).searchParams.get("studentId");
  if (!studentId)
    return NextResponse.json(
      { error: "Parâmetro studentId é obrigatório" },
      { status: 400 },
    );

  return controller.index(studentId, academyId as string);
}
