import request from "supertest";
import app from "../../src/app";
import { loadEventsData } from "../testutils";
import { Event } from "@prisma/client";
// import DbContainer from "./db.container";

import EventRepository from "../../src/db/repositories/events.repository";
import { RepositoryFactory } from "../../src/db/repository.factory";

//TODO: error scenarios
describe("Events Routes", () => {
  let mockEventsData: Event[] = loadEventsData();

  let eventRepo: EventRepository;

  beforeAll(async () => {
    // DbContainer.setup();
    mockEventsData = loadEventsData();
    eventRepo = (await RepositoryFactory.getInstance()).getEventsRepository();
  });

  afterAll(() => {
    // DbContainer.setup();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Saves new Event", async () => {
    const newEvent = {
      name: "newEvent",
      description: "new Event Desc",
      location: "new Event Location",
      date: new Date(Date.now()),
      spaceId: 0,
    };

    await request(app)
      .get("/events")
      .expect(200)
      .then((response) => expect(response.body).toEqual(mockEventsData));

    // expect(getEventsSpy).toHaveBeenCalledTimes(1);
  });

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
