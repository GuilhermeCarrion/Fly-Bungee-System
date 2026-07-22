import { AppError, handleError } from "@/lib/errors";
import { PlanService } from "../services/PlanService";
import { planSchema, planUpdateSchema } from "@/schemas/plan.schema";
import { NextResponse } from "next/server";

const planService = new PlanService();

export class PlanController {
  async store(req: Request, academyId: string) {
    try {
      const body = await req.json();
      const parsed = planSchema.safeParse(body);
      if (!parsed.success)
        throw new AppError(
          "Dados inválidos: " + parsed.error.issues[0].message,
          400,
        );
      const result = await planService.create(parsed.data, academyId);
      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      handleError(error);
    }
  }

  async index(req: Request, academyId: string) {
    try {
      const onlyActive = new URL(req.url).searchParams.get("active") === "true";
      const plans = await planService.list(academyId, onlyActive);
      return NextResponse.json(plans, { status: 200 });
    } catch (error) {
      handleError(error);
    }
  }

  async show(id: string, academyId: string) {
    try {
      const plan = await planService.getById(id, academyId);
      return NextResponse.json(plan, { status: 200 });
    } catch (error) {
      handleError(error);
    }
  }

  async update(req: Request, id: string, academyId: string) {
    try {
      const body = await req.json();
      const parsed = planUpdateSchema.safeParse(body);
      if (!parsed.success)
        throw new AppError(
          "Dados inválidos: " + parsed.error.issues[0].message,
          400,
        );
      const result = await planService.update(id, parsed.data, academyId);
      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      handleError(error);
    }
  }

  async deactivate(id: string, academyId: string) {
    try {
      await planService.deactivate(id, academyId);
      return NextResponse.json(
        { message: "Plano desativado" },
        { status: 200 },
      );
    } catch (error) {
      handleError(error);
    }
  }
}
