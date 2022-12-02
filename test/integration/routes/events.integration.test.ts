import request from "supertest";
import app from "../../../src/app";
import { loadEventsData } from "../../testutils";
import { Event } from "@prisma/client";
import DbContainer from "../db.container";

import EventRepository from "../../../src/db/repositories/event.repository";
import RepositoryFactory from "../../../src/db/repository.factory";
import e from "express";

//TODO: error scenarios
describe("Events Routes", () => {
  let mockEventsData: any[] = loadEventsData();

  let eventRepo: EventRepository;

  beforeAll(async () => {
    mockEventsData = loadEventsData();
    eventRepo = (await RepositoryFactory.getInstance()).getEventRepository();
  });

  afterAll(() => {});

  beforeEach(() => {
    DbContainer.refreshDbData();
  });

  it("Returns All Events", async () => {
    await request(app)
      .get("/events")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(mockEventsData);
      });
  });

  // it("Saves Event", async () => {
  //   const newEvent = {
  //     name: "newEvent",
  //     description: "new Event Desc",
  //     location: "new Event Location",
  //     date: new Date(Date.now()),
  //     spaceId: 0,
  //   };

  //   await request(app)
  //     .post("/events")
  //     .send(newEvent)
  //     .expect(200)
  //     .then((response) => {
  //       expect(response.body).toEqual(expect.objectContaining(newEvent));
  //     });

  //   await request(app)
  //     .get("/events")
  //     .expect(200)
  //     .then((response) => {
  //       expect(response.body).toEqual(mockEventsData);
  //     });
  // });

  //   it("Returns events array", async () => {
  //     await request(app)
  //       .get("/events")
  //       .expect(200)
  //       .then((response) => expect(response.body).toEqual(mockEventsData));

  //     expect(getEventsSpy).toHaveBeenCalledTimes(1);
  //   });

  //   it("Returns events array by space id", async () => {
  //     await request(app)
  //       .get(`/events/${spaceId}`)
  //       .expect(200)
  //       .then((response) => expect(response.body).toEqual(expectedResult));

  //     expect(getEventsBySpaceIdSpy).toHaveBeenCalledTimes(1);
  //   });
});
