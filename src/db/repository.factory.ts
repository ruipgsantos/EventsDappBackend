import { PrismaClient } from "@prisma/client";
import EventRepository from "./repositories/event.repository";
import SpaceRepository from "./repositories/space.repository";
import UserRepository from "./repositories/user.repository";

/**
 * Repository Factor. Will return ready to connect singleton instances of each repository.
 */
export default class RepositoryFactory {
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

  public getEventRepository(): EventRepository {
    return new EventRepository(this._prismaClient);
  }

  public getSpaceRepository(): SpaceRepository {
    return new SpaceRepository(this._prismaClient);
  }
  public getUserRepository(): UserRepository {
    return new UserRepository(this._prismaClient);
  }
}
