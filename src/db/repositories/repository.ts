import { Prisma, PrismaClient } from "@prisma/client";
import { NotFoundError } from "@prisma/client/runtime";
import RecordNotFound from "../../../src/error/recordnotfound.error";

type QueryFunction<ReturnType> = (prisma: PrismaClient) => Promise<ReturnType>;

export default abstract class Repository {
  protected _prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this._prismaClient = prismaClient;
  }

  protected async execute<ReturnType>(
    queryFunction: QueryFunction<ReturnType>
  ): Promise<ReturnType> {
    try {
      return await queryFunction(this._prismaClient);
    } catch (error) {
      console.warn(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          //not found
          throw new RecordNotFound();
        }
      } else {
        throw error;
      }
      await this._prismaClient.$disconnect();
    } finally {
      await this._prismaClient.$disconnect();
    }
  }
}
