import { PrismaClient } from "@prisma/client";

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
    } catch (e) {
      console.error(e);
      await this._prismaClient.$disconnect();
    } finally {
      await this._prismaClient.$disconnect();
    }
  }
}
