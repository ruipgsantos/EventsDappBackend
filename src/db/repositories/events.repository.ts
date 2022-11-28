import { getExecutor } from "./prisma";
import { Event } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

export default class EventsRepository {
  private _prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this._prismaClient = prismaClient;
  }

  public async getEvents(): Promise<Event[]> {
    const execute = await getExecutor<Event[]>(this._prismaClient);
    return await execute(async (prisma: PrismaClient): Promise<Event[]> => {
      return await prisma.event.findMany({
        include: { space: true },
        orderBy: { date: "desc" },
      });
    });
  }

  public async getEventsBySpaceId(spaceId: number): Promise<Event[]> {
    const execute = await getExecutor<Event[]>(this._prismaClient);
    const eventsRes = await execute(
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

  public async saveEvent(event: Event): Promise<Event> {
    const execute = await getExecutor<Event>(this._prismaClient);
    const eventRes = await execute(
      async (prisma: PrismaClient): Promise<Event> => {
        return await prisma.event.create({ data: event });
      }
    );

    return eventRes;
  }
}
