import request from "supertest";
import app from "../../../src/app";
import { loadEventsData } from "../../test.utils";
import { Event } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

import EventRepository from "../../../src/db/repositories/event.repository";
import RepositoryFactory from "../../../src/db/repository.factory";
import { PrismaClient } from "@prisma/client";
import Repository from "../../../src/db/repositories/repository";
import {
  authenticateUser,
  resetDatabaseData,
  mockData,
} from "../int.test.utils";

describe("Events Routes", () => {
  let mockEventsData: any[] = loadEventsData();
  let eventRepo: EventRepository;

  class GenericRepo extends Repository {
    public async getEvent(id: number): Promise<Event | null> {
      return this.execute<Event | null>(async () => {
        return await this._prismaClient.event.findUnique({ where: { id } });
      });
    }
  }

  const { user1Address, user1PrivateKey } = mockData;

  const genericRepo = new GenericRepo(new PrismaClient());

  beforeAll(async () => {
    eventRepo = (await RepositoryFactory.getInstance()).getEventRepository();
  });

  beforeEach(() => {
    resetDatabaseData();
    jest.clearAllMocks();
  });
  describe("WITHOUT Auth", () => {
    it("Returns All Events", async () => {
      await request(app)
        .get("/events")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(mockEventsData);
        });
    });

    it("Returns events array by space id", async () => {
      await request(app)
        .get(`/events/space/5`)
        .expect(200)
        .then((response) => {
          const expectedEvents = mockEventsData.filter(
            (e: Event) => e.spaceId === 5
          );

          expect(response.body instanceof Array<Event>).toEqual(true);
          expect(response.body).toEqual(expectedEvents);
        });
    });
  });

  describe("WITH Auth", () => {
    const newEvent = {
      name: "newEvent",
      description: "new Event Desc",
      location: "new Event Location",
      date: new Date(Date.now()),
      spaceId: 1,
    };
    let cookie: any = {};
    beforeEach(async () => {
      //authenticate
      cookie = await authenticateUser(app, user1Address, user1PrivateKey);
    });

    it("Saves Event", async () => {
      await request(app)
        .post("/events")
        .send(newEvent)
        .set("Cookie", [cookie])
        .expect(200)
        .then(async (response) => {
          const resEvent: Event = response.body;
          expect(resEvent).toEqual(
            expect.objectContaining({
              ...newEvent,
              date: newEvent.date.toISOString(),
            })
          );

          const dbEvent = await genericRepo.getEvent(resEvent.id);
          expect(dbEvent).toEqual(expect.objectContaining(newEvent));
        });
    });

    it("Returns 401 Unauthorized when trying to save Event without Auth", async () => {
      await request(app).post("/events").send(newEvent).expect(401);
    });

    it("Returns 403 Forbidden when trying to save Event that it doesnt Own", async () => {
      await request(app)
        .post("/events")
        .send({ ...newEvent, spaceId: 3 }) //space does not belong to user1
        .set("Cookie", [cookie])
        .expect(403);
    });
  });
});
