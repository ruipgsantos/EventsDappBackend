import { Event } from "@prisma/client";
import Repository from "./repository";

export default class EventRepository extends Repository {
  public async getEvents(): Promise<Event[]> {
    return this.execute<Event[]>(async () => {
      return await this._prismaClient.event.findMany({
        include: { space: true },
        orderBy: { date: "desc" },
      });
    });
  }

  public async getEventsBySpaceId(spaceId: number): Promise<Event[]> {
    return this.execute<Event[]>(async () => {
      return await this._prismaClient.event.findMany({
        where: { spaceId: { equals: spaceId } },
        include: { space: true },
        orderBy: { date: "desc" },
      });
    });
  }

  public async saveEvent(event: Event): Promise<Event> {
    return this.execute<Event>(async () => {
      return await this._prismaClient.event.upsert({
        where: { id: event.id },
        update: {
          ...event,
        },
        create: {
          ...event,
        },
      });
    });
  }
}
