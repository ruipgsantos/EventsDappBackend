import { PrismaClient } from "@prisma/client";
import { Executor, getExecutor } from "./prisma";
import { Event } from "@prisma/client";

export class EventsRepository {
  private _prismaClient: PrismaClient;
  // private _executor: Executor<Event>;

  constructor(prismaClient: PrismaClient) {
    this._prismaClient = prismaClient;
  }

  public async getEvents() {
    const executor = await getExecutor<Event[]>(this._prismaClient);
    return await executor(async (): Promise<Event[]> => {
      return await this._prismaClient.event.findMany();
    });
  }

  public async getEventsBySpaceId(spaceId: number): Promise<Event[]> {
    const executor = await getExecutor<Event[]>(this._prismaClient);
    const eventsRes = await executor(async (): Promise<Event[]> => {
      return await this._prismaClient.event.findMany({
        where: { spaceId: { equals: 1 } },
      });
    });

    return eventsRes;
  }
}
