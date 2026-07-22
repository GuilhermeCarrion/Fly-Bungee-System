import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type CreatePlanData = {
  academyId: string;
  name: string;
  credits: number;
  validityDays: number;
  price: number;
  active?: boolean;
};

export class PlanRepository {
  async create(data: CreatePlanData) {
    return await prisma.plan.create({ data });
  }

  async findByName(name: string, academyId: string) {
    return await prisma.plan.findFirst({ where: { name, academyId } });
  }

  async findAll(academyId: string, onlyActive = false) {
    return await prisma.plan.findMany({
      where: { academyId, ...(onlyActive ? { active: true } : {}) },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string, academyId: string) {
    return await prisma.plan.findFirst({ where: { id, academyId } });
  }

  async update(id: string, data: Prisma.PlanUpdateInput) {
    return await prisma.plan.update({ where: { id }, data });
  }
}
