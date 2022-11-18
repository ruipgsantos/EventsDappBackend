import { getExecutor } from "./prisma";
import { Event } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

export default class EventsRepository {
  private _prismaClient: PrismaClient;
  // private _executor: Executor<Event>;

  constructor(prismaClient: PrismaClient) {
    this._prismaClient = prismaClient;
  }

  public async getEvents(): Promise<Event[]> {
    const executor = await getExecutor<Event[]>(this._prismaClient);
    return await executor(async (prisma: PrismaClient): Promise<Event[]> => {
      return await prisma.event.findMany({
        include: { space: true },
        orderBy: { date: "desc" },
      });
    });
  }

  public async getEventsBySpaceId(spaceId: number): Promise<Event[]> {
    const executor = await getExecutor<Event[]>(this._prismaClient);
    const eventsRes = await executor(
      async (prisma: PrismaClient): Promise<Event[]> => {
        return await prisma.event.findMany({
          where: { spaceId: { equals: spaceId } },
          include: { space: true },
          orderBy: { date: "desc" },
        });
      }
    );

    return eventsRes;
  }
}
