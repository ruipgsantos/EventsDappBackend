import { PrismaClient } from "@prisma/client";
import { EventsRepository } from "./repositories/events.repository";

export class RepositoryFactory {
  private _prismaClient: PrismaClient;
  private static _instance: RepositoryFactory;

  private constructor() {
    this._prismaClient = new PrismaClient();
  }

  public static async getInstance(): Promise<RepositoryFactory> {
    if (!this._instance) {
      this._instance = new RepositoryFactory();
    }

    return this._instance;
  }

  public getEventsRepository(): EventsRepository {
    return new EventsRepository(this._prismaClient);
  }
}
