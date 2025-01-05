import type { PrismaClient } from "@prisma/client";

import logger from "../logger";

export class RepositoryError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any,
  ) {
    super(message);
    this.name = "RepositoryError";
  }
}

export interface IRepository<T> {
  findById(id: string): Promise<T>;
  findAll(filters?: any): Promise<T[]>;
  create(entity: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

export abstract class BaseRepository<T> implements IRepository<T> {
  constructor(
    protected prisma: PrismaClient,
    protected modelName: string,
  ) {}

  protected logOperation(operation: string, details?: any) {
    logger.info(`[${this.modelName}Repository] ${operation}`, {
      operation,
      model: this.modelName,
      ...details,
    });
  }

  protected handleError(error: any, operation: string, details?: any): never {
    logger.error(`[${this.modelName}Repository] ${operation} failed`, {
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
              name: error.name,
            }
          : error,
      operation,
      model: this.modelName,
      details,
    });

    if (error instanceof RepositoryError) {
      throw error;
    }

    throw new RepositoryError(
      `Failed to ${operation.toLowerCase()} ${this.modelName.toLowerCase()}`,
      `${this.modelName.toUpperCase()}_${operation.toUpperCase()}_ERROR`,
      {
        originalError: error instanceof Error ? error.message : error,
        ...details,
      },
    );
  }

  protected validateId(id: string): void {
    if (!id || typeof id !== "string") {
      throw new RepositoryError(
        "Invalid ID provided",
        `${this.modelName.toUpperCase()}_INVALID_ID`,
        { id },
      );
    }
  }

  abstract findById(id: string): Promise<T>;
  abstract findAll(filters?: any): Promise<T[]>;
  abstract create(
    entity: Omit<T, "id" | "createdAt" | "updatedAt">,
  ): Promise<T>;
  abstract update(id: string, entity: Partial<T>): Promise<T>;
  abstract delete(id: string): Promise<void>;
}
