import type { PrismaClient, Prisma } from "@prisma/client";

import type { PersonalRecord } from "../../types/models";

import { BaseRepository, RepositoryError } from "./base.repository";

export interface PersonalRecordSearchParams {
  exerciseId?: string;
  workoutId?: string;
  setId?: string;
  type?: "WEIGHT" | "REPS" | "DURATION";
}

type PrismaPersonalRecord = Prisma.PersonalRecordGetPayload<{
  include: {
    exercise: true;
    workout: true;
    set: true;
  };
}>;

export class PersonalRecordRepository extends BaseRepository<PersonalRecord> {
  constructor(prisma: PrismaClient) {
    super(prisma, "PersonalRecord");
  }

  async findById(id: string): Promise<PersonalRecord> {
    try {
      this.validateId(id);
      this.logOperation("findById", { id });

      const record = await this.prisma.personalRecord.findUnique({
        where: { id },
        include: this.getIncludeOptions(),
      });

      if (!record) {
        throw new RepositoryError(
          "Personal record not found",
          "PERSONAL_RECORD_NOT_FOUND",
          {
            id,
          },
        );
      }

      return this.mapToPersonalRecord(record);
    } catch (error) {
      this.handleError(error, "findById", { id });
    }
  }

  async findAll(
    params?: PersonalRecordSearchParams,
  ): Promise<PersonalRecord[]> {
    try {
      this.logOperation("findAll", params);

      const records = await this.prisma.personalRecord.findMany({
        where: this.buildSearchQuery(params),
        include: this.getIncludeOptions(),
        orderBy: { achievedAt: "desc" },
      });

      return records.map((record) => this.mapToPersonalRecord(record));
    } catch (error) {
      this.handleError(error, "findAll", params);
    }
  }

  async create(
    record: Omit<PersonalRecord, "id" | "createdAt" | "updatedAt">,
  ): Promise<PersonalRecord> {
    try {
      this.logOperation("create", record);

      const created = await this.prisma.personalRecord.create({
        data: {
          type: record.type,
          value: record.value,
          achievedAt: record.achievedAt,
          exercise: {
            connect: { id: record.exerciseId },
          },
          workout: {
            connect: { id: record.workoutId },
          },
          set: {
            connect: { id: record.setId },
          },
        },
        include: this.getIncludeOptions(),
      });

      return this.mapToPersonalRecord(created);
    } catch (error) {
      this.handleError(error, "create", record);
    }
  }

  async update(
    id: string,
    record: Partial<PersonalRecord>,
  ): Promise<PersonalRecord> {
    try {
      this.validateId(id);
      this.logOperation("update", { id, record });

      const updateData: Prisma.PersonalRecordUpdateInput = {};

      if (record.type !== undefined) updateData.type = record.type;
      if (record.value !== undefined) updateData.value = record.value;
      if (record.achievedAt !== undefined)
        updateData.achievedAt = record.achievedAt;
      if (record.exerciseId !== undefined) {
        updateData.exercise = { connect: { id: record.exerciseId } };
      }
      if (record.workoutId !== undefined) {
        updateData.workout = { connect: { id: record.workoutId } };
      }
      if (record.setId !== undefined) {
        updateData.set = { connect: { id: record.setId } };
      }

      const updated = await this.prisma.personalRecord.update({
        where: { id },
        data: updateData,
        include: this.getIncludeOptions(),
      });

      return this.mapToPersonalRecord(updated);
    } catch (error) {
      this.handleError(error, "update", { id, record });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.validateId(id);
      this.logOperation("delete", { id });

      await this.prisma.personalRecord.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error, "delete", { id });
    }
  }

  private buildSearchQuery(
    params?: PersonalRecordSearchParams,
  ): Prisma.PersonalRecordWhereInput {
    if (!params) return {};

    const query: Prisma.PersonalRecordWhereInput = {};

    if (params.exerciseId) {
      query.exerciseId = params.exerciseId;
    }

    if (params.workoutId) {
      query.workoutId = params.workoutId;
    }

    if (params.setId) {
      query.setId = params.setId;
    }

    if (params.type) {
      query.type = params.type;
    }

    return query;
  }

  private getIncludeOptions() {
    return {
      exercise: true,
      workout: true,
      set: true,
    } as const;
  }

  private mapToPersonalRecord = (
    data: PrismaPersonalRecord,
  ): PersonalRecord => {
    if (!data) throw new Error("Cannot map null personal record");

    return {
      id: data.id,
      exerciseId: data.exerciseId,
      workoutId: data.workoutId,
      setId: data.setId,
      type: data.type as "WEIGHT" | "REPS" | "DURATION",
      value: data.value,
      achievedAt: data.achievedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  };
}
