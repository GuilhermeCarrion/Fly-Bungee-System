import { StudentPackageController } from "@/server/controllers/StudentPackageController";
import { authorizeRequest } from "@/server/middleware/AuthMiddleware";
import { Role } from "@prisma/client";

const controller = new StudentPackageController();

type Context = { params: Promise<{ id: string }> };

export async function DELETE(req: Request, { params }: Context) {
  const { error, academyId } = await authorizeRequest(req, [
    Role.ADMIN,
    Role.GESTOR,
  ]);
  if (error) return error;
  const { id } = await params;
  return controller.delete(id, academyId as string);
}
