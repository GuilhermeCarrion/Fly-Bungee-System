import { AppError, handleError } from "@/lib/errors";
import { AppointmentService } from "../services/AppointmentService";
import { appointmentSchema } from "@/schemas/appointment.schema";
import { NextResponse } from "next/server";

const service = new AppointmentService();

export class AppointmentController {
  async store(req: Request, academyId: string) {
    try {
      const body = await req.json();
      const parsed = appointmentSchema.safeParse(body);

      if (!parsed.success) {
        throw new AppError("Dados inválidos", 400);
      }

      const result = await service.create(parsed.data, academyId);
      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      return handleError(error);
    }
  }
}
