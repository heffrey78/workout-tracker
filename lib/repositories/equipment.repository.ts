import type { PrismaClient, Prisma } from "@prisma/client";

import type { Equipment } from "../../types/models";

import { BaseRepository, RepositoryError } from "./base.repository";

export interface EquipmentSearchParams {
  name?: string;
  category?: string;
}

type PrismaEquipment = Prisma.EquipmentGetPayload<{
  include: {
    exercises: true;
  };
}>;

export class EquipmentRepository extends BaseRepository<Equipment> {
  constructor(prisma: PrismaClient) {
    super(prisma, "Equipment");
  }

  async findById(id: string): Promise<Equipment> {
    try {
      this.validateId(id);
      this.logOperation("findById", { id });

      const equipment = await this.prisma.equipment.findUnique({
        where: { id },
        include: this.getIncludeOptions(),
      });

      if (!equipment) {
        throw new RepositoryError(
          "Equipment not found",
          "EQUIPMENT_NOT_FOUND",
          {
            id,
          },
        );
      }

      return this.mapToEquipment(equipment);
    } catch (error) {
      this.handleError(error, "findById", { id });
    }
  }

  async findAll(params?: EquipmentSearchParams): Promise<Equipment[]> {
    try {
      this.logOperation("findAll", params);

      const equipment = await this.prisma.equipment.findMany({
        where: this.buildSearchQuery(params),
        include: this.getIncludeOptions(),
        orderBy: { name: "asc" },
      });

      return equipment.map((eq) => this.mapToEquipment(eq));
    } catch (error) {
      this.handleError(error, "findAll", params);
    }
  }

  async create(
    equipment: Omit<Equipment, "id" | "createdAt" | "updatedAt">,
  ): Promise<Equipment> {
    try {
      this.logOperation("create", equipment);

      const created = await this.prisma.equipment.create({
        data: {
          name: equipment.name,
          description: equipment.description,
          category: equipment.category,
        },
        include: this.getIncludeOptions(),
      });

      return this.mapToEquipment(created);
    } catch (error) {
      this.handleError(error, "create", equipment);
    }
  }

  async update(id: string, equipment: Partial<Equipment>): Promise<Equipment> {
    try {
      this.validateId(id);
      this.logOperation("update", { id, equipment });

      const updateData: Prisma.EquipmentUpdateInput = {};

      if (equipment.name !== undefined) updateData.name = equipment.name;
      if (equipment.description !== undefined)
        updateData.description = equipment.description;
      if (equipment.category !== undefined)
        updateData.category = equipment.category;

      const updated = await this.prisma.equipment.update({
        where: { id },
        data: updateData,
        include: this.getIncludeOptions(),
      });

      return this.mapToEquipment(updated);
    } catch (error) {
      this.handleError(error, "update", { id, equipment });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.validateId(id);
      this.logOperation("delete", { id });

      await this.prisma.equipment.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error, "delete", { id });
    }
  }

  private buildSearchQuery(
    params?: EquipmentSearchParams,
  ): Prisma.EquipmentWhereInput {
    if (!params) return {};

    const query: Prisma.EquipmentWhereInput = {};

    if (params.name) {
      query.name = { contains: params.name, mode: "insensitive" };
    }

    if (params.category) {
      query.category = { contains: params.category, mode: "insensitive" };
    }

    return query;
  }

  private getIncludeOptions() {
    return {
      exercises: true,
    } as const;
  }

  private mapToEquipment = (data: PrismaEquipment): Equipment => {
    if (!data) throw new Error("Cannot map null equipment");

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  };
}
